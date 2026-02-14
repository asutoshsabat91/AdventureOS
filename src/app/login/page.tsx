'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Users, 
  Search, 
  Star, 
  Shield, 
  Clock,
  TrendingUp,
  Heart,
  Phone,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  Mountain,
  Waves,
  Bike,
  Camera
} from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate login and store user session
    setTimeout(() => {
      const userSession = {
        name: 'Adventure User',
        email: 'demo@adventureos.com',
        loginTime: new Date().toISOString(),
        points: 1500,
        isAuthenticated: true
      }
      
      // Store user session in localStorage
      localStorage.setItem('adventureOS_user', JSON.stringify(userSession))
      
      setIsLoading(false)
      router.push('/dashboard')
    }, 2000)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate signup and store user session
    setTimeout(() => {
      const userSession = {
        name: 'New Adventure User',
        email: 'newuser@adventureos.com',
        loginTime: new Date().toISOString(),
        points: 2000, // Welcome bonus
        isAuthenticated: true
      }
      
      // Store user session in localStorage
      localStorage.setItem('adventureOS_user', JSON.stringify(userSession))
      
      setIsLoading(false)
      router.push('/dashboard')
    }, 2000)
  }

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)
    
    // Simulate social login
    setTimeout(() => {
      const userSession = {
        name: `${provider} User`,
        email: `user@${provider.toLowerCase()}.com`,
        loginTime: new Date().toISOString(),
        points: 1800,
        provider: provider,
        isAuthenticated: true
      }
      
      // Store user session in localStorage
      localStorage.setItem('adventureOS_user', JSON.stringify(userSession))
      
      setIsLoading(false)
      router.push('/dashboard')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Mountain className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AdventureOS
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost">Support</Button>
              <Button variant="outline">List Your Property</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Login */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Marketing Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                🎯 India's #1 Adventure Travel Platform
              </Badge>
              <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                Discover Your Next
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}Great Adventure
                </span>
              </h1>
              <p className="text-xl text-gray-600">
                AI-powered adventure planning, real-time community, and unforgettable experiences. 
                Your journey starts here.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plane className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Planning</h3>
                  <p className="text-sm text-gray-600">Smart itineraries</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Travel Buddies</h3>
                  <p className="text-sm text-gray-600">Find companions</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Safe Travel</h3>
                  <p className="text-sm text-gray-600">Emergency support</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Best Prices</h3>
                  <p className="text-sm text-gray-600">Great deals</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-4 border-t">
              <div>
                <div className="text-2xl font-bold text-blue-600">50K+</div>
                <div className="text-sm text-gray-600">Active Travelers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">1000+</div>
                <div className="text-sm text-gray-600">Adventure Plans</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">4.8★</div>
                <div className="text-sm text-gray-600">User Rating</div>
              </div>
            </div>

            {/* Popular Destinations */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Trending Adventures</h3>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary" className="px-3 py-1">
                  <Mountain className="h-3 w-3 mr-1" /> Manali Trek
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  <Waves className="h-3 w-3 mr-1" /> Goa Watersports
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  <Bike className="h-3 w-3 mr-1" /> Leh Cycling
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  <Camera className="h-3 w-3 mr-1" /> Rajasthan Safari
                </Badge>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="max-w-md mx-auto w-full">
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
                <CardDescription>
                  Sign in to access your adventure plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10"
                            defaultValue="demo@adventureos.com"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="pl-10 pr-10"
                            defaultValue="password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className="text-sm">Remember me</span>
                        </label>
                        <Button variant="link" className="p-0 h-auto text-sm">
                          Forgot password?
                        </Button>
                      </div>

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Signing in...
                          </>
                        ) : (
                          <>
                            Sign In
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullname">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="fullname"
                            type="text"
                            placeholder="Enter your full name"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            className="pl-10 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" required />
                        <span className="text-sm">
                          I agree to the Terms & Conditions and Privacy Policy
                        </span>
                      </div>

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating account...
                          </>
                        ) : (
                          <>
                            Create Account
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full" onClick={() => handleSocialLogin('Google')} disabled={isLoading}>
                    <div className="w-5 h-5 bg-red-500 rounded mr-2"></div>
                    Google
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => handleSocialLogin('Facebook')} disabled={isLoading}>
                    <div className="w-5 h-5 bg-blue-600 rounded mr-2"></div>
                    Facebook
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-600">
                  Demo credentials: demo@adventureos.com / password
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-white border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Best Price Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Secure Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium">Trusted by 50K+ Users</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
