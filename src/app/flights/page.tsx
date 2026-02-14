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
  Plane,
  Clock,
  Star,
  TrendingUp,
  Filter,
  ChevronRight,
  ArrowUpDown,
  Luggage,
  Wifi,
  Coffee,
  Tv,
  Heart,
  Plus,
  Minus
} from 'lucide-react'
import Navigation from '@/components/navigation'

export default function FlightsPage() {
  const [tripType, setTripType] = useState('oneway')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [departDate, setDepartDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)
  const [classType, setClassType] = useState('economy')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const popularRoutes = [
    { from: 'Delhi', to: 'Mumbai', price: '₹4,999', duration: '2h 15m', airlines: ['IndiGo', 'AirAsia', 'SpiceJet'] },
    { from: 'Bangalore', to: 'Delhi', price: '₹5,499', duration: '2h 45m', airlines: ['Air India', 'Vistara', 'IndiGo'] },
    { from: 'Mumbai', to: 'Goa', price: '₹3,999', duration: '1h 30m', airlines: ['IndiGo', 'GoAir', 'SpiceJet'] },
    { from: 'Chennai', to: 'Bangalore', price: '₹2,999', duration: '1h 15m', airlines: ['AirAsia', 'IndiGo', 'SpiceJet'] },
    { from: 'Kolkata', to: 'Delhi', price: '₹6,999', duration: '2h 30m', airlines: ['Air India', 'Vistara', 'SpiceJet'] },
    { from: 'Hyderabad', to: 'Mumbai', price: '₹4,499', duration: '1h 45m', airlines: ['IndiGo', 'AirAsia', 'GoAir'] }
  ]

  const flightDeals = [
    { airline: 'IndiGo', route: 'Delhi → Mumbai', price: '₹3,999', originalPrice: '₹7,999', discount: '50% OFF' },
    { airline: 'Air India', route: 'Bangalore → Delhi', price: '₹5,999', originalPrice: '₹9,999', discount: '40% OFF' },
    { airline: 'Vistara', route: 'Mumbai → Goa', price: '₹4,499', originalPrice: '₹7,499', discount: '40% OFF' },
    { airline: 'SpiceJet', route: 'Chennai → Bangalore', price: '₹2,499', originalPrice: '₹4,999', discount: '50% OFF' }
  ]

  const handleSearch = () => {
    if (!from || !to || !departDate) {
      alert('Please fill in all required fields')
      return
    }

    setIsSearching(true)
    
    setTimeout(() => {
      const mockResults = [
        {
          id: '1',
          airline: 'IndiGo',
          flightNumber: '6E-2341',
          from: 'Delhi',
          to: 'Mumbai',
          departure: '06:00',
          arrival: '08:15',
          duration: '2h 15m',
          price: '₹4,999',
          stops: 'Non-stop',
          aircraft: 'Airbus A320',
          amenities: ['Meal', 'Entertainment'],
          refundable: true,
          rating: 4.2
        },
        {
          id: '2',
          airline: 'Air India',
          flightNumber: 'AI-567',
          from: 'Delhi',
          to: 'Mumbai',
          departure: '10:30',
          arrival: '13:15',
          duration: '2h 45m',
          price: '₹6,499',
          stops: 'Non-stop',
          aircraft: 'Boeing 737',
          amenities: ['Meal', 'WiFi', 'Extra Baggage'],
          refundable: false,
          rating: 4.0
        },
        {
          id: '3',
          airline: 'Vistara',
          flightNumber: 'UK-890',
          from: 'Delhi',
          to: 'Mumbai',
          departure: '14:00',
          arrival: '16:30',
          duration: '2h 30m',
          price: '₹7,999',
          stops: 'Non-stop',
          aircraft: 'Airbus A321',
          amenities: ['Meal', 'Entertainment', 'WiFi'],
          refundable: true,
          rating: 4.5
        }
      ]
      
      setSearchResults(mockResults)
      setIsSearching(false)
    }, 2000)
  }

  const handleSwapCities = () => {
    const temp = from
    setFrom(to)
    setTo(temp)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activePage="flights" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Flight</h1>
          <p className="text-xl opacity-90">Search millions of flights to find the best deals</p>
        </div>

        {/* Search Card */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Flight Search
            </CardTitle>
            <CardDescription>Find the best flights for your journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Trip Type Tabs */}
            <Tabs value={tripType} onValueChange={setTripType}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="oneway">One Way</TabsTrigger>
                <TabsTrigger value="roundtrip">Round Trip</TabsTrigger>
                <TabsTrigger value="multicity">Multi City</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* From/To Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">From</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Departure city"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSwapCities}
                  className="mt-8 h-12 w-12 rounded-full"
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">To</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Arrival city"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>
            </div>

            {/* Dates Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Departure Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="date"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>
              
              {tripType === 'roundtrip' && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Return Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Travelers & Class Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Travelers</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Adults</p>
                      <p className="text-sm text-gray-500">12+ years</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{adults}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAdults(adults + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Children</p>
                      <p className="text-sm text-gray-500">2-11 years</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setChildren(Math.max(0, children - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{children}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setChildren(children + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Infants</p>
                      <p className="text-sm text-gray-500">Below 2 years</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setInfants(Math.max(0, infants - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{infants}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setInfants(infants + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Class</label>
                <div className="space-y-2">
                  {['economy', 'premium', 'business'].map((cls) => (
                    <div
                      key={cls}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        classType === cls ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setClassType(cls)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium capitalize">
                            {cls === 'economy' ? 'Economy' : cls === 'premium' ? 'Premium Economy' : 'Business'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {cls === 'economy' && 'Standard seats, basic amenities'}
                            {cls === 'premium' && 'Extra legroom, premium meals'}
                            {cls === 'business' && 'Lie-flat seats, luxury experience'}
                          </p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          classType === cls ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`}>
                          {classType === cls && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              disabled={isSearching || !from || !to || !departDate}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white h-12 text-lg font-semibold"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching Flights...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Search Flights
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Search Results ({searchResults.length} flights found)</h2>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {searchResults.map((flight) => (
              <Card key={flight.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Flight Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Plane className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-lg">{flight.airline}</p>
                          <p className="text-sm text-gray-500">{flight.flightNumber} • {flight.aircraft}</p>
                        </div>
                        <Badge variant="outline">{flight.stops}</Badge>
                        {flight.refundable && (
                          <Badge className="bg-green-100 text-green-800">Refundable</Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-2xl font-bold">{flight.departure}</p>
                          <p className="text-gray-600">{flight.from}</p>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-sm text-gray-500 mb-2">{flight.duration}</p>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <div className="w-20 h-0.5 bg-gray-300"></div>
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-2xl font-bold">{flight.arrival}</p>
                          <p className="text-gray-600">{flight.to}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                        {flight.amenities.includes('Meal') && <Coffee className="h-4 w-4" />}
                        {flight.amenities.includes('WiFi') && <Wifi className="h-4 w-4" />}
                        {flight.amenities.includes('Entertainment') && <Tv className="h-4 w-4" />}
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{flight.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Booking */}
                    <div className="text-right">
                      <p className="text-3xl font-bold text-blue-600">{flight.price}</p>
                      <p className="text-sm text-gray-500 mb-4">per person</p>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Popular Routes & Deals */}
        {searchResults.length === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Popular Routes */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Routes</CardTitle>
                <CardDescription>Most searched flight routes in India</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularRoutes.map((route, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div>
                        <p className="font-semibold">{route.from} → {route.to}</p>
                        <p className="text-sm text-gray-500">{route.duration}</p>
                        <div className="flex gap-2 mt-1">
                          {route.airlines.map((airline, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {airline}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-600">{route.price}</p>
                        <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Flight Deals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Today's Deals
                </CardTitle>
                <CardDescription>Special discounts on selected flights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {flightDeals.map((deal, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div>
                        <p className="font-semibold">{deal.route}</p>
                        <p className="text-sm text-gray-500">{deal.airline}</p>
                        <Badge className="bg-red-100 text-red-800 mt-1">{deal.discount}</Badge>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg text-gray-400 line-through">{deal.originalPrice}</span>
                        </div>
                        <p className="text-xl font-bold text-blue-600">{deal.price}</p>
                        <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
