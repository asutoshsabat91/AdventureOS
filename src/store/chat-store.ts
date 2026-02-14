import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export interface Message {
  id: string
  chat_room_id: string
  user_id: string
  content: string
  message_type: 'text' | 'location' | 'emergency'
  created_at: string
  user?: {
    full_name: string
    avatar_url: string | null
  }
}

export interface ChatRoom {
  id: string
  name: string
  type: 'travel_buddy' | 'emergency' | 'general'
  participants: string[]
  itinerary_id: string | null
  created_at: string
  updated_at: string
  last_message?: Message
  online_users?: string[]
}

interface ChatState {
  chatRooms: ChatRoom[]
  currentChatRoom: ChatRoom | null
  messages: Message[]
  onlineUsers: string[]
  isLoading: boolean
  error: string | null
  
  // Actions
  setChatRooms: (rooms: ChatRoom[]) => void
  setCurrentChatRoom: (room: ChatRoom | null) => void
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  setOnlineUsers: (users: string[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Real-time actions
  subscribeToChatRoom: (chatRoomId: string) => () => void
  subscribeToOnlineUsers: () => () => void
  sendMessage: (chatRoomId: string, content: string, type?: 'text' | 'location' | 'emergency') => Promise<void>
  createChatRoom: (name: string, type: 'travel_buddy' | 'emergency' | 'general', participants: string[], itineraryId?: string) => Promise<void>
  joinChatRoom: (chatRoomId: string) => Promise<void>
  leaveChatRoom: (chatRoomId: string) => Promise<void>
}

export const useChatStore = create<ChatState>((set, get) => ({
  chatRooms: [],
  currentChatRoom: null,
  messages: [],
  onlineUsers: [],
  isLoading: false,
  error: null,

  setChatRooms: (rooms) => set({ chatRooms: rooms }),
  setCurrentChatRoom: (room) => set({ currentChatRoom: room }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message],
    chatRooms: state.chatRooms.map(room => 
      room.id === message.chat_room_id 
        ? { ...room, last_message: message, updated_at: message.created_at }
        : room
    )
  })),
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  subscribeToChatRoom: (chatRoomId: string) => {
    const channel = supabase
      .channel(`chat_room_${chatRoomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_room_id=eq.${chatRoomId}`
        },
        async (payload) => {
          const newMessage = payload.new as Message
          
          // Fetch user details for the message
          const { data: userData } = await supabase
            .from('users')
            .select('full_name, avatar_url')
            .eq('id', newMessage.user_id)
            .single()
          
          const messageWithUser = {
            ...newMessage,
            user: userData
          }
          
          get().addMessage(messageWithUser)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  },

  subscribeToOnlineUsers: () => {
    const channel = supabase
      .channel('online_users')
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState()
        const onlineUsers = Object.keys(newState).map(key => key)
        get().setOnlineUsers(onlineUsers)
      })
      .subscribe()

    // Set current user as online
    const currentUser = supabase.auth.getUser()
    currentUser.then(({ data: { user } }) => {
      if (user) {
        channel.track({
          user_id: user.id,
          online_at: new Date().toISOString()
        })
      }
    })

    return () => {
      supabase.removeChannel(channel)
    }
  },

  sendMessage: async (chatRoomId: string, content: string, type: 'text' | 'location' | 'emergency' = 'text') => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('messages')
        .insert({
          chat_room_id: chatRoomId,
          user_id: user.id,
          content,
          message_type: type
        })

      if (error) throw error
    } catch (error) {
      console.error('Error sending message:', error)
      get().setError(error instanceof Error ? error.message : 'Failed to send message')
    }
  },

  createChatRoom: async (name: string, type: 'travel_buddy' | 'emergency' | 'general', participants: string[], itineraryId?: string) => {
    try {
      set({ isLoading: true, error: null })

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('chat_rooms')
        .insert({
          name,
          type,
          participants: [...participants, user.id],
          itinerary_id: itineraryId || null
        })
        .select()
        .single()

      if (error) throw error

      set((state) => ({
        chatRooms: [...state.chatRooms, data],
        isLoading: false
      }))
    } catch (error) {
      console.error('Error creating chat room:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create chat room',
        isLoading: false 
      })
    }
  },

  joinChatRoom: async (chatRoomId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('chat_rooms')
        .update({
          participants: supabase.sql`array_append(participants, ${user.id})`
        })
        .eq('id', chatRoomId)

      if (error) throw error
    } catch (error) {
      console.error('Error joining chat room:', error)
      get().setError(error instanceof Error ? error.message : 'Failed to join chat room')
    }
  },

  leaveChatRoom: async (chatRoomId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('chat_rooms')
        .update({
          participants: supabase.sql`array_remove(participants, ${user.id})`
        })
        .eq('id', chatRoomId)

      if (error) throw error

      if (get().currentChatRoom?.id === chatRoomId) {
        set({ currentChatRoom: null, messages: [] })
      }
    } catch (error) {
      console.error('Error leaving chat room:', error)
      get().setError(error instanceof Error ? error.message : 'Failed to leave chat room')
    }
  }
}))
