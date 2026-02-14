'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Plane,
  Hotel,
  Mountain,
  Star,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Globe,
  Compass,
  ArrowRight,
  Trophy,
  MessageCircle,
  Camera,
  Waves,
  Bike,
  Navigation,
  Heart,
  Filter,
  Clock,
  BarChart3,
  UserCheck,
  Award,
  Target,
  Zap,
  DollarSign,
  Bell,
  BellOff,
  Eye,
  Flame,
  Crown,
  Gem,
  Medal,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus,
  X,
  Menu,
  Settings,
  LogOut,
  User
} from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('flights')
  const [searchType, setSearchType] = useState('flights')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [showLogin, setShowLogin] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [selectedAdventure, setSelectedAdventure] = useState(null)
  const [joinedGroups, setJoinedGroups] = useState([])
  const [savedDestinations, setSavedDestinations] = useState([])
  const [priceAlerts, setPriceAlerts] = useState([])
  const [userPoints, setUserPoints] = useState(1250)
  const [notifications, setNotifications] = useState(3)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')

  // Handler functions
  const showNotificationMessage = (message) => {
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const handleFlightSearch = () => {
    if (!from || !to || !date) {
      showNotificationMessage('Please fill in all flight search details')
      return
    }
    showNotificationMessage(`Searching flights from ${from} to ${to} on ${date}`)
    // Simulate search delay
    setTimeout(() => {
      setActiveTab('flights')
      showNotificationMessage('Found 12 flights matching your criteria!')
    }, 1000)
  }

  const handleHotelSearch = () => {
    showNotificationMessage('Searching for available hotels...')
    setTimeout(() => {
      setActiveTab('hotels')
      showNotificationMessage('Found 28 hotels matching your criteria!')
    }, 1000)
  }

  const handleBookFlight = (flight) => {
    setSelectedFlight(flight)
    showNotificationMessage(`Selected ${flight.airline.name} flight ${flight.route}`)
    setUserPoints(userPoints + 50)
    setTimeout(() => {
      showNotificationMessage('Redirecting to booking page...')
      router.push('/flights')
    }, 1500)
  }

  const handleBookHotel = (hotel) => {
    setSelectedHotel(hotel)
    showNotificationMessage(`Selected ${hotel.name} in ${hotel.location}`)
    setUserPoints(userPoints + 75)
    setTimeout(() => {
      showNotificationMessage('Redirecting to hotel booking...')
      router.push('/hotels')
    }, 1500)
  }

  const handleBookAdventure = (adventure) => {
    setSelectedAdventure(adventure)
    showNotificationMessage(`Selected ${adventure.title} adventure`)
    setUserPoints(userPoints + 100)
    setTimeout(() => {
      showNotificationMessage('Redirecting to adventure booking...')
      router.push('/adventures')
    }, 1500)
  }

  const handleJoinGroup = (group) => {
    if (joinedGroups.includes(group.name)) {
      setJoinedGroups(joinedGroups.filter(g => g !== group.name))
      showNotificationMessage(`Left ${group.name} group`)
    } else {
      setJoinedGroups([...joinedGroups, group.name])
      showNotificationMessage(`Joined ${group.name} group!`)
      setUserPoints(userPoints + 25)
    }
  }

  const handleSaveDestination = (destination) => {
    if (savedDestinations.includes(destination.name)) {
      setSavedDestinations(savedDestinations.filter(d => d !== destination.name))
      showNotificationMessage(`Removed ${destination.name} from saved destinations`)
    } else {
      setSavedDestinations([...savedDestinations, destination.name])
      showNotificationMessage(`Saved ${destination.name} to your wishlist!`)
      setUserPoints(userPoints + 10)
    }
  }

  const handleStartPriceTracking = () => {
    const newAlert = {
      id: Date.now(),
      route: from && to ? `${from} → ${to}` : 'Delhi → Mumbai',
      targetPrice: '₹5,000',
      currentPrice: '₹6,500',
      status: 'active'
    }
    setPriceAlerts([...priceAlerts, newAlert])
    showNotificationMessage('Price tracking started! You\'ll get alerts when prices drop.')
    setUserPoints(userPoints + 15)
  }

  const handleClaimReward = (reward) => {
    showNotificationMessage(`Claimed ${reward} reward!`)
    setUserPoints(userPoints + reward.points || 50)
  }

  const handleStartAIChat = () => {
    showNotificationMessage('AI Assistant is ready to help you plan your trip!')
    setTimeout(() => {
      router.push('/unified')
      setActiveTab('ai-assistant')
    }, 1000)
  }

  const handleLogin = (provider) => {
    showNotificationMessage(`Signing in with ${provider}...`)
    setTimeout(() => {
      setShowLogin(false)
      showNotificationMessage('Successfully signed in! Welcome to AdventureOS')
      setUserPoints(userPoints + 100) // Welcome bonus
    }, 1500)
  }

  const handleExplore = (destination) => {
    showNotificationMessage(`Exploring ${destination.name}...`)
    setTimeout(() => {
      router.push('/destinations')
    }, 1000)
  }

  // Sample data for each section
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
    },
    {
      airline: { name: 'Vistara', logo: '✈️', code: 'UK' },
      route: 'Mumbai → Goa',
      price: '₹4,499',
      originalPrice: '₹8,999',
      discount: '50% OFF',
      departure: '14:00',
      arrival: '15:45',
      duration: '1h 45m',
      rating: 4.6
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
    },
    {
      name: 'ITC Grand Goa',
      location: 'South Goa, Goa',
      price: '₹6,999',
      originalPrice: '₹10,999',
      discount: '36% OFF',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=300&h=200&fit=crop'
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
    },
    {
      title: 'Leh Ladakh Motorcycle Expedition',
      location: 'Ladakh, Jammu & Kashmir',
      price: '₹28,999',
      originalPrice: '₹35,999',
      discount: '19% OFF',
      rating: 4.9,
      duration: '10 Days / 9 Nights',
      image: 'https://images.unsplash.com/photo-1555408723-77d62244c3a9?w=300&h=200&fit=crop'
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
    },
    {
      name: 'Solo Travelers India',
      members: 3421,
      activity: 'Rajasthan heritage tour',
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=100&h=100&fit=crop',
      category: 'Solo Travel'
    }
  ]

  const popularDestinations = [
    { 
      name: 'Manali, Himachal', 
      price: '₹8,999', 
      rating: 4.8, 
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=300&h=200&fit=crop', 
      tag: 'Most Popular',
      description: 'Valley of Gods with snow-capped peaks'
    },
    { 
      name: 'Goa', 
      price: '₹6,999', 
      rating: 4.7, 
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=300&h=200&fit=crop', 
      tag: 'Beach Paradise',
      description: 'Sandy beaches and vibrant nightlife'
    },
    { 
      name: 'Leh Ladakh', 
      price: '₹15,999', 
      rating: 4.9, 
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=300&h=200&fit=crop', 
      tag: 'Adventure',
      description: 'High-altitude desert with monasteries'
    },
    { 
      name: 'Kerala Backwaters', 
      price: '₹9,999', 
      rating: 4.8, 
      image: 'https://images.unsplash.com/photo-1605462863863-10d9e47e15ee?w=300&h=200&fit=crop', 
      tag: 'Serene',
      description: 'Houseboats and lush greenery'
    }
  ]

  const stats = [
    { number: '2.5M+', label: 'Happy Travelers' },
    { number: '500+', label: 'Destinations' },
    { number: '10,000+', label: 'Hotels & Adventures' },
    { number: '24/7', label: 'AI Assistant Support' }
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
      id: 'destinations', 
      label: 'Destinations', 
      icon: Globe, 
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    },
    { 
      id: 'price-tracker', 
      label: 'Price Tracker', 
      icon: TrendingUp, 
      color: 'text-red-600',
      bgColor: 'bg-red-50'
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
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&h=1080&fit=crop)' }}
        ></div>
        
        <div className="relative z-20 container mx-auto px-4 py-20">
          <div className="text-center text-white">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered Travel Platform
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Discover Your Next
              <span className="text-yellow-400"> Adventure</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              India's #1 adventure travel platform with AI-powered planning, real-time price tracking, and immersive 3D previews
            </p>
            
            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center mb-8">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" onClick={() => setActiveTab('flights')}>
                <Compass className="h-5 w-5 mr-2" />
                Start Exploring
              </Button>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Sign In
                </Button>
              </Link>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <Trophy className="h-5 w-5 text-yellow-400" />
                <span className="text-white font-semibold">{userPoints} pts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need for Travel</h2>
            <p className="text-gray-600 text-lg">All travel services in one beautiful interface</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Custom Tab List */}
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
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleFlightSearch}>
                          <Search className="h-4 w-4 mr-2" />
                          Search Flights
                        </Button>
                      </div>
                    </div>

                    {/* Flight Deals */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => handleBookFlight(flight)}>
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
                        <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleHotelSearch}>
                          <Search className="h-4 w-4 mr-2" />
                          Search Hotels
                        </Button>
                      </div>
                    </div>

                    {/* Hotel Deals */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                              <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => handleBookHotel(hotel)}>
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

              {/* Adventures Tab */}
              <TabsContent value="adventures" className="mt-0">
                <Card className="shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardTitle className="flex items-center gap-2">
                      <Mountain className="h-6 w-6" />
                      Adventure Activities & Experiences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {/* Adventure Categories */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {[
                        { icon: Mountain, name: 'Trekking', count: 250 },
                        { icon: Waves, name: 'Water Sports', count: 180 },
                        { icon: Bike, name: 'Cycling', count: 120 },
                        { icon: Camera, name: 'Photography', count: 95 }
                      ].map((category, index) => {
                        const Icon = category.icon
                        return (
                          <Card key={index} className="text-center p-4 hover:shadow-lg transition-shadow cursor-pointer">
                            <Icon className="h-8 w-8 mx-auto mb-2 text-green-600" />
                            <h4 className="font-semibold">{category.name}</h4>
                            <p className="text-sm text-gray-600">{category.count} options</p>
                          </Card>
                        )
                      })}
                    </div>

                    {/* Adventure Deals */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {adventureDeals.map((adventure, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow overflow-hidden">
                          <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${adventure.image})` }}>
                            <div className="w-full h-full bg-black bg-opacity-30"></div>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{adventure.title}</h4>
                              <Badge className="bg-red-100 text-red-800">
                                {adventure.discount}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{adventure.location}</p>
                            <p className="text-sm text-gray-600 mb-3">{adventure.duration}</p>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-xl font-bold text-green-600">{adventure.price}</span>
                                <span className="text-sm text-gray-500 line-through ml-2">{adventure.originalPrice}</span>
                              </div>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleBookAdventure(adventure)}>
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

              {/* Community Tab */}
              <TabsContent value="community" className="mt-0">
                <Card className="shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-6 w-6" />
                      Travel Community & Groups
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {/* Community Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <Users className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                        <h4 className="font-semibold">25,432</h4>
                        <p className="text-sm text-gray-600">Active Members</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <MessageCircle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                        <h4 className="font-semibold">1,247</h4>
                        <p className="text-sm text-gray-600">Travel Groups</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <Calendar className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                        <h4 className="font-semibold">342</h4>
                        <p className="text-sm text-gray-600">Upcoming Trips</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <Globe className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                        <h4 className="font-semibold">89</h4>
                        <p className="text-sm text-gray-600">Countries</p>
                      </div>
                    </div>

                    {/* Active Groups */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Active Travel Groups</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {communityGroups.map((group, index) => (
                          <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <img src={group.image} alt={group.name} className="w-12 h-12 rounded-lg" />
                                <div className="flex-1">
                                  <h4 className="font-semibold">{group.name}</h4>
                                  <p className="text-sm text-gray-600">{group.members} members</p>
                                  <p className="text-sm text-orange-600">{group.activity}</p>
                                </div>
                                <Button size="sm" className={joinedGroups.includes(group.name) ? "bg-gray-600 hover:bg-gray-700" : "bg-orange-600 hover:bg-orange-700"} onClick={() => handleJoinGroup(group)}>
                                  {joinedGroups.includes(group.name) ? 'Joined' : 'Join'}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Destinations Tab */}
              <TabsContent value="destinations" className="mt-0">
                <Card className="shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white">
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-6 w-6" />
                      Popular Destinations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {popularDestinations.map((dest, index) => (
                        <Card key={index} className="hover:shadow-xl transition-shadow cursor-pointer group">
                          <div className="relative">
                            <div className="h-48 bg-cover bg-center transition-transform duration-300 group-hover:scale-105" style={{ backgroundImage: `url(${dest.image})` }}>
                              <div className="w-full h-full bg-black bg-opacity-30"></div>
                            </div>
                            <Badge className="absolute top-4 left-4 bg-orange-100 text-orange-800">
                              {dest.tag}
                            </Badge>
                          </div>
                          
                          <CardContent className="p-4">
                            <h3 className="font-bold text-lg mb-1">{dest.name}</h3>
                            <p className="text-sm text-gray-600 mb-3">{dest.description}</p>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-xl font-bold text-cyan-600">{dest.price}</span>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm">{dest.rating}</span>
                                </div>
                              </div>
                              <Button size="sm" onClick={() => handleExplore(dest)}>
                                Explore
                                <ChevronRight className="h-4 w-4 ml-1" />
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
                      <p className="text-gray-600">Track prices in real-time and get alerts when prices drop</p>
                      <Button className="mt-4 bg-red-600 hover:bg-red-700" onClick={handleStartPriceTracking}>
                        Start Tracking
                      </Button>
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
                      <h3 className="text-xl font-semibold mb-2">Rewards Program</h3>
                      <div className="mb-4">
                        <div className="text-3xl font-bold text-yellow-600">{userPoints}</div>
                        <div className="text-sm text-gray-600">Available Points</div>
                      </div>
                      <p className="text-gray-600 mb-4">Earn points, badges, and exclusive rewards</p>
                      <div className="space-y-2">
                        <Button className="bg-yellow-600 hover:bg-yellow-700" onClick={() => handleClaimReward({ name: 'Welcome Bonus', points: 50 })}>
                          Claim Welcome Bonus
                        </Button>
                        <Button variant="outline" className="w-full">
                          View All Rewards
                        </Button>
                      </div>
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
                      <h3 className="text-xl font-semibold mb-2">AI Travel Assistant</h3>
                      <p className="text-gray-600">Get personalized recommendations and instant help</p>
                      <Button className="mt-4 bg-pink-600 hover:bg-pink-700" onClick={handleStartAIChat}>
                        Start Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </section>

      {/* CTA Section with Social Login */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Adventure Today</h2>
          <p className="text-xl mb-8 text-white/90">Join millions of travelers and explore the world</p>
          
          <div className="max-w-md mx-auto space-y-4">
            <Link href="/login">
              <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 flex items-center justify-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
            </Link>
            
            <Link href="/login">
              <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </Button>
            </Link>
            
            <div className="text-center">
              <p className="text-sm text-white/70">or</p>
              <Link href="/login">
                <Button variant="outline" className="mt-2 border-white text-white hover:bg-white hover:text-blue-600">
                  Sign up with Email
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Compass className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">AdventureOS</span>
              </div>
              <p className="text-gray-400">
                India's #1 adventure travel platform with AI-powered planning and real-time community.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/flights" className="text-gray-400 hover:text-white">Flights</Link></li>
                <li><Link href="/hotels" className="text-gray-400 hover:text-white">Hotels</Link></li>
                <li><Link href="/adventures" className="text-gray-400 hover:text-white">Adventures</Link></li>
                <li><Link href="/community" className="text-gray-400 hover:text-white">Community</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2">
                <li><Link href="/price-tracker" className="text-gray-400 hover:text-white">Price Tracker</Link></li>
                <li><Link href="/destinations" className="text-gray-400 hover:text-white">3D Previews</Link></li>
                <li><Link href="/rewards" className="text-gray-400 hover:text-white">Rewards</Link></li>
                <li><Link href="/ai-assistant" className="text-gray-400 hover:text-white">AI Assistant</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AdventureOS. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 z-50 animate-pulse">
          <Card className="bg-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5" />
              <span>{notificationMessage}</span>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
