import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { apiAggregatorService } from '@/lib/api/aggregator'
import { ComprehensiveSearchRequest } from '@/lib/api/aggregator'

const comprehensiveSearchSchema = z.object({
  destination: z.string().min(1, 'Destination is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  travelers: z.number().min(1, 'Travelers must be at least 1').max(20, 'Maximum 20 travelers allowed'),
  budget: z.number().positive().optional(),
  adventure_preferences: z.array(z.string()).default([]),
  include_flights: z.boolean().default(false),
  include_accommodation: z.boolean().default(false),
  include_activities: z.boolean().default(false),
  flight_preferences: z.object({
    cabin_class: z.enum(['economy', 'premium_economy', 'business', 'first']).optional(),
    direct_flights_only: z.boolean().optional(),
    max_price: z.number().positive().optional()
  }).optional(),
  accommodation_preferences: z.object({
    property_types: z.array(z.string()).optional(),
    min_rating: z.number().min(1).max(5).optional(),
    max_price_per_night: z.number().positive().optional()
  }).optional(),
  activity_preferences: z.object({
    difficulty: z.enum(['easy', 'moderate', 'challenging']).optional(),
    min_physical_rating: z.number().min(1).max(5).optional(),
    adventure_types: z.array(z.string()).optional()
  }).optional()
}).refine((data) => new Date(data.end_date) >= new Date(data.start_date), {
  message: "End date must be after start date",
  path: ["end_date"]
}).refine((data) => {
  const start = new Date(data.start_date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return start >= today
}, {
  message: "Start date must be today or in the future",
  path: ["start_date"]
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedRequest = comprehensiveSearchSchema.parse(body)

    // Ensure at least one search type is selected
    if (!validatedRequest.include_flights && !validatedRequest.include_accommodation && !validatedRequest.include_activities) {
      return NextResponse.json({
        success: false,
        error: 'At least one search type (flights, accommodations, or activities) must be selected'
      }, { status: 400 })
    }

    // Call the aggregator service
    const result = await apiAggregatorService.comprehensiveSearch(validatedRequest)

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('Error in comprehensive search:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request format',
        details: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Comprehensive search failed',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AdventureOS Comprehensive Search API',
    version: '1.0.0',
    endpoints: {
      POST: '/api/comprehensive-search - Search flights, accommodations, and activities',
      GET: '/api/comprehensive-search - API information'
    },
    features: [
      'Multi-API aggregation',
      'Intelligent caching',
      'Parallel processing',
      'Error resilience',
      'Recommendation engine',
      'Cost estimation'
    ],
    supported_apis: [
      'OpenWeatherMap - Weather and adventure metrics',
      'Skyscanner - Flight search',
      'Hostelworld - Accommodation search',
      'TourRadar - Activity and tour search'
    ]
  })
}
