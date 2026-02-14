import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const adventurePreferences = [
  'Hiking & Trekking',
  'Mountain Climbing',
  'Rock Climbing',
  'Skiing & Snowboarding',
  'Skydiving',
  'Paragliding',
  'Surfing',
  'Scuba Diving',
  'Kayaking & Rafting',
  'Mountain Biking',
  'Camping',
  'Wildlife Safari',
  'Cultural Tours',
  'Photography',
  'Food & Cuisine',
  'Nightlife',
  'Beach Activities',
  'Water Sports'
]

export const itineraryFormSchema = z.object({
  destination: z.string().min(2, 'Destination must be at least 2 characters'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  budget: z.number().min(50, 'Budget must be at least $50'),
  adventure_preferences: z.array(z.string()).min(1, 'Select at least one adventure preference'),
  group_size: z.number().min(1, 'Group size must be at least 1').max(20, 'Group size cannot exceed 20'),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
  fitness_level: z.enum(['beginner', 'intermediate', 'advanced']),
  risk_tolerance: z.enum(['low', 'medium', 'high'])
}).refine((data) => new Date(data.end_date) >= new Date(data.start_date), {
  message: "End date must be after start date",
  path: ["end_date"]
})

export type ItineraryFormData = z.infer<typeof itineraryFormSchema>

export function useItineraryForm() {
  const form = useForm<ItineraryFormData>({
    resolver: zodResolver(itineraryFormSchema),
    defaultValues: {
      destination: '',
      start_date: '',
      end_date: '',
      budget: 1000,
      adventure_preferences: [],
      group_size: 1,
      difficulty_level: 'beginner',
      fitness_level: 'beginner',
      risk_tolerance: 'medium'
    }
  })

  return {
    form,
    adventurePreferences
  }
}
