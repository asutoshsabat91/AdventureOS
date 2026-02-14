'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Navigation from '@/components/navigation'
import AuthCheck from '@/components/auth-check'
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Trophy,
  Star,
  Settings,
  Camera,
  Edit,
  Save,
  X,
  Plane,
  Hotel,
  Mountain,
  Heart,
  Award,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  location: string
  joinDate: string
  avatar: string
  bio: string
  points: number
  level: string
  totalTrips: number
  totalSpent: number
  preferences: {
    notifications: boolean
    newsletter: boolean
    publicProfile: boolean
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({})

  useEffect(() => {
    // Load user profile from localStorage
    const userSession = localStorage.getItem('adventureOS_user')
    if (userSession) {
      const user = JSON.parse(userSession)
      
      // Mock profile data (in real app, this would come from API)
      const mockProfile: UserProfile = {
        id: user.email || '1',
        name: user.name || 'Adventure User',
        email: user.email || 'user@adventureos.com',
        phone: '+91 98765 43210',
        location: 'Mumbai, India',
        joinDate: user.loginTime || new Date().toISOString(),
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        bio: 'Adventure enthusiast, love exploring new places and meeting fellow travelers. Always up for a good trek or a beach vacation!',
        points: user.points || 1500,
        level: 'Gold Explorer',
        totalTrips: 12,
        totalSpent: 85000,
        preferences: {
          notifications: true,
          newsletter: true,
          publicProfile: true
        }
      }
      
      setProfile(mockProfile)
      setEditForm(mockProfile)
    }
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    if (profile && editForm) {
      const updatedProfile = { ...profile, ...editForm }
      setProfile(updatedProfile)
      setIsEditing(false)
      
      // Update localStorage (in real app, this would be an API call)
      const userSession = JSON.parse(localStorage.getItem('adventureOS_user') || '{}')
      userSession.name = updatedProfile.name
      userSession.email = updatedProfile.email
      localStorage.setItem('adventureOS_user', JSON.stringify(userSession))
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (profile) {
      setEditForm(profile)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Gold Explorer': return 'bg-yellow-100 text-yellow-800'
      case 'Silver Adventurer': return 'bg-gray-100 text-gray-800'
      case 'Bronze Traveler': return 'bg-orange-100 text-orange-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const getActivityStats = () => {
    return [
      { icon: <Plane className="h-5 w-5" />, label: 'Flights', count: 8, color: 'text-blue-600' },
      { icon: <Hotel className="h-5 w-5" />, label: 'Hotels', count: 15, color: 'text-purple-600' },
      { icon: <Mountain className="h-5 w-5" />, label: 'Adventures', count: 12, color: 'text-green-600' },
      { icon: <Heart className="h-5 w-5" />, label: 'Wishlist', count: 23, color: 'text-red-600' }
    ]
  }

  if (!profile) {
    return (
      <AuthCheck>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AuthCheck>
    )
  }

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <Navigation activePage="profile" />
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Profile Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Header */}
              <Card className="shadow-xl border-0">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full overflow-hidden">
                          <img 
                            src={profile.avatar} 
                            alt={profile.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="absolute bottom-0 right-0 w-8 h-8 p-0 bg-white shadow-md"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                          <Badge className={getLevelColor(profile.level)}>
                            {profile.level}
                          </Badge>
                        </div>
                        <p className="text-gray-600">{profile.bio}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {profile.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Joined {new Date(profile.joinDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant={isEditing ? "ghost" : "outline"}
                      onClick={isEditing ? handleCancel : handleEdit}
                    >
                      {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                  </div>

                  {/* Edit Form */}
                  {isEditing ? (
                    <div className="space-y-4 border-t pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={editForm.name || ''}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editForm.email || ''}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={editForm.phone || ''}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={editForm.location || ''}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                          id="bio"
                          value={editForm.bio || ''}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          rows={3}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-purple-600">
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Profile Info */
                    <div className="space-y-4 border-t pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{profile.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">{profile.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Activity Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Activity Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {getActivityStats().map((stat, index) => (
                      <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className={`${stat.color} mb-2 flex justify-center`}>
                          {stat.icon}
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <Trophy className="h-8 w-8 text-yellow-600" />
                      <div className="flex-1">
                        <p className="font-medium">Gold Explorer</p>
                        <p className="text-sm text-gray-600">Reached 1500 points</p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Plane className="h-8 w-8 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium">Frequent Flyer</p>
                        <p className="text-sm text-gray-600">Booked 10+ flights</p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Mountain className="h-8 w-8 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium">Adventure Seeker</p>
                        <p className="text-sm text-gray-600">Completed 5+ adventures</p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Points & Level */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Rewards & Points
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
                    <p className="text-sm opacity-90">Total Points</p>
                    <p className="text-3xl font-bold">{profile.points.toLocaleString()}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{profile.totalTrips}</p>
                      <p className="text-sm text-gray-600">Total Trips</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">₹{(profile.totalSpent / 1000).toFixed(0)}k</p>
                      <p className="text-sm text-gray-600">Total Spent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive booking updates</p>
                    </div>
                    <button
                      onClick={() => handleInputChange('notifications', !profile.preferences.notifications)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        profile.preferences.notifications ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        profile.preferences.notifications ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Newsletter</p>
                      <p className="text-sm text-gray-600">Travel deals and tips</p>
                    </div>
                    <button
                      onClick={() => handleInputChange('newsletter', !profile.preferences.newsletter)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        profile.preferences.newsletter ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        profile.preferences.newsletter ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Public Profile</p>
                      <p className="text-sm text-gray-600">Visible to other travelers</p>
                    </div>
                    <button
                      onClick={() => handleInputChange('publicProfile', !profile.preferences.publicProfile)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        profile.preferences.publicProfile ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        profile.preferences.publicProfile ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Heart className="h-4 w-4 mr-2" />
                    View Wishlist
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="h-4 w-4 mr-2" />
                    Booking History
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Award className="h-4 w-4 mr-2" />
                    All Rewards
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthCheck>
  )
}
