'use client'

import { useState } from 'react'
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
  Compass,
  Star,
  TrendingUp,
  Filter,
  ChevronRight,
  Heart,
  Clock,
  Zap,
  Shield,
  Mountain,
  Waves,
  Bike,
  Camera,
  MapPinIcon,
  CheckCircle,
  Hotel,
  Plane,
  Award
} from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/navigation'
import { useRouter } from 'next/navigation'

export default function AdventuresPage() {
  const router = useRouter()
  const [destination, setDestination] = useState('')
  const [activity, setActivity] = useState('')
  const [duration, setDuration] = useState('')
  const [difficulty, setDifficulty] = useState('all')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const adventureTypes = [
    { icon: Mountain, name: 'Trekking & Hiking', color: 'bg-green-100 text-green-700', count: 150, description: 'Mountain adventures' },
    { icon: Waves, name: 'Water Sports', color: 'bg-blue-100 text-blue-700', count: 120, description: 'Ocean & river activities' },
    { icon: Bike, name: 'Cycling', color: 'bg-orange-100 text-orange-700', count: 85, description: 'Mountain & road biking' },
    { icon: Camera, name: 'Photography', color: 'bg-purple-100 text-purple-700', count: 65, description: 'Wildlife & landscape' },
    { icon: Compass, name: 'Wildlife Safari', color: 'bg-yellow-100 text-yellow-700', count: 95, description: 'Animal encounters' },
    { icon: Zap, name: 'Extreme Sports', color: 'bg-red-100 text-red-700', count: 45, description: 'Adrenaline rush' }
  ]

  const featuredAdventures = [
    {
      id: 1,
      title: 'Manali to Spiti Valley Trek',
      location: 'Himachal Pradesh',
      price: '₹18,999',
      originalPrice: '₹24,999',
      discount: '24% OFF',
      rating: 4.9,
      reviews: 234,
      difficulty: 'Moderate',
      duration: '7 Days / 6 Nights',
      includes: ['Accommodation', 'Meals', 'Guide', 'Equipment'],
      image: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=400&h=250&fit=crop',
      altitude: '4,270m',
      bestTime: 'June - September',
      groupSize: 'Max 12 people'
    },
    {
      id: 2,
      title: 'Scuba Diving in Goa',
      location: 'Grande Island, Goa',
      price: '₹8,999',
      originalPrice: '₹12,999',
      discount: '31% OFF',
      rating: 4.8,
      reviews: 189,
      difficulty: 'Easy',
      duration: '3 Days / 2 Nights',
      includes: ['Diving Course', 'Equipment', 'Certificate', 'Stay'],
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop',
      depth: '12m',
      bestTime: 'October - May',
      groupSize: 'Max 8 people'
    },
    {
      id: 3,
      title: 'Leh Ladakh Motorcycle Expedition',
      location: 'Ladakh, Jammu & Kashmir',
      price: '₹28,999',
      originalPrice: '₹35,999',
      discount: '19% OFF',
      rating: 4.9,
      reviews: 156,
      difficulty: 'Challenging',
      duration: '10 Days / 9 Nights',
      includes: ['Bike Rental', 'Fuel', 'Stay', 'Support Vehicle'],
      image: 'https://images.unsplash.com/photo-1555408723-77d62244c3a9?w=400&h=250&fit=crop',
      altitude: '5,359m',
      bestTime: 'June - September',
      groupSize: 'Max 15 people'
    },
    {
      id: 4,
      title: 'Rishikesh River Rafting',
      location: 'Ganges, Rishikesh',
      price: '₹2,999',
      originalPrice: '₹4,999',
      discount: '40% OFF',
      rating: 4.7,
      reviews: 298,
      difficulty: 'Moderate',
      duration: '2 Days / 1 Night',
      includes: ['Rafting Gear', 'Guide', 'Meals', 'Camping'],
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
      rapids: 'Grade III-IV',
      bestTime: 'September - June',
      groupSize: 'Max 10 people'
    },
    {
      id: 5,
      title: 'Kerala Backwaters Kayaking',
      location: 'Alleppey, Kerala',
      price: '₹4,999',
      originalPrice: '₹7,999',
      discount: '37% OFF',
      rating: 4.6,
      reviews: 167,
      difficulty: 'Easy',
      duration: '3 Days / 2 Nights',
      includes: ['Kayak', 'Guide', 'Homestay', 'Meals'],
      image: 'https://images.unsplash.com/photo-1605462863863-10d9e47e15ee?w=400&h=250&fit=crop',
      distance: '25km',
      bestTime: 'October - March',
      groupSize: 'Max 8 people'
    },
    {
      id: 6,
      title: 'Andaman Islands Snorkeling',
      location: 'Havelock Island, Andaman',
      price: '₹12,999',
      originalPrice: '₹18,999',
      discount: '32% OFF',
      rating: 4.9,
      reviews: 203,
      difficulty: 'Easy',
      duration: '5 Days / 4 Nights',
      includes: ['Snorkeling Gear', 'Boat Rides', 'Stay', 'Meals'],
      image: 'https://images.unsplash.com/photo-1540202404-1b927e27fa6c?w=400&h=250&fit=crop',
      visibility: '20m',
      bestTime: 'November - April',
      groupSize: 'Max 12 people'
    }
  ]

  const trendingExperiences = [
    {
      title: 'Rishikesh River Rafting',
      location: 'Rishikesh',
      price: '₹2,499',
      rating: 4.7,
      duration: '1 Day',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
      tag: 'Best Seller'
    },
    {
      title: 'Goa Kayaking Adventure',
      location: 'Goa',
      price: '₹1,999',
      rating: 4.6,
      duration: 'Half Day',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=300&h=200&fit=crop',
      tag: 'Popular'
    },
    {
      title: 'Coorg Coffee Plantation Tour',
      location: 'Coorg',
      price: '₹1,799',
      rating: 4.5,
      duration: 'Full Day',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop',
      tag: 'Family Friendly'
    },
    {
      title: 'Munnar Tea Garden Trek',
      location: 'Munnar',
      price: '₹1,299',
      rating: 4.4,
      duration: 'Half Day',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
      tag: 'Scenic'
    }
  ]

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Moderate': return 'bg-yellow-100 text-yellow-800'
      case 'Challenging': return 'bg-orange-100 text-orange-800'
      case 'Expert': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSearchAdventures = async () => {
    setIsSearching(true)
    
    // Simulate API call
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          title: 'Himalayan Trekking Expedition',
          location: 'Manali',
          price: '₹12,999',
          duration: '5 Days',
          difficulty: 'Moderate'
        },
        {
          id: 2,
          title: 'Scuba Diving in Goa',
          location: 'Goa',
          price: '₹8,999',
          duration: '3 Days',
          difficulty: 'Easy'
        }
      ]
      setSearchResults(mockResults)
      setIsSearching(false)
    }, 1500)
  }

  const handleBookAdventure = (adventureId: number) => {
    alert(`Booking adventure ${adventureId}. Redirecting to payment...`)
    router.push('/payment')
  }

  const handleViewAdventures = (type: any) => {
    setActivity(type.name.toLowerCase().split(' ')[0])
    handleSearchAdventures()
  }

  const handleWishlist = (item: any) => {
    alert(`Added ${item.title || item.name} to wishlist!`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activePage="adventures" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Discover Amazing Adventures
            </h1>
            <p className="text-xl opacity-90">
              From thrilling treks to serene experiences - find your perfect adventure
            </p>
          </div>

          {/* Search Widget */}
          <Card className="max-w-5xl mx-auto shadow-2xl">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Where to?"
                      className="pl-10"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Activity</label>
                  <div className="relative">
                    <Compass className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <select
                      className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={activity}
                      onChange={(e) => setActivity(e.target.value)}
                    >
                      <option value="">All Activities</option>
                      <option value="trekking">Trekking</option>
                      <option value="water">Water Sports</option>
                      <option value="cycling">Cycling</option>
                      <option value="wildlife">Wildlife</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Duration</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <select
                      className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    >
                      <option value="">Any Duration</option>
                      <option value="1">1 Day</option>
                      <option value="2-3">2-3 Days</option>
                      <option value="4-7">4-7 Days</option>
                      <option value="8+">8+ Days</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Difficulty</label>
                  <div className="relative">
                    <Zap className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <select
                      className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                    >
                      <option value="all">All Levels</option>
                      <option value="easy">Easy</option>
                      <option value="moderate">Moderate</option>
                      <option value="challenging">Challenging</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  onClick={handleSearchAdventures}
                  disabled={isSearching}
                >
                  <Search className="h-4 w-4 mr-2" />
                  {isSearching ? 'Searching...' : 'Search Adventures'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {showFilters ? 'Hide Filters' : 'More Filters'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Adventure Types */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Adventure Categories</h2>
            <p className="text-gray-600">Choose your type of adventure</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {adventureTypes.map((type, index) => (
              <Card key={index} className="hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full ${type.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <type.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold mb-1">{type.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {type.count} Experiences
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Adventures */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Adventures</h2>
              <p className="text-gray-600">Handpicked experiences for adventure enthusiasts</p>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-red-100 text-red-800">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredAdventures.map((adventure, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow overflow-hidden group">
                <div className="relative">
                  <div className="h-56 bg-cover bg-center transition-transform duration-300 group-hover:scale-105" style={{ backgroundImage: `url(${adventure.image})` }}>
                    <div className="w-full h-full bg-black bg-opacity-30"></div>
                  </div>
                  <Badge className="absolute top-4 left-4 bg-red-600 text-white">
                    {adventure.discount}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-4 right-4 bg-white hover:bg-gray-100"
                    onClick={() => handleWishlist(adventure)}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{adventure.title}</h3>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPinIcon className="h-4 w-4" />
                        <span className="text-sm">{adventure.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{adventure.rating}</span>
                      </div>
                      <div className="text-xs text-gray-500">{adventure.reviews} reviews</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{adventure.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{adventure.groupSize} people</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(adventure.difficulty)}>
                        {adventure.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Best: {adventure.bestTime}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-sm font-medium text-gray-700">Highlights:</div>
                    <div className="flex flex-wrap gap-1">
                      {(adventure.highlights || []).slice(0, 3).map((highlight, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-sm font-medium text-gray-700">Includes:</div>
                    <div className="space-y-1">
                      {(adventure.includes || []).slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">{adventure.price}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">{adventure.originalPrice}</span>
                      <div className="text-xs text-gray-600">per person</div>
                    </div>
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                      onClick={() => handleBookAdventure(adventure.id)}
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

      {/* Trending Experiences */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Trending Experiences</h2>
            <p className="text-gray-600">Quick adventures for instant thrills</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingExperiences.map((exp, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow overflow-hidden group">
                <div className="relative">
                  <div className="h-32 bg-cover bg-center transition-transform duration-300 group-hover:scale-105" style={{ backgroundImage: `url(${exp.image})` }}>
                    <div className="w-full h-full bg-black bg-opacity-30"></div>
                  </div>
                  <Badge className="absolute top-4 left-4 bg-orange-100 text-orange-800 text-xs">
                    {exp.tag}
                  </Badge>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-1">{exp.title}</h3>
                  <div className="flex items-center gap-1 text-gray-600 mb-2">
                    <MapPinIcon className="h-3 w-3" />
                    <span className="text-xs">{exp.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{exp.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">{exp.duration}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">{exp.price}</span>
                    <Button size="sm" variant="outline">
                      Book
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Trust */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Adventure with Confidence</h2>
            <p className="text-gray-600">Your safety is our top priority</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Safety First</h3>
              <p className="text-sm text-gray-600">Certified guides and proper equipment</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Verified Operators</h3>
              <p className="text-sm text-gray-600">Only trusted and experienced partners</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-600">Emergency assistance anytime</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Best Price</h3>
              <p className="text-sm text-gray-600">Price match guarantee</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
