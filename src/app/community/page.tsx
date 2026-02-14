'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Heart,
  Star,
  MessageCircle,
  Filter,
  ChevronRight,
  UserCheck,
  Globe,
  Camera,
  Mountain,
  Waves,
  Bike,
  Coffee,
  Zap,
  Clock,
  Award,
  TrendingUp,
  Send,
  UserPlus,
  MapPinIcon,
  CheckCircle,
  Hotel,
  Plane,
  Compass
} from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/navigation'

export default function CommunityPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('buddies')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDestination, setSelectedDestination] = useState('')
  const [selectedActivity, setSelectedActivity] = useState('')
  const [selectedDateRange, setSelectedDateRange] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const travelBuddies = [
    {
      id: 1,
      name: 'Priya Sharma',
      age: 28,
      location: 'Mumbai',
      bio: 'Adventure enthusiast, love trekking and meeting new people!',
      interests: ['Trekking', 'Photography', 'Camping', 'Wildlife'],
      experience: 'Intermediate',
      languages: ['English', 'Hindi', 'Marathi'],
      rating: 4.8,
      tripsCompleted: 15,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      isOnline: true,
      upcomingTrip: {
        destination: 'Manali',
        dates: 'Dec 15-22',
        activity: 'Trekking'
      }
    },
    {
      id: 2,
      name: 'Rahul Verma',
      age: 32,
      location: 'Bangalore',
      bio: 'Weekend warrior looking for adventure buddies for mountain biking',
      interests: ['Cycling', 'Rock Climbing', 'Kayaking', 'Camping'],
      experience: 'Advanced',
      languages: ['English', 'Hindi', 'Kannada'],
      rating: 4.9,
      tripsCompleted: 23,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      isOnline: false,
      upcomingTrip: {
        destination: 'Coorg',
        dates: 'Dec 20-22',
        activity: 'Cycling'
      }
    },
    {
      id: 3,
      name: 'Anjali Patel',
      age: 25,
      location: 'Delhi',
      bio: 'Solo traveler looking to explore India with like-minded adventurers',
      interests: ['Photography', 'Cultural Tours', 'Food', 'Trekking'],
      experience: 'Beginner',
      languages: ['English', 'Hindi', 'Gujarati'],
      rating: 4.7,
      tripsCompleted: 8,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      isOnline: true,
      upcomingTrip: {
        destination: 'Rajasthan',
        dates: 'Jan 5-12',
        activity: 'Cultural Tour'
      }
    },
    {
      id: 4,
      name: 'Karthik Nair',
      age: 30,
      location: 'Kerala',
      bio: 'Water sports instructor and adventure guide. Let\'s explore together!',
      interests: ['Scuba Diving', 'Surfing', 'Kayaking', 'Fishing'],
      experience: 'Expert',
      languages: ['English', 'Malayalam', 'Hindi', 'Tamil'],
      rating: 4.9,
      tripsCompleted: 45,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      isOnline: true,
      upcomingTrip: {
        destination: 'Andaman',
        dates: 'Dec 25-30',
        activity: 'Scuba Diving'
      }
    }
  ]

  const chatRooms = [
    {
      id: 1,
      name: 'Manali December Trekkers',
      description: 'Planning Manali trek for December 2024',
      members: 12,
      lastMessage: 'Anyone interested in Hampta Pass?',
      lastMessageTime: '2 min ago',
      isActive: true,
      destination: 'Manali',
      activity: 'Trekking'
    },
    {
      id: 2,
      name: 'Goa Water Sports Enthusiasts',
      description: 'Group for water sports lovers in Goa',
      members: 28,
      lastMessage: 'Scuba diving this weekend!',
      lastMessageTime: '15 min ago',
      isActive: false,
      destination: 'Goa',
      activity: 'Water Sports'
    },
    {
      id: 3,
      name: 'Ladakh Motorcycle Expedition 2024',
      description: 'Epic bike trip to Ladakh',
      members: 8,
      lastMessage: 'Route finalized, booking bikes',
      lastMessageTime: '1 hour ago',
      isActive: false,
      destination: 'Ladakh',
      activity: 'Motorcycling'
    },
    {
      id: 4,
      name: 'South India Photography Tour',
      description: 'Capturing the beauty of South India',
      members: 15,
      lastMessage: 'Great shots at Hampi!',
      lastMessageTime: '3 hours ago',
      isActive: false,
      destination: 'Multiple',
      activity: 'Photography'
    }
  ]

  const upcomingTrips = [
    {
      id: 1,
      title: 'Spiti Valley Winter Trek',
      destination: 'Spiti Valley',
      dates: 'Dec 20-28, 2024',
      organizer: 'Priya Sharma',
      participants: 8,
      maxParticipants: 12,
      difficulty: 'Challenging',
      image: 'https://images.unsplash.com/photo-1605538466941-75e3b8ceb943?w=400&h=200&fit=crop',
      tags: ['Trekking', 'Winter', 'Photography']
    },
    {
      id: 2,
      title: 'Goa New Year Beach Camp',
      destination: 'Goa',
      dates: 'Dec 29 - Jan 2, 2025',
      organizer: 'Rahul Verma',
      participants: 15,
      maxParticipants: 20,
      difficulty: 'Easy',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=200&fit=crop',
      tags: ['Beach', 'New Year', 'Camping']
    },
    {
      id: 3,
      title: 'Coorg Coffee Plantation Tour',
      destination: 'Coorg',
      dates: 'Jan 10-12, 2025',
      organizer: 'Anjali Patel',
      participants: 6,
      maxParticipants: 10,
      difficulty: 'Easy',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=200&fit=crop',
      tags: ['Cultural', 'Photography', 'Food']
    }
  ]

  const getExperienceColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-orange-100 text-orange-800'
      case 'Expert': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCompatibilityScore = (buddy: any) => {
    // Mock compatibility score calculation
    return Math.floor(Math.random() * 30) + 70 // 70-99% compatibility
  }

  const handleSearchCommunity = async () => {
    setIsSearching(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false)
      alert(`Searching for: ${searchQuery || 'All'} in ${selectedDestination || 'All destinations'}`)
    }, 1000)
  }

  const handleConnectWithBuddy = (buddyId: number, buddyName: string) => {
    alert(`Connection request sent to ${buddyName}! They will be notified.`)
  }

  const handleChatWithBuddy = (buddyId: number, buddyName: string) => {
    alert(`Opening chat with ${buddyName}...`)
    router.push('/chat')
  }

  const handleJoinGroup = (groupId: number, groupName: string) => {
    alert(`Successfully joined ${groupName}! You can now participate in group discussions.`)
  }

  const handleJoinTrip = (tripId: number, tripTitle: string) => {
    alert(`Request sent to join "${tripTitle}"! The organizer will review your request.`)
  }

  const handleCreateGroup = () => {
    alert('Opening group creation form...')
    router.push('/community/create-group')
  }

  const handlePlanTrip = () => {
    alert('Opening trip planning form...')
    router.push('/community/plan-trip')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activePage="community" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Find Your Adventure Community
            </h1>
            <p className="text-xl opacity-90">
              Connect with like-minded travelers, share experiences, and create memories together
            </p>
          </div>

          {/* Search Widget */}
          <Card className="max-w-4xl mx-auto shadow-2xl">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="People, places, activities..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <select
                      className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedDestination}
                      onChange={(e) => setSelectedDestination(e.target.value)}
                    >
                      <option value="">All Destinations</option>
                      <option value="manali">Manali</option>
                      <option value="goa">Goa</option>
                      <option value="ladakh">Ladakh</option>
                      <option value="coorg">Coorg</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Activity</label>
                  <div className="relative">
                    <Mountain className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <select
                      className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedActivity}
                      onChange={(e) => setSelectedActivity(e.target.value)}
                    >
                      <option value="">All Activities</option>
                      <option value="trekking">Trekking</option>
                      <option value="cycling">Cycling</option>
                      <option value="water">Water Sports</option>
                      <option value="photography">Photography</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">When</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <select
                      className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedDateRange}
                      onChange={(e) => setSelectedDateRange(e.target.value)}
                    >
                      <option value="">Any Time</option>
                      <option value="this-month">This Month</option>
                      <option value="next-month">Next Month</option>
                      <option value="next-3-months">Next 3 Months</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  onClick={handleSearchCommunity}
                  disabled={isSearching}
                >
                  <Search className="h-4 w-4 mr-2" />
                  {isSearching ? 'Searching...' : 'Search Community'}
                </Button>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="buddies" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Travel Buddies
              </TabsTrigger>
              <TabsTrigger value="groups" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Groups
              </TabsTrigger>
              <TabsTrigger value="trips" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Upcoming Trips
              </TabsTrigger>
              <TabsTrigger value="forums" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Forums
              </TabsTrigger>
            </TabsList>

            {/* Travel Buddies Tab */}
            <TabsContent value="buddies" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Find Travel Buddies</h2>
                  <p className="text-gray-600">Connect with adventurers who match your interests</p>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  <Zap className="h-3 w-3 mr-1" />
                  {travelBuddies.filter(b => b.isOnline).length} Online Now
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {travelBuddies.map((buddy) => (
                  <Card key={buddy.id} className="hover:shadow-lg transition-all group">
                    <CardContent className="p-6">
                      <div className="relative mb-4">
                        <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden">
                          <img 
                            src={buddy.avatar} 
                            alt={buddy.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {buddy.isOnline && (
                          <div className="absolute top-4 right-1/4 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                        <div className="text-center">
                          <h3 className="font-semibold text-lg">{buddy.name}</h3>
                          <p className="text-sm text-gray-600">{buddy.age}, {buddy.location}</p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <p className="text-sm text-gray-700 text-center">{buddy.bio}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{buddy.rating}</span>
                          </div>
                          <Badge className={getExperienceColor(buddy.experience)}>
                            {buddy.experience}
                          </Badge>
                        </div>

                        <div className="text-xs text-gray-600">
                          <div className="flex items-center gap-1 mb-1">
                            <Award className="h-3 w-3" />
                            <span>{buddy.tripsCompleted} trips completed</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            <span>{buddy.languages.join(', ')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="text-xs font-medium text-gray-700">Interests:</div>
                        <div className="flex flex-wrap gap-1">
                          {buddy.interests.slice(0, 3).map((interest, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {buddy.upcomingTrip && (
                        <div className="bg-blue-50 p-3 rounded-lg mb-4">
                          <div className="text-xs font-medium text-blue-800 mb-1">Upcoming Trip:</div>
                          <div className="text-xs text-blue-700">
                            <div className="flex items-center gap-1">
                              <MapPinIcon className="h-3 w-3" />
                              <span>{buddy.upcomingTrip.destination}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{buddy.upcomingTrip.dates}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Compatibility</span>
                          <span className="font-semibold text-green-600">{getCompatibilityScore(buddy)}%</span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleChatWithBuddy(buddy.id, buddy.name)}
                          >
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Chat
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => handleConnectWithBuddy(buddy.id, buddy.name)}
                          >
                            <UserPlus className="h-3 w-3 mr-1" />
                            Connect
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Groups Tab */}
            <TabsContent value="groups" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Travel Groups</h2>
                  <p className="text-gray-600">Join groups planning trips to your favorite destinations</p>
                </div>
                <Button onClick={handleCreateGroup}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {chatRooms.map((room) => (
                  <Card key={room.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg mb-1">{room.name}</h3>
                          <p className="text-gray-600 text-sm">{room.description}</p>
                        </div>
                        {room.isActive && (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{room.members} members</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="h-4 w-4" />
                          <span>{room.destination}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mountain className="h-4 w-4" />
                          <span>{room.activity}</span>
                        </div>
                      </div>

                      <div className="border-t pt-3">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm text-gray-600 truncate">{room.lastMessage}</p>
                          <span className="text-xs text-gray-500">{room.lastMessageTime}</span>
                        </div>
                        <Button 
                          className="w-full"
                          onClick={() => handleJoinGroup(room.id, room.name)}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Join Group
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Upcoming Trips Tab */}
            <TabsContent value="trips" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Upcoming Trips</h2>
                  <p className="text-gray-600">Join planned trips or create your own</p>
                </div>
                <Button onClick={handlePlanTrip}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Plan Trip
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingTrips.map((trip) => (
                  <Card key={trip.id} className="hover:shadow-lg transition-shadow overflow-hidden group">
                    <div className="relative">
                      <div className="h-40 bg-cover bg-center transition-transform duration-300 group-hover:scale-105" style={{ backgroundImage: `url(${trip.image})` }}>
                        <div className="w-full h-full bg-black bg-opacity-30"></div>
                      </div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="font-bold text-lg">{trip.title}</h3>
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="h-4 w-4" />
                          <span className="text-sm">{trip.destination}</span>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{trip.dates}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">Organized by {trip.organizer}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge className={getExperienceColor(trip.difficulty)}>
                            {trip.difficulty}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {trip.participants}/{trip.maxParticipants} spots
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {trip.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Button 
                        className="w-full"
                        onClick={() => handleJoinTrip(trip.id, trip.title)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Join Trip
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Forums Tab */}
            <TabsContent value="forums" className="space-y-6">
              <div className="text-center py-12">
                <MessageCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Forums Coming Soon</h3>
                <p className="text-gray-600 mb-4">
                  Share your travel stories and get advice from the community
                </p>
                <Button>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Get Notified
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Community at a Glance</h2>
            <p className="text-gray-600">Join thousands of adventure enthusiasts</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">15,234</div>
              <div className="text-gray-600">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">856</div>
              <div className="text-gray-600">Trips Planned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">2,456</div>
              <div className="text-gray-600">Connections Made</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">4.9★</div>
              <div className="text-gray-600">Community Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
