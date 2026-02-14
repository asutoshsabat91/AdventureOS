// Offline storage utility for AdventureOS using IndexedDB

export interface OfflineItinerary {
  id: string
  title: string
  destination: string
  start_date: string
  end_date: string
  budget: number
  adventure_preferences: string[]
  structured_data: any
  status: 'draft' | 'synced' | 'sync_pending'
  created_at: string
  updated_at: string
  last_sync_attempt?: string
  sync_errors?: string[]
}

export interface OfflineChatMessage {
  id: string
  chat_room_id: string
  user_id: string
  content: string
  message_type: 'text' | 'location' | 'emergency'
  created_at: string
  status: 'sent' | 'pending' | 'failed'
  retry_count: number
}

export interface OfflineUserProfile {
  id: string
  full_name: string
  email: string
  avatar_url?: string
  preferences: {
    adventure_preferences: string[]
    risk_tolerance: 'low' | 'medium' | 'high'
    fitness_level: 'beginner' | 'intermediate' | 'advanced'
  }
  last_updated: string
}

class OfflineStorage {
  private db: IDBDatabase | null = null
  private readonly DB_NAME = 'AdventureOS'
  private readonly DB_VERSION = 1

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION)

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        console.log('IndexedDB initialized successfully')
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create itineraries store
        if (!db.objectStoreNames.contains('itineraries')) {
          const itineraryStore = db.createObjectStore('itineraries', { keyPath: 'id' })
          itineraryStore.createIndex('status', 'status', { unique: false })
          itineraryStore.createIndex('destination', 'destination', { unique: false })
          itineraryStore.createIndex('created_at', 'created_at', { unique: false })
        }

        // Create chat messages store
        if (!db.objectStoreNames.contains('chat_messages')) {
          const messageStore = db.createObjectStore('chat_messages', { keyPath: 'id' })
          messageStore.createIndex('chat_room_id', 'chat_room_id', { unique: false })
          messageStore.createIndex('status', 'status', { unique: false })
          messageStore.createIndex('created_at', 'created_at', { unique: false })
        }

        // Create user profile store
        if (!db.objectStoreNames.contains('user_profile')) {
          db.createObjectStore('user_profile', { keyPath: 'id' })
        }

        // Create cache store for API responses
        if (!db.objectStoreNames.contains('api_cache')) {
          const cacheStore = db.createObjectStore('api_cache', { keyPath: 'url' })
          cacheStore.createIndex('timestamp', 'timestamp', { unique: false })
          cacheStore.createIndex('expires_at', 'expires_at', { unique: false })
        }

        // Create settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' })
        }
      }
    })
  }

  // Itinerary operations
  async saveItinerary(itinerary: OfflineItinerary): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['itineraries'], 'readwrite')
      const store = transaction.objectStore('itineraries')
      
      const updatedItinerary = {
        ...itinerary,
        status: itinerary.status === 'synced' ? 'sync_pending' : itinerary.status,
        updated_at: new Date().toISOString()
      }

      const request = store.put(updatedItinerary)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        console.log('Itinerary saved offline:', itinerary.id)
        resolve()
      }
    })
  }

  async getItinerary(id: string): Promise<OfflineItinerary | null> {
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['itineraries'], 'readonly')
      const store = transaction.objectStore('itineraries')
      const request = store.get(id)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || null)
    })
  }

  async getAllItineraries(): Promise<OfflineItinerary[]> {
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['itineraries'], 'readonly')
      const store = transaction.objectStore('itineraries')
      const request = store.getAll()
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || [])
    })
  }

  async getPendingItineraries(): Promise<OfflineItinerary[]> {
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['itineraries'], 'readonly')
      const store = transaction.objectStore('itineraries')
      const index = store.index('status')
      const request = index.getAll('sync_pending')
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || [])
    })
  }

  async deleteItinerary(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['itineraries'], 'readwrite')
      const store = transaction.objectStore('itineraries')
      const request = store.delete(id)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  // Chat message operations
  async saveChatMessage(message: OfflineChatMessage): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['chat_messages'], 'readwrite')
      const store = transaction.objectStore('chat_messages')
      
      const updatedMessage = {
        ...message,
        status: 'pending',
        retry_count: 0
      }

      const request = store.put(updatedMessage)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        console.log('Chat message saved offline:', message.id)
        resolve()
      }
    })
  }

  async getPendingChatMessages(): Promise<OfflineChatMessage[]> {
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['chat_messages'], 'readonly')
      const store = transaction.objectStore('chat_messages')
      const index = store.index('status')
      const request = index.getAll('pending')
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || [])
    })
  }

  async markMessageAsSent(messageId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['chat_messages'], 'readwrite')
      const store = transaction.objectStore('chat_messages')
      
      const getRequest = store.get(messageId)
      getRequest.onerror = () => reject(getRequest.error)
      getRequest.onsuccess = () => {
        const message = getRequest.result
        if (message) {
          message.status = 'sent'
          const putRequest = store.put(message)
          putRequest.onerror = () => reject(putRequest.error)
          putRequest.onsuccess = () => resolve()
        } else {
          reject(new Error('Message not found'))
        }
      }
    })
  }

  // User profile operations
  async saveUserProfile(profile: OfflineUserProfile): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['user_profile'], 'readwrite')
      const store = transaction.objectStore('user_profile')
      
      const updatedProfile = {
        ...profile,
        last_updated: new Date().toISOString()
      }

      const request = store.put(updatedProfile)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getUserProfile(): Promise<OfflineUserProfile | null> {
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['user_profile'], 'readonly')
      const store = transaction.objectStore('user_profile')
      const request = store.get('current_user')
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || null)
    })
  }

  // API cache operations
  async cacheAPIResponse(url: string, data: any, ttlMinutes: number = 5): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['api_cache'], 'readwrite')
      const store = transaction.objectStore('api_cache')
      
      const cacheEntry = {
        url,
        data,
        timestamp: Date.now(),
        expires_at: Date.now() + (ttlMinutes * 60 * 1000)
      }

      const request = store.put(cacheEntry)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getCachedAPIResponse(url: string): Promise<any | null> {
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['api_cache'], 'readonly')
      const store = transaction.objectStore('api_cache')
      const request = store.get(url)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const entry = request.result
        if (entry && entry.expires_at > Date.now()) {
          resolve(entry.data)
        } else {
          resolve(null)
        }
      }
    })
  }

  async clearExpiredCache(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['api_cache'], 'readwrite')
      const store = transaction.objectStore('api_cache')
      const index = store.index('expires_at')
      const request = index.openCursor(IDBKeyRange.upperBound(Date.now()))
      
      request.onerror = () => reject(request.error)
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          cursor.delete()
          cursor.continue()
        } else {
          resolve()
        }
      }
    })
  }

  // Settings operations
  async saveSetting(key: string, value: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['settings'], 'readwrite')
      const store = transaction.objectStore('settings')
      
      const setting = { key, value }
      const request = store.put(setting)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getSetting(key: string, defaultValue: any = null): Promise<any> {
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['settings'], 'readonly')
      const store = transaction.objectStore('settings')
      const request = store.get(key)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result?.value || defaultValue)
    })
  }

  // Utility methods
  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    const storeNames = ['itineraries', 'chat_messages', 'user_profile', 'api_cache', 'settings']
    
    for (const storeName of storeNames) {
      await new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.clear()
        
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve()
      })
    }
  }

  async getStorageStats(): Promise<{
    itineraries: number
    chat_messages: number
    api_cache: number
    estimatedSize: string
  }> {
    if (!this.db) throw new Error('Database not initialized')

    const stats = {
      itineraries: 0,
      chat_messages: 0,
      api_cache: 0,
      estimatedSize: 'Unknown'
    }

    // Count records in each store
    for (const storeName of ['itineraries', 'chat_messages', 'api_cache']) {
      stats[storeName as keyof typeof stats] = await new Promise<number>((resolve) => {
        const transaction = this.db!.transaction([storeName], 'readonly')
        const store = transaction.objectStore(storeName)
        const request = store.count()
        request.onsuccess = () => resolve(request.result || 0)
      })
    }

    return stats
  }
}

// Singleton instance
export const offlineStorage = new OfflineStorage()

// Initialize offline storage when the module loads
if (typeof window !== 'undefined') {
  offlineStorage.init().catch(console.error)
}
