import { BaseAPIClient, StandardAPIResponse, APIError } from './base-client'

export interface TourSearchRequest {
  destination: string
  start_date: string
  end_date?: string
  duration?: {
    min?: number
    max?: number
  }
  travelers: number
  categories?: string[]
  difficulty?: 'easy' | 'moderate' | 'challenging'
  min_age?: number
  max_age?: number
  price_range?: {
    min?: number
    max?: number
  }
  adventure_types?: string[]
  physical_rating?: number
  service_rating?: number
  free_cancellation?: boolean
  instant_confirmation?: boolean
}

export interface Tour {
  id: string
  title: string
  operator: {
    id: string
    name: string
    logo_url?: string
    rating: number
    review_count: number
    years_in_business: number
    certifications: string[]
  }
  category: {
    main: string
    subcategories: string[]
  }
  difficulty: 'easy' | 'moderate' | 'challenging'
  physical_rating: number // 1-5 scale
  duration: {
    days: number
    nights: number
    hours?: number
  }
  price: {
    amount: number
    currency: string
    per_person: boolean
    includes: string[]
    excludes: string[]
    optional_activities: Array<{
      name: string
      price: number
      currency: string
    }>
  }
  itinerary: {
    summary: string
    highlights: string[]
    day_by_day: Array<{
      day: number
      title: string
      description: string
      meals: string[]
      accommodation?: string
      activities: string[]
      transportation?: string
    }>
  }
  locations: {
    start: {
      city: string
      country: string
      address?: string
      coordinates: {
        lat: number
        lng: number
      }
    }
    end: {
      city: string
      country: string
      address?: string
      coordinates: {
        lat: number
        lng: number
      }
    }
    visited_places: Array<{
      name: string
      country: string
      type: 'city' | 'national_park' | 'landmark' | 'natural_wonder'
      description?: string
    }>
  }
  inclusions: {
    accommodation: boolean
    meals: {
      breakfast: boolean
      lunch: boolean
      dinner: boolean
    }
    transportation: boolean
    guide: boolean
    equipment: string[]
    entrance_fees: boolean
  }
  group_info: {
    min_group_size: number
    max_group_size: number
    average_group_size: number
    solo_travelers: boolean
    age_range: {
      min: number
      max: number
    }
  }
  adventure_features: {
    activity_types: string[]
    skill_level_required: string[]
    gear_provided: string[]
    gear_required: string[]
    physical_requirements: string[]
    weather_dependencies: string[]
  }
  sustainability: {
    eco_friendly: boolean
    responsible_tourism: boolean
    local_community_support: boolean
    carbon_offset: boolean
    certifications: string[]
  }
  safety: {
    safety_rating: number // 1-5 scale
    insurance_required: boolean
    emergency_support: boolean
    first_aid_kit: boolean
    safety_equipment: string[]
    guide_certifications: string[]
  }
  reviews: {
    overall_rating: number
    total_reviews: number
    service_rating: number
    value_rating: number
    quality_rating: number
    recent_reviews: Array<{
      id: string
      rating: number
      title: string
      comment: string
      date: string
      traveler_type: string
      helpful_count: number
    }>
  }
  availability: {
    next_departures: Array<{
      date: string
      guaranteed: boolean
      available_spaces: number
      price: number
      currency: string
    }>
    frequency: string
    seasonal_availability: {
      start_month: string
      end_month: string
    }
  }
  booking: {
    instant_confirmation: boolean
    deposit_required: boolean
    deposit_percentage?: number
    payment_methods: string[]
    cancellation_policy: {
      free_cancellation: boolean
      deadline_days: number
      penalty_percentage: number
    }
    booking_requirements: string[]
  }
  media: {
    images: Array<{
      url: string
      caption: string
      is_primary: boolean
      category: 'activity' | 'accommodation' | 'scenery' | 'group'
    }>
    videos: Array<{
      url: string
      title: string
      duration: number
      thumbnail: string
    }>
  }
  special_offers?: {
    type: 'discount' | 'free_upgrade' | 'group_discount'
    description: string
    valid_until: string
    discount_percentage?: number
  }
}

export interface TourSearchResponse {
  search_id: string
  tours: Tour[]
  total_results: number
  filters: {
    categories: Array<{
      name: string
      count: number
    }>
    difficulty_levels: Array<{
      level: string
      count: number
    }>
    duration_ranges: Array<{
      min: number
      max: number
      count: number
    }>
    price_ranges: Array<{
      min: number
      max: number
      count: number
    }>
    adventure_types: Array<{
      type: string
      count: number
    }>
  }
  recommendations?: {
    best_rated: Tour
    best_value: Tour
    most_popular: Tour
    adventure_focused: Tour
  }
}

export class TourRadarAPI extends BaseAPIClient {
  constructor(apiKey: string) {
    super(
      'https://api.tourradar.com/v2',
      apiKey,
      { maxRequests: 100, windowMs: 60000 }, // 100 requests per minute
      'tourradar'
    )
  }

  async searchTours(request: TourSearchRequest): Promise<StandardAPIResponse<TourSearchResponse>> {
    try {
      // Get destination ID
      const destinationId = await this.getDestinationId(request.destination)

      // Search for tours
      const searchResults = await this.makeRequest({
        method: 'GET',
        url: '/search/tours',
        params: {
          destination_id: destinationId,
          start_date: request.start_date,
          end_date: request.end_date,
          duration_min: request.duration?.min,
          duration_max: request.duration?.max,
          travelers: request.travelers,
          categories: request.categories?.join(','),
          difficulty: request.difficulty,
          min_age: request.min_age,
          max_age: request.max_age,
          price_min: request.price_range?.min,
          price_max: request.price_range?.max,
          adventure_types: request.adventure_types?.join(','),
          physical_rating: request.physical_rating,
          service_rating: request.service_rating,
          free_cancellation: request.free_cancellation,
          instant_confirmation: request.instant_confirmation
        }
      })

      // Process and standardize results
      const standardizedResults = await this.processTourResults(searchResults, request)

      return {
        data: standardizedResults,
        success: true,
        message: `Found ${standardizedResults.total_results} tours`
      }
    } catch (error: any) {
      throw new APIError(
        `Failed to search tours: ${error.message}`,
        error.response?.status,
        error.code
      )
    }
  }

  async getTourDetails(tourId: string): Promise<StandardAPIResponse<Tour>> {
    try {
      const tourData = await this.makeRequest({
        method: 'GET',
        url: `/tours/${tourId}`,
        params: {
          include: 'itinerary,availability,reviews,media,operator'
        }
      })

      const standardizedTour = this.standardizeTour(tourData)

      return {
        data: standardizedTour,
        success: true
      }
    } catch (error: any) {
      throw new APIError(
        `Failed to fetch tour details: ${error.message}`,
        error.response?.status
      )
    }
  }

  async getTourAvailability(tourId: string, startDate: string, endDate: string): Promise<StandardAPIResponse<any>> {
    try {
      const availability = await this.makeRequest({
        method: 'GET',
        url: `/tours/${tourId}/availability`,
        params: {
          start_date: startDate,
          end_date: endDate
        }
      })

      return {
        data: availability,
        success: true
      }
    } catch (error: any) {
      throw new APIError(
        `Failed to fetch tour availability: ${error.message}`,
        error.response?.status
      )
    }
  }

  async getDestinationSuggestions(query: string): Promise<StandardAPIResponse<any[]>> {
    try {
      const suggestions = await this.makeRequest({
        method: 'GET',
        url: '/search/destinations',
        params: { query }
      })

      return {
        data: suggestions.destinations || [],
        success: true
      }
    } catch (error: any) {
      throw new APIError(
        `Failed to get destination suggestions: ${error.message}`,
        error.response?.status
      )
    }
  }

  async getOperatorDetails(operatorId: string): Promise<StandardAPIResponse<any>> {
    try {
      const operator = await this.makeRequest({
        method: 'GET',
        url: `/operators/${operatorId}`
      })

      return {
        data: operator,
        success: true
      }
    } catch (error: any) {
      throw new APIError(
        `Failed to fetch operator details: ${error.message}`,
        error.response?.status
      )
    }
  }

  private async getDestinationId(destination: string): Promise<string> {
    try {
      const response = await this.makeRequest({
        method: 'GET',
        url: '/search/destinations',
        params: { query: destination }
      })

      const destinations = response.destinations || []
      const city = destinations.find((dest: any) => 
        dest.type === 'city' || dest.type === 'country' || dest.type === 'region'
      )

      if (!city) {
        throw new Error(`No destination found for: ${destination}`)
      }

      return city.id
    } catch (error) {
      throw new Error(`Failed to get destination ID for ${destination}: ${error}`)
    }
  }

  private async processTourResults(results: any, request: TourSearchRequest): Promise<TourSearchResponse> {
    const tours: Tour[] = []
    const categories = new Map<string, number>()
    const difficultyLevels = new Map<string, number>()
    const durationRanges = new Map<string, number>()
    const priceRanges = new Map<string, number>()
    const adventureTypes = new Map<string, number>()

    // Process tours
    if (results.tours) {
      for (const tourData of results.tours) {
        try {
          const tour = this.standardizeTour(tourData)
          
          // Apply filters
          if (request.price_range) {
            if (request.price_range.min && tour.price.amount < request.price_range.min) continue
            if (request.price_range.max && tour.price.amount > request.price_range.max) continue
          }
          if (request.physical_rating && tour.physical_rating < request.physical_rating) continue
          if (request.service_rating && tour.operator.rating < request.service_rating) continue

          tours.push(tour)

          // Update filters data
          const categoryKey = tour.category.main
          categories.set(categoryKey, (categories.get(categoryKey) || 0) + 1)

          const difficultyKey = tour.difficulty
          difficultyLevels.set(difficultyKey, (difficultyLevels.get(difficultyKey) || 0) + 1)

          const durationKey = `${tour.duration.days} days`
          durationRanges.set(durationKey, (durationRanges.get(durationKey) || 0) + 1)

          const priceRangeKey = this.getPriceRangeKey(tour.price.amount)
          priceRanges.set(priceRangeKey, (priceRanges.get(priceRangeKey) || 0) + 1)

          tour.adventure_features.activity_types.forEach(type => {
            adventureTypes.set(type, (adventureTypes.get(type) || 0) + 1)
          })
        } catch (error) {
          console.warn('Failed to process tour:', error)
        }
      }
    }

    // Sort tours by rating (default)
    tours.sort((a, b) => b.reviews.overall_rating - a.reviews.overall_rating)

    // Generate recommendations
    const recommendations = this.generateRecommendations(tours)

    return {
      search_id: results.search_id || 'unknown',
      tours,
      total_results: tours.length,
      filters: {
        categories: Array.from(categories.entries()).map(([name, count]) => ({ name, count })),
        difficulty_levels: Array.from(difficultyLevels.entries()).map(([level, count]) => ({ level, count })),
        duration_ranges: Array.from(durationRanges.entries()).map((range, index, array) => {
          const [days] = range[0].split(' ')
          return {
            min: parseInt(days),
            max: parseInt(days),
            count: range[1]
          }
        }),
        price_ranges: Array.from(priceRanges.entries()).map((range, index, array) => {
          const [min, max] = range[0].split('-').map(p => parseInt(p.replace('$', '').replace('+', '')))
          return {
            min,
            max: max || min + 500,
            count: range[1]
          }
        }),
        adventure_types: Array.from(adventureTypes.entries()).map(([type, count]) => ({ type, count }))
      },
      recommendations
    }
  }

  private standardizeTour(tourData: any): Tour {
    // This is a simplified version - in production, you'd map all the complex TourRadar data structures
    return {
      id: tourData.id || Math.random().toString(),
      title: tourData.title || 'Amazing Adventure Tour',
      operator: {
        id: tourData.operatorId || 'op1',
        name: tourData.operatorName || 'Adventure Tours Inc',
        logo_url: tourData.operatorLogo,
        rating: tourData.operatorRating || 4.8,
        review_count: tourData.operatorReviewCount || 250,
        years_in_business: tourData.operatorYears || 10,
        certifications: tourData.operatorCertifications || ['ISO 9001', 'Adventure Travel Trade Association']
      },
      category: {
        main: tourData.category || 'Adventure',
        subcategories: tourData.subcategories || ['Hiking', 'Camping']
      },
      difficulty: tourData.difficulty || 'moderate',
      physical_rating: tourData.physicalRating || 3,
      duration: {
        days: tourData.durationDays || 5,
        nights: (tourData.durationDays || 5) - 1,
        hours: tourData.durationHours
      },
      price: {
        amount: tourData.price || 1200,
        currency: tourData.currency || 'USD',
        per_person: true,
        includes: tourData.includes || ['Accommodation', 'Meals', 'Guide', 'Equipment'],
        excludes: tourData.excludes || ['Flights', 'Personal Expenses'],
        optional_activities: tourData.optionalActivities || []
      },
      itinerary: {
        summary: tourData.summary || 'An amazing adventure through stunning landscapes.',
        highlights: tourData.highlights || ['Mountain hiking', 'Local culture', 'Wildlife spotting'],
        day_by_day: tourData.dayByDay || [
          {
            day: 1,
            title: 'Arrival and Orientation',
            description: 'Meet your group and guide for trip overview.',
            meals: ['Dinner'],
            activities: ['Orientation', 'Welcome dinner']
          }
        ]
      },
      locations: {
        start: {
          city: tourData.startCity || 'Adventure City',
          country: tourData.startCountry || 'Adventureland',
          address: tourData.startAddress,
          coordinates: {
            lat: tourData.startLat || 0,
            lng: tourData.startLng || 0
          }
        },
        end: {
          city: tourData.endCity || 'Adventure City',
          country: tourData.endCountry || 'Adventureland',
          address: tourData.endAddress,
          coordinates: {
            lat: tourData.endLat || 0,
            lng: tourData.endLng || 0
          }
        },
        visited_places: tourData.visitedPlaces || []
      },
      inclusions: {
        accommodation: tourData.accommodationIncluded !== false,
        meals: {
          breakfast: tourData.breakfastIncluded !== false,
          lunch: tourData.lunchIncluded || false,
          dinner: tourData.dinnerIncluded !== false
        },
        transportation: tourData.transportationIncluded !== false,
        guide: tourData.guideIncluded !== false,
        equipment: tourData.equipmentIncluded || [],
        entrance_fees: tourData.entranceFeesIncluded !== false
      },
      group_info: {
        min_group_size: tourData.minGroupSize || 4,
        max_group_size: tourData.maxGroupSize || 16,
        average_group_size: tourData.avgGroupSize || 10,
        solo_travelers: tourData.soloTravelersFriendly !== false,
        age_range: {
          min: tourData.minAge || 18,
          max: tourData.maxAge || 65
        }
      },
      adventure_features: {
        activity_types: tourData.activityTypes || ['Hiking', 'Camping'],
        skill_level_required: tourData.skillLevels || ['Beginner'],
        gear_provided: tourData.gearProvided || ['Backpack', 'Sleeping bag'],
        gear_required: tourData.gearRequired || ['Hiking boots'],
        physical_requirements: tourData.physicalRequirements || ['Good fitness level'],
        weather_dependencies: tourData.weatherDependencies || ['Clear weather for hiking']
      },
      sustainability: {
        eco_friendly: tourData.ecoFriendly || false,
        responsible_tourism: tourData.responsibleTourism || false,
        local_community_support: tourData.localCommunitySupport !== false,
        carbon_offset: tourData.carbonOffset || false,
        certifications: tourData.sustainabilityCertifications || []
      },
      safety: {
        safety_rating: tourData.safetyRating || 4.5,
        insurance_required: tourData.insuranceRequired !== false,
        emergency_support: tourData.emergencySupport !== false,
        first_aid_kit: tourData.firstAidKit !== false,
        safety_equipment: tourData.safetyEquipment || ['First aid kit', 'Emergency beacon'],
        guide_certifications: tourData.guideCertifications || ['Wilderness First Responder', 'Mountain Guide']
      },
      reviews: {
        overall_rating: tourData.overallRating || 4.7,
        total_reviews: tourData.totalReviews || 180,
        service_rating: tourData.serviceRating || 4.8,
        value_rating: tourData.valueRating || 4.6,
        quality_rating: tourData.qualityRating || 4.7,
        recent_reviews: tourData.recentReviews || []
      },
      availability: {
        next_departures: tourData.nextDepartures || [],
        frequency: tourData.frequency || 'Weekly',
        seasonal_availability: {
          start_month: tourData.seasonStart || 'April',
          end_month: tourData.seasonEnd || 'October'
        }
      },
      booking: {
        instant_confirmation: tourData.instantConfirmation || false,
        deposit_required: tourData.depositRequired !== false,
        deposit_percentage: tourData.depositPercentage || 20,
        payment_methods: tourData.paymentMethods || ['Credit Card', 'PayPal'],
        cancellation_policy: {
          free_cancellation: tourData.freeCancellation || true,
          deadline_days: tourData.cancellationDeadline || 30,
          penalty_percentage: tourData.cancellationPenalty || 10
        },
        booking_requirements: tourData.bookingRequirements || ['Valid passport', 'Travel insurance']
      },
      media: {
        images: tourData.images || [{
          url: 'https://via.placeholder.com/400x300',
          caption: 'Tour Image',
          is_primary: true,
          category: 'activity'
        }],
        videos: tourData.videos || []
      },
      special_offers: tourData.specialOffers
    }
  }

  private getPriceRangeKey(price: number): string {
    if (price < 500) return '$0-500'
    if (price < 1000) return '$500-1000'
    if (price < 2000) return '$1000-2000'
    if (price < 3000) return '$2000-3000'
    return '$3000+'
  }

  private generateRecommendations(tours: Tour[]) {
    if (tours.length === 0) return undefined

    const bestRated = tours.reduce((best, tour) => 
      tour.reviews.overall_rating > best.reviews.overall_rating ? tour : best
    )

    const bestValue = tours.reduce((best, tour) => {
      const score = tour.reviews.overall_rating / (tour.price.amount / tour.duration.days)
      const bestScore = best.reviews.overall_rating / (best.price.amount / best.duration.days)
      return score > bestScore ? tour : best
    })

    const mostPopular = tours.reduce((best, tour) => 
      tour.reviews.total_reviews > best.reviews.total_reviews ? tour : best
    )

    const adventureFocused = tours.reduce((best, tour) => {
      const score = tour.adventure_features.activity_types.length + tour.physical_rating
      const bestScore = best.adventure_features.activity_types.length + best.physical_rating
      return score > bestScore ? tour : best
    })

    return {
      best_rated: bestRated,
      best_value: bestValue,
      most_popular: mostPopular,
      adventure_focused: adventureFocused
    }
  }
}

// Singleton instance
export const tourRadarAPI = new TourRadarAPI(process.env.TOURRADAR_API_KEY || 'mock-key')
