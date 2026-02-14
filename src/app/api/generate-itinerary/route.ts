import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { z } from 'zod'
import { ItinerarySchema } from '@/lib/itinerary-schema'
import { supabase } from '@/lib/supabase'

// Check if we have real OpenAI credentials
const hasOpenAIKey = !!process.env.OPENAI_API_KEY

const openai = hasOpenAIKey ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

// Mock itinerary data for development
const generateMockItinerary = (request: any) => {
  const { destination, start_date, end_date, budget, adventure_preferences } = request
  
  return {
    destination,
    overview: `An amazing ${destination.toLowerCase()} adventure experience tailored to your preferences`,
    total_budget: budget,
    estimated_duration: Math.ceil((new Date(end_date).getTime() - new Date(start_date).getTime()) / (1000 * 60 * 60 * 24)),
    difficulty_level: request.difficulty_level,
    best_season: "Spring to Autumn",
    weather_conditions: "Pleasant with occasional rain",
    required_gear: ["Backpack", "Hiking boots", "Weather-appropriate clothing", "First aid kit"],
    safety_considerations: ["Stay hydrated", "Check weather forecasts", "Inform someone of your plans"],
    emergency_contacts: ["Local emergency services: 108", "Tourist helpline: 1363"],
    daily_itinerary: [
      {
        day: 1,
        date: start_date,
        activities: [
          {
            time: "09:00",
            activity: "Arrival and Check-in",
            location: `${destination} Base Camp`,
            description: "Settle in and prepare for adventure",
            difficulty: "Easy",
            duration: "2 hours",
            cost: 0,
            gear_needed: ["ID documents", "Booking confirmation"]
          },
          {
            time: "14:00",
            activity: "Orientation and Safety Briefing",
            location: "Adventure Center",
            description: "Learn about the area and safety procedures",
            difficulty: "Easy",
            duration: "1 hour",
            cost: 0,
            gear_needed: ["Notebook", "Pen"]
          }
        ],
        meals: [
          {
            type: "Lunch",
            restaurant: "Local Eatery",
            cuisine: "Regional",
            cost: 500,
            dietary_options: ["Vegetarian", "Vegan", "Gluten-free"]
          },
          {
            type: "Dinner",
            restaurant: "Camp Restaurant",
            cuisine: "Multi-cuisine",
            cost: 800,
            dietary_options: ["Vegetarian", "Non-vegetarian"]
          }
        ],
        accommodation: {
          name: "Adventure Lodge",
          type: "Mountain Lodge",
          rating: 4,
          cost_per_night: 2000,
          amenities: ["WiFi", "Hot water", "Restaurant", "Guide service"]
        },
        transportation: {
          mode: "Private Vehicle",
          details: "Airport transfers and local transport",
          cost: 1500
        },
        total_day_cost: 4800
      }
    ],
    adventure_activities: adventure_preferences.map(pref => ({
      name: pref.charAt(0).toUpperCase() + pref.slice(1),
      description: `Exciting ${pref} experience in ${destination}`,
      difficulty: request.difficulty_level,
      duration: "3-4 hours",
      cost: budget * 0.2,
      best_time: "Morning",
      requirements: ["Basic fitness", "Adventure spirit"],
      safety_level: "Moderate",
      equipment_provided: true
    })),
    packing_list: [
      { item: "Backpack (40-50L)", quantity: 1, essential: true },
      { item: "Hiking shoes", quantity: 1, essential: true },
      { item: "Weatherproof jacket", quantity: 1, essential: true },
      { item: "Quick dry clothes", quantity: 3, essential: true },
      { item: "Personal medications", quantity: 1, essential: true },
      { item: "Sunscreen", quantity: 1, essential: false },
      { item: "Camera", quantity: 1, essential: false }
    ],
    budget_breakdown: {
      accommodation: budget * 0.3,
      food: budget * 0.25,
      activities: budget * 0.25,
      transportation: budget * 0.15,
      miscellaneous: budget * 0.05
    },
    tips_and_recommendations: [
      "Start your day early to make the most of daylight",
      "Stay hydrated and carry water bottles",
      "Respect local customs and environment",
      "Keep emergency contacts handy",
      "Travel light but smart"
    ],
    cancellation_policy: {
      full_refund_days: 7,
      partial_refund_percentage: 50,
      no_refund_days: 2
    }
  }
}

interface ItineraryRequest {
  destination: string
  start_date: string
  end_date: string
  budget: number
  adventure_preferences: string[]
  group_size: number
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  fitness_level: 'beginner' | 'intermediate' | 'advanced'
  risk_tolerance: 'low' | 'medium' | 'high'
}

export async function POST(request: NextRequest) {
  try {
    const body: ItineraryRequest = await request.json()
    
    // Validate input
    const validatedRequest = z.object({
      destination: z.string().min(1),
      start_date: z.string(),
      end_date: z.string(),
      budget: z.number().positive(),
      adventure_preferences: z.array(z.string()),
      group_size: z.number().positive(),
      difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
      fitness_level: z.enum(['beginner', 'intermediate', 'advanced']),
      risk_tolerance: z.enum(['low', 'medium', 'high'])
    }).parse(body)

    // Calculate trip duration
    const start = new Date(validatedRequest.start_date)
    const end = new Date(validatedRequest.end_date)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

    // Construct the detailed prompt for the AI
    const systemPrompt = `You are an expert adventure travel planner with extensive knowledge of extreme sports, outdoor activities, and travel logistics. You specialize in creating detailed, actionable itineraries that balance adventure, safety, and budget constraints.

Generate a comprehensive adventure travel itinerary that strictly follows the provided schema. The itinerary must be:
1. Physically realistic with proper acclimatization for altitude activities
2. Budget-conscious while maximizing adventure experiences
3. Weather-aware and seasonal appropriate
4. Safety-first with proper risk assessments
5. Culturally respectful and environmentally conscious

Key considerations:
- For high-altitude destinations (above 2500m), include proper acclimatization days
- Water sports should be scheduled based on optimal tide/swell conditions
- Mountain activities require avalanche risk assessment and proper equipment
- Include rest days between physically demanding activities
- Consider travel time between locations in the daily schedule
- Always include emergency contact information and local emergency services

The output must be valid JSON that conforms exactly to the schema. Do not include markdown formatting or explanatory text.`

    const userPrompt = `Create a detailed ${days}-day adventure itinerary for ${validatedRequest.destination} with the following parameters:

- Destination: ${validatedRequest.destination}
- Start Date: ${validatedRequest.start_date}
- End Date: ${validatedRequest.end_date}
- Total Budget: $${validatedRequest.budget} USD
- Group Size: ${validatedRequest.group_size} people
- Adventure Preferences: ${validatedRequest.adventure_preferences.join(', ')}
- Difficulty Level: ${validatedRequest.difficulty_level}
- Fitness Level: ${validatedRequest.fitness_level}
- Risk Tolerance: ${validatedRequest.risk_tolerance}

Please generate a structured JSON itinerary that includes specific activities, timing, costs, and logistics. Ensure all activities are realistically scheduled and budgeted.`

    let rawContent: string

    // Use OpenAI if available, otherwise use mock data
    if (hasOpenAIKey && openai) {
      console.log('🤖 Using OpenAI API for itinerary generation')
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" }
      })

      rawContent = completion.choices[0]?.message?.content
      if (!rawContent) {
        throw new Error('No content received from OpenAI')
      }
    } else {
      console.log('🔧 Using mock itinerary generation for development')
      const mockItinerary = generateMockItinerary(validatedRequest)
      rawContent = JSON.stringify(mockItinerary)
    }

    // Parse and validate the AI response
    let parsedContent
    try {
      parsedContent = JSON.parse(rawContent)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', rawContent)
      throw new Error('Invalid JSON response from AI')
    }

    const validatedItinerary = ItinerarySchema.parse(parsedContent)

    // TODO: Implement RAG validation with external APIs
    // For now, we'll mark API validation as true
    validatedItinerary.api_validation_status = {
      flights_available: true,
      accommodation_available: true,
      tours_available: true,
      gear_rentals_available: true
    }

    return NextResponse.json({
      success: true,
      itinerary: validatedItinerary
    })

  } catch (error) {
    console.error('Error generating itinerary:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid AI response format',
        details: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate itinerary'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AdventureOS Itinerary Generator API',
    version: '1.0.0',
    endpoints: {
      POST: '/api/generate-itinerary - Generate a new adventure itinerary'
    }
  })
}
