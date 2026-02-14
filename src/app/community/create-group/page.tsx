'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Navigation from '@/components/navigation'
import AuthCheck from '@/components/auth-check'
import { 
  Users,
  MapPin,
  Calendar,
  ArrowLeft,
  Plus,
  X,
  Camera,
  Globe,
  Lock,
  Settings,
  CheckCircle,
  AlertCircle,
  Star,
  Clock,
  TrendingUp,
  Heart,
  MessageSquare,
  Eye,
  EyeOff
} from 'lucide-react'

export default function CreateGroupPage() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [groupCreated, setGroupCreated] = useState(false)
  const [formData, setFormData] = useState({
    groupName: '',
    groupDescription: '',
    destination: '',
    activity: '',
    startDate: '',
    endDate: '',
    maxMembers: '10',
    groupType: 'public',
    tags: [] as string[],
    groupImage: ''
  })

  const [newTag, setNewTag] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  // Popular destinations and activities
  const popularDestinations = [
    'Manali', 'Goa', 'Rishikesh', 'Jaipur', 'Kerala', 'Leh-Ladakh',
    'Andaman', 'Rajasthan', 'Himalayas', 'Coorg', 'Munnar', 'Udaipur'
  ]

  const popularActivities = [
    'Trekking', 'Scuba Diving', 'Cycling', 'Photography', 'Camping',
    'Wildlife Safari', 'Rock Climbing', 'Kayaking', 'Paragliding', 'Cultural Tours'
  ]

  const suggestedTags = [
    'Adventure', 'Budget Travel', 'Luxury', 'Solo Travel', 'Group Travel',
    'Photography', 'Nature', 'Beach', 'Mountains', 'Wildlife',
    'Cultural', 'Food', 'Festival', 'Weekend Trip', 'Long Trip'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAddTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag]
      })
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const handleCreateGroup = async () => {
    if (!formData.groupName || !formData.groupDescription || !formData.destination || !formData.activity) {
      alert('Please fill in all required fields')
      return
    }

    setIsCreating(true)

    // Simulate group creation
    setTimeout(() => {
      const newGroup = {
        id: 'group_' + Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
        createdBy: 'current-user',
        members: 1,
        status: 'active'
      }

      // Store group in localStorage (in real app, this would be an API call)
      const existingGroups = JSON.parse(localStorage.getItem('communityGroups') || '[]')
      existingGroups.push(newGroup)
      localStorage.setItem('communityGroups', JSON.stringify(existingGroups))

      setIsCreating(false)
      setGroupCreated(true)
      setShowSuccess(true)

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/community')
      }, 2000)
    }, 2000)
  }

  if (showSuccess) {
    return (
      <AuthCheck>
        <div className="min-h-screen bg-gray-50">
          <Navigation activePage="community" />
          
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto">
              <Card className="shadow-xl border-0">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Group Created Successfully!</h1>
                  <p className="text-lg text-gray-600 mb-6">
                    Your adventure group "{formData.groupName}" is now live. Redirecting to community...
                  </p>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AuthCheck>
    )
  }

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <Navigation activePage="community" />
        
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Community
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Adventure Group</h1>
              <p className="text-gray-600">Bring together like-minded travelers for your next adventure</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Group Name *
                    </label>
                    <Input
                      name="groupName"
                      placeholder="e.g., Manali December Trekkers"
                      value={formData.groupName}
                      onChange={handleInputChange}
                      maxLength={50}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.groupName.length}/50 characters
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Group Description *
                    </label>
                    <textarea
                      name="groupDescription"
                      placeholder="Describe your group's purpose, what kind of adventures you're planning, and who should join..."
                      value={formData.groupDescription}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.groupDescription.length}/500 characters
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Group Image
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                        <Camera className="h-8 w-8 text-gray-400" />
                      </div>
                      <div>
                        <Button variant="outline" size="sm">
                          <Camera className="h-4 w-4 mr-2" />
                          Upload Image
                        </Button>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, PNG up to 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trip Details */}
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Trip Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Destination *
                      </label>
                      <Input
                        name="destination"
                        placeholder="e.g., Manali"
                        value={formData.destination}
                        onChange={handleInputChange}
                        list="destinations"
                      />
                      <datalist id="destinations">
                        {popularDestinations.map(dest => (
                          <option key={dest} value={dest} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Primary Activity *
                      </label>
                      <Input
                        name="activity"
                        placeholder="e.g., Trekking"
                        value={formData.activity}
                        onChange={handleInputChange}
                        list="activities"
                      />
                      <datalist id="activities">
                        {popularActivities.map(activity => (
                          <option key={activity} value={activity} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Start Date
                      </label>
                      <Input
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        End Date
                      </label>
                      <Input
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Maximum Members
                    </label>
                    <select
                      name="maxMembers"
                      value={formData.maxMembers}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="5">5 members</option>
                      <option value="10">10 members</option>
                      <option value="15">15 members</option>
                      <option value="20">20 members</option>
                      <option value="50">50 members</option>
                      <option value="100">100+ members</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Group Settings */}
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Group Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Group Type
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant={formData.groupType === 'public' ? 'default' : 'outline'}
                        onClick={() => setFormData({...formData, groupType: 'public'})}
                        className="h-20 flex-col"
                      >
                        <Globe className="h-6 w-6 mb-2" />
                        Public
                        <span className="text-xs">Anyone can join</span>
                      </Button>
                      <Button
                        variant={formData.groupType === 'private' ? 'default' : 'outline'}
                        onClick={() => setFormData({...formData, groupType: 'private'})}
                        className="h-20 flex-col"
                      >
                        <Lock className="h-6 w-6 mb-2" />
                        Private
                        <span className="text-xs">Approval required</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Add Tags (Max 10)
                    </label>
                    <div className="flex gap-2 mb-3">
                      <Input
                        placeholder="Type a tag and press Enter"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag(newTag)}
                        maxLength={20}
                      />
                      <Button 
                        onClick={() => handleAddTag(newTag)}
                        disabled={!newTag.trim() || formData.tags.length >= 10}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {formData.tags.map((tag, index) => (
                          <Badge key={index} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Suggested tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedTags.slice(0, 8).map((tag) => (
                          <Button
                            key={tag}
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddTag(tag)}
                            disabled={formData.tags.includes(tag)}
                            className="text-xs"
                          >
                            {tag}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">💡 Tips for Great Groups</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Be Specific</p>
                      <p className="text-xs text-gray-600">Clearly describe your group's purpose</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Add Good Photos</p>
                      <p className="text-xs text-gray-600">Visuals attract more members</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Set Clear Rules</p>
                      <p className="text-xs text-gray-600">Define group expectations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Be Active</p>
                      <p className="text-xs text-gray-600">Engage with members regularly</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Groups */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🔥 Popular Groups</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Manali Trekkers</p>
                      <p className="text-xs text-gray-600">245 members</p>
                    </div>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Goa Explorers</p>
                      <p className="text-xs text-gray-600">189 members</p>
                    </div>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Kerala Backwaters</p>
                      <p className="text-xs text-gray-600">156 members</p>
                    </div>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              {/* Safety Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🛡️ Safety Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600">Verify member identities before meeting</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600">Meet in public places initially</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600">Share trip details with family</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600">Follow local laws and regulations</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Create Button */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleCreateGroup}
              disabled={isCreating || !formData.groupName || !formData.groupDescription || !formData.destination || !formData.activity}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 text-lg font-semibold"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Group...
                </>
              ) : (
                <>
                  <Users className="h-5 w-5 mr-2" />
                  Create Adventure Group
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </AuthCheck>
  )
}
