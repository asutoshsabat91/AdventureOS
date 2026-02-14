import { ChatOpenAI } from "@langchain/openai"
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages"
import { StateGraph, END } from "@langchain/langgraph"
import { RunnableConfig } from "@langchain/core/runnables"
import { supabase } from '@/lib/supabase'

// Define the state structure for our support agent
export interface SupportAgentState {
  user_id: string
  session_id: string
  messages: Array<{
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp: string
    metadata?: any
  }>
  user_context: {
    profile?: any
    current_itinerary?: any
    upcoming_trips?: any[]
    preferences?: any
    location?: string
    emergency_contacts?: any[]
  }
  conversation_context: {
    intent: 'general' | 'itinerary_help' | 'emergency' | 'booking_support' | 'travel_advice' | 'technical_support'
    sentiment: 'positive' | 'neutral' | 'negative' | 'urgent'
    priority: 'low' | 'medium' | 'high' | 'critical'
    resolved: boolean
    escalation_needed: boolean
  }
  agent_actions: {
    taken_actions: string[]
    scheduled_actions: Array<{
      action: string
      scheduled_time: string
      parameters: any
    }>
    external_apis_called: string[]
  }
  knowledge_base: {
    relevant_articles: Array<{
      title: string
      content: string
      relevance_score: number
    }>
    faqs: Array<{
      question: string
      answer: string
      relevance_score: number
    }>
  }
}

// Support Agent Tools
class SupportAgentTools {
  private llm: ChatOpenAI

  constructor(openaiApiKey: string) {
    this.llm = new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 0.7,
      openAIApiKey: openaiApiKey,
    })
  }

  // Get user context from database
  async getUserContext(userId: string): Promise<any> {
    try {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      const { data: itineraries } = await supabase
        .from('itineraries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)

      return {
        profile,
        current_itinerary: itineraries?.[0] || null,
        upcoming_trips: itineraries?.filter(i => new Date(i.start_date) > new Date()) || [],
        preferences: profile?.adventure_preferences || [],
        location: profile?.current_location || null,
        emergency_contacts: profile?.emergency_contacts || []
      }
    } catch (error) {
      console.error('Error fetching user context:', error)
      return {}
    }
  }

  // Analyze message intent and sentiment
  async analyzeMessage(message: string): Promise<{ intent: string, sentiment: string, priority: string }> {
    const analysisPrompt = `
    Analyze this user message for intent, sentiment, and priority:
    
    Message: "${message}"
    
    Respond in JSON format:
    {
      "intent": "general|itinerary_help|emergency|booking_support|travel_advice|technical_support",
      "sentiment": "positive|neutral|negative|urgent",
      "priority": "low|medium|high|critical"
    }
    
    Consider:
    - Emergency keywords: "emergency", "help", "lost", "danger", "injured", "stolen"
    - Booking issues: "refund", "cancel", "booking", "payment"
    - Itinerary help: "itinerary", "plan", "schedule", "change"
    - Technical issues: "error", "bug", "not working", "broken"
    `

    try {
      const response = await this.llm.invoke([
        new SystemMessage("You are a message analysis expert. Respond only with valid JSON."),
        new HumanMessage(analysisPrompt)
      ])

      const content = response.content as string
      return JSON.parse(content)
    } catch (error) {
      console.error('Error analyzing message:', error)
      return { intent: 'general', sentiment: 'neutral', priority: 'medium' }
    }
  }

  // Search knowledge base
  async searchKnowledgeBase(query: string, intent: string): Promise<any> {
    // Mock knowledge base - in production, this would search a real knowledge base
    const knowledgeBase = {
      general: [
        {
          title: "Getting Started with AdventureOS",
          content: "AdventureOS helps you plan amazing adventure trips with AI-powered itineraries...",
          relevance_score: 0.8
        }
      ],
      emergency: [
        {
          title: "Emergency Procedures",
          content: "In case of emergency, contact local emergency services immediately...",
          relevance_score: 0.9
        }
      ],
      itinerary_help: [
        {
          title: "Modifying Your Itinerary",
          content: "You can modify your itinerary by accessing the edit feature...",
          relevance_score: 0.85
        }
      ],
      booking_support: [
        {
          title: "Booking and Cancellation Policy",
          content: "Our booking policy allows cancellations up to 24 hours before...",
          relevance_score: 0.9
        }
      ],
      travel_advice: [
        {
          title: "Best Adventure Destinations",
          content: "Popular adventure destinations include Manali, Rishikesh, Leh...",
          relevance_score: 0.8
        }
      ],
      technical_support: [
        {
          title: "Troubleshooting Common Issues",
          content: "If you're experiencing technical issues, try clearing your cache...",
          relevance_score: 0.85
        }
      ]
    }

    const articles = knowledgeBase[intent as keyof typeof knowledgeBase] || []
    const faqs = [
      {
        question: "How do I cancel my booking?",
        answer: "You can cancel your booking from your dashboard...",
        relevance_score: 0.8
      }
    ]

    return { articles, faqs }
  }

  // Generate personalized response
  async generateResponse(
    state: SupportAgentState,
    userMessage: string
  ): Promise<string> {
    const contextPrompt = `
    You are an expert adventure travel support agent for AdventureOS. You are helpful, knowledgeable, and empathetic.
    
    User Context:
    - Name: ${state.user_context.profile?.full_name || 'Traveler'}
    - Preferences: ${state.user_context.preferences?.join(', ') || 'Not specified'}
    - Current Location: ${state.user_context.location || 'Unknown'}
    - Upcoming Trips: ${state.user_context.upcoming_trips?.length || 0} trips planned
    
    Conversation Context:
    - Intent: ${state.conversation_context.intent}
    - Sentiment: ${state.conversation_context.sentiment}
    - Priority: ${state.conversation_context.priority}
    
    Relevant Knowledge:
    ${state.knowledge_base.articles.map(a => `- ${a.title}: ${a.content}`).join('\n')}
    
    Recent Messages:
    ${state.messages.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n')}
    
    User's Current Message: "${userMessage}"
    
    Guidelines:
    1. Be empathetic and understanding
    2. Provide specific, actionable advice
    3. Reference their travel history when relevant
    4. For emergencies, prioritize safety and immediate actions
    5. For technical issues, provide step-by-step solutions
    6. For booking issues, explain policies clearly
    7. Keep responses concise but comprehensive
    
    Respond as a helpful support agent:
    `

    try {
      const response = await this.llm.invoke([
        new SystemMessage("You are an expert adventure travel support agent."),
        new HumanMessage(contextPrompt)
      ])

      return response.content as string
    } catch (error) {
      console.error('Error generating response:', error)
      return "I apologize, but I'm having trouble generating a response right now. Please try again or contact human support."
    }
  }

  // Schedule follow-up actions
  async scheduleFollowUp(state: SupportAgentState): Promise<any> {
    const actions = []

    // Schedule weather check for upcoming trips
    if (state.user_context.upcoming_trips && state.user_context.upcoming_trips.length > 0) {
      actions.push({
        action: 'weather_check',
        scheduled_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        parameters: {
          destination: state.user_context.upcoming_trips[0].destination,
          user_id: state.user_id
        }
      })
    }

    // Schedule check-in for complex issues
    if (state.conversation_context.priority === 'high' || state.conversation_context.priority === 'critical') {
      actions.push({
        action: 'follow_up_check',
        scheduled_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        parameters: {
          session_id: state.session_id,
          user_id: state.user_id
        }
      })
    }

    return actions
  }

  // Check if escalation is needed
  async checkEscalationNeeded(state: SupportAgentState): Promise<boolean> {
    // Escalate if:
    // 1. Emergency situation
    // 2. Critical priority
    // 3. Multiple failed attempts to resolve
    // 4. User explicitly requests human support
    
    if (state.conversation_context.intent === 'emergency') return true
    if (state.conversation_context.priority === 'critical') return true
    
    const failedAttempts = state.messages.filter(m => 
      m.role === 'assistant' && 
      m.metadata?.resolution_failed === true
    ).length
    
    if (failedAttempts >= 3) return true
    
    const requestsHuman = state.messages.some(m => 
      m.role === 'user' && 
      (m.content.toLowerCase().includes('human') || 
       m.content.toLowerCase().includes('agent') || 
       m.content.toLowerCase().includes('speak to someone'))
    )
    
    return requestsHuman
  }

  // Call external APIs if needed
  async callExternalAPIs(state: SupportAgentState, userMessage: string): Promise<string[]> {
    const apisCalled = []

    // Check weather for user's location
    if (userMessage.toLowerCase().includes('weather') && state.user_context.location) {
      try {
        // This would integrate with the weather API
        apisCalled.push('weather_api')
      } catch (error) {
        console.error('Error calling weather API:', error)
      }
    }

    // Check booking status
    if (state.conversation_context.intent === 'booking_support') {
      try {
        // This would integrate with booking APIs
        apisCalled.push('booking_api')
      } catch (error) {
        console.error('Error calling booking API:', error)
      }
    }

    return apisCalled
  }
}

// LangGraph Workflow
export class SupportAgentWorkflow {
  private tools: SupportAgentTools
  private workflow: StateGraph<SupportAgentState>

  constructor(openaiApiKey: string) {
    this.tools = new SupportAgentTools(openaiApiKey)
    this.workflow = this.createWorkflow()
  }

  private createWorkflow(): StateGraph<SupportAgentState> {
    const workflow = new StateGraph<SupportAgentState>({
      channels: {
        user_id: { reducer: (x: string) => x },
        session_id: { reducer: (x: string) => x },
        messages: { 
          reducer: (x: any[], y: any) => {
            if (Array.isArray(y)) return y
            return [...(x || []), y]
          }
        },
        user_context: { reducer: (x: any) => x },
        conversation_context: { 
          reducer: (x: any, y: any) => ({ ...(x || {}), ...(y || {}) })
        },
        agent_actions: { 
          reducer: (x: any, y: any) => ({ ...(x || {}), ...(y || {}) })
        },
        knowledge_base: { 
          reducer: (x: any, y: any) => ({ ...(x || {}), ...(y || {}) })
        }
      }
    })

    // Define workflow nodes
    workflow.addNode("initialize", this.initialize.bind(this))
    workflow.addNode("analyze_message", this.analyzeMessage.bind(this))
    workflow.addNode("gather_context", this.gatherContext.bind(this))
    workflow.addNode("search_knowledge", this.searchKnowledge.bind(this))
    workflow.addNode("generate_response", this.generateResponse.bind(this))
    workflow.addNode("schedule_actions", this.scheduleActions.bind(this))
    workflow.addNode("check_escalation", this.checkEscalation.bind(this))
    workflow.addNode("escalate", this.escalate.bind(this))

    // Define workflow edges
    workflow.setEntryPoint("initialize")
    workflow.addEdge("initialize", "analyze_message")
    workflow.addEdge("analyze_message", "gather_context")
    workflow.addEdge("gather_context", "search_knowledge")
    workflow.addEdge("search_knowledge", "generate_response")
    workflow.addEdge("generate_response", "schedule_actions")
    workflow.addEdge("schedule_actions", "check_escalation")
    
    workflow.addConditionalEdges(
      "check_escalation",
      this.shouldEscalate.bind(this),
      {
        escalate: "escalate",
        resolve: END
      }
    )

    return workflow
  }

  private async initialize(state: SupportAgentState): Promise<Partial<SupportAgentState>> {
    return {
      agent_actions: {
        taken_actions: [],
        scheduled_actions: [],
        external_apis_called: []
      }
    }
  }

  private async analyzeMessage(state: SupportAgentState): Promise<Partial<SupportAgentState>> {
    const lastMessage = state.messages[state.messages.length - 1]
    if (!lastMessage || lastMessage.role !== 'user') {
      return state
    }

    const analysis = await this.tools.analyzeMessage(lastMessage.content)
    
    return {
      conversation_context: {
        intent: analysis.intent as any,
        sentiment: analysis.sentiment as any,
        priority: analysis.priority as any,
        resolved: false,
        escalation_needed: false
      }
    }
  }

  private async gatherContext(state: SupportAgentState): Promise<Partial<SupportAgentState>> {
    const userContext = await this.tools.getUserContext(state.user_id)
    
    return {
      user_context
    }
  }

  private async searchKnowledge(state: SupportAgentState): Promise<Partial<SupportAgentState>> {
    const lastMessage = state.messages[state.messages.length - 1]
    if (!lastMessage) return state

    const knowledge = await this.tools.searchKnowledgeBase(
      lastMessage.content,
      state.conversation_context.intent
    )
    
    return {
      knowledge_base: knowledge
    }
  }

  private async generateResponse(state: SupportAgentState): Promise<Partial<SupportAgentState>> {
    const lastMessage = state.messages[state.messages.length - 1]
    if (!lastMessage) return state

    const response = await this.tools.generateResponse(state, lastMessage.content)
    const apisCalled = await this.tools.callExternalAPIs(state, lastMessage.content)
    
    const assistantMessage = {
      role: 'assistant' as const,
      content: response,
      timestamp: new Date().toISOString(),
      metadata: {
        apis_called: apisCalled
      }
    }

    return {
      messages: [...state.messages, assistantMessage],
      agent_actions: {
        ...state.agent_actions,
        taken_actions: [...state.agent_actions.taken_actions, 'generated_response'],
        external_apis_called: [...state.agent_actions.external_apis_called, ...apisCalled]
      }
    }
  }

  private async scheduleActions(state: SupportAgentState): Promise<Partial<SupportAgentState>> {
    const scheduledActions = await this.tools.scheduleFollowUp(state)
    
    return {
      agent_actions: {
        ...state.agent_actions,
        scheduled_actions: scheduledActions
      }
    }
  }

  private async checkEscalation(state: SupportAgentState): Promise<Partial<SupportAgentState>> {
    const escalationNeeded = await this.tools.checkEscalationNeeded(state)
    
    return {
      conversation_context: {
        ...state.conversation_context,
        escalation_needed: escalationNeeded
      }
    }
  }

  private async escalate(state: SupportAgentState): Promise<Partial<SupportAgentState>> {
    const escalationMessage = {
      role: 'assistant' as const,
      content: "I'm connecting you with a human support specialist who can better assist you with your request. They'll be with you shortly.",
      timestamp: new Date().toISOString(),
      metadata: {
        escalated: true,
        escalation_time: new Date().toISOString()
      }
    }

    // In a real implementation, this would trigger the escalation process
    console.log(`Escalating session ${state.session_id} for user ${state.user_id}`)
    
    return {
      messages: [...state.messages, escalationMessage],
      conversation_context: {
        ...state.conversation_context,
        escalation_needed: true,
        resolved: false
      }
    }
  }

  private shouldEscalate(state: SupportAgentState): string {
    return state.conversation_context.escalation_needed ? 'escalate' : 'resolve'
  }

  // Compile the workflow
  compile() {
    return this.workflow.compile()
  }
}

// Main Support Agent Class
export class AutonomousSupportAgent {
  private workflow: any
  private sessions: Map<string, SupportAgentState> = new Map()

  constructor(openaiApiKey: string) {
    const workflowBuilder = new SupportAgentWorkflow(openaiApiKey)
    this.workflow = workflowBuilder.compile()
  }

  async processMessage(
    userId: string,
    sessionId: string,
    message: string,
    existingState?: SupportAgentState
  ): Promise<SupportAgentState> {
    try {
      // Get or create session state
      let state: SupportAgentState = existingState || {
        user_id: userId,
        session_id: sessionId,
        messages: [],
        user_context: {},
        conversation_context: {
          intent: 'general',
          sentiment: 'neutral',
          priority: 'medium',
          resolved: false,
          escalation_needed: false
        },
        agent_actions: {
          taken_actions: [],
          scheduled_actions: [],
          external_apis_called: []
        },
        knowledge_base: {
          relevant_articles: [],
          faqs: []
        }
      }

      // Add user message
      state.messages.push({
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      })

      // Process through workflow
      const config: RunnableConfig = {
        configurable: {
          thread_id: sessionId
        }
      }

      const result = await this.workflow.invoke(state, config)
      
      // Store session state
      this.sessions.set(sessionId, result)
      
      return result
    } catch (error) {
      console.error('Error processing message:', error)
      throw error
    }
  }

  getSession(sessionId: string): SupportAgentState | undefined {
    return this.sessions.get(sessionId)
  }

  clearSession(sessionId: string): void {
    this.sessions.delete(sessionId)
  }

  // Get session statistics
  getSessionStats(): {
    total_sessions: number
    active_sessions: number
    escalated_sessions: number
    resolved_sessions: number
  } {
    const sessions = Array.from(this.sessions.values())
    
    return {
      total_sessions: sessions.length,
      active_sessions: sessions.filter(s => !s.conversation_context.resolved).length,
      escalated_sessions: sessions.filter(s => s.conversation_context.escalation_needed).length,
      resolved_sessions: sessions.filter(s => s.conversation_context.resolved).length
    }
  }
}

// Singleton instance
export const autonomousSupportAgent = new AutonomousSupportAgent(process.env.OPENAI_API_KEY || 'mock-key')
