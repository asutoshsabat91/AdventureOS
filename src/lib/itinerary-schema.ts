import { z } from 'zod'

export const ActivitySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(['adventure', 'cultural', 'transport', 'accommodation', 'dining']),
  duration_hours: z.number(),
  start_time: z.string(), // HH:MM format
  location: z.string(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }),
  cost: z.number(),
  gear_required: z.array(z.string()).optional(),
  weather_dependent: z.boolean().optional(),
  api_references: z.object({
    tourradar_id: z.string().optional(),
    hostelworld_id: z.string().optional(),
    fareharbor_id: z.string().optional(),
    skyscanner_id: z.string().optional()
  }).optional()
})

export const DaySchema = z.object({
  day_number: z.number(),
  date: z.string(), // YYYY-MM-DD format
  theme: z.string(),
  activities: z.array(ActivitySchema),
  total_cost: z.number(),
  weather_forecast: z.object({
    temperature_min: z.number(),
    temperature_max: z.number(),
    conditions: z.string(),
    precipitation_chance: z.number()
  }).optional(),
  safety_notes: z.array(z.string()).optional()
})

export const ItinerarySchema = z.object({
  id: z.string().optional(),
  destination: z.string(),
  start_date: z.string(), // YYYY-MM-DD
  end_date: z.string(), // YYYY-MM-DD
  total_budget: z.number(),
  estimated_total_cost: z.number(),
  currency: z.string().default('USD'),
  days: z.array(DaySchema),
  adventure_preferences: z.array(z.string()),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
  group_size: z.number(),
  transportation: z.object({
    type: z.enum(['flight', 'train', 'bus', 'car_rental', 'mixed']),
    details: z.string(),
    estimated_cost: z.number()
  }),
  accommodation: z.object({
    type: z.enum(['hostel', 'hotel', 'airbnb', 'camping', 'mixed']),
    preferences: z.array(z.string()),
    estimated_nightly_cost: z.number()
  }),
  emergency_contacts: z.array(z.object({
    name: z.string(),
    phone: z.string(),
    relationship: z.string()
  })),
  packing_suggestions: z.array(z.string()),
  health_safety_notes: z.array(z.string()),
  api_validation_status: z.object({
    flights_available: z.boolean(),
    accommodation_available: z.boolean(),
    tours_available: z.boolean(),
    gear_rentals_available: z.boolean()
  })
})

export type Itinerary = z.infer<typeof ItinerarySchema>
export type Day = z.infer<typeof DaySchema>
export type Activity = z.infer<typeof ActivitySchema>
