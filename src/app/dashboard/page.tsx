'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Plane,
  Train,
  Bus,
  Hotel,
  Camera,
  Mountain,
  Waves,
  Bike,
  Star,
  TrendingUp,
  Clock,
  Heart,
  Filter,
  ChevronRight,
  Sparkles,
  Shield,
  Award,
  Globe,
  Navigation,
  Compass,
  Zap,
  User as UserIcon,
  CheckCircle,
  Trophy,
  LayoutGrid
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AITravelAssistant from '@/components/ai-travel-assistant'
import AuthCheck from '@/components/auth-check'

export default function Dashboard() {
  const router = useRouter()
  const [searchType, setSearchType] = useState('flights')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [travelers, setTravelers] = useState('1')
  const [isSearching, setIsSearching] = useState(false)

  const adventureTypes = [
    { icon: Mountain, name: 'Trekking', color: 'bg-green-100 text-green-700', count: 250 },
    { icon: Waves, name: 'Water Sports', color: 'bg-blue-100 text-blue-700', count: 180 },
    { icon: Bike, name: 'Cycling', color: 'bg-orange-100 text-orange-700', count: 120 },
    { icon: Camera, name: 'Photography', color: 'bg-purple-100 text-purple-700', count: 95 }
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
      name: 'Leh Ladakh', 
      price: '₹15,999', 
      rating: 4.9, 
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=300&h=200&fit=crop', 
      tag: 'Adventure',
      description: 'High-altitude desert with monasteries'
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
      name: 'Rishikesh', 
      price: '₹5,999', 
      rating: 4.6, 
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop', 
      tag: 'Spiritual',
      description: 'Yoga capital and adventure sports'
    },
    { 
      name: 'Jaipur, Rajasthan', 
      price: '₹7,999', 
      rating: 4.5, 
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=300&h=200&fit=crop', 
      tag: 'Heritage',
      description: 'Pink City with royal palaces'
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

  const trendingAdventures = [
    {
      title: 'Manali to Spiti Valley Trek',
      duration: '7 Days / 6 Nights',
      price: '₹18,999',
      originalPrice: '₹24,999',
      discount: '24% OFF',
      rating: 4.9,
      reviews: 234,
      difficulty: 'Moderate',
      includes: ['Accommodation', 'Meals', 'Guide', 'Equipment'],
      image: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=400&h=250&fit=crop'
    },
    {
      title: 'Goa Scuba Diving Experience',
      duration: '3 Days / 2 Nights',
      price: '₹12,499',
      originalPrice: '₹16,999',
      discount: '26% OFF',
      rating: 4.8,
      reviews: 189,
      difficulty: 'Easy',
      includes: ['Diving Course', 'Equipment', 'Certificate', 'Stay'],
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop'
    },
    {
      title: 'Leh Ladakh Motorcycle Expedition',
      duration: '10 Days / 9 Nights',
      price: '₹28,999',
      originalPrice: '₹35,999',
      discount: '19% OFF',
      rating: 4.9,
      reviews: 156,
      difficulty: 'Challenging',
      includes: ['Bike Rental', 'Fuel', 'Stay', 'Support Vehicle'],
      image: 'https://images.unsplash.com/photo-1555408723-77d62244c3a9?w=400&h=250&fit=crop'
    }
  ]

  const handleSearch = async () => {
    if (!from || !to || !date) {
      alert('Please fill in all required fields')
      return
    }
    
    setIsSearching(true)
    
    // Simulate API call and redirect to appropriate page
    setTimeout(() => {
      setIsSearching(false)
      if (searchType === 'flights') {
        router.push(`/flights?from=${from}&to=${to}&date=${date}`)
      } else if (searchType === 'hotels') {
        router.push(`/hotels?destination=${to}&checkin=${date}`)
      } else if (searchType === 'adventures') {
        router.push(`/adventures?destination=${to}&date=${date}`)
      }
    }, 1000)
  }

  const handleExploreDestination = (destination: any) => {
    router.push(`/hotels?destination=${destination.name}`)
  }

  const handleBookAdventure = (adventure: any) => {
    router.push(`/adventures?search=${adventure.title}`)
  }

  const handleExploreAdventures = (type: any) => {
    router.push(`/adventures?activity=${type.name.toLowerCase()}`)
  }

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Mountain className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">AdventureOS</span>
              </Link>
              
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/flights" className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
                  <Plane className="h-4 w-4" />
                  Flights
                </Link>
                <Link href="/hotels" className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
                  <Hotel className="h-4 w-4" />
                  Hotels
                </Link>
                <Link href="/adventures" className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
                  <Mountain className="h-4 w-4" />
                  Adventures
                </Link>
                <Link href="/community" className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
                  <Users className="h-4 w-4" />
                  Community
                </Link>
                <Link href="/destinations" className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium">
                  <Globe className="h-4 w-4" />
                  Destinations
                </Link>
                <Link href="/price-tracker" className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium">
                  <TrendingUp className="h-4 w-4" />
                  Price Tracker
                </Link>
                <Link href="/rewards" className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium">
                  <Trophy className="h-4 w-4" />
                  Rewards
                </Link>
                <Link href="/unified" className="flex items-center gap-1 text-pink-600 hover:text-pink-700 font-medium">
                  <Sparkles className="h-4 w-4" />
                  Unified View
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4 mr-1" />
                Wishlist
              </Button>
              <Button variant="ghost" size="sm">
                <Globe className="h-4 w-4 mr-1" />
                EN
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                <UserIcon className="h-4 w-4 mr-1" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Search */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Find Your Perfect Adventure
            </h1>
            <p className="text-xl opacity-90">
              Discover amazing experiences with AI-powered planning
            </p>
          </div>

          {/* Search Widget */}
          <Card className="max-w-5xl mx-auto shadow-2xl">
            <CardContent className="p-6">
              <Tabs value={searchType} onValueChange={setSearchType} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="flights" className="flex items-center gap-2">
                    <Plane className="h-4 w-4" />
                    Flights
                  </TabsTrigger>
                  <TabsTrigger value="hotels" className="flex items-center gap-2">
                    <Hotel className="h-4 w-4" />
                    Hotels
                  </TabsTrigger>
                  <TabsTrigger value="adventures" className="flex items-center gap-2">
                    <Compass className="h-4 w-4" />
                    Adventures
                  </TabsTrigger>
                  <TabsTrigger value="packages" className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Packages
                  </TabsTrigger>
                </TabsList>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">From</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Departure city"
                        className="pl-10"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">To</label>
                    <div className="relative">
                      <Navigation className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Destination"
                        className="pl-10"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Travel Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="date"
                        className="pl-10"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Travelers</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <select
                        className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={travelers}
                        onChange={(e) => setTravelers(e.target.value)}
                      >
                        <option value="1">1 Traveler</option>
                        <option value="2">2 Travelers</option>
                        <option value="3">3 Travelers</option>
                        <option value="4">4+ Travelers</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {isSearching ? 'Searching...' : `Search ${searchType.charAt(0).toUpperCase() + searchType.slice(1)}`}
                  </Button>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Adventure Types */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Explore Adventure Types</h2>
            <p className="text-gray-600">Choose from our handpicked adventure experiences</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {adventureTypes.map((type, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleExploreAdventures(type)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full ${type.color} flex items-center justify-center mx-auto mb-4`}>
                    <type.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold mb-1">{type.name}</h3>
                  <p className="text-sm text-gray-600">{type.count} Experiences</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Popular Destinations</h2>
              <p className="text-gray-600">Trending places for adventure seekers</p>
            </div>
            <Button variant="outline">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularDestinations.map((dest, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                onClick={() => handleExploreDestination(dest)}
              >
                <div className="h-24 bg-cover bg-center" style={{ backgroundImage: `url(${dest.image})` }}>
                  <div className="w-full h-full bg-black bg-opacity-20 flex items-end">
                    <Badge className="mb-2 ml-2 bg-orange-100 text-orange-800 text-xs">
                      {dest.tag}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-1">{dest.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-bold">{dest.price}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{dest.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Adventures */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Trending Adventures</h2>
              <p className="text-gray-600">Hot deals on amazing experiences</p>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-red-100 text-red-800">
                <Zap className="h-3 w-3 mr-1" />
                Limited Time Offer
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingAdventures.map((adventure, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow overflow-hidden">
                <div className="relative">
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${adventure.image})` }}>
                    <div className="w-full h-full bg-black bg-opacity-30"></div>
                  </div>
                  <Badge className="absolute top-4 left-4 bg-red-600 text-white">
                    {adventure.discount}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">{adventure.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{adventure.duration}</p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{adventure.rating}</span>
                      <span className="text-gray-500">({adventure.reviews})</span>
                    </div>
                    <Badge variant="outline">{adventure.difficulty}</Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {adventure.includes.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">{adventure.price}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">{adventure.originalPrice}</span>
                    </div>
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                      onClick={() => handleBookAdventure(adventure)}
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Why Choose AdventureOS?</h2>
            <p className="text-gray-600">Your trusted partner for unforgettable adventures</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">100% Safe</h3>
              <p className="text-sm text-gray-600">Verified operators & insurance coverage</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Best Price</h3>
              <p className="text-sm text-gray-600">Lowest price guarantee & instant refunds</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-600">Round the clock assistance</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">50K+ Users</h3>
              <p className="text-sm text-gray-600">Trusted by adventure enthusiasts</p>
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
                  <Mountain className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">AdventureOS</span>
              </div>
              <p className="text-gray-400">
                India's #1 adventure travel platform with AI-powered planning and real-time community.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/safety" className="hover:text-white">Safety</Link></li>
                <li><Link href="/cancellation" className="hover:text-white">Cancellation</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <Button variant="outline" size="sm" className="text-gray-400 border-gray-600">
                  Facebook
                </Button>
                <Button variant="outline" size="sm" className="text-gray-400 border-gray-600">
                  Instagram
                </Button>
                <Button variant="outline" size="sm" className="text-gray-400 border-gray-600">
                  Twitter
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AdventureOS. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* AI Travel Assistant */}
      <AITravelAssistant />

      {/* Unified View CTA */}
      <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <LayoutGrid className="h-12 w-12" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Try Our Unified View</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Experience all AdventureOS features in one beautiful, tabbed interface. 
            Switch seamlessly between Flights, Hotels, Adventures, Community, Price Tracker, 
            Destinations, Rewards, and AI Assistant - all in one place!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/unified">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <LayoutGrid className="h-5 w-5 mr-2" />
                Open Unified View
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </AuthCheck>
  )
}
