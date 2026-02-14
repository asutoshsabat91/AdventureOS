import { openWeatherMapAPI, WeatherData, AdventureWeatherMetrics } from './openweathermap'
import { skyscannerAPI, FlightSearchRequest, FlightSearchResponse } from './skyscanner'
import { hostelworldAPI, AccommodationSearchRequest, AccommodationSearchResponse } from './hostelworld'
import { tourRadarAPI, TourSearchRequest, TourSearchResponse } from './tourradar'
import { StandardAPIResponse, APIError } from './base-client'

export interface ComprehensiveSearchRequest {
  destination: string
  start_date: string
  end_date: string
  travelers: number
  budget?: number
  adventure_preferences: string[]
  include_flights?: boolean
  include_accommodation?: boolean
  include_activities?: boolean
  flight_preferences?: {
    cabin_class?: 'economy' | 'premium_economy' | 'business' | 'first'
    direct_flights_only?: boolean
    max_price?: number
  }
  accommodation_preferences?: {
    property_types?: string[]
    min_rating?: number
    max_price_per_night?: number
  }
  activity_preferences?: {
    difficulty?: 'easy' | 'moderate' | 'challenging'
    min_physical_rating?: number
    adventure_types?: string[]
  }
}

export interface ComprehensiveSearchResponse {
  destination: {
    name: string
    coordinates: {
      lat: number
      lng: number
    }
    weather: WeatherData
    adventure_metrics: AdventureWeatherMetrics
  }
  flights?: FlightSearchResponse
  accommodations?: AccommodationSearchResponse
  activities?: TourSearchResponse
  recommendations: {
    best_value_package: {
      flight?: any
      accommodation?: any
      activity?: any
      total_cost: number
      savings_percentage: number
    }
    adventure_focused_package: {
      flight?: any
      accommodation?: any
      activity?: any
      adventure_score: number
    }
    budget_friendly_package: {
      flight?: any
      accommodation?: any
      activity?: any
      total_cost: number
      under_budget: boolean
    }
  }
  total_cost_estimate: {
    min: number
    max: number
    currency: string
    breakdown: {
      flights: number
      accommodation: number
      activities: number
      other: number
    }
  }
  search_metadata: {
    search_id: string
    timestamp: string
    processing_time: number
    cached_results: string[]
    api_errors: string[]
  }
}

class APIAggregatorService {
  private searchCache = new Map<string, any>()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  async comprehensiveSearch(request: ComprehensiveSearchRequest): Promise<StandardAPIResponse<ComprehensiveSearchResponse>> {
    const startTime = Date.now()
    const searchId = `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(request)
      const cached = this.searchCache.get(cacheKey)
      if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
        return {
          data: { ...cached.data, search_metadata: { ...cached.data.search_metadata, cached_results: ['all'] } },
          success: true,
          message: 'Results retrieved from cache'
        }
      }

      // Get destination coordinates and weather
      const destinationData = await this.getDestinationData(request.destination)
      
      // Parallel API calls for better performance
      const apiPromises: Promise<any>[] = []
      const apiErrors: string[] = []
      const cachedResults: string[] = []

      if (request.include_flights) {
        apiPromises.push(
          this.searchFlightsWithFallback(request, destinationData.coordinates)
            .catch(error => {
              apiErrors.push(`Flights: ${error.message}`)
              return null
            })
        )
      }

      if (request.include_accommodation) {
        apiPromises.push(
          this.searchAccommodationsWithFallback(request)
            .catch(error => {
              apiErrors.push(`Accommodations: ${error.message}`)
              return null
            })
        )
      }

      if (request.include_activities) {
        apiPromises.push(
          this.searchActivitiesWithFallback(request)
            .catch(error => {
              apiErrors.push(`Activities: ${error.message}`)
              return null
            })
        )
      }

      // Wait for all API calls to complete
      const results = await Promise.all(apiPromises)
      
      const [flights, accommodations, activities] = results

      // Generate recommendations
      const recommendations = this.generateRecommendations(
        flights,
        accommodations,
        activities,
        request
      )

      // Calculate cost estimates
      const costEstimate = this.calculateCostEstimate(
        flights,
        accommodations,
        activities,
        request.travelers,
        request.start_date,
        request.end_date
      )

      const response: ComprehensiveSearchResponse = {
        destination: destinationData,
        flights: flights || undefined,
        accommodations: accommodations || undefined,
        activities: activities || undefined,
        recommendations,
        total_cost_estimate: costEstimate,
        search_metadata: {
          search_id: searchId,
          timestamp: new Date().toISOString(),
          processing_time: Date.now() - startTime,
          cached_results,
          api_errors
        }
      }

      // Cache the results
      this.searchCache.set(cacheKey, {
        data: response,
        timestamp: Date.now()
      })

      return {
        data: response,
        success: true,
        message: `Comprehensive search completed in ${Date.now() - startTime}ms`
      }
    } catch (error: any) {
      throw new APIError(
        `Comprehensive search failed: ${error.message}`,
        error.response?.status,
        error.code
      )
    }
  }

  async getDestinationData(destination: string): Promise<ComprehensiveSearchResponse['destination']> {
    try {
      // Mock coordinates - in production, use geocoding API
      const coordinates = { lat: 32.2419, lng: 77.1889 } // Manali coordinates
      
      // Get weather data
      const weatherResponse = await openWeatherMapAPI.getCurrentWeather(coordinates.lat, coordinates.lng)
      
      // Get adventure-specific weather metrics
      const metricsResponse = await openWeatherMapAPI.getAdventureWeatherMetrics(
        coordinates.lat, 
        coordinates.lng, 
        []
      )

      return {
        name: destination,
        coordinates,
        weather: weatherResponse.data,
        adventure_metrics: metricsResponse.data
      }
    } catch (error: any) {
      throw new Error(`Failed to get destination data: ${error.message}`)
    }
  }

  private async searchFlightsWithFallback(request: ComprehensiveSearchRequest, coordinates: any): Promise<FlightSearchResponse | null> {
    if (!request.include_flights) return null

    // Mock origin - in production, get from user profile or preferences
    const flightRequest: FlightSearchRequest = {
      origin: 'New York',
      destination: request.destination,
      departure_date: request.start_date,
      return_date: request.end_date,
      adults: request.travelers,
      cabin_class: request.flight_preferences?.cabin_class,
      direct_flights_only: request.flight_preferences?.direct_flights_only,
      max_price: request.flight_preferences?.max_price
    }

    const response = await skyscannerAPI.searchFlights(flightRequest)
    return response.data
  }

  private async searchAccommodationsWithFallback(request: ComprehensiveSearchRequest): Promise<AccommodationSearchResponse | null> {
    if (!request.include_accommodation) return null

    const accommodationRequest: AccommodationSearchRequest = {
      destination: request.destination,
      check_in: request.start_date,
      check_out: request.end_date,
      guests: request.travelers,
      property_types: request.accommodation_preferences?.property_types,
      rating: request.accommodation_preferences?.min_rating,
      max_price: request.accommodation_preferences?.max_price_per_night
    }

    const response = await hostelworldAPI.searchAccommodations(accommodationRequest)
    return response.data
  }

  private async searchActivitiesWithFallback(request: ComprehensiveSearchRequest): Promise<TourSearchResponse | null> {
    if (!request.include_activities) return null

    const activityRequest: TourSearchRequest = {
      destination: request.destination,
      start_date: request.start_date,
      end_date: request.end_date,
      travelers: request.travelers,
      categories: request.adventure_preferences,
      difficulty: request.activity_preferences?.difficulty,
      physical_rating: request.activity_preferences?.min_physical_rating,
      adventure_types: request.activity_preferences?.adventure_types
    }

    const response = await tourRadarAPI.searchTours(activityRequest)
    return response.data
  }

  private generateRecommendations(
    flights: FlightSearchResponse | null,
    accommodations: AccommodationSearchResponse | null,
    activities: TourSearchResponse | null,
    request: ComprehensiveSearchRequest
  ): ComprehensiveSearchResponse['recommendations'] {
    const recommendations: ComprehensiveSearchResponse['recommendations'] = {
      best_value_package: {
        total_cost: 0,
        savings_percentage: 0
      },
      adventure_focused_package: {
        adventure_score: 0
      },
      budget_friendly_package: {
        total_cost: 0,
        under_budget: false
      }
    }

    // Best value package
    if (flights?.recommendations?.best_value && accommodations?.recommendations?.best_value) {
      recommendations.best_value_package.flight = flights.recommendations.best_value
      recommendations.best_value_package.accommodation = accommodations.recommendations.best_value
      recommendations.best_value_package.total_cost = 
        flights.recommendations.best_value.price.amount + 
        (accommodations.recommendations.best_value.rooms[0]?.price_per_night || 0) * this.getNumberOfNights(request.start_date, request.end_date)
      recommendations.best_value_package.savings_percentage = 15 // Mock calculation
    }

    // Adventure focused package
    if (activities?.recommendations?.adventure_focused) {
      recommendations.adventure_focused_package.activity = activities.recommendations.adventure_focused
      recommendations.adventure_focused_package.adventure_score = 
        activities.recommendations.adventure_focused.physical_rating + 
        activities.recommendations.adventure_focused.adventure_features.activity_types.length
    }

    // Budget friendly package
    if (flights?.recommendations?.cheapest && accommodations?.properties?.[0]) {
      recommendations.budget_friendly_package.flight = flights.recommendations.cheapest
      recommendations.budget_friendly_package.accommodation = accommodations.properties[0]
      recommendations.budget_friendly_package.total_cost = 
        flights.recommendations.cheapest.price.amount + 
        (accommodations.properties[0].rooms[0]?.price_per_night || 0) * this.getNumberOfNights(request.start_date, request.end_date)
      recommendations.budget_friendly_package.under_budget = 
        !request.budget || recommendations.budget_friendly_package.total_cost <= request.budget
    }

    return recommendations
  }

  private calculateCostEstimate(
    flights: FlightSearchResponse | null,
    accommodations: AccommodationSearchResponse | null,
    activities: TourSearchResponse | null,
    travelers: number,
    startDate: string,
    endDate: string
  ): ComprehensiveSearchResponse['total_cost_estimate'] {
    const nights = this.getNumberOfNights(startDate, endDate)
    
    let flightCost = 0
    let accommodationCost = 0
    let activityCost = 0

    if (flights?.fllights?.length) {
      flightCost = flights.flights[0].price.amount * travelers
    }

    if (accommodations?.properties?.length) {
      const avgPricePerNight = accommodations.properties.reduce((sum, prop) => 
        sum + (prop.rooms[0]?.price_per_night || 0), 0) / accommodations.properties.length
      accommodationCost = avgPricePerNight * nights
    }

    if (activities?.tours?.length) {
      const avgActivityCost = activities.tours.reduce((sum, tour) => 
        sum + tour.price.amount, 0) / activities.tours.length
      activityCost = avgActivityCost * travelers
    }

    const other = Math.round((flightCost + accommodationCost + activityCost) * 0.2) // 20% for other expenses

    return {
      min: flightCost + accommodationCost + activityCost + other,
      max: Math.round((flightCost + accommodationCost + activityCost + other) * 1.5), // 50% buffer
      currency: 'USD',
      breakdown: {
        flights: flightCost,
        accommodation: accommodationCost,
        activities: activityCost,
        other
      }
    }
  }

  private getNumberOfNights(startDate: string, endDate: string): number {
    const start = new Date(startDate)
    const end = new Date(endDate)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  private generateCacheKey(request: ComprehensiveSearchRequest): string {
    return `${request.destination}_${request.start_date}_${request.end_date}_${request.travelers}_${JSON.stringify(request.adventure_preferences)}`
  }

  // Method to clear cache
  clearCache(): void {
    this.searchCache.clear()
  }

  // Method to get cache statistics
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.searchCache.size,
      keys: Array.from(this.searchCache.keys())
    }
  }
}

// Singleton instance
export const apiAggregatorService = new APIAggregatorService()
