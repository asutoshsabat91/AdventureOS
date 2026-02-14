import { BaseAPIClient, StandardAPIResponse, APIError } from './base-client'

export interface AccommodationSearchRequest {
  destination: string
  check_in: string
  check_out: string
  guests: number
  rooms?: number
  property_types?: string[]
  min_price?: number
  max_price?: number
  rating?: number
  amenities?: string[]
  free_cancellation?: boolean
  instant_booking?: boolean
}

export interface Accommodation {
  id: string
  name: string
  type: 'hostel' | 'hotel' | 'guesthouse' | 'apartment' | 'resort'
  rating: {
    overall: number
    atmosphere: number
    cleanliness: number
    facilities: number
    location: number
    security: number
    staff: number
    value: number
  }
  images: Array<{
    url: string
    caption: string
    is_primary: boolean
  }>
  location: {
    address: string
    city: string
    country: string
    coordinates: {
      lat: number
      lng: number
    }
    distance_from_center?: number
    neighborhood?: string
  }
  description: string
  amenities: {
    general: string[]
    room: string[]
    food_drink: string[]
    entertainment: string[]
    services: string[]
    safety: string[]
  }
  rooms: Array<{
    id: string
    type: string
    max_occupancy: number
    price_per_night: number
    currency: string
    availability: boolean
    private_bathroom: boolean
    air_conditioning: boolean
    heating: boolean
    free_wifi: boolean
    breakfast_included: boolean
    cancellation_policy: {
      free_cancellation: boolean
      deadline: string
      penalty: number
    }
  }>
  atmosphere: {
    age_range: string
    solo_traveler_friendly: boolean
    party_atmosphere: boolean
    quiet_atmosphere: boolean
    family_friendly: boolean
    backpacker_vibe: boolean
  }
  policies: {
    check_in: {
      from: string
      until: string
    }
    check_out: {
      from: string
      until: string
    }
    age_restriction?: {
      minimum: number
      maximum?: number
    }
    id_required: boolean
    curfew?: {
      enabled: boolean
      from: string
      until: string
    }
    taxes: Array<{
      name: string
      amount: number
      type: 'percentage' | 'fixed'
    }>
  }
  reviews: {
    total: number
    recent: Array<{
      id: string
      rating: number
      comment: string
      date: string
      traveler_type: string
    }>
  }
  booking: {
    instant_booking: boolean
    deposit_required: boolean
    deposit_percentage?: number
    payment_methods: string[]
    cancellation_policy: {
      free_cancellation: boolean
      deadline_hours: number
      penalty_percentage: number
    }
  }
  sustainability: {
    eco_friendly: boolean
    green_certifications: string[]
    environmental_initiatives: string[]
  }
  adventure_features?: {
    gear_storage: boolean
    drying_room: boolean
    bike_rental: boolean
    tour_desk: boolean
    travel_advice: boolean
    common_area: boolean
    kitchen_access: boolean
  }
}

export interface AccommodationSearchResponse {
  search_id: string
  properties: Accommodation[]
  total_results: number
  filters: {
    property_types: Array<{
      type: string
      count: number
    }>
    price_range: {
      min: number
      max: number
    }
    rating_range: {
      min: number
      max: number
    }
    amenities: Array<{
      name: string
      count: number
    }>
    neighborhoods: Array<{
      name: string
      count: number
    }>
  }
  recommendations?: {
    best_rated: Accommodation
    best_value: Accommodation
    most_popular: Accommodation
    best_location: Accommodation
  }
}

export class HostelworldAPI extends BaseAPIClient {
  constructor(apiKey: string) {
    super(
      'https://api.hostelworld.com/v2',
      apiKey,
      { maxRequests: 100, windowMs: 60000 }, // 100 requests per minute
      'hostelworld'
    )
  }

  async searchAccommodations(request: AccommodationSearchRequest): Promise<StandardAPIResponse<AccommodationSearchResponse>> {
    try {
      // Get location ID for destination
      const locationId = await this.getLocationId(request.destination)

      // Search for properties
      const searchResults = await this.makeRequest({
        method: 'GET',
        url: '/search/properties',
        params: {
          location_id: locationId,
          check_in: request.check_in,
          check_out: request.check_out,
          guests: request.guests,
          rooms: request.rooms || 1,
          property_types: request.property_types?.join(','),
          min_price: request.min_price,
          max_price: request.max_price,
          rating: request.rating,
          amenities: request.amenities?.join(','),
          free_cancellation: request.free_cancellation,
          instant_booking: request.instant_booking
        }
      })

      // Process and standardize results
      const standardizedResults = await this.processAccommodationResults(searchResults, request)

      return {
        data: standardizedResults,
        success: true,
        message: `Found ${standardizedResults.total_results} accommodations`
      }
    } catch (error: any) {
      throw new APIError(
        `Failed to search accommodations: ${error.message}`,
        error.response?.status,
        error.code
      )
    }
  }

  async getAccommodationDetails(propertyId: string): Promise<StandardAPIResponse<Accommodation>> {
    try {
      const propertyData = await this.makeRequest({
        method: 'GET',
        url: `/properties/${propertyId}`,
        params: {
          include: 'rooms,amenities,policies,reviews,booking'
        }
      })

      const standardizedProperty = this.standardizeAccommodation(propertyData)

      return {
        data: standardizedProperty,
        success: true
      }
    } catch (error: any) {
      throw new APIError(
        `Failed to fetch accommodation details: ${error.message}`,
        error.response?.status
      )
    }
  }

  async getAccommodationReviews(propertyId: string, page: number = 1): Promise<StandardAPIResponse<any>> {
    try {
      const reviews = await this.makeRequest({
        method: 'GET',
        url: `/properties/${propertyId}/reviews`,
        params: { page, limit: 20 }
      })

      return {
        data: reviews,
        success: true
      }
    } catch (error: any) {
      throw new APIError(
        `Failed to fetch accommodation reviews: ${error.message}`,
        error.response?.status
      )
    }
  }

  async checkAvailability(propertyId: string, checkIn: string, checkOut: string): Promise<StandardAPIResponse<any>> {
    try {
      const availability = await this.makeRequest({
        method: 'GET',
        url: `/properties/${propertyId}/availability`,
        params: {
          check_in: checkIn,
          check_out: checkOut
        }
      })

      return {
        data: availability,
        success: true
      }
    } catch (error: any) {
      throw new APIError(
        `Failed to check availability: ${error.message}`,
        error.response?.status
      )
    }
  }

  async getLocationSuggestions(query: string): Promise<StandardAPIResponse<any[]>> {
    try {
      const suggestions = await this.makeRequest({
        method: 'GET',
        url: '/search/locations',
        params: { query }
      })

      return {
        data: suggestions.locations || [],
        success: true
      }
    } catch (error: any) {
      throw new APIError(
        `Failed to get location suggestions: ${error.message}`,
        error.response?.status
      )
    }
  }

  private async getLocationId(destination: string): Promise<string> {
    try {
      const response = await this.makeRequest({
        method: 'GET',
        url: '/search/locations',
        params: { query: destination }
      })

      const locations = response.locations || []
      const city = locations.find((loc: any) => 
        loc.type === 'city' || loc.type === 'country'
      )

      if (!city) {
        throw new Error(`No location found for destination: ${destination}`)
      }

      return city.id
    } catch (error) {
      throw new Error(`Failed to get location ID for ${destination}: ${error}`)
    }
  }

  private async processAccommodationResults(results: any, request: AccommodationSearchRequest): Promise<AccommodationSearchResponse> {
    const properties: Accommodation[] = []
    const propertyTypes = new Map<string, number>()
    let minPrice = Infinity
    let maxPrice = 0
    let minRating = Infinity
    let maxRating = 0
    const amenities = new Map<string, number>()
    const neighborhoods = new Map<string, number>()

    // Process properties
    if (results.properties) {
      for (const propertyData of results.properties) {
        try {
          const property = this.standardizeAccommodation(propertyData)
          
          // Apply filters
          if (request.min_price && property.rooms[0]?.price_per_night < request.min_price) {
            continue
          }
          if (request.max_price && property.rooms[0]?.price_per_night > request.max_price) {
            continue
          }
          if (request.rating && property.rating.overall < request.rating) {
            continue
          }

          properties.push(property)

          // Update filters data
          const typeKey = property.type
          propertyTypes.set(typeKey, (propertyTypes.get(typeKey) || 0) + 1)

          if (property.rooms.length > 0) {
            const price = property.rooms[0].price_per_night
            minPrice = Math.min(minPrice, price)
            maxPrice = Math.max(maxPrice, price)
          }

          minRating = Math.min(minRating, property.rating.overall)
          maxRating = Math.max(maxRating, property.rating.overall)

          // Count amenities
          property.amenities.general.forEach(amenity => {
            amenities.set(amenity, (amenities.get(amenity) || 0) + 1)
          })

          if (property.location.neighborhood) {
            neighborhoods.set(
              property.location.neighborhood, 
              (neighborhoods.get(property.location.neighborhood) || 0) + 1
            )
          }
        } catch (error) {
          console.warn('Failed to process property:', error)
        }
      }
    }

    // Sort properties by rating (default)
    properties.sort((a, b) => b.rating.overall - a.rating.overall)

    // Generate recommendations
    const recommendations = this.generateRecommendations(properties)

    return {
      search_id: results.search_id || 'unknown',
      properties,
      total_results: properties.length,
      filters: {
        property_types: Array.from(propertyTypes.entries()).map(([type, count]) => ({ type, count })),
        price_range: {
          min: minPrice === Infinity ? 0 : minPrice,
          max: maxPrice
        },
        rating_range: {
          min: minRating === Infinity ? 0 : minRating,
          max: maxRating
        },
        amenities: Array.from(amenities.entries()).map(([name, count]) => ({ name, count })),
        neighborhoods: Array.from(neighborhoods.entries()).map(([name, count]) => ({ name, count }))
      },
      recommendations
    }
  }

  private standardizeAccommodation(propertyData: any): Accommodation {
    // This is a simplified version - in production, you'd map all the complex Hostelworld data structures
    return {
      id: propertyData.id || Math.random().toString(),
      name: propertyData.name || 'Sample Property',
      type: propertyData.type || 'hostel',
      rating: {
        overall: propertyData.overallRating || 8.5,
        atmosphere: propertyData.atmosphereRating || 8.0,
        cleanliness: propertyData.cleanlinessRating || 9.0,
        facilities: propertyData.facilitiesRating || 8.5,
        location: propertyData.locationRating || 9.0,
        security: propertyData.securityRating || 9.5,
        staff: propertyData.staffRating || 9.0,
        value: propertyData.valueRating || 8.5
      },
      images: propertyData.images || [{
        url: 'https://via.placeholder.com/400x300',
        caption: 'Property Image',
        is_primary: true
      }],
      location: {
        address: propertyData.address || '123 Sample Street',
        city: propertyData.city || 'Sample City',
        country: propertyData.country || 'Sample Country',
        coordinates: {
          lat: propertyData.latitude || 0,
          lng: propertyData.longitude || 0
        },
        distance_from_center: propertyData.distanceFromCenter,
        neighborhood: propertyData.neighborhood
      },
      description: propertyData.description || 'A great place to stay for adventure travelers.',
      amenities: {
        general: propertyData.generalAmenities || ['Free WiFi', '24/7 Reception'],
        room: propertyData.roomAmenities || ['Lockers', 'Reading Light'],
        food_drink: propertyData.foodDrinkAmenities || ['Kitchen', 'Bar'],
        entertainment: propertyData.entertainmentAmenities || ['Common Room', 'TV'],
        services: propertyData.services || ['Laundry', 'Tours'],
        safety: propertyData.safetyAmenities || ['Security Lockers', '24/7 Security']
      },
      rooms: propertyData.rooms || [{
        id: 'room1',
        type: 'Dormitory Bed',
        max_occupancy: 1,
        price_per_night: 25,
        currency: 'USD',
        availability: true,
        private_bathroom: false,
        air_conditioning: true,
        heating: true,
        free_wifi: true,
        breakfast_included: false,
        cancellation_policy: {
          free_cancellation: true,
          deadline: '2024-01-01',
          penalty: 0
        }
      }],
      atmosphere: {
        age_range: propertyData.ageRange || '18-35',
        solo_traveler_friendly: propertyData.soloTravelerFriendly !== false,
        party_atmosphere: propertyData.partyAtmosphere || false,
        quiet_atmosphere: propertyData.quietAtmosphere || true,
        family_friendly: propertyData.familyFriendly || false,
        backpacker_vibe: propertyData.backpackerVibe !== false
      },
      policies: {
        check_in: {
          from: propertyData.checkInFrom || '14:00',
          until: propertyData.checkInUntil || '23:00'
        },
        check_out: {
          from: propertyData.checkOutFrom || '07:00',
          until: propertyData.checkOutUntil || '10:00'
        },
        age_restriction: propertyData.ageRestriction,
        id_required: propertyData.idRequired !== false,
        curfew: propertyData.curfew,
        taxes: propertyData.taxes || []
      },
      reviews: {
        total: propertyData.totalReviews || 150,
        recent: propertyData.recentReviews || []
      },
      booking: {
        instant_booking: propertyData.instantBooking || false,
        deposit_required: propertyData.depositRequired || true,
        deposit_percentage: propertyData.depositPercentage || 10,
        payment_methods: propertyData.paymentMethods || ['Credit Card', 'PayPal'],
        cancellation_policy: {
          free_cancellation: propertyData.freeCancellation || true,
          deadline_hours: propertyData.cancellationDeadlineHours || 24,
          penalty_percentage: propertyData.cancellationPenaltyPercentage || 0
        }
      },
      sustainability: {
        eco_friendly: propertyData.ecoFriendly || false,
        green_certifications: propertyData.greenCertifications || [],
        environmental_initiatives: propertyData.environmentalInitiatives || []
      },
      adventure_features: {
        gear_storage: propertyData.gearStorage !== false,
        drying_room: propertyData.dryingRoom || false,
        bike_rental: propertyData.bikeRental || false,
        tour_desk: propertyData.tourDesk !== false,
        travel_advice: propertyData.travelAdvice !== false,
        common_area: propertyData.commonArea !== false,
        kitchen_access: propertyData.kitchenAccess !== false
      }
    }
  }

  private generateRecommendations(properties: Accommodation[]) {
    if (properties.length === 0) return undefined

    const bestRated = properties.reduce((best, property) => 
      property.rating.overall > best.rating.overall ? property : best
    )

    const bestValue = properties
      .filter(p => p.rooms.length > 0)
      .reduce((best, property) => {
        const score = property.rating.overall / property.rooms[0].price_per_night
        const bestScore = best.rating.overall / best.rooms[0].price_per_night
        return score > bestScore ? property : best
      })

    const mostPopular = properties.reduce((best, property) => 
      property.reviews.total > best.reviews.total ? property : best
    )

    const bestLocation = properties.reduce((best, property) => 
      property.rating.location > best.rating.location ? property : best
    )

    return {
      best_rated: bestRated,
      best_value: bestValue,
      most_popular: mostPopular,
      best_location: bestLocation
    }
  }
}

// Singleton instance
export const hostelworldAPI = new HostelworldAPI(process.env.HOSTELWORLD_API_KEY || 'mock-key')
