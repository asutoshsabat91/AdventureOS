'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Navigation from '@/components/navigation'
import AuthCheck from '@/components/auth-check'
import { 
  Heart,
  MapPin,
  Calendar,
  Users,
  Star,
  Plane,
  Hotel,
  Mountain,
  Trash2,
  Search,
  Filter,
  ArrowRight,
  Clock
} from 'lucide-react'

interface WishlistItem {
  id: string
  type: 'flight' | 'hotel' | 'adventure' | 'destination'
  title: string
  provider: string
  price: number
  rating: number
  location: string
  date?: string
  duration?: string
  image: string
  description: string
  addedDate: string
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'flight' | 'hotel' | 'adventure' | 'destination'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'rating'>('date')

  useEffect(() => {
    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem('adventureOS_wishlist')
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist))
    } else {
      // Mock data for demonstration
      const mockData: WishlistItem[] = [
        {
          id: '1',
          type: 'flight',
          title: 'Delhi to Goa Flight',
          provider: 'IndiGo',
          price: 4999,
          rating: 4.5,
          location: 'Delhi → Goa',
          date: '2024-12-25',
          duration: '2h 30m',
          image: 'https://images.unsplash.com/photo-1436491865332-7a61a94cc0ad?w=400&h=250&fit=crop',
          description: 'Direct flight with complimentary meals',
          addedDate: '2024-02-10'
        },
        {
          id: '2',
          type: 'hotel',
          title: 'Taj Palace Goa',
          provider: 'Taj Hotels',
          price: 8500,
          rating: 4.8,
          location: 'Goa',
          date: '2024-12-25 - 2024-12-28',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop',
          description: 'Luxury beachfront resort with spa',
          addedDate: '2024-02-11'
        },
        {
          id: '3',
          type: 'adventure',
          title: 'Scuba Diving Experience',
          provider: 'Andaman Adventures',
          price: 3500,
          rating: 4.9,
          location: 'Andaman Islands',
          date: '2024-12-20',
          duration: '3 hours',
          image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop',
          description: 'Certified instructors and equipment included',
          addedDate: '2024-02-12'
        },
        {
          id: '4',
          type: 'destination',
          title: 'Manali Adventure Package',
          provider: 'Himalayan Tours',
          price: 15000,
          rating: 4.7,
          location: 'Manali, Himachal Pradesh',
          date: '2024-12-15 - 2024-12-22',
          image: 'https://images.unsplash.com/photo-1626621341517-bbf7d9810e53?w=400&h=250&fit=crop',
          description: 'Complete adventure package with accommodation',
          addedDate: '2024-02-13'
        }
      ]
      setWishlistItems(mockData)
      localStorage.setItem('adventureOS_wishlist', JSON.stringify(mockData))
    }
  }, [])

  const handleRemoveFromWishlist = (itemId: string) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== itemId)
    setWishlistItems(updatedWishlist)
    localStorage.setItem('adventureOS_wishlist', JSON.stringify(updatedWishlist))
  }

  const filteredItems = wishlistItems
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = filterType === 'all' || item.type === filterType
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price
        case 'rating':
          return b.rating - a.rating
        case 'date':
        default:
          return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
      }
    })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane className="h-4 w-4" />
      case 'hotel': return <Hotel className="h-4 w-4" />
      case 'adventure': return <Mountain className="h-4 w-4" />
      case 'destination': return <MapPin className="h-4 w-4" />
      default: return <Heart className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'flight': return 'bg-blue-100 text-blue-800'
      case 'hotel': return 'bg-purple-100 text-purple-800'
      case 'adventure': return 'bg-green-100 text-green-800'
      case 'destination': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <Navigation activePage="wishlist" />
        
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-gray-600">Save your favorite adventures and book them later</p>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search wishlist items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="flight">Flights</option>
                    <option value="hotel">Hotels</option>
                    <option value="adventure">Adventures</option>
                    <option value="destination">Destinations</option>
                  </select>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="date">Recently Added</option>
                    <option value="price">Price: Low to High</option>
                    <option value="rating">Rating: High to Low</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wishlist Items */}
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-600 mb-6">Start adding your favorite adventures and travel options</p>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Explore Adventures
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-48 h-48 lg:h-auto">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getTypeColor(item.type)}>
                              {getTypeIcon(item.type)}
                              <span className="ml-1 capitalize">{item.type}</span>
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{item.rating}</span>
                            </div>
                          </div>
                          
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-gray-600 mb-2">{item.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {item.location}
                            </div>
                            {item.date && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {item.date}
                              </div>
                            )}
                            {item.duration && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {item.duration}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2 ml-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">₹{item.price.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">per person</p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveFromWishlist(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <p className="text-sm text-gray-500">
                          Added on {new Date(item.addedDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm font-medium text-gray-900">{item.provider}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthCheck>
  )
}
