'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useChatStore } from '@/store/chat-store'
import { MessageCircle, Plus, Users, MapPin, AlertTriangle, Circle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ChatRoomsListProps {
  onChatRoomSelect: (chatRoomId: string) => void
  selectedChatRoomId: string | null
}

export function ChatRoomsList({ onChatRoomSelect, selectedChatRoomId }: ChatRoomsListProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')
  const [newRoomType, setNewRoomType] = useState<'travel_buddy' | 'emergency' | 'general'>('general')
  const [searchQuery, setSearchQuery] = useState('')
  
  const {
    chatRooms,
    onlineUsers,
    createChatRoom,
    isLoading
  } = useChatStore()

  const handleCreateChatRoom = async () => {
    if (!newRoomName.trim()) return

    await createChatRoom(newRoomName.trim(), newRoomType, [])
    setNewRoomName('')
    setIsCreateDialogOpen(false)
  }

  const filteredChatRooms = chatRooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRoomIcon = (type: string) => {
    switch (type) {
      case 'travel_buddy':
        return <Users className="h-4 w-4 text-blue-500" />
      case 'emergency':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <MessageCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case 'travel_buddy':
        return 'bg-blue-100 text-blue-800'
      case 'emergency':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Chat Rooms</CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Create
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Chat Room</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Room Name</label>
                  <Input
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="Enter room name"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Room Type</label>
                  <Select value={newRoomType} onValueChange={(value: any) => setNewRoomType(value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Chat</SelectItem>
                      <SelectItem value="travel_buddy">Travel Buddy</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateChatRoom} disabled={!newRoomName.trim() || isLoading}>
                    Create Room
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Circle className="h-2 w-2 text-green-500 fill-current" />
          <span>{onlineUsers.length} users online</span>
        </div>
        
        <Input
          placeholder="Search chat rooms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-2"
        />
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="h-full overflow-y-auto">
          {filteredChatRooms.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No chat rooms found</p>
              <p className="text-sm">Create a new room to get started</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredChatRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => onChatRoomSelect(room.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedChatRoomId === room.id ? 'bg-blue-50 border border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getRoomIcon(room.type)}
                        <h3 className="font-medium truncate">{room.name}</h3>
                        <Badge className={`text-xs ${getRoomTypeColor(room.type)}`}>
                          {room.type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Users className="h-3 w-3" />
                        <span>{room.participants.length} participants</span>
                        <span>•</span>
                        <span>Created {formatDistanceToNow(new Date(room.created_at), { addSuffix: true })}</span>
                      </div>
                      
                      {room.last_message && (
                        <div className="mt-2 text-sm text-gray-600 truncate">
                          <span className="font-medium">
                            {room.last_message.user?.full_name || 'Someone'}:
                          </span>{' '}
                          {room.last_message.content}
                        </div>
                      )}
                    </div>
                    
                    {room.last_message && (
                      <div className="text-xs text-gray-400 ml-2">
                        {formatDistanceToNow(new Date(room.last_message.created_at), { addSuffix: true })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
