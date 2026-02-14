'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Navigation from '@/components/navigation'
import AuthCheck from '@/components/auth-check'
import { 
  Send,
  Phone,
  Video,
  MoreVertical,
  Search,
  Smile,
  Paperclip,
  Mic,
  Settings,
  Users,
  Bot,
  User,
  Circle,
  Check,
  CheckCheck,
  ArrowLeft,
  Clock,
  Star,
  MapPin,
  Calendar,
  Info
} from 'lucide-react'

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
  isRead: boolean
  isOwn: boolean
  type: 'text' | 'system'
}

interface ChatRoom {
  id: string
  name: string
  type: 'direct' | 'group' | 'ai'
  participants: string[]
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
  isOnline: boolean
  avatar?: string
  description?: string
}

export default function ChatPage() {
  const router = useRouter()
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null)
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showChatList, setShowChatList] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentUser] = useState({
    id: 'current-user',
    name: 'You',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  })

  // Mock chat rooms data
  const [chatRooms] = useState<ChatRoom[]>([
    {
      id: '1',
      name: 'Priya Sharma',
      type: 'direct',
      participants: ['current-user', 'priya'],
      lastMessage: 'Hey! Are you joining the Manali trek?',
      lastMessageTime: '2 min ago',
      unreadCount: 2,
      isOnline: true,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '2',
      name: 'Manali December Trekkers',
      type: 'group',
      participants: ['current-user', 'priya', 'rahul', 'anjali', 'karthik'],
      lastMessage: 'Rahul: Anyone interested in Hampta Pass?',
      lastMessageTime: '5 min ago',
      unreadCount: 5,
      isOnline: true,
      description: '12 members • Planning Manali trek for December 2024'
    },
    {
      id: '3',
      name: 'AdventureOS AI Assistant',
      type: 'ai',
      participants: ['current-user', 'ai'],
      lastMessage: 'How can I help you plan your trip?',
      lastMessageTime: '1 hour ago',
      unreadCount: 0,
      isOnline: true,
      avatar: '/ai-avatar.png'
    },
    {
      id: '4',
      name: 'Rahul Verma',
      type: 'direct',
      participants: ['current-user', 'rahul'],
      lastMessage: 'Thanks for the cycling tips!',
      lastMessageTime: '1 day ago',
      unreadCount: 0,
      isOnline: false,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '5',
      name: 'Goa Water Sports Enthusiasts',
      type: 'group',
      participants: ['current-user', 'karthik', 'anjali', 'others'],
      lastMessage: 'Karthik: Scuba diving this weekend?',
      lastMessageTime: '2 days ago',
      unreadCount: 1,
      isOnline: false,
      description: '8 members • Water sports adventures in Goa'
    }
  ])

  // Mock messages for selected room
  const mockMessages: { [key: string]: Message[] } = {
    '1': [
      {
        id: '1',
        senderId: 'priya',
        senderName: 'Priya Sharma',
        content: 'Hey! Are you joining the Manali trek?',
        timestamp: new Date(Date.now() - 120000),
        isRead: false,
        isOwn: false,
        type: 'text'
      },
      {
        id: '2',
        senderId: 'current-user',
        senderName: 'You',
        content: 'Yes! I\'m really excited about it. When are we leaving?',
        timestamp: new Date(Date.now() - 100000),
        isRead: true,
        isOwn: true,
        type: 'text'
      },
      {
        id: '3',
        senderId: 'priya',
        senderName: 'Priya Sharma',
        content: 'Great! We\'re planning to leave on December 15th. Are you ready with your gear?',
        timestamp: new Date(Date.now() - 80000),
        isRead: false,
        isOwn: false,
        type: 'text'
      }
    ],
    '2': [
      {
        id: '1',
        senderId: 'rahul',
        senderName: 'Rahul Verma',
        content: 'Hey everyone! How\'s the preparation going?',
        timestamp: new Date(Date.now() - 300000),
        isRead: true,
        isOwn: false,
        type: 'text'
      },
      {
        id: '2',
        senderId: 'anjali',
        senderName: 'Anjali Patel',
        content: 'Almost done! Just need to get my trekking poles',
        timestamp: new Date(Date.now() - 240000),
        isRead: true,
        isOwn: false,
        type: 'text'
      },
      {
        id: '3',
        senderId: 'rahul',
        senderName: 'Rahul Verma',
        content: 'Anyone interested in Hampta Pass?',
        timestamp: new Date(Date.now() - 180000),
        isRead: false,
        isOwn: false,
        type: 'text'
      }
    ],
    '3': [
      {
        id: '1',
        senderId: 'ai',
        senderName: 'AdventureOS AI Assistant',
        content: 'Hello! I\'m your AI travel assistant. How can I help you plan your perfect adventure?',
        timestamp: new Date(Date.now() - 3600000),
        isRead: true,
        isOwn: false,
        type: 'text'
      }
    ]
  }

  useEffect(() => {
    if (selectedRoom) {
      setMessages(mockMessages[selectedRoom.id] || [])
      scrollToBottom()
    }
  }, [selectedRoom])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = () => {
    if (!message.trim() || !selectedRoom) return

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: message,
      timestamp: new Date(),
      isRead: true,
      isOwn: true,
      type: 'text'
    }

    setMessages([...messages, newMessage])
    setMessage('')

    // Simulate AI response for AI chat
    if (selectedRoom.type === 'ai') {
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          senderId: 'ai',
          senderName: 'AdventureOS AI Assistant',
          content: generateAIResponse(message),
          timestamp: new Date(),
          isRead: true,
          isOwn: false,
          type: 'text'
        }
        setMessages(prev => [...prev, aiResponse])
      }, 1000)
    }
  }

  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      'That sounds like an exciting adventure! Let me help you plan it perfectly.',
      'I can find the best deals for your trip. What\'s your budget range?',
      'Based on your preferences, I recommend visiting during the shoulder season for better prices.',
      'Would you like me to create a detailed itinerary for your trip?',
      'I can help you find travel buddies for this adventure. Interested?'
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSelectRoom = (room: ChatRoom) => {
    setSelectedRoom(room)
    setShowChatList(false)
  }

  const handleBackToList = () => {
    setShowChatList(true)
    setSelectedRoom(null)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const filteredRooms = chatRooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!showChatList && selectedRoom) {
    return (
      <AuthCheck>
        <div className="min-h-screen bg-gray-50">
          <Navigation activePage="chat" />
          
          <div className="container mx-auto px-4 py-4 h-[calc(100vh-80px)]">
            <Card className="h-full flex flex-col shadow-xl border-0">
              {/* Chat Header */}
              <CardHeader className="border-b bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleBackToList}
                      className="md:hidden"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        {selectedRoom.type === 'ai' ? (
                          <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                            <Bot className="h-6 w-6 text-white" />
                          </div>
                        ) : (
                          <img 
                            src={selectedRoom.avatar || '/default-avatar.png'} 
                            alt={selectedRoom.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      {selectedRoom.isOnline && (
                        <Circle className="h-3 w-3 fill-green-500 text-green-500 absolute bottom-0 right-0" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedRoom.name}</h3>
                      {selectedRoom.type === 'group' && (
                        <p className="text-sm text-gray-500">{selectedRoom.description}</p>
                      )}
                      {selectedRoom.type === 'ai' && (
                        <p className="text-sm text-green-500">AI Assistant • Always online</p>
                      )}
                      {selectedRoom.type === 'direct' && (
                        <p className="text-sm text-green-500">Online</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedRoom.type === 'direct' && (
                      <>
                        <Button variant="ghost" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Video className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm">
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md ${msg.isOwn ? 'order-2' : 'order-1'}`}>
                        {!msg.isOwn && (
                          <p className="text-xs text-gray-500 mb-1">{msg.senderName}</p>
                        )}
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            msg.isOwn
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-900 border'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                          <span>{formatTime(msg.timestamp)}</span>
                          {msg.isOwn && (
                            <span>{msg.isRead ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white border rounded-lg px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="border-t bg-white p-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="sm">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </AuthCheck>
    )
  }

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <Navigation activePage="chat" />
        
        <div className="container mx-auto px-4 py-4">
          <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-80px)]">
            {/* Chat List */}
            <div className="lg:col-span-1">
              <Card className="h-full flex flex-col shadow-xl border-0">
                <CardHeader className="border-b bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-xl">Messages</CardTitle>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto p-0">
                  <div className="divide-y">
                    {filteredRooms.map((room) => (
                      <div
                        key={room.id}
                        onClick={() => handleSelectRoom(room)}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                              {room.type === 'ai' ? (
                                <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                                  <Bot className="h-7 w-7 text-white" />
                                </div>
                              ) : (
                                <img 
                                  src={room.avatar || '/default-avatar.png'} 
                                  alt={room.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            {room.isOnline && (
                              <Circle className="h-3 w-3 fill-green-500 text-green-500 absolute bottom-0 right-0" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold truncate">{room.name}</h3>
                              <span className="text-xs text-gray-500">{room.lastMessageTime}</span>
                            </div>
                            
                            {room.type === 'group' && (
                              <p className="text-xs text-gray-500 mb-1">{room.description}</p>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-600 truncate">{room.lastMessage}</p>
                              {room.unreadCount > 0 && (
                                <Badge className="bg-blue-600 text-white text-xs ml-2">
                                  {room.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Area (Desktop) */}
            <div className="lg:col-span-2 hidden lg:block">
              <Card className="h-full flex items-center justify-center shadow-xl border-0">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a chat from the list to start messaging</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthCheck>
  )
}
