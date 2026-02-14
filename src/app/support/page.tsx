'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AutonomousSupportChat } from '@/components/autonomous-support-chat'
import { 
  Bot, 
  MessageCircle, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  CheckCircle,
  Phone,
  Star,
  BookOpen,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  MapPin,
  Settings
} from 'lucide-react'

// Mock user ID - in production, this would come from authentication
const MOCK_USER_ID = 'user_123'

interface SupportStats {
  total_sessions: number
  active_sessions: number
  escalated_sessions: number
  resolved_sessions: number
  average_response_time_ms: number
  average_satisfaction_score: number
  intent_distribution: Record<string, number>
  sentiment_distribution: Record<string, number>
  priority_distribution: Record<string, number>
}

interface RecentSession {
  id: string
  user_name: string
  intent: string
  priority: string
  status: string
  started_at: string
  message_count: number
  satisfaction?: number
}

export default function SupportDashboard() {
  const [stats, setStats] = useState<SupportStats | null>(null)
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showSupportChat, setShowSupportChat] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Load agent statistics
      const statsResponse = await fetch('/api/support/chat')
      if (statsResponse.ok) {
        const data = await statsResponse.json()
        setStats(data.data.agent_stats)
      }

      // Mock recent sessions data
      setRecentSessions([
        {
          id: 'session_1',
          user_name: 'Alex Johnson',
          intent: 'emergency',
          priority: 'critical',
          status: 'escalated',
          started_at: '2024-01-15T10:30:00Z',
          message_count: 8,
          satisfaction: 5
        },
        {
          id: 'session_2',
          user_name: 'Sarah Chen',
          intent: 'booking_support',
          priority: 'medium',
          status: 'resolved',
          started_at: '2024-01-15T09:15:00Z',
          message_count: 5,
          satisfaction: 4
        },
        {
          id: 'session_3',
          user_name: 'Mike Davis',
          intent: 'itinerary_help',
          priority: 'low',
          status: 'active',
          started_at: '2024-01-15T08:45:00Z',
          message_count: 12
        }
      ])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'escalated': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getIntentIcon = (intent: string) => {
    switch (intent) {
      case 'emergency': return <AlertTriangle className="h-4 w-4" />
      case 'booking_support': return <Calendar className="h-4 w-4" />
      case 'itinerary_help': return <MapPin className="h-4 w-4" />
      case 'technical_support': return <Settings className="h-4 w-4" />
      default: return <MessageCircle className="h-4 w-4" />
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Bot className="h-16 w-16 mx-auto mb-4 text-purple-600 animate-pulse" />
          <h2 className="text-xl font-semibold mb-2">Loading Support Dashboard</h2>
          <p className="text-gray-600">Initializing AI support systems...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Support Center
          </h1>
          <p className="text-lg text-gray-600">
            Autonomous customer support powered by advanced AI agents
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center p-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Bot className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-1">Test Support</h3>
            <p className="text-sm text-gray-600 mb-3">
              Try the AI assistant
            </p>
            <Button
              size="sm"
              onClick={() => setShowSupportChat(true)}
              className="w-full"
            >
              Start Chat
            </Button>
          </Card>

          <Card className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-1">Analytics</h3>
            <p className="text-sm text-gray-600">
              View performance metrics
            </p>
          </Card>

          <Card className="text-center p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-1">Knowledge Base</h3>
            <p className="text-sm text-gray-600">
              Manage help articles
            </p>
          </Card>

          <Card className="text-center p-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Settings className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-semibold mb-1">Settings</h3>
            <p className="text-sm text-gray-600">
              Configure AI behavior
            </p>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Stats Cards */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.total_sessions || 0}</div>
                  <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>+12% from yesterday</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Now</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats?.active_sessions || 0}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Users className="h-3 w-3" />
                    <span>Live conversations</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Resolved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats?.resolved_sessions || 0}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>Successfully handled</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Escalated</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats?.escalated_sessions || 0}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Phone className="h-3 w-3" />
                    <span>Human agent needed</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Response Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Average Response Time</span>
                      <span>{Math.round((stats?.average_response_time_ms || 0) / 1000)}s</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Customer Satisfaction</span>
                      <span>{(stats?.average_satisfaction_score || 0).toFixed(1)}/5.0</span>
                    </div>
                    <Progress value={(stats?.average_satisfaction_score || 0) * 20} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Intent Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(stats?.intent_distribution || {}).map(([intent, count]) => (
                      <div key={intent} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getIntentIcon(intent)}
                          <span className="text-sm capitalize">{intent.replace('_', ' ')}</span>
                        </div>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Support Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{session.user_name}</h3>
                            <Badge className={getPriorityColor(session.priority)}>
                              {session.priority}
                            </Badge>
                            <Badge className={getStatusColor(session.status)}>
                              {session.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              {getIntentIcon(session.intent)}
                              <span className="capitalize">{session.intent.replace('_', ' ')}</span>
                            </div>
                            <span>•</span>
                            <span>{session.message_count} messages</span>
                            <span>•</span>
                            <span>{new Date(session.started_at).toLocaleString()}</span>
                          </div>

                          {session.satisfaction && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">Satisfaction:</span>
                              <div className="flex">{renderStars(session.satisfaction)}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sentiment Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats?.sentiment_distribution || {}).map(([sentiment, count]) => (
                      <div key={sentiment}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{sentiment}</span>
                          <span>{count}</span>
                        </div>
                        <Progress 
                          value={(count / (stats?.total_sessions || 1)) * 100} 
                          className="h-2" 
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Priority Levels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats?.priority_distribution || {}).map(([priority, count]) => (
                      <div key={priority}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{priority}</span>
                          <span>{count}</span>
                        </div>
                        <Progress 
                          value={(count / (stats?.total_sessions || 1)) * 100} 
                          className="h-2" 
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="knowledge">
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold mb-2">Knowledge Base</h3>
                  <p className="text-gray-600 mb-4">
                    Manage help articles, FAQs, and training data for the AI assistant
                  </p>
                  <Button>Add Article</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Support Chat */}
        {showSupportChat && (
          <AutonomousSupportChat
            userId={MOCK_USER_ID}
            initialMessage="Hello! I'd like to test the autonomous support system."
          />
        )}
      </div>
    </div>
  )
}
