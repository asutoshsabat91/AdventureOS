'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { travelBuddyMatcher, TravelBuddyMatch, MatchingCriteria } from '@/lib/travel-buddy-matcher'
import { useChatStore } from '@/store/chat-store'
import { Search, Users, MapPin, Calendar, Shield, Star, MessageCircle } from 'lucide-react'

const adventurePreferences = [
  'Hiking & Trekking',
  'Mountain Climbing', 
  'Rock Climbing',
  'Skiing & Snowboarding',
  'Skydiving',
  'Paragliding',
  'Surfing',
  'Scuba Diving',
  'Kayaking & Rafting',
  'Mountain Biking',
  'Camping',
  'Wildlife Safari',
  'Cultural Tours',
  'Photography',
  'Food & Cuisine',
  'Nightlife',
  'Beach Activities',
  'Water Sports'
]

export function TravelBuddyMatcher() {
  const [matches, setMatches] = useState<TravelBuddyMatch[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchMode, setSearchMode] = useState<'preferences' | 'destination'>('preferences')
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([])
  
  const [criteria, setCriteria] = useState<MatchingCriteria>({
    adventure_preferences: [],
    risk_tolerance: 'medium',
    fitness_level: 'beginner',
    min_verification_status: 'verified'
  })

  const { createChatRoom } = useChatStore()

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      // Mock user ID - in real app, this would come from auth
      const userId = 'current-user-id'
      
      let searchCriteria = { ...criteria }
      
      if (searchMode === 'preferences') {
        searchCriteria.adventure_preferences = selectedPreferences
      } else {
        // For destination search, we'd need a real destination
        searchCriteria.destination = 'Manali' // Example
      }

      const results = searchMode === 'preferences' 
        ? await travelBuddyMatcher.findTravelBuddies(userId, searchCriteria)
        : await travelBuddyMatcher.findUsersByDestination('Manali', userId)

      setMatches(results)
    } catch (error) {
      console.error('Error finding travel buddies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreferenceToggle = (preference: string) => {
    const updated = selectedPreferences.includes(preference)
      ? selectedPreferences.filter(p => p !== preference)
      : [...selectedPreferences, preference]
    
    setSelectedPreferences(updated)
    setCriteria(prev => ({ ...prev, adventure_preferences: updated }))
  }

  const handleConnect = async (match: TravelBuddyMatch) => {
    try {
      await createChatRoom(
        `Travel Chat: ${match.user.full_name}`,
        'travel_buddy',
        [match.user.id]
      )
    } catch (error) {
      console.error('Error creating chat room:', error)
    }
  }

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const getVerificationBadge = (status: string, biometric: boolean) => {
    if (status === 'verified' && biometric) {
      return <Badge className="bg-green-100 text-green-800"><Shield className="h-3 w-3 mr-1" />Verified</Badge>
    }
    if (status === 'verified') {
      return <Badge variant="secondary"><Shield className="h-3 w-3 mr-1" />Verified</Badge>
    }
    return <Badge variant="outline">Unverified</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Search Criteria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Find Your Travel Buddy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Mode */}
          <div>
            <label className="text-sm font-medium mb-2 block">Search Mode</label>
            <Select value={searchMode} onValueChange={(value: any) => setSearchMode(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="preferences">By Adventure Preferences</SelectItem>
                <SelectItem value="destination">By Destination</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {searchMode === 'preferences' && (
            <>
              {/* Adventure Preferences */}
              <div>
                <label className="text-sm font-medium mb-2 block">Adventure Preferences</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {adventurePreferences.map((preference) => (
                    <Button
                      key={preference}
                      type="button"
                      variant={selectedPreferences.includes(preference) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePreferenceToggle(preference)}
                      className="justify-start text-xs h-8"
                    >
                      {preference}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Risk Tolerance and Fitness Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Risk Tolerance</label>
              <Select 
                value={criteria.risk_tolerance} 
                onValueChange={(value: any) => setCriteria(prev => ({ ...prev, risk_tolerance: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Fitness Level</label>
              <Select 
                value={criteria.fitness_level} 
                onValueChange={(value: any) => setCriteria(prev => ({ ...prev, fitness_level: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Verification Status */}
          <div>
            <label className="text-sm font-medium mb-2 block">Minimum Verification</label>
            <Select 
              value={criteria.min_verification_status} 
              onValueChange={(value: any) => setCriteria(prev => ({ ...prev, min_verification_status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Any Status</SelectItem>
                <SelectItem value="verified">Verified Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleSearch} 
            disabled={isLoading || (searchMode === 'preferences' && selectedPreferences.length === 0)}
            className="w-full"
          >
            <Search className="h-4 w-4 mr-2" />
            {isLoading ? 'Searching...' : 'Find Travel Buddies'}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {matches.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Found {matches.length} Travel Buddies</h3>
          
          {matches.map((match) => (
            <Card key={match.user.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={match.user.avatar_url || undefined} />
                      <AvatarFallback>
                        {match.user.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{match.user.full_name}</h4>
                        {getVerificationBadge(match.user.verification_status, match.user.biometric_verified)}
                        <div className={`flex items-center gap-1 text-sm font-medium ${getCompatibilityColor(match.compatibility_score)}`}>
                          <Star className="h-4 w-4" />
                          {match.compatibility_score}% Match
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div className="text-sm">
                          <span className="text-gray-500">Risk:</span>
                          <span className="ml-1 font-medium capitalize">{match.user.risk_tolerance}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Fitness:</span>
                          <span className="ml-1 font-medium capitalize">{match.user.fitness_level}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Preferences:</span>
                          <span className="ml-1 font-medium">{match.user.adventure_preferences.length}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Joined:</span>
                          <span className="ml-1 font-medium">
                            {new Date(match.user.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Compatibility Breakdown */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-24">Adventures</span>
                          <Progress value={match.matching_factors.adventure_preferences} className="flex-1 h-2" />
                          <span className="text-xs text-gray-500 w-8">{match.matching_factors.adventure_preferences}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-24">Risk Match</span>
                          <Progress value={match.matching_factors.risk_tolerance} className="flex-1 h-2" />
                          <span className="text-xs text-gray-500 w-8">{match.matching_factors.risk_tolerance}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-24">Fitness</span>
                          <Progress value={match.matching_factors.fitness_level} className="flex-1 h-2" />
                          <span className="text-xs text-gray-500 w-8">{match.matching_factors.fitness_level}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-24">Verification</span>
                          <Progress value={match.matching_factors.verification_status} className="flex-1 h-2" />
                          <span className="text-xs text-gray-500 w-8">{match.matching_factors.verification_status}%</span>
                        </div>
                      </div>

                      {/* Overlapping Info */}
                      {match.overlapping_destinations && match.overlapping_destinations.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
                          <MapPin className="h-4 w-4" />
                          <span>Also going to: {match.overlapping_destinations.join(', ')}</span>
                        </div>
                      )}

                      {match.overlapping_dates && match.overlapping_dates.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-green-600 mb-2">
                          <Calendar className="h-4 w-4" />
                          <span>Overlapping dates available</span>
                        </div>
                      )}

                      {/* Shared Preferences */}
                      <div className="flex flex-wrap gap-1">
                        {match.user.adventure_preferences.slice(0, 5).map((pref) => (
                          <Badge key={pref} variant="outline" className="text-xs">
                            {pref}
                          </Badge>
                        ))}
                        {match.user.adventure_preferences.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{match.user.adventure_preferences.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleConnect(match)}
                    className="ml-4"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {matches.length === 0 && !isLoading && searchMode === 'preferences' && selectedPreferences.length > 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">No matches found</h3>
            <p className="text-gray-600">Try adjusting your search criteria to find more travel buddies.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
