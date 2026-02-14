import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { autonomousSupportAgent, SupportAgentState } from '@/lib/ai/support-agent'
import { supabase } from '@/lib/supabase'

const supportMessageSchema = z.object({
  user_id: z.string().min(1, 'User ID is required'),
  session_id: z.string().min(1, 'Session ID is required'),
  message: z.string().min(1, 'Message is required'),
  context: z.object({
    current_page: z.string().optional(),
    user_action: z.string().optional(),
    error_details: z.any().optional()
  }).optional()
})

const sessionRequestSchema = z.object({
  user_id: z.string().min(1, 'User ID is required'),
  session_id: z.string().min(1, 'Session ID is required')
})

// Store session states in memory (in production, use Redis or database)
const sessionStates = new Map<string, SupportAgentState>()

// POST /api/support/chat - Process a support message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = supportMessageSchema.parse(body)

    // Get existing session state or create new one
    let existingState = sessionStates.get(validatedData.session_id)
    
    // If no existing state, try to load from database
    if (!existingState) {
      try {
        const { data: sessionData } = await supabase
          .from('support_sessions')
          .select('*')
          .eq('session_id', validatedData.session_id)
          .eq('user_id', validatedData.user_id)
          .single()

        if (sessionData) {
          existingState = sessionData.state as SupportAgentState
        }
      } catch (error) {
        // Session doesn't exist in database, will create new one
        console.log('Creating new support session')
      }
    }

    // Process the message through the autonomous agent
    const result = await autonomousSupportAgent.processMessage(
      validatedData.user_id,
      validatedData.session_id,
      validatedData.message,
      existingState
    )

    // Store session state
    sessionStates.set(validatedData.session_id, result)

    // Save session to database
    try {
      await supabase
        .from('support_sessions')
        .upsert({
          session_id: validatedData.session_id,
          user_id: validatedData.user_id,
          state: result,
          last_activity: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Error saving session to database:', error)
    }

    // Log the interaction for analytics
    try {
      await supabase
        .from('support_interactions')
        .insert({
          session_id: validatedData.session_id,
          user_id: validatedData.user_id,
          message: validatedData.message,
          response: result.messages[result.messages.length - 1]?.content,
          intent: result.conversation_context.intent,
          sentiment: result.conversation_context.sentiment,
          priority: result.conversation_context.priority,
      escalated: result.conversation_context.escalation_needed,
          context: validatedData.context,
          created_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Error logging interaction:', error)
    }

    // Return the assistant's response
    const lastMessage = result.messages[result.messages.length - 1]
    
    return NextResponse.json({
      success: true,
      data: {
        response: lastMessage?.content || '',
        session_state: {
          intent: result.conversation_context.intent,
          sentiment: result.conversation_context.sentiment,
          priority: result.conversation_context.priority,
          resolved: result.conversation_context.resolved,
          escalated: result.conversation_context.escalation_needed
        },
        suggested_actions: result.agent_actions.scheduled_actions || [],
        knowledge_articles: result.knowledge_base.relevant_articles || [],
        session_id: validatedData.session_id
      }
    })

  } catch (error: any) {
    console.error('Error in support chat:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request format',
        details: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Support service unavailable',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}

// GET /api/support/chat - Get session state or session info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    const userId = searchParams.get('user_id')

    if (sessionId && userId) {
      // Get specific session
      const validatedData = sessionRequestSchema.parse({
        session_id: sessionId,
        user_id: userId
      })

      let sessionState = sessionStates.get(validatedData.session_id)
      
      if (!sessionState) {
        // Try to load from database
        try {
          const { data: sessionData } = await supabase
            .from('support_sessions')
            .select('*')
            .eq('session_id', validatedData.session_id)
            .eq('user_id', validatedData.user_id)
            .single()

          if (sessionData) {
            sessionState = sessionData.state as SupportAgentState
            sessionStates.set(validatedData.session_id, sessionState)
          }
        } catch (error) {
          return NextResponse.json({
            success: false,
            error: 'Session not found'
          }, { status: 404 })
        }
      }

      if (!sessionState) {
        return NextResponse.json({
          success: false,
          error: 'Session not found'
        }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: {
          session_id: sessionState.session_id,
          messages: sessionState.messages,
          conversation_context: sessionState.conversation_context,
          user_context: {
            // Return only safe user context
            preferences: sessionState.user_context.preferences,
            location: sessionState.user_context.location,
            upcoming_trips_count: sessionState.user_context.upcoming_trips?.length || 0
          },
          suggested_actions: sessionState.agent_actions.scheduled_actions || []
        }
      })
    } else {
      // Get agent statistics
      const stats = autonomousSupportAgent.getSessionStats()
      
      return NextResponse.json({
        success: true,
        data: {
          agent_stats: stats,
          active_sessions: sessionStates.size,
          available_features: [
            'Autonomous conversation handling',
            'Intent recognition',
            'Sentiment analysis',
            'Priority escalation',
            'Knowledge base integration',
            'Follow-up scheduling',
            'External API integration',
            'Emergency response'
          ]
        }
      })
    }

  } catch (error: any) {
    console.error('Error in support GET:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request format',
        details: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Support service unavailable'
    }, { status: 500 })
  }
}

// DELETE /api/support/chat - End a session
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    const userId = searchParams.get('user_id')

    if (!sessionId || !userId) {
      return NextResponse.json({
        success: false,
        error: 'Session ID and User ID are required'
      }, { status: 400 })
    }

    const validatedData = sessionRequestSchema.parse({
      session_id: sessionId,
      user_id: userId
    })

    // Clear from memory
    sessionStates.delete(validatedData.session_id)
    autonomousSupportAgent.clearSession(validatedData.session_id)

    // Mark session as ended in database
    try {
      await supabase
        .from('support_sessions')
        .update({
          ended_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('session_id', validatedData.session_id)
        .eq('user_id', validatedData.user_id)
    } catch (error) {
      console.error('Error ending session in database:', error)
    }

    return NextResponse.json({
      success: true,
      message: 'Session ended successfully'
    })

  } catch (error: any) {
    console.error('Error ending support session:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request format',
        details: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to end session'
    }, { status: 500 })
  }
}
