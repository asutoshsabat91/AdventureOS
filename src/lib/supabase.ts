import { createClient } from '@supabase/supabase-js'

// Check if we have real Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Mock data for development
const mockUsers = [
  {
    id: 'user_123',
    email: 'demo@adventureos.com',
    full_name: 'Adventure Explorer',
    avatar_url: null,
    biometric_verified: true,
    verification_status: 'verified' as const,
    emergency_contacts: [],
    risk_tolerance: 'medium' as const,
    fitness_level: 'intermediate' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const mockItineraries = [
  {
    id: 'itinerary_1',
    user_id: 'user_123',
    title: 'Manali Adventure Trip',
    destination: 'Manali, India',
    start_date: '2024-02-20',
    end_date: '2024-02-25',
    budget: 50000,
    adventure_preferences: ['skiing', 'trekking', 'camping'],
    structured_data: {},
    status: 'draft' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const mockChatRooms = [
  {
    id: 'room_1',
    name: 'Manali Adventure Seekers',
    type: 'travel_buddy' as const,
    participants: ['user_123'],
    itinerary_id: 'itinerary_1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const mockMessages = [
  {
    id: 'msg_1',
    chat_room_id: 'room_1',
    user_id: 'user_123',
    content: 'Looking for adventure buddies for Manali trip!',
    message_type: 'text' as const,
    created_at: new Date().toISOString()
  }
]

// Mock Supabase client implementation
class MockSupabaseClient {
  constructor() {
    console.log('🔧 Using Mock Supabase Client for development')
  }

  from(table: string) {
    return {
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          single: () => ({
            data: this.getMockData(table, column, value, true),
            error: null
          }),
          then: (callback: any) => callback({
            data: this.getMockData(table, column, value, false),
            error: null
          })
        }),
        then: (callback: any) => callback({
          data: this.getMockData(table),
          error: null
        })
      }),
      insert: (data: any) => ({
        select: () => ({
          single: () => ({
            data: { ...data, id: `mock_${Date.now()}` },
            error: null
          })
        })
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: () => ({
            single: () => ({
              data: { ...data, id: value },
              error: null
            })
          })
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          then: (callback: any) => callback({
            data: null,
            error: null
          })
        })
      })
    }
  }

  channel(channelName: string) {
    return {
      on: (event: string, callback: any) => ({
        subscribe: () => ({
          unsubscribe: () => {}
        })
      })
    }
  }

  auth = {
    getUser: () => Promise.resolve({
      data: { user: mockUsers[0] },
      error: null
    }),
    signInWithOAuth: () => Promise.resolve({
      data: { user: mockUsers[0] },
      error: null
    }),
    signOut: () => Promise.resolve({
      error: null
    })
  }

  storage = {
    from: () => ({
      upload: () => Promise.resolve({
        data: { path: 'mock-avatar.jpg' },
        error: null
      }),
      getPublicUrl: () => ({
        data: { publicUrl: 'https://via.placeholder.com/150' }
      })
    })
  }

  private getMockData(table: string, column?: string, value?: any, single = false) {
    let data: any[] = []
    
    switch (table) {
      case 'users':
        data = mockUsers
        break
      case 'itineraries':
        data = mockItineraries
        break
      case 'chat_rooms':
        data = mockChatRooms
        break
      case 'messages':
        data = mockMessages
        break
      default:
        data = []
    }

    // Filter by column and value if provided
    if (column && value !== undefined) {
      data = data.filter(item => item[column as keyof typeof item] === value)
    }

    // Return single item or array
    if (single) {
      return data[0] || null
    }
    return data
  }
}

// Use real Supabase if credentials are available, otherwise use mock
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new MockSupabaseClient() as any

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          biometric_verified: boolean
          verification_status: 'pending' | 'verified' | 'rejected'
          emergency_contacts: JSON
          risk_tolerance: 'low' | 'medium' | 'high'
          fitness_level: 'beginner' | 'intermediate' | 'advanced'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          biometric_verified?: boolean
          verification_status?: 'pending' | 'verified' | 'rejected'
          emergency_contacts?: JSON
          risk_tolerance?: 'low' | 'medium' | 'high'
          fitness_level?: 'beginner' | 'intermediate' | 'advanced'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          biometric_verified?: boolean
          verification_status?: 'pending' | 'verified' | 'rejected'
          emergency_contacts?: JSON
          risk_tolerance?: 'low' | 'medium' | 'high'
          fitness_level?: 'beginner' | 'intermediate' | 'advanced'
          created_at?: string
          updated_at?: string
        }
      }
      itineraries: {
        Row: {
          id: string
          user_id: string
          title: string
          destination: string
          start_date: string
          end_date: string
          budget: number
          adventure_preferences: string[]
          structured_data: JSON
          status: 'draft' | 'confirmed' | 'active' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          destination: string
          start_date: string
          end_date: string
          budget: number
          adventure_preferences: string[]
          structured_data: JSON
          status?: 'draft' | 'confirmed' | 'active' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          destination?: string
          start_date?: string
          end_date?: string
          budget?: number
          adventure_preferences?: string[]
          structured_data?: JSON
          status?: 'draft' | 'confirmed' | 'active' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
      gear_rentals: {
        Row: {
          id: string
          owner_id: string
          gear_type: string
          brand_model: string
          description: string
          daily_rate: number
          location: string
          availability: boolean
          insurance_required: boolean
          images: string[]
          rental_type: 'p2p' | 'b2b'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          gear_type: string
          brand_model: string
          description: string
          daily_rate: number
          location: string
          availability?: boolean
          insurance_required?: boolean
          images?: string[]
          rental_type: 'p2p' | 'b2b'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          gear_type?: string
          brand_model?: string
          description?: string
          daily_rate?: number
          location?: string
          availability?: boolean
          insurance_required?: boolean
          images?: string[]
          rental_type?: 'p2p' | 'b2b'
          created_at?: string
          updated_at?: string
        }
      }
      chat_rooms: {
        Row: {
          id: string
          name: string
          type: 'travel_buddy' | 'emergency' | 'general'
          participants: string[]
          itinerary_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'travel_buddy' | 'emergency' | 'general'
          participants: string[]
          itinerary_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'travel_buddy' | 'emergency' | 'general'
          participants?: string[]
          itinerary_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          chat_room_id: string
          user_id: string
          content: string
          message_type: 'text' | 'location' | 'emergency'
          created_at: string
        }
        Insert: {
          id?: string
          chat_room_id: string
          user_id: string
          content: string
          message_type?: 'text' | 'location' | 'emergency'
          created_at?: string
        }
        Update: {
          id?: string
          chat_room_id?: string
          user_id?: string
          content?: string
          message_type?: 'text' | 'location' | 'emergency'
          created_at?: string
        }
      }
      emergencies: {
        Row: {
          id: string
          user_id: string
          location: JSON
          severity: 'low' | 'medium' | 'high' | 'critical'
          description: string
          status: 'active' | 'resolved'
          contacts_notified: string[]
          created_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          location: JSON
          severity: 'low' | 'medium' | 'high' | 'critical'
          description: string
          status?: 'active' | 'resolved'
          contacts_notified?: string[]
          created_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          location?: JSON
          severity?: 'low' | 'medium' | 'high' | 'critical'
          description?: string
          status?: 'active' | 'resolved'
          contacts_notified?: string[]
          created_at?: string
          resolved_at?: string | null
        }
      }
    }
  }
}
