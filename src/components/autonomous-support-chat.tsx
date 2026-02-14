'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAutonomousSupport } from '@/hooks/use-autonomous-support'
import { 
  MessageCircle, 
  Send, 
  AlertTriangle, 
  Info, 
  ThumbsUp, 
  ThumbsDown,
  Phone,
  Calendar,
  MapPin,
  Settings,
  X,
  Minimize2,
  Maximize2,
  Bot,
  User,
  Clock,
  Star,
  BookOpen,
  CheckCircle
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface AutonomousSupportChatProps {
  userId: string
  className?: string
  initialMessage?: string
}

export function AutonomousSupportChat({ userId, className, initialMessage }: AutonomousSupportChatProps) {
  const [message, setMessage] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [hasRated, setHasRated] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const {
    session,
    isLoading,
    isTyping,
    error,
    sendMessage,
    sendQuickMessage,
    endSession,
    rateConversation,
    clearError,
    hasActiveSession,
    messageCount,
    isEscalated,
    isResolved,
    currentPriority,
    currentIntent,
    hasKnowledgeArticles,
    hasSuggestedActions
  } = useAutonomousSupport(userId)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [session?.messages])

  // Handle initial message
  useEffect(() => {
    if (initialMessage && !hasActiveSession && !isLoading) {
      setTimeout(() => {
        sendMessage(initialMessage)
      }, 1000)
    }
  }, [initialMessage, hasActiveSession, isLoading, sendMessage])

  // Focus input when chat opens
  useEffect(() => {
    if (!isMinimized && !isLoading) {
      inputRef.current?.focus()
    }
  }, [isMinimized, isLoading])

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return

    const messageToSend = message.trim()
    setMessage('')
    
    try {
      await sendMessage(messageToSend)
    } catch (error) {
      // Error is handled by the hook
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleRate = async (rating: number) => {
    await rateConversation(rating)
    setHasRated(true)
    setShowRating(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
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

  const renderMessage = (msg: any, index: number) => {
    const isUser = msg.role === 'user'
    const isError = msg.metadata?.error

    return (
      <div
        key={index}
        className={`flex gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        <div className={`flex gap-2 max-w-[80%] ${isUser ? 'flex-row-reverse' : ''}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser ? 'bg-blue-500' : isError ? 'bg-red-500' : 'bg-green-500'
          }`}>
            {isUser ? (
              <User className="h-4 w-4 text-white" />
            ) : isError ? (
              <AlertTriangle className="h-4 w-4 text-white" />
            ) : (
              <Bot className="h-4 w-4 text-white" />
            )}
          </div>
          
          <div className={`rounded-lg p-3 ${
            isUser 
              ? 'bg-blue-500 text-white' 
              : isError 
                ? 'bg-red-50 border border-red-200 text-red-800'
                : 'bg-gray-100 border border-gray-200'
          }`}>
            <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
            <div className={`text-xs mt-1 ${
              isUser ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isMinimized) {
    return (
      <Card className={`fixed bottom-4 right-4 w-80 shadow-lg border-2 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium text-sm">AdventureOS Support</div>
                <div className="text-xs text-gray-500">
                  {hasActiveSession ? `${messageCount} messages` : 'Click to start'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {currentPriority !== 'medium' && (
                <Badge className={`text-xs ${getPriorityColor(currentPriority)}`}>
                  {currentPriority}
                </Badge>
              )}
              {isEscalated && (
                <Phone className="h-4 w-4 text-orange-500" />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(false)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`fixed bottom-4 right-4 w-96 h-[600px] shadow-lg border-2 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg">Support Assistant</CardTitle>
            {isTyping && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">typing...</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {currentPriority !== 'medium' && (
              <Badge className={`text-xs ${getPriorityColor(currentPriority)}`}>
                {currentPriority}
              </Badge>
            )}
            {isEscalated && (
              <Badge variant="outline" className="text-xs text-orange-600">
                <Phone className="h-3 w-3 mr-1" />
                Escalated
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => endSession()}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {getIntentIcon(currentIntent)}
          <span className="capitalize">{currentIntent.replace('_', ' ')}</span>
          {hasActiveSession && (
            <>
              <span>•</span>
              <Clock className="h-3 w-3" />
              <span>{messageCount} messages</span>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Quick Actions */}
        <div className="p-3 border-b">
          <div className="flex gap-2 mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => sendQuickMessage('emergency')}
              className="text-xs"
              disabled={isLoading}
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              Emergency
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => sendQuickMessage('booking_help')}
              className="text-xs"
              disabled={isLoading}
            >
              <Calendar className="h-3 w-3 mr-1" />
              Booking
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => sendQuickMessage('itinerary_help')}
              className="text-xs"
              disabled={isLoading}
            >
              <MapPin className="h-3 w-3 mr-1" />
              Itinerary
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => sendQuickMessage('technical_issue')}
              className="text-xs"
              disabled={isLoading}
            >
              <Settings className="h-3 w-3 mr-1" />
              Technical
            </Button>
          </div>
          
          {/* Knowledge Base Toggle */}
          {hasKnowledgeArticles && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowKnowledgeBase(!showKnowledgeBase)}
              className="text-xs w-full"
            >
              <BookOpen className="h-3 w-3 mr-1" />
              {showKnowledgeBase ? 'Hide' : 'Show'} Related Articles
            </Button>
          )}
        </div>

        {/* Knowledge Base Articles */}
        {showKnowledgeBase && session?.knowledge_articles && (
          <div className="p-3 border-b bg-blue-50">
            <div className="text-sm font-medium mb-2">Related Articles</div>
            {session.knowledge_articles.slice(0, 2).map((article, index) => (
              <div key={index} className="mb-2 p-2 bg-white rounded border">
                <div className="text-sm font-medium">{article.title}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {article.content.substring(0, 100)}...
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            {!hasActiveSession && !isLoading && (
              <div className="text-center text-gray-500 py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold mb-2">Hello! I'm your AI Assistant</h3>
                <p className="text-sm mb-4">
                  I can help you with itinerary planning, bookings, technical issues, and emergency support.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline">24/7 Available</Badge>
                  <Badge variant="outline">AI-Powered</Badge>
                  <Badge variant="outline">Emergency Ready</Badge>
                </div>
              </div>
            )}
            
            {session?.messages.map(renderMessage)}
            
            {isTyping && (
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 border border-gray-200 rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border-t border-red-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span>{error}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={clearError}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Suggested Actions */}
        {hasSuggestedActions && session?.suggested_actions && (
          <div className="p-3 border-t bg-blue-50">
            <div className="text-sm font-medium mb-2">Suggested Actions</div>
            <div className="space-y-1">
              {session.suggested_actions.slice(0, 2).map((action, index) => (
                <div key={index} className="text-xs text-blue-700">
                  • {action.action.replace('_', ' ').charAt(0).toUpperCase() + action.action.slice(1)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rating Section */}
        {hasActiveSession && messageCount > 2 && !hasRated && !showRating && (
          <div className="p-3 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">How was this conversation?</span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRating(true)}
                >
                  <Star className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {showRating && (
          <div className="p-3 border-t bg-yellow-50">
            <div className="text-sm font-medium mb-2">Rate your experience</div>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRate(rating)}
                  className="p-2"
                >
                  <Star className={`h-5 w-5 ${rating <= (hasRated ? 5 : 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              size="sm"
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Status Indicators */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {isResolved && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  <span>Resolved</span>
                </div>
              )}
              {isEscalated && (
                <div className="flex items-center gap-1 text-orange-600">
                  <Phone className="h-3 w-3" />
                  <span>Human agent joining</span>
                </div>
              )}
            </div>
            
            <div className="text-xs text-gray-400">
              Powered by AI
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
