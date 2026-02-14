import { BaseAPIClient, StandardAPIResponse, APIError } from './base-client'

export interface FlightSearchRequest {
  origin: string
  destination: string
  departure_date: string
  return_date?: string
  adults: number
  children?: number
  infants?: number
  cabin_class?: 'economy' | 'premium_economy' | 'business' | 'first'
  direct_flights_only?: boolean
  max_price?: number
}

export interface Flight {
  id: string
  airline: {
    name: string
    iata: string
    logo_url?: string
  }
  flight_number: string
  departure: {
    airport: {
      name: string
      iata: string
      city: string
      country: string
    }
    time: string
    terminal?: string
  }
  arrival: {
    airport: {
      name: string
      iata: string
      city: string
      country: string
    }
    time: string
    terminal?: string
  }
  duration: number // minutes
  aircraft?: string
  cabin_class: string
  price: {
    amount: number
    currency: string
    per_adult: boolean
  }
  stops: number
  layovers?: Array<{
    airport: string
    duration: number
    connection_time: number
  }>
  baggage: {
    carry_on: boolean
    checked: {
      included: boolean
      weight?: number
      fee?: number
    }
  }
  amenities: string[]
  carbon_emissions?: {
    amount: number
    unit: string
  }
}

export interface FlightSearchResponse {
  search_id: string
  flights: Flight[]
  total_results: number
  filters: {
    airlines: Array<{
      name: string
      iata: string
      count: number
    }>
    price_range: {
      min: number
      max: number
    }
    duration_range: {
      min: number
      max: number
    }
    stops_available: number[]
  }
  recommendations?: {
    cheapest: Flight
    fastest: Flight
    best_value: Flight
    most_convenient: Flight
  }
}

export class SkyscannerAPI extends BaseAPIClient {
  private rapidApiKey: string

  constructor(apiKey: string, rapidApiKey: string) {
    super(
      'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
      apiKey,
      { maxRequests: 100, windowMs: 60000 }, // 100 requests per minute
      'skyscanner'
    )
    this.rapidApiKey = rapidApiKey
  }

  async searchFlights(request: FlightSearchRequest): Promise<StandardAPIResponse<FlightSearchResponse>> {
    try {
      // First, get place IDs for origin and destination
      const originPlace = await this.getPlaceId(request.origin)
      const destinationPlace = await this.getPlaceId(request.destination)

      // Create search session
      const searchSession = await this.createSearchSession({
        originPlaceId: originPlace,
        destinationPlaceId: destinationPlace,
        departureDate: request.departure_date,
        returnDate: request.return_date,
        adults: request.adults,
        children: request.children || 0,
        infants: request.infants || 0,
        cabinClass: request.cabin_class || 'economy',
        directFlightsOnly: request.direct_flights_only || false
      })

      // Poll for results
      const searchResults = await this.pollSearchResults(searchSession.searchId)

      // Process and standardize results
      const standardizedResults = await this.processFlightResults(searchResults, request)

      return {
        data: standardizedResults,
        success: true,
        message: `Found ${standardizedResults.total_results} flights`
      }
    } catch (error: any) {
      throw new APIError(
        `Failed to search flights: ${error.message}`,
        error.response?.status,
        error.code
      )
    }
  }

  async getFlightDetails(flightId: string): Promise<StandardAPIResponse<Flight>> {
    try {
      const flightData = await this.makeRequest({
        method: 'GET',
        url: `/flights/${flightId}`,
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com'
        }
      })

      const standardizedFlight = await this.standardizeFlight(flightData)

      return {
        data: standardizedFlight,
        success: true
      }
    } catch (error: any) {
      throw new APIError(
        `Failed to fetch flight details: ${error.message}`,
        error.response?.status
      )
    }
  }

  async getAirportSuggestions(query: string): Promise<StandardAPIResponse<any[]>> {
    try {
      const suggestions = await this.makeRequest({
        method: 'GET',
        url: '/autosuggest/airports',
        params: { query },
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com'
        }
      })

      const suggestionsData = suggestions as any

      return {
        data: suggestionsData.Places || [],
        success: true
      }
    } catch (error: any) {
      throw new APIError(
        `Failed to get airport suggestions: ${error.message}`,
        error.response?.status
      )
    }
  }

  private async getPlaceId(query: string): Promise<string> {
    try {
      const response = await this.makeRequest({
        method: 'GET',
        url: '/autosuggest/airports',
        params: { query },
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com'
        }
      })

      const responseData = response as any

      const places = responseData.Places || []
      const airport = places.find((place: any) => 
        place.PlaceType === 'Airport' || place.PlaceType === 'City'
      )

      if (!airport) {
        throw new Error(`No airport found for query: ${query}`)
      }

      return airport.PlaceId
    } catch (error) {
      throw new Error(`Failed to get place ID for ${query}: ${error}`)
    }
  }

  private async createSearchSession(params: any): Promise<{ searchId: string }> {
    try {
      const response = await this.makeRequest({
        method: 'POST',
        url: '/flights/create-session',
        data: params,
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com'
        }
      })

      const sessionData = response as any

      return {
        searchId: sessionData.SessionId
      }
    } catch (error) {
      throw new Error(`Failed to create search session: ${error}`)
    }
  }

  private async pollSearchResults(searchId: string): Promise<any> {
    const maxAttempts = 10
    const pollDelay = 2000 // 2 seconds

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await this.makeRequest({
          method: 'GET',
          url: `/flights/poll-session/${searchId}`,
          headers: {
            'X-RapidAPI-Key': this.rapidApiKey,
            'X-RapidAPI-Host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com'
          }
        })

        const pollData = response as any

        if (pollData.Status === 'UpdatesComplete') {
          return pollData
        }

        // Wait before next poll
        if (attempt < maxAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, pollDelay))
        }
      } catch (error) {
        if (attempt === maxAttempts - 1) {
          throw new Error(`Failed to poll search results after ${maxAttempts} attempts: ${error}`)
        }
      }
    }

    throw new Error('Search polling timed out')
  }

  private async processFlightResults(results: any, request: FlightSearchRequest): Promise<FlightSearchResponse> {
    const flights: Flight[] = []
    const airlines = new Map<string, { name: string; iata: string; count: number }>()
    let minPrice = Infinity
    let maxPrice = 0
    let minDuration = Infinity
    let maxDuration = 0
    const stopsSet = new Set<number>()

    // Process itineraries
    if (results.Itineraries && results.Itineraries.Buckets) {
      for (const bucket of results.Itineraries.Buckets) {
        try {
          const flight = await this.standardizeFlight(bucket, results.Legs, results.Carriers, results.Places)
          
          // Apply filters
          if (request.max_price && flight.price.amount > request.max_price) {
            continue
          }

          flights.push(flight)

          // Update filters data
          const airlineKey = flight.airline.iata
          if (!airlines.has(airlineKey)) {
            airlines.set(airlineKey, {
              name: flight.airline.name,
              iata: flight.airline.iata,
              count: 0
            })
          }
          airlines.get(airlineKey)!.count++

          minPrice = Math.min(minPrice, flight.price.amount)
          maxPrice = Math.max(maxPrice, flight.price.amount)
          minDuration = Math.min(minDuration, flight.duration)
          maxDuration = Math.max(maxDuration, flight.duration)
          stopsSet.add(flight.stops)
        } catch (error) {
          console.warn('Failed to process flight:', error)
        }
      }
    }

    // Sort flights by price (default)
    flights.sort((a, b) => a.price.amount - b.price.amount)

    // Generate recommendations
    const recommendations = this.generateRecommendations(flights)

    return {
      search_id: results.SessionId || 'unknown',
      flights,
      total_results: flights.length,
      filters: {
        airlines: Array.from(airlines.values()),
        price_range: {
          min: minPrice === Infinity ? 0 : minPrice,
          max: maxPrice
        },
        duration_range: {
          min: minDuration === Infinity ? 0 : minDuration,
          max: maxDuration
        },
        stops_available: Array.from(stopsSet).sort()
      },
      recommendations
    }
  }

  private async standardizeFlight(flightData: any, legs?: any, carriers?: any, places?: any): Promise<Flight> {
    // This is a simplified version - in production, you'd map all the complex Skyscanner data structures
    return {
      id: flightData.Id || Math.random().toString(),
      airline: {
        name: 'Sample Airline', // Extract from carriers
        iata: 'SA',
        logo_url: ''
      },
      flight_number: 'SA123',
      departure: {
        airport: {
          name: 'Sample Airport',
          iata: 'SMP',
          city: 'Sample City',
          country: 'Sample Country'
        },
        time: '2024-01-01T10:00:00',
        terminal: '1'
      },
      arrival: {
        airport: {
          name: 'Destination Airport',
          iata: 'DST',
          city: 'Destination City',
          country: 'Destination Country'
        },
        time: '2024-01-01T12:00:00',
        terminal: '2'
      },
      duration: 120,
      aircraft: 'Boeing 737',
      cabin_class: 'economy',
      price: {
        amount: flightData.Price || 500,
        currency: 'USD',
        per_adult: true
      },
      stops: 0,
      baggage: {
        carry_on: true,
        checked: {
          included: true,
          weight: 23,
          fee: 0
        }
      },
      amenities: ['WiFi', 'Entertainment'],
      carbon_emissions: {
        amount: 500,
        unit: 'kg'
      }
    }
  }

  private generateRecommendations(flights: Flight[]) {
    if (flights.length === 0) return undefined

    const cheapest = flights.reduce((min, flight) => 
      flight.price.amount < min.price.amount ? flight : min
    )
    
    const fastest = flights.reduce((min, flight) => 
      flight.duration < min.duration ? flight : min
    )

    // Best value: balance of price and duration
    const bestValue = flights.reduce((best, flight) => {
      const score = flight.price.amount / flight.duration
      const bestScore = best.price.amount / best.duration
      return score < bestScore ? flight : best
    })

    // Most convenient: direct flights with good timing
    const mostConvenient = flights
      .filter(f => f.stops === 0)
      .sort((a, b) => {
        // Prefer flights with reasonable departure times (8am-8pm)
        const aHour = parseInt(a.departure.time.split('T')[1].split(':')[0])
        const bHour = parseInt(b.departure.time.split('T')[1].split(':')[0])
        const aScore = aHour >= 8 && aHour <= 20 ? 1 : 0
        const bScore = bHour >= 8 && bHour <= 20 ? 1 : 0
        return bScore - aScore
      })[0] || cheapest

    return {
      cheapest,
      fastest,
      best_value: bestValue,
      most_convenient: mostConvenient
    }
  }
}

// Singleton instance
export const skyscannerAPI = new SkyscannerAPI(
  process.env.SKYSCANNER_API_KEY || 'mock-key',
  process.env.RAPIDAPI_KEY || 'mock-key'
)
