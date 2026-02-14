'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  RotateCw,
  MapPin,
  Thermometer,
  Wind,
  Sun,
  Cloud,
  Camera,
  Heart,
  Share2,
  Calendar,
  Users,
  Clock,
  Star,
  Compass,
  Mountain,
  Waves,
  Trees,
  Building,
  Plane,
  Hotel,
  Utensils,
  ShoppingBag
} from 'lucide-react'

interface Destination {
  id: string
  name: string
  country: string
  description: string
  image360: string[]
  videoUrl: string
  highlights: string[]
  weather: {
    temp: string
    condition: string
    humidity: string
    wind: string
  }
  bestTime: string
  rating: number
  reviews: number
  tags: string[]
  activities: {
    icon: React.ReactNode
    name: string
    count: number
  }[]
  nearby: {
    name: string
    distance: string
    type: string
  }[]
}

export default function DestinationPreview() {
  const destinations: Destination[] = [
    {
      id: '1',
      name: 'Maldives',
      country: 'Indian Ocean',
      description: 'Tropical paradise with crystal-clear waters, overwater bungalows, and pristine beaches. Experience luxury like never before in this island nation.',
      image360: [
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1540202404-1b927e27fa6c?w=800&h=600&fit=crop'
      ],
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      highlights: [
        'Overwater Villas',
        'Coral Reefs',
        'Dolphin Watching',
        'Sunset Cruises',
        'World-Class Spas'
      ],
      weather: {
        temp: '28°C',
        condition: 'Sunny',
        humidity: '75%',
        wind: '15 km/h'
      },
      bestTime: 'November - April',
      rating: 4.9,
      reviews: 2847,
      tags: ['Beach', 'Luxury', 'Romantic', 'Diving', 'Island'],
      activities: [
        { icon: <Waves className="h-4 w-4" />, name: 'Water Sports', count: 45 },
        { icon: <Mountain className="h-4 w-4" />, name: 'Island Hopping', count: 23 },
        { icon: <Camera className="h-4 w-4" />, name: 'Photography', count: 67 },
        { icon: <Utensils className="h-4 w-4" />, name: 'Seafood Dining', count: 89 }
      ],
      nearby: [
        { name: 'Male City', distance: '15 km', type: 'city' },
        { name: 'Banana Reef', distance: '8 km', type: 'attraction' },
        { name: 'Maafushi Island', distance: '27 km', type: 'island' }
      ]
    },
    {
      id: '2',
      name: 'Swiss Alps',
      country: 'Switzerland',
      description: 'Majestic mountain peaks, world-class skiing, and charming alpine villages. Experience the ultimate mountain adventure.',
      image360: [
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551632811-561732d1e308?w=800&h=600&fit=crop'
      ],
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      highlights: [
        'Mountain Peaks',
        'Ski Resorts',
        'Alpine Villages',
        'Scenic Trails',
        'Mountain Cuisine'
      ],
      weather: { temp: '12°C', condition: 'Partly Cloudy', humidity: '60%', wind: '20 km/h' },
      bestTime: 'December - March',
      rating: 4.8,
      reviews: 1923,
      tags: ['Mountains', 'Skiing', 'Adventure', 'Nature'],
      activities: [
        { icon: <Mountain className="h-4 w-4" />, name: 'Skiing', count: 120 },
        { icon: <Camera className="h-4 w-4" />, name: 'Hiking', count: 85 },
        { icon: <Trees className="h-4 w-4" />, name: 'Nature Walks', count: 45 }
      ],
      nearby: [
        { name: 'Zermatt', distance: '45 km', type: 'village' },
        { name: 'Interlaken', distance: '120 km', type: 'town' },
        { name: 'Lake Geneva', distance: '180 km', type: 'lake' }
      ]
    },
    {
      id: '3',
      name: 'Tokyo',
      country: 'Japan',
      description: 'Ultra-modern city blending ancient traditions with cutting-edge technology. Experience the future today.',
      image360: [
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&h=600&fit=crop'
      ],
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      highlights: [
        'Modern Architecture',
        'Ancient Temples',
        'Technology Hubs',
        'Cherry Blossoms',
        'Ramen Culture'
      ],
      weather: { temp: '18°C', condition: 'Clear', humidity: '55%', wind: '10 km/h' },
      bestTime: 'March - May, September - November',
      rating: 4.7,
      reviews: 3456,
      tags: ['City', 'Technology', 'Culture', 'Food'],
      activities: [
        { icon: <Building className="h-4 w-4" />, name: 'Sightseeing', count: 200 },
        { icon: <Utensils className="h-4 w-4" />, name: 'Food Tours', count: 150 },
        { icon: <ShoppingBag className="h-4 w-4" />, name: 'Shopping', count: 180 }
      ],
      nearby: [
        { name: 'Mount Fuji', distance: '100 km', type: 'mountain' },
        { name: 'Kyoto', distance: '370 km', type: 'city' },
        { name: 'Nara', distance: '400 km', type: 'city' }
      ]
    }
  ]

  const [currentDestination, setCurrentDestination] = useState<Destination>(destinations[0])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    if (isRotating) {
      const interval = setInterval(() => {
        setRotation(prev => (prev + 1) % 360)
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isRotating])

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % currentDestination.image360.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isPlaying, currentDestination.image360.length])

  const handleDestinationChange = (destination: Destination) => {
    setCurrentDestination(destination)
    setCurrentImageIndex(0)
    setIsPlaying(false)
    setRotation(0)
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return <Sun className="h-5 w-5 text-yellow-500" />
      case 'cloudy': return <Cloud className="h-5 w-5 text-gray-500" />
      default: return <Sun className="h-5 w-5 text-yellow-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Immersive Destination Preview
          </h1>
          <p className="text-gray-600">Experience destinations like never before with 360° views and interactive features</p>
        </div>

        {/* Destination Selector */}
        <div className="flex justify-center gap-4 mb-8">
          {destinations.map((dest) => (
            <Button
              key={dest.id}
              variant={currentDestination.id === dest.id ? "default" : "outline"}
              onClick={() => handleDestinationChange(dest)}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              {dest.name}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Preview */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="relative">
                {/* 360° View */}
                <div 
                  className="relative h-96 bg-cover bg-center transition-all duration-1000"
                  style={{ 
                    backgroundImage: `url(${currentDestination.image360[currentImageIndex]})`,
                    transform: `rotateY(${rotation}deg)`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  {/* Controls Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="bg-white/90 hover:bg-white"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsRotating(!isRotating)}
                        className="bg-white/90 hover:bg-white"
                      >
                        <RotateCw className={`h-4 w-4 ${isRotating ? 'animate-spin' : ''}`} />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsMuted(!isMuted)}
                        className="bg-white/90 hover:bg-white"
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="bg-white/90 hover:bg-white"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Destination Info Overlay */}
                  <div className="absolute top-4 left-4 text-white">
                    <h2 className="text-3xl font-bold mb-1">{currentDestination.name}</h2>
                    <p className="text-lg opacity-90">{currentDestination.country}</p>
                  </div>

                  {/* Weather Widget */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      {getWeatherIcon(currentDestination.weather.condition)}
                      <div>
                        <p className="font-semibold">{currentDestination.weather.temp}</p>
                        <p className="text-xs text-gray-600">{currentDestination.weather.condition}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Thumbnails */}
                <div className="flex gap-2 p-4 bg-gray-50">
                  {currentDestination.image360.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-20 rounded-lg bg-cover bg-center border-2 transition-all ${
                        currentImageIndex === index ? 'border-purple-600 scale-110' : 'border-gray-300'
                      }`}
                      style={{ backgroundImage: `url(${image})` }}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Description and Highlights */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <p className="text-gray-700 mb-6">{currentDestination.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {currentDestination.highlights.map((highlight, index) => (
                    <div key={index} className="text-center p-3 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
                      <Star className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                      <p className="text-sm font-medium">{highlight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Compass className="h-5 w-5 text-purple-600" />
                  Quick Info
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Rating</span>
                    </div>
                    <span className="font-semibold">{currentDestination.rating} ({currentDestination.reviews})</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Best Time</span>
                    </div>
                    <span className="font-semibold">{currentDestination.bestTime}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Temperature</span>
                    </div>
                    <span className="font-semibold">{currentDestination.weather.temp}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Wind</span>
                    </div>
                    <span className="font-semibold">{currentDestination.weather.wind}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activities */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Camera className="h-5 w-5 text-purple-600" />
                  Popular Activities
                </h3>
                
                <div className="space-y-3">
                  {currentDestination.activities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          {activity.icon}
                        </div>
                        <span className="font-medium">{activity.name}</span>
                      </div>
                      <Badge variant="outline">{activity.count} options</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Nearby Places */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  Nearby Places
                </h3>
                
                <div className="space-y-3">
                  {currentDestination.nearby.map((place, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{place.name}</p>
                        <p className="text-sm text-gray-600">{place.type}</p>
                      </div>
                      <Badge variant="outline">{place.distance}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
                <Plane className="h-4 w-4 mr-2" />
                Book Trip to {currentDestination.name}
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline">
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
