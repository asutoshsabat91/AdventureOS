'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  Bell, 
  BellOff, 
  Clock, 
  DollarSign,
  AlertCircle,
  Zap,
  Target,
  Activity,
  BarChart3,
  Eye,
  Calendar
} from 'lucide-react'

interface PriceData {
  id: string
  type: 'flight' | 'hotel' | 'adventure'
  title: string
  currentPrice: number
  originalPrice: number
  lowestPrice: number
  highestPrice: number
  priceHistory: { time: string; price: number }[]
  trend: 'up' | 'down' | 'stable'
  changePercent: number
  prediction: 'rising' | 'falling' | 'stable'
  nextUpdate: string
  isTracking: boolean
  urgency: 'low' | 'medium' | 'high'
}

export default function PriceTracker() {
  const [priceData, setPriceData] = useState<PriceData[]>([
    {
      id: '1',
      type: 'flight',
      title: 'Delhi to Goa - IndiGo',
      currentPrice: 3999,
      originalPrice: 5999,
      lowestPrice: 3499,
      highestPrice: 6999,
      priceHistory: [
        { time: '2h ago', price: 4299 },
        { time: '4h ago', price: 4599 },
        { time: '6h ago', price: 4999 },
        { time: '8h ago', price: 5299 },
        { time: '10h ago', price: 5599 },
      ],
      trend: 'down',
      changePercent: -33.3,
      prediction: 'falling',
      nextUpdate: '2 min',
      isTracking: true,
      urgency: 'high'
    },
    {
      id: '2',
      type: 'hotel',
      title: 'Taj Palace Goa',
      currentPrice: 8999,
      originalPrice: 12999,
      lowestPrice: 7999,
      highestPrice: 14999,
      priceHistory: [
        { time: '1h ago', price: 9299 },
        { time: '3h ago', price: 9699 },
        { time: '5h ago', price: 9999 },
        { time: '7h ago', price: 10299 },
        { time: '9h ago', price: 10999 },
      ],
      trend: 'down',
      changePercent: -30.8,
      prediction: 'stable',
      nextUpdate: '5 min',
      isTracking: true,
      urgency: 'medium'
    },
    {
      id: '3',
      type: 'adventure',
      title: 'Himalayan Trekking',
      currentPrice: 18999,
      originalPrice: 24999,
      lowestPrice: 16999,
      highestPrice: 27999,
      priceHistory: [
        { time: '30m ago', price: 19999 },
        { time: '2h ago', price: 20999 },
        { time: '4h ago', price: 21999 },
        { time: '6h ago', price: 22999 },
        { time: '8h ago', price: 23999 },
      ],
      trend: 'down',
      changePercent: -24.0,
      prediction: 'falling',
      nextUpdate: '1 min',
      isTracking: false,
      urgency: 'low'
    }
  ])

  const [notifications, setNotifications] = useState(true)

  useEffect(() => {
    // Simulate real-time price updates
    const interval = setInterval(() => {
      setPriceData(prev => prev.map(item => {
        const randomChange = (Math.random() - 0.5) * 200 // Random price change
        const newPrice = Math.max(item.lowestPrice, Math.min(item.highestPrice, item.currentPrice + randomChange))
        const trend = newPrice > item.currentPrice ? 'up' : newPrice < item.currentPrice ? 'down' : 'stable'
        const changePercent = ((newPrice - item.originalPrice) / item.originalPrice) * 100
        
        return {
          ...item,
          currentPrice: newPrice,
          trend,
          changePercent,
          priceHistory: [
            { time: 'now', price: newPrice },
            ...item.priceHistory.slice(0, 4)
          ]
        }
      }))
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const toggleTracking = (id: string) => {
    setPriceData(prev => prev.map(item => 
      item.id === id ? { ...item, isTracking: !item.isTracking } : item
    ))
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getPredictionColor = (prediction: string) => {
    switch (prediction) {
      case 'rising': return 'bg-red-100 text-red-800'
      case 'falling': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500 text-white'
      case 'medium': return 'bg-yellow-500 text-white'
      default: return 'bg-green-500 text-white'
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-purple-600" />
            Real-Time Price Tracker
          </h2>
          <p className="text-gray-600">Track prices and get instant alerts for the best deals</p>
        </div>
        <Button
          variant={notifications ? "default" : "outline"}
          onClick={() => setNotifications(!notifications)}
          className="flex items-center gap-2"
        >
          {notifications ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
          {notifications ? 'Notifications On' : 'Notifications Off'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Total Savings</p>
                <p className="text-2xl font-bold text-green-800">₹12,497</p>
              </div>
              <TrendingDown className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Tracking</p>
                <p className="text-2xl font-bold text-blue-800">{priceData.filter(d => d.isTracking).length}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Hot Deals</p>
                <p className="text-2xl font-bold text-purple-800">{priceData.filter(d => d.urgency === 'high').length}</p>
              </div>
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Next Update</p>
                <p className="text-2xl font-bold text-orange-800">1 min</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Price Tracking Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {priceData.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="capitalize">
                      {item.type}
                    </Badge>
                    {item.urgency !== 'low' && (
                      <Badge className={getUrgencyColor(item.urgency)}>
                        {item.urgency === 'high' ? '🔥 Hot Deal' : '⚡ Popular'}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant={item.isTracking ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTracking(item.id)}
                >
                  {item.isTracking ? <Eye className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Current Price */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current Price</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{formatPrice(item.currentPrice)}</span>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(item.trend)}
                      <span className={`text-sm font-medium ${
                        item.changePercent < 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.changePercent > 0 ? '+' : ''}{item.changePercent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Original</p>
                  <p className="text-lg line-through text-gray-500">{formatPrice(item.originalPrice)}</p>
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Price Range (24h)</span>
                  <span>{formatPrice(item.lowestPrice)} - {formatPrice(item.highestPrice)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full relative"
                    style={{
                      left: `${((item.currentPrice - item.lowestPrice) / (item.highestPrice - item.lowestPrice)) * 100}%`,
                      width: '2px'
                    }}
                  ></div>
                </div>
              </div>

              {/* Prediction */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">AI Prediction</span>
                </div>
                <Badge className={getPredictionColor(item.prediction)}>
                  {item.prediction === 'rising' ? '📈 Prices Rising' : 
                   item.prediction === 'falling' ? '📉 Prices Falling' : '➡️ Stable'}
                </Badge>
              </div>

              {/* Next Update */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-600">Next update</span>
                </div>
                <span className="font-medium">{item.nextUpdate}</span>
              </div>

              {/* Mini Chart */}
              <div className="h-16 flex items-end gap-1">
                {item.priceHistory.map((point, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-gradient-to-t from-purple-500 to-purple-300 rounded-t"
                    style={{
                      height: `${((point.price - item.lowestPrice) / (item.highestPrice - item.lowestPrice)) * 100}%`,
                      opacity: index === 0 ? 1 : 0.7 - (index * 0.1)
                    }}
                  ></div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alert Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alert Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Price Drop Alert</p>
                <p className="text-sm text-gray-600">Notify when price drops 10%</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Target Price Alert</p>
                <p className="text-sm text-gray-600">Notify when price reaches target</p>
              </div>
              <Button variant="outline" size="sm">Set Target</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Urgent Deal Alert</p>
                <p className="text-sm text-gray-600">Instant notifications for hot deals</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
