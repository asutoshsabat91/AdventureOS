import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import NodeCache from 'node-cache'

// Cache configuration
const cache = new NodeCache({ 
  stdTTL: 300, // 5 minutes default TTL
  checkperiod: 60, // Check for expired keys every 60 seconds
  useClones: false
})

// Rate limiting configuration
interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map()

  constructor(private config: RateLimitConfig) {}

  isAllowed(key: string): boolean {
    const now = Date.now()
    const windowStart = now - this.config.windowMs
    
    if (!this.requests.has(key)) {
      this.requests.set(key, [])
    }
    
    const requests = this.requests.get(key)!
    
    // Remove old requests outside the window
    const validRequests = requests.filter(timestamp => timestamp > windowStart)
    this.requests.set(key, validRequests)
    
    if (validRequests.length >= this.config.maxRequests) {
      return false
    }
    
    validRequests.push(now)
    return true
  }
}

// Base API client with caching and rate limiting
export abstract class BaseAPIClient {
  protected client: AxiosInstance
  protected rateLimiter: RateLimiter
  protected cacheKeyPrefix: string

  constructor(
    baseURL: string,
    apiKey: string,
    rateLimitConfig: RateLimitConfig,
    cacheKeyPrefix: string
  ) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AdventureOS/1.0'
      }
    })

    this.rateLimiter = new RateLimiter(rateLimitConfig)
    this.cacheKeyPrefix = cacheKeyPrefix

    // Add API key to requests
    this.client.interceptors.request.use((config) => {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${apiKey}`
      }
      return config
    })

    // Response interceptor for caching
    this.client.interceptors.response.use(
      (response) => {
        this.cacheResponse(response.config, response.data)
        return response
      },
      (error) => {
        if (error.response?.status === 429) {
          console.warn(`Rate limit exceeded for ${this.cacheKeyPrefix}`)
        }
        return Promise.reject(error)
      }
    )
  }

  protected async makeRequest<T>(
    config: AxiosRequestConfig,
    cacheTTL?: number
  ): Promise<T> {
    // Check cache first
    if (config.method?.toLowerCase() === 'get') {
      const cached = this.getCachedResponse<T>(config)
      if (cached) {
        return cached
      }
    }

    // Check rate limit
    if (!this.rateLimiter.isAllowed(this.cacheKeyPrefix)) {
      throw new Error(`Rate limit exceeded for ${this.cacheKeyPrefix}`)
    }

    try {
      const response = await this.client.request<T>(config)
      return response.data
    } catch (error) {
      console.error(`API request failed for ${this.cacheKeyPrefix}:`, error)
      throw error
    }
  }

  private getCacheKey(config: AxiosRequestConfig): string {
    return `${this.cacheKeyPrefix}:${config.url}:${JSON.stringify(config.params)}`
  }

  private getCachedResponse<T>(config: AxiosRequestConfig): T | null {
    const key = this.getCacheKey(config)
    return cache.get<T>(key) || null
  }

  private cacheResponse(config: AxiosRequestConfig, data: any): void {
    if (config.method?.toLowerCase() === 'get') {
      const key = this.getCacheKey(config)
      cache.set(key, data)
    }
  }

  protected clearCache(pattern?: string): void {
    if (pattern) {
      const keys = cache.keys().filter(key => key.includes(pattern))
      keys.forEach(key => cache.del(key))
    } else {
      cache.flushAll()
    }
  }

  // Utility method for exponential backoff retry
  protected async retryRequest<T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn()
      } catch (error: any) {
        if (attempt === maxRetries) {
          throw error
        }

        // Don't retry on client errors (4xx)
        if (error.response?.status >= 400 && error.response?.status < 500) {
          throw error
        }

        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw new Error('Max retries exceeded')
  }
}

// Standardized response format for all APIs
export interface StandardAPIResponse<T> {
  data: T
  success: boolean
  message?: string
  cached?: boolean
  rateLimitRemaining?: number
}

// Error handling utility
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public response?: any
  ) {
    super(message)
    this.name = 'APIError'
  }
}

// Cache statistics utility
export function getCacheStats() {
  return {
    keys: cache.keys().length,
    stats: cache.getStats(),
    memoryUsage: process.memoryUsage()
  }
}

// Clear all caches (useful for development)
export function clearAllCaches() {
  cache.flushAll()
}
