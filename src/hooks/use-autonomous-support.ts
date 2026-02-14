import { useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'sonner'

export interface SupportMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  metadata?: any
}

export interface SupportSession {
  session_id: string
  user_id: string
  messages: SupportMessage[]
  conversation_context: {
    intent: string
    sentiment: string
    priority: string
    resolved: boolean
    escalated: boolean
  }
  user_context: {
    preferences?: string[]
    location?: string
    upcoming_trips_count?: number
  }
  suggested_actions: Array<{
    action: string
    scheduled_time: string
    parameters: any
  }>
  knowledge_articles: Array<{
    title: string
    content: string
    relevance_score: number
  }>
}

export interface SupportResponse {
  response: string
  session_state: {
    intent: string
    sentiment: string
    priority: string
    resolved: boolean
    escalated: boolean
  }
  suggested_actions: any[]
  knowledge_articles: any[]
  session_id: string
}

export function useAutonomousSupport(userId: string) {
  const [session, setSession] = useState<SupportSession | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  
  const abortControllerRef = useRef<AbortController | null>(null)
  const messageQueueRef = useRef<SupportMessage[]>([])

  // Initialize a new support session
  const initializeSession = useCallback(async () => {
    try {
      const newSessionId = `support_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      setSessionId(newSessionId)
      
      const newSession: SupportSession = {
        session_id: newSessionId,
        user_id: userId,
        messages: [],
        conversation_context: {
          intent: 'general',
          sentiment: 'neutral',
          priority: 'medium',
          resolved: false,
          escalated: false
        },
        user_context: {
          preferences: [],
          location: null,
          upcoming_trips_count: 0
        },
        suggested_actions: [],
        knowledge_articles: []
      }
      
      setSession(newSession)
      return newSessionId
    } catch (error) {
      console.error('Failed to initialize support session:', error)
      setError('Failed to start support session')
      return null
    }
  }, [userId])

  // Send a message to the support agent
  const sendMessage = useCallback(async (
    message: string,
    context?: {
      current_page?: string
      user_action?: string
      error_details?: any
    }
  ) => {
    if (!message.trim() || !userId) return

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    setIsLoading(true)
    setIsTyping(true)
    setError(null)

    try {
      // Ensure we have a session
      let currentSessionId = sessionId
      if (!currentSessionId) {
        currentSessionId = await initializeSession()
        if (!currentSessionId) {
          throw new Error('Failed to initialize session')
        }
      }

      // Add user message to local state immediately
      const userMessage: SupportMessage = {
        role: 'user',
        content: message.trim(),
        timestamp: new Date().toISOString(),
        metadata: context
      }

      setSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, userMessage]
      } : null)

      // Send to API
      const response = await fetch('/api/support/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          session_id: currentSessionId,
          message: message.trim(),
          context
        }),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: { success: boolean; data: SupportResponse; error?: string } = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to send message')
      }

      // Add assistant response to state
      const assistantMessage: SupportMessage = {
        role: 'assistant',
        content: data.data.response,
        timestamp: new Date().toISOString(),
        metadata: {
          intent: data.data.session_state.intent,
          sentiment: data.data.session_state.sentiment,
          priority: data.data.session_state.priority
        }
      }

      setSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, assistantMessage],
        conversation_context: data.data.session_state,
        suggested_actions: data.data.suggested_actions,
        knowledge_articles: data.data.knowledge_articles
      } : null)

      // Show appropriate toast based on priority
      if (data.data.session_state.priority === 'critical') {
        toast.error('High priority issue detected', {
          description: 'Our support team has been notified'
        })
      } else if (data.data.session_state.escalated) {
        toast.info('Connecting you with a human agent', {
          description: 'A support specialist will join shortly'
        })
      }

      return data.data

    } catch (error: any) {
      console.error('Error sending support message:', error)
      
      if (error.name === 'AbortError') {
        return null // Request was cancelled
      }

      const errorMessage = error.message || 'Failed to send message'
      setError(errorMessage)
      
      // Add error message to session
      const errorMessageObj: SupportMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your message. Please try again or contact support directly.',
        timestamp: new Date().toISOString(),
        metadata: { error: true }
      }

      setSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, errorMessageObj]
      } : null)

      toast.error('Support Error', {
        description: errorMessage
      })

      throw error
    } finally {
      setIsLoading(false)
      setIsTyping(false)
      abortControllerRef.current = null
    }
  }, [userId, sessionId, initializeSession])

  // Load existing session
  const loadSession = useCallback(async (sessionIdToLoad: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(
        `/api/support/chat?session_id=${sessionIdToLoad}&user_id=${userId}`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to load session')
      }

      setSession(data.data)
      setSessionId(sessionIdToLoad)

      return data.data

    } catch (error: any) {
      console.error('Error loading support session:', error)
      setError(error.message || 'Failed to load session')
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  // End the current session
  const endSession = useCallback(async () => {
    if (!sessionId || !userId) return

    try {
      const response = await fetch(
        `/api/support/chat?session_id=${sessionId}&user_id=${userId}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setSession(null)
      setSessionId(null)
      messageQueueRef.current = []

      toast.success('Support session ended')

    } catch (error: any) {
      console.error('Error ending support session:', error)
      toast.error('Failed to end session')
    }
  }, [sessionId, userId])

  // Get support agent statistics
  const getAgentStats = useCallback(async () => {
    try {
      const response = await fetch('/api/support/chat')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.data

    } catch (error: any) {
      console.error('Error fetching agent stats:', error)
      return null
    }
  }, [])

  // Quick actions for common requests
  const sendQuickMessage = useCallback(async (type: 'emergency' | 'booking_help' | 'itinerary_help' | 'technical_issue') => {
    const quickMessages = {
      emergency: "I need emergency assistance. This is urgent.",
      booking_help: "I need help with my booking or reservation.",
      itinerary_help: "I need help modifying or creating an itinerary.",
      technical_issue: "I'm experiencing a technical problem with the app."
    }

    await sendMessage(quickMessages[type], {
      user_action: `quick_action_${type}`
    })
  }, [sendMessage])

  // Rate the conversation
  const rateConversation = useCallback(async (rating: number) => {
    if (!sessionId || !userId) return

    try {
      // This would update the last interaction with a satisfaction score
      // Implementation would depend on your API design
      toast.success('Thank you for your feedback!')
    } catch (error) {
      console.error('Error rating conversation:', error)
    }
  }, [sessionId, userId])

  // Clear error state
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Auto-save session to localStorage
  useEffect(() => {
    if (session) {
      try {
        localStorage.setItem(`support_session_${userId}`, JSON.stringify(session))
      } catch (error) {
        console.error('Failed to save session to localStorage:', error)
      }
    }
  }, [session, userId])

  // Load session from localStorage on mount
  useEffect(() => {
    if (userId) {
      try {
        const savedSession = localStorage.getItem(`support_session_${userId}`)
        if (savedSession) {
          const parsedSession = JSON.parse(savedSession)
          // Only restore if session is recent (within last 24 hours)
          const sessionAge = Date.now() - new Date(parsedSession.messages?.[0]?.timestamp || 0).getTime()
          if (sessionAge < 24 * 60 * 60 * 1000) {
            setSession(parsedSession)
            setSessionId(parsedSession.session_id)
          } else {
            localStorage.removeItem(`support_session_${userId}`)
          }
        }
      } catch (error) {
        console.error('Failed to load session from localStorage:', error)
      }
    }
  }, [userId])

  return {
    // State
    session,
    isLoading,
    isTyping,
    error,
    sessionId,
    
    // Actions
    sendMessage,
    initializeSession,
    loadSession,
    endSession,
    getAgentStats,
    sendQuickMessage,
    rateConversation,
    clearError,
    
    // Computed values
    hasActiveSession: !!session,
    messageCount: session?.messages.length || 0,
    isEscalated: session?.conversation_context.escalated || false,
    isResolved: session?.conversation_context.resolved || false,
    currentPriority: session?.conversation_context.priority || 'medium',
    currentIntent: session?.conversation_context.intent || 'general',
    hasKnowledgeArticles: (session?.knowledge_articles.length || 0) > 0,
    hasSuggestedActions: (session?.suggested_actions.length || 0) > 0
  }
}
