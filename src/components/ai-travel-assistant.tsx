'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  MapPin, 
  Calendar, 
  DollarSign,
  TrendingUp,
  Clock,
  Users,
  Heart,
  Star,
  Zap,
  Brain,
  Compass,
  Camera,
  Sun,
  Cloud,
  Umbrella
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  recommendations?: Recommendation[]
}

interface Recommendation {
  id: string
  type: 'flight' | 'hotel' | 'adventure' | 'destination'
  title: string
  description: string
  price: string
  rating: number
  image: string
  tags: string[]
  savings?: string
  urgency?: 'low' | 'medium' | 'high'
  weather?: {
    temp: string
    condition: string
    icon: React.ReactNode
  }
}

export default function AITravelAssistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = async (userMessage: string): Promise<Message> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500))

    const lowerMessage = userMessage.toLowerCase()
    let response = ""
    let recommendations: Recommendation[] = []

    if (lowerMessage.includes('flight') || lowerMessage.includes('fly')) {
      response = "I found some amazing flight deals for you! Here are the best options:"
      recommendations = [
        {
          id: '1',
          type: 'flight',
          title: 'Delhi to Goa - IndiGo',
          description: 'Non-stop flight, 2h 15m, includes meals',
          price: '₹3,999',
          rating: 4.5,
          image: 'https://images.unsplash.com/photo-1436491865332-7a61a94cc025?w=400&h=200&fit=crop',
          tags: ['Non-stop', 'Meals Included', 'Free Cancellation'],
          savings: 'Save 25%',
          urgency: 'high'
        },
        {
          id: '2',
          type: 'flight',
          title: 'Mumbai to Bangkok - AirAsia',
          description: 'Direct flight, 4h 30m, budget-friendly',
          price: '₹8,999',
          rating: 4.3,
          image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=200&fit=crop',
          tags: ['International', 'Budget', '20kg Baggage'],
          savings: 'Limited Seats',
          urgency: 'medium'
        }
      ]
    } else if (lowerMessage.includes('hotel') || lowerMessage.includes('stay')) {
      response = "Based on your preferences, I recommend these amazing accommodations:"
      recommendations = [
        {
          id: '3',
          type: 'hotel',
          title: 'Taj Palace Goa',
          description: 'Luxury beach resort with private beach access',
          price: '₹8,999/night',
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=200&fit=crop',
          tags: ['Beachfront', 'Spa', 'Pool', '5-Star'],
          savings: '30% OFF',
          weather: {
            temp: '28°C',
            condition: 'Sunny',
            icon: <Sun className="h-4 w-4 text-yellow-500" />
          }
        }
      ]
    } else if (lowerMessage.includes('adventure') || lowerMessage.includes('trek')) {
      response = "Here are some thrilling adventures perfect for you:"
      recommendations = [
        {
          id: '4',
          type: 'adventure',
          title: 'Himalayan Trekking Expedition',
          description: '7-day guided trek with professional climbers',
          price: '₹18,999',
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=400&h=200&fit=crop',
          tags: ['Trekking', 'Camping', 'Guided', 'Equipment Included'],
          savings: 'Early Bird Offer',
          urgency: 'high'
        }
      ]
    } else if (lowerMessage.includes('weather') || lowerMessage.includes('climate')) {
      response = "Here's the weather forecast for popular destinations:"
      recommendations = [
        {
          id: '5',
          type: 'destination',
          title: 'Goa - Perfect Beach Weather',
          description: 'Sunny with clear skies, ideal for beach activities',
          price: 'N/A',
          rating: 5,
          image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=200&fit=crop',
          tags: ['Sunny', '28°C', 'Low Humidity'],
          weather: {
            temp: '28°C',
            condition: 'Sunny',
            icon: <Sun className="h-4 w-4 text-yellow-500" />
          }
        }
      ]
    } else {
      response = "I'm your AI travel assistant! I can help you find the best flights, hotels, adventures, and destinations. Just ask me anything about travel! 🌍✈️"
    }

    return {
      id: Date.now().toString(),
      type: 'assistant' as const,
      content: response,
      timestamp: new Date(),
      recommendations
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    const aiResponse = await generateAIResponse(input)
    setMessages(prev => [...prev, aiResponse])
    setIsTyping(false)
  }

  const handleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true)
      // Simulate voice recognition
      setTimeout(() => {
        setInput("Find me flights from Delhi to Goa for next weekend")
        setIsListening(false)
      }, 2000)
    } else {
      setIsListening(false)
    }
  }

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  const quickActions = [
    { icon: <TrendingUp className="h-4 w-4" />, text: "Best Deals", action: "Show me the best travel deals" },
    { icon: <MapPin className="h-4 w-4" />, text: "Popular Places", action: "What are the trending destinations?" },
    { icon: <DollarSign className="h-4 w-4" />, text: "Budget Trips", action: "Find budget-friendly trips under ₹10,000" },
    { icon: <Calendar className="h-4 w-4" />, text: "Weekend Trips", action: "Suggest weekend getaway ideas" }
  ]

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all"
        >
          <Bot className="h-6 w-6" />
          <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-yellow-400" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[90vw]">
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Travel Assistant
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs">Online</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="text-white hover:bg-white/20"
              >
                −
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 h-96 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-800 mb-2">Hello! I'm your AI Travel Assistant 🌍</h3>
                <p className="text-sm text-gray-600 mb-4">I can help you find the best deals, plan trips, and answer all your travel questions!</p>
                
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(action.action)}
                      className="text-xs h-auto py-2 px-2 flex flex-col items-center gap-1"
                    >
                      {action.icon}
                      <span>{action.text}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-white text-gray-800 shadow-sm'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  
                  {message.recommendations && (
                    <div className="mt-3 space-y-2">
                      {message.recommendations.map((rec) => (
                        <div key={rec.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <div className="flex items-start gap-3">
                            <div className="w-16 h-16 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${rec.image})` }}></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-sm">{rec.title}</h4>
                                {rec.urgency && (
                                  <Badge className={`text-xs ${getUrgencyColor(rec.urgency)}`}>
                                    {rec.urgency === 'high' ? '⚡ Hot Deal' : rec.urgency === 'medium' ? '🔥 Popular' : '✨ Available'}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{rec.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-purple-600">{rec.price}</span>
                                  {rec.savings && (
                                    <Badge className="bg-green-100 text-green-800 text-xs">{rec.savings}</Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs">{rec.rating}</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {rec.tags.map((tag, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              {rec.weather && (
                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                                  {rec.weather.icon}
                                  <span>{rec.weather.temp} • {rec.weather.condition}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-sm p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about travel..."
                className="pr-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVoiceInput}
                className={`absolute right-1 top-1 ${isListening ? 'text-red-500' : 'text-gray-400'}`}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>
            <Button onClick={handleSend} className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
