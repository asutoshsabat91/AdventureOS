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
  Hotel,
  Star,
  Wifi,
  Coffee,
  Car,
  Dumbbell,
  Waves,
  Utensils,
  Filter,
  ChevronRight,
  TrendingUp,
  Heart,
  MapPinIcon,
  Plane,
  Compass
} from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/navigation'

export default function HotelsPage() {
  const router = useRouter()
  const [destination, setDestination] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('2')
  const [rooms, setRooms] = useState('1')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const popularDestinations = [
    { 
      name: 'Goa - Beach Paradise', 
      price: '₹2,999', 
      rating: 4.8, 
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop', 
      tag: 'Most Popular',
      description: 'Beach resorts and vibrant nightlife'
    },
    { 
      name: 'Manali - Hill Station', 
      price: '₹3,499', 
      rating: 4.7, 
      image: 'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=300&h=200&fit=crop', 
      tag: 'Romantic',
      description: 'Snow mountains and adventure sports'
    },
    { 
      name: 'Jaipur - Heritage City', 
      price: '₹2,799', 
      rating: 4.6, 
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=300&h=200&fit=crop', 
      tag: 'Heritage',
      description: 'Royal palaces and cultural experiences'
    },
    { 
      name: 'Kerala - Backwaters', 
      price: '₹4,199', 
      rating: 4.9, 
      image: 'https://images.unsplash.com/photo-1605462863863-10d9e47e15ee?w=300&h=200&fit=crop', 
      tag: 'Serene',
      description: 'Houseboats and lush green landscapes'
    },
    { 
      name: 'Udaipur - Lake City', 
      price: '₹3,899', 
      rating: 4.8, 
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=300&h=200&fit=crop', 
      tag: 'Luxury',
      description: 'Lakeside palaces and romantic ambiance'
    },
    { 
      name: 'Rishikesh - Spiritual', 
      price: '₹1,999', 
      rating: 4.5, 
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop', 
      tag: 'Wellness',
      description: 'Yoga retreats and Ganges views'
    }
  ]

  const hotelDeals = [
    {
      name: 'Taj Exotica Resort & Spa',
      location: 'Candolim, Goa',
      price: '₹8,999',
      originalPrice: '₹14,999',
      discount: '40% OFF',
      rating: 4.7,
      reviews: 2341,
      amenities: ['Beach Access', 'Spa', 'Pool', 'Fine Dining'],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop',
      brand: 'Taj Hotels',
      category: '5 Star Luxury'
    },
    {
      name: 'The Oberoi Udaivilas',
      location: 'Udaipur, Rajasthan',
      price: '₹12,999',
      originalPrice: '₹19,999',
      discount: '35% OFF',
      rating: 4.9,
      reviews: 1876,
      amenities: ['Lake View', 'Spa', 'Pool', 'Butler Service'],
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=250&fit=crop',
      brand: 'Oberoi Hotels',
      category: 'Ultra Luxury'
    },
    {
      name: 'ITC Grand Goa',
      location: 'South Goa, Goa',
      price: '₹6,999',
      originalPrice: '₹10,999',
      discount: '36% OFF',
      rating: 4.6,
      reviews: 1543,
      amenities: ['Private Beach', 'Golf', 'Spa', 'Multiple Restaurants'],
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=250&fit=crop',
      brand: 'ITC Hotels',
      category: '5 Star Premium'
    },
    {
      name: 'Leela Palace New Delhi',
      location: 'Chanakyapuri, Delhi',
      price: '₹9,999',
      originalPrice: '₹15,999',
      discount: '37% OFF',
      rating: 4.8,
      reviews: 2109,
      amenities: ['Spa', 'Pool', 'Fine Dining', 'Business Center'],
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop',
      brand: 'The Leela',
      category: '5 Star Luxury'
    }
  ]

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'WiFi': return <Wifi className="h-4 w-4" />
      case 'Pool': return <Waves className="h-4 w-4" />
      case 'Spa': return <Heart className="h-4 w-4" />
      case 'Restaurant': return <Utensils className="h-4 w-4" />
      case 'Gym': return <Dumbbell className="h-4 w-4" />
      case 'Parking': return <Car className="h-4 w-4" />
      default: return <Coffee className="h-4 w-4" />
    }
  }

  const handleSearchHotels = async () => {
    if (!destination || !checkIn || !checkOut) {
      alert('Please fill in all required fields')
      return
    }
    
    setIsSearching(true)
    
    // Simulate API call
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          name: 'Taj Palace Goa',
          rating: 4.5,
          price: '₹4,999',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop'
        },
        {
          id: 2,
          name: 'Marriott Resort',
          rating: 4.3,
          price: '₹3,999',
          image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=250&fit=crop'
        }
      ]
      setSearchResults(mockResults)
      setIsSearching(false)
    }, 1500)
  }

  const handleBookHotel = (hotelId: number) => {
    alert(`Booking hotel ${hotelId}. Redirecting to payment...`)
    router.push('/payment')
  }

  const handleViewHotels = (dest: any) => {
    setDestination(dest.name)
    handleSearchHotels()
  }

  const handleWishlist = (item: any) => {
    alert(`Added ${item.name || item.hotelName} to wishlist!`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activePage="hotels" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Find Your Perfect Stay
            </h1>
            <p className="text-xl opacity-90">
              Discover amazing hotels and resorts at unbeatable prices
            </p>
          </div>

          {/* Search Widget */}
          <Card className="max-w-5xl mx-auto shadow-2xl">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="City or Hotel"
                      className="pl-10"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Check-in</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      className="pl-10"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Check-out</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      className="pl-10"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <select
                      className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4+ Guests</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Rooms</label>
                  <div className="relative">
                    <Hotel className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <select
                      className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={rooms}
                      onChange={(e) => setRooms(e.target.value)}
                    >
                      <option value="1">1 Room</option>
                      <option value="2">2 Rooms</option>
                      <option value="3">3 Rooms</option>
                      <option value="4">4+ Rooms</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  onClick={handleSearchHotels}
                  disabled={isSearching}
                >
                  <Search className="h-4 w-4 mr-2" />
                  {isSearching ? 'Searching...' : 'Search Hotels'}
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

      {/* Popular Destinations */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Popular Destinations</h2>
            <p className="text-gray-600">Top destinations with amazing hotel deals</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDestinations.map((dest, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                <div className="relative">
                  <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${dest.image})` }}>
                    <div className="w-full h-full bg-black bg-opacity-30"></div>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-bold text-lg">{dest.name}</h3>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{dest.rating}</span>
                      <span>•</span>
                      <span>{dest.hotels} Hotels</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-600">From</span>
                      <div className="text-xl font-bold text-blue-600">{dest.price}</div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => handleViewHotels(dest)}
                    >
                      View Hotels
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Hotel Deals */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Today's Best Deals</h2>
              <p className="text-gray-600">Limited time offers on premium hotels</p>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-red-100 text-red-800">
                <TrendingUp className="h-3 w-3 mr-1" />
                Flash Sale
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hotelDeals.map((deal, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow overflow-hidden">
                <div className="relative">
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${deal.image})` }}>
                    <div className="w-full h-full bg-black bg-opacity-30"></div>
                  </div>
                  <Badge className="absolute top-4 left-4 bg-red-600 text-white">
                    {deal.discount}
                  </Badge>
                  <Button variant="ghost" size="sm" className="absolute top-4 right-4 bg-white hover:bg-gray-100">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{deal.name}</h3>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPinIcon className="h-4 w-4" />
                        <span className="text-sm">{deal.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{deal.rating}</span>
                      </div>
                      <div className="text-xs text-gray-500">{deal.reviews} reviews</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Room Type:</span>
                      <span className="text-sm font-medium">{deal.roomType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Breakfast:</span>
                      <Badge variant={deal.breakfast ? "default" : "outline"} className="text-xs">
                        {deal.breakfast ? "Included" : "Not Included"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-gray-600">Amenities:</div>
                    <div className="flex flex-wrap gap-2">
                      {deal.amenities.slice(0, 4).map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-1 text-xs text-gray-600">
                          {getAmenityIcon(amenity)}
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">{deal.price}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">{deal.originalPrice}</span>
                      <div className="text-xs text-gray-600">per night</div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleBookHotel(deal.id)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      >
                        Book Now
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleWishlist(deal)}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
