'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Plane,
  Hotel,
  Mountain,
  TrendingUp,
  Globe,
  Trophy,
  Sparkles,
  Star,
  Heart,
  Filter,
  ChevronRight,
  Clock,
  ArrowRight,
  BarChart3,
  MessageCircle,
  UserCheck,
  Award,
  Target,
  Zap,
  Compass,
  Camera,
  Waves,
  Bike,
  Navigation,
  DollarSign,
  Bell,
  BellOff,
  Eye,
  Flame,
  Crown,
  Gem,
  Medal
} from 'lucide-react'

export default function UnifiedTabs() {
  const [activeTab, setActiveTab] = useState('flights')
  const [searchType, setSearchType] = useState('flights')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')

  // Sample data for each tab
  const flightDeals = [
    {
      airline: { name: 'IndiGo', logo: '🛩️', code: '6E' },
      route: 'Delhi → Mumbai',
      price: '₹3,999',
      originalPrice: '₹7,999',
      discount: '50% OFF',
      departure: '06:00',
      arrival: '08:15',
      duration: '2h 15m',
      rating: 4.5
    },
    {
      airline: { name: 'Air India', logo: '🇮🇳', code: 'AI' },
      route: 'Bangalore → Delhi',
      price: '₹5,999',
      originalPrice: '₹9,999',
      discount: '40% OFF',
      departure: '10:30',
      arrival: '13:15',
      duration: '2h 45m',
      rating: 4.7
    }
  ]

  const hotelDeals = [
    {
      name: 'Taj Goa Resort & Spa',
      location: 'Candolim, Goa',
      price: '₹8,999',
      originalPrice: '₹14,999',
      discount: '40% OFF',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop'
    },
    {
      name: 'The Oberoi Udaivilas',
      location: 'Udaipur, Rajasthan',
      price: '₹12,999',
      originalPrice: '₹19,999',
      discount: '35% OFF',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=300&h=200&fit=crop'
    }
  ]

  const adventureDeals = [
    {
      title: 'Manali to Spiti Valley Trek',
      location: 'Himachal Pradesh',
      price: '₹18,999',
      originalPrice: '₹24,999',
      discount: '24% OFF',
      rating: 4.9,
      duration: '7 Days / 6 Nights',
      image: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=300&h=200&fit=crop'
    },
    {
      title: 'Scuba Diving in Goa',
      location: 'Grande Island, Goa',
      price: '₹8,999',
      originalPrice: '₹12,999',
      discount: '31% OFF',
      rating: 4.8,
      duration: '3 Days / 2 Nights',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop'
    }
  ]

  const communityGroups = [
    {
      name: 'Himalayan Trekkers',
      members: 2847,
      activity: 'Planning Spiti Valley trek',
      image: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=100&h=100&fit=crop',
      category: 'Adventure'
    },
    {
      name: 'Beach Lovers India',
      members: 1523,
      activity: 'Goa trip this weekend',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100&h=100&fit=crop',
      category: 'Beach'
    }
  ]

  const tabConfig = [
    { 
      id: 'flights', 
      label: 'Flights', 
      icon: Plane, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      id: 'hotels', 
      label: 'Hotels', 
      icon: Hotel, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      id: 'adventures', 
      label: 'Adventures', 
      icon: Mountain, 
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      id: 'community', 
      label: 'Community', 
      icon: Users, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    { 
      id: 'price-tracker', 
      label: 'Price Tracker', 
      icon: TrendingUp, 
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    { 
      id: 'destinations', 
      label: 'Destinations', 
      icon: Globe, 
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    },
    { 
      id: 'rewards', 
      label: 'Rewards', 
      icon: Trophy, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    { 
      id: 'ai-assistant', 
      label: 'AI Assistant', 
      icon: Sparkles, 
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AdventureOS Unified Experience
          </h1>
          <p className="text-gray-600">All your travel needs in one beautiful interface</p>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Custom Tab List with better styling */}
          <div className="bg-white rounded-xl shadow-lg p-2 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
              {tabConfig.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200
                      ${isActive 
                        ? `${tab.bgColor} ${tab.color} shadow-md scale-105` 
                        : 'hover:bg-gray-50 text-gray-600'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5 mb-1" />
                    <span className="text-xs font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab Contents */}
          <div className="space-y-6">
            {/* Flights Tab */}
            <TabsContent value="flights" className="mt-0">
              <Card className="shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Plane className="h-6 w-6" />
                    Flight Deals & Search
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Search Widget */}
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Input placeholder="From" value={from} onChange={(e) => setFrom(e.target.value)} />
                      <Input placeholder="To" value={to} onChange={(e) => setTo(e.target.value)} />
                      <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Search className="h-4 w-4 mr-2" />
                        Search Flights
                      </Button>
                    </div>
                  </div>

                  {/* Flight Deals */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {flightDeals.map((flight, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{flight.airline.logo}</span>
                              <div>
                                <h4 className="font-semibold">{flight.airline.name}</h4>
                                <p className="text-sm text-gray-600">{flight.airline.code}</p>
                              </div>
                            </div>
                            <Badge className="bg-red-100 text-red-800">
                              {flight.discount}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <p className="font-medium">{flight.route}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>{flight.departure} - {flight.arrival}</span>
                              <span>{flight.duration}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-xl font-bold text-blue-600">{flight.price}</span>
                                <span className="text-sm text-gray-500 line-through ml-2">{flight.originalPrice}</span>
                              </div>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                Book Now
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Hotels Tab */}
            <TabsContent value="hotels" className="mt-0">
              <Card className="shadow-xl">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Hotel className="h-6 w-6" />
                    Hotel Deals & Accommodations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Search Widget */}
                  <div className="bg-purple-50 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Input placeholder="Destination" />
                      <Input type="date" placeholder="Check-in" />
                      <Input type="date" placeholder="Check-out" />
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <Search className="h-4 w-4 mr-2" />
                        Search Hotels
                      </Button>
                    </div>
                  </div>

                  {/* Hotel Deals */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hotelDeals.map((hotel, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow overflow-hidden">
                        <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${hotel.image})` }}>
                          <div className="w-full h-full bg-black bg-opacity-30"></div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{hotel.name}</h4>
                            <Badge className="bg-red-100 text-red-800">
                              {hotel.discount}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{hotel.location}</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xl font-bold text-purple-600">{hotel.price}</span>
                              <span className="text-sm text-gray-500 line-through ml-2">{hotel.originalPrice}</span>
                            </div>
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                              Book Now
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other tabs with simplified content */}
            <TabsContent value="adventures" className="mt-0">
              <Card className="shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Mountain className="h-6 w-6" />
                    Adventure Activities & Experiences
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <Mountain className="h-16 w-16 mx-auto mb-4 text-green-600" />
                    <h3 className="text-xl font-semibold mb-2">Adventure Activities</h3>
                    <p className="text-gray-600">Explore thrilling adventures and experiences</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="community" className="mt-0">
              <Card className="shadow-xl">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    Travel Community & Groups
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 mx-auto mb-4 text-orange-600" />
                    <h3 className="text-xl font-semibold mb-2">Travel Community</h3>
                    <p className="text-gray-600">Connect with fellow travelers</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="price-tracker" className="mt-0">
              <Card className="shadow-xl">
                <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6" />
                    Real-Time Price Tracker
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <TrendingUp className="h-16 w-16 mx-auto mb-4 text-red-600" />
                    <h3 className="text-xl font-semibold mb-2">Price Tracker</h3>
                    <p className="text-gray-600">Track prices in real-time</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="destinations" className="mt-0">
              <Card className="shadow-xl">
                <CardHeader className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-6 w-6" />
                    Immersive Destination Previews
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <Globe className="h-16 w-16 mx-auto mb-4 text-cyan-600" />
                    <h3 className="text-xl font-semibold mb-2">Destinations</h3>
                    <p className="text-gray-600">Explore destinations in 3D</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rewards" className="mt-0">
              <Card className="shadow-xl">
                <CardHeader className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-6 w-6" />
                    Rewards & Gamification
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-600" />
                    <h3 className="text-xl font-semibold mb-2">Rewards</h3>
                    <p className="text-gray-600">Earn rewards and achievements</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai-assistant" className="mt-0">
              <Card className="shadow-xl">
                <CardHeader className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6" />
                    AI Travel Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <Sparkles className="h-16 w-16 mx-auto mb-4 text-pink-600" />
                    <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
                    <p className="text-gray-600">Get help from our AI travel assistant</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
