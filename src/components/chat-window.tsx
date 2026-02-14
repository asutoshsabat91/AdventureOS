'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useChatStore, Message } from '@/store/chat-store'
import { Send, MapPin, AlertTriangle, Users, Circle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ChatWindowProps {
  chatRoomId: string
  className?: string
}

export function ChatWindow({ chatRoomId, className }: ChatWindowProps) {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const {
    messages,
    onlineUsers,
    currentChatRoom,
    sendMessage,
    subscribeToChatRoom,
    subscribeToOnlineUsers,
    error
  } = useChatStore()

  // Subscribe to chat room and online users
  useEffect(() => {
    const unsubscribeChat = subscribeToChatRoom(chatRoomId)
    const unsubscribeOnline = subscribeToOnlineUsers()

    return () => {
      unsubscribeChat()
      unsubscribeOnline()
    }
  }, [chatRoomId, subscribeToChatRoom, subscribeToOnlineUsers])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (type: 'text' | 'location' | 'emergency' = 'text') => {
    if (!message.trim() || isSending) return

    setIsSending(true)
    try {
      await sendMessage(chatRoomId, message.trim(), type)
      setMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getMessageIcon = (type: Message['message_type']) => {
    switch (type) {
      case 'location':
        return <MapPin className="h-3 w-3 text-blue-500" />
      case 'emergency':
        return <AlertTriangle className="h-3 w-3 text-red-500" />
      default:
        return null
    }
  }

  const getMessageTypeColor = (type: Message['message_type']) => {
    switch (type) {
      case 'location':
        return 'bg-blue-50 border-blue-200'
      case 'emergency':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <Card className={`flex flex-col h-[600px] ${className}`}>
      {/* Chat Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {currentChatRoom?.name || 'Chat Room'}
            <Badge variant="outline" className="text-xs">
              {currentChatRoom?.type}
            </Badge>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Users className="h-4 w-4" />
              <span>{onlineUsers.length} online</span>
            </div>
            
            {/* Online Users Indicator */}
            <div className="flex -space-x-2">
              {onlineUsers.slice(0, 3).map((userId) => (
                <div
                  key={userId}
                  className="w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"
                >
                  <Circle className="h-2 w-2 text-white fill-current" />
                </div>
              ))}
              {onlineUsers.length > 3 && (
                <div className="w-6 h-6 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center text-xs text-white">
                  +{onlineUsers.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-3 pb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.user_id === 'current-user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${msg.user_id === 'current-user' ? 'order-2' : 'order-1'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {msg.user && (
                      <span className="text-xs font-medium text-gray-600">
                        {msg.user.full_name}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                    </span>
                    {getMessageIcon(msg.message_type)}
                  </div>
                  
                  <div
                    className={`rounded-lg p-3 border ${getMessageTypeColor(msg.message_type)} ${
                      msg.user_id === 'current-user' ? 'bg-blue-500 text-white border-blue-500' : ''
                    }`}
                  >
                    <p className="text-sm break-words">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Error Display */}
        {error && (
          <div className="px-4 py-2 bg-red-50 border-t border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              disabled={isSending}
              className="flex-1"
            />
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleSendMessage('location')}
              disabled={isSending || !message.trim()}
              title="Send location"
            >
              <MapPin className="h-4 w-4" />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleSendMessage('emergency')}
              disabled={isSending || !message.trim()}
              title="Send emergency message"
            >
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </Button>
            
            <Button
              size="sm"
              onClick={() => handleSendMessage('text')}
              disabled={isSending || !message.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
