import { supabase } from '@/lib/supabase'

export interface TravelBuddyProfile {
  id: string
  full_name: string
  avatar_url: string | null
  verification_status: 'pending' | 'verified' | 'rejected'
  biometric_verified: boolean
  risk_tolerance: 'low' | 'medium' | 'high'
  fitness_level: 'beginner' | 'intermediate' | 'advanced'
  adventure_preferences: string[]
  emergency_contacts: any
  created_at: string
  updated_at: string
}

export interface TravelBuddyMatch {
  user: TravelBuddyProfile
  compatibility_score: number
  matching_factors: {
    adventure_preferences: number
    risk_tolerance: number
    fitness_level: number
    verification_status: number
  }
  overlapping_destinations?: string[]
  overlapping_dates?: {
    start_date: string
    end_date: string
  }[]
}

export interface MatchingCriteria {
  destination?: string
  start_date?: string
  end_date?: string
  adventure_preferences: string[]
  risk_tolerance: 'low' | 'medium' | 'high'
  fitness_level: 'beginner' | 'intermediate' | 'advanced'
  min_verification_status?: 'pending' | 'verified' | 'rejected'
}

class TravelBuddyMatcher {
  // Calculate compatibility score between two users (0-100)
  private calculateCompatibilityScore(
    user1: TravelBuddyProfile,
    user2: TravelBuddyProfile,
    criteria: MatchingCriteria
  ): Omit<TravelBuddyMatch, 'user'> {
    let adventurePreferencesScore = 0
    let riskToleranceScore = 0
    let fitnessLevelScore = 0
    let verificationStatusScore = 0

    // Adventure preferences matching (40% weight)
    const user1Preferences = new Set(user1.adventure_preferences)
    const user2Preferences = new Set(user2.adventure_preferences)
    const criteriaPreferences = new Set(criteria.adventure_preferences)
    
    const intersection = new Set([...user1Preferences].filter(x => user2Preferences.has(x)))
    const union = new Set([...user1Preferences, ...user2Preferences])
    
    // Jaccard similarity for preferences
    const preferencesSimilarity = union.size > 0 ? intersection.size / union.size : 0
    
    // Boost score if both match criteria preferences
    const criteriaMatch = [...criteriaPreferences].filter(pref => 
      user1Preferences.has(pref) && user2Preferences.has(pref)
    ).length
    
    const criteriaBoost = criteriaPreferences.size > 0 ? criteriaMatch / criteriaPreferences.size : 0
    adventurePreferencesScore = (preferencesSimilarity * 0.7 + criteriaBoost * 0.3) * 100

    // Risk tolerance matching (25% weight)
    const riskLevels = { low: 1, medium: 2, high: 3 }
    const user1RiskLevel = riskLevels[user1.risk_tolerance]
    const user2RiskLevel = riskLevels[user2.risk_tolerance]
    const criteriaRiskLevel = riskLevels[criteria.risk_tolerance]
    
    const riskDifference = Math.abs(user1RiskLevel - user2RiskLevel)
    const riskAlignment = Math.max(0, 1 - (riskDifference / 2)) // Normalize to 0-1
    
    // Boost if both match criteria risk tolerance
    const riskBonus = (user1RiskLevel === criteriaRiskLevel && user2RiskLevel === criteriaRiskLevel) ? 0.2 : 0
    riskToleranceScore = Math.min(100, (riskAlignment + riskBonus) * 100)

    // Fitness level matching (20% weight)
    const fitnessLevels = { beginner: 1, intermediate: 2, advanced: 3 }
    const user1FitnessLevel = fitnessLevels[user1.fitness_level]
    const user2FitnessLevel = fitnessLevels[user2.fitness_level]
    const criteriaFitnessLevel = fitnessLevels[criteria.fitness_level]
    
    const fitnessDifference = Math.abs(user1FitnessLevel - user2FitnessLevel)
    const fitnessAlignment = Math.max(0, 1 - (fitnessDifference / 2))
    
    // Boost if both match criteria fitness level
    const fitnessBonus = (user1FitnessLevel === criteriaFitnessLevel && user2FitnessLevel === criteriaFitnessLevel) ? 0.2 : 0
    fitnessLevelScore = Math.min(100, (fitnessAlignment + fitnessBonus) * 100)

    // Verification status matching (15% weight)
    const verificationScores = { pending: 0.3, verified: 1.0, rejected: 0.1 }
    const user1VerificationScore = verificationScores[user1.verification_status]
    const user2VerificationScore = verificationScores[user2.verification_status]
    
    // Bonus for biometric verification
    const biometricBonus1 = user1.biometric_verified ? 0.2 : 0
    const biometricBonus2 = user2.biometric_verified ? 0.2 : 0
    
    verificationStatusScore = ((user1VerificationScore + user2VerificationScore) / 2 + biometricBonus1 + biometricBonus2) * 100

    // Calculate weighted total score
    const totalScore = Math.round(
      adventurePreferencesScore * 0.4 +
      riskToleranceScore * 0.25 +
      fitnessLevelScore * 0.2 +
      verificationStatusScore * 0.15
    )

    return {
      compatibility_score: Math.min(100, totalScore),
      matching_factors: {
        adventure_preferences: Math.round(adventurePreferencesScore),
        risk_tolerance: Math.round(riskToleranceScore),
        fitness_level: Math.round(fitnessLevelScore),
        verification_status: Math.round(verificationStatusScore)
      }
    }
  }

  // Find potential travel buddies for a user
  async findTravelBuddies(
    userId: string,
    criteria: MatchingCriteria,
    limit: number = 20
  ): Promise<TravelBuddyMatch[]> {
    try {
      // Get the current user's profile
      const { data: currentUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (userError || !currentUser) {
        throw new Error('Failed to fetch user profile')
      }

      // Get potential matches (exclude current user)
      let query = supabase
        .from('users')
        .select('*')
        .neq('id', userId)

      // Filter by verification status if specified
      if (criteria.min_verification_status) {
        const statusOrder = { pending: 0, verified: 1, rejected: -1 }
        const minStatusValue = statusOrder[criteria.min_verification_status]
        
        if (minStatusValue >= 0) {
          query = query.in('verification_status', 
            minStatusValue === 1 ? ['verified'] : ['pending', 'verified']
          )
        }
      }

      const { data: potentialMatches, error: matchesError } = await query.limit(limit * 2) // Get more to allow for filtering

      if (matchesError) {
        throw new Error('Failed to fetch potential matches')
      }

      if (!potentialMatches || potentialMatches.length === 0) {
        return []
      }

      // Calculate compatibility scores
      const matches: TravelBuddyMatch[] = potentialMatches
        .map(user => ({
          user,
          ...this.calculateCompatibilityScore(currentUser, user, criteria)
        }))
        .filter(match => match.compatibility_score >= 30) // Minimum threshold
        .sort((a, b) => b.compatibility_score - a.compatibility_score)
        .slice(0, limit)

      // Add overlapping destinations and dates if available
      // This would require querying itineraries table
      // For now, we'll return the basic matches

      return matches
    } catch (error) {
      console.error('Error finding travel buddies:', error)
      throw error
    }
  }

  // Get users going to the same destination
  async findUsersByDestination(
    destination: string,
    userId: string,
    limit: number = 10
  ): Promise<TravelBuddyMatch[]> {
    try {
      // Find users with itineraries for the same destination
      const { data: itineraryUsers, error: itineraryError } = await supabase
        .from('itineraries')
        .select('user_id, destination, start_date, end_date')
        .ilike('destination', `%${destination}%`)
        .neq('user_id', userId)
        .limit(limit)

      if (itineraryError) {
        throw new Error('Failed to fetch itinerary users')
      }

      if (!itineraryUsers || itineraryUsers.length === 0) {
        return []
      }

      // Get full user profiles for these users
      const userIds = [...new Set(itineraryUsers.map(i => i.user_id))]
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .in('id', userIds)

      if (usersError || !users) {
        throw new Error('Failed to fetch user profiles')
      }

      // Get current user for comparison
      const { data: currentUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (!currentUser) {
        throw new Error('Current user not found')
      }

      // Calculate matches with destination preference
      const matches: TravelBuddyMatch[] = users.map(user => {
        const userItineraries = itineraryUsers.filter(i => i.user_id === user.id)
        const overlappingDates = userItineraries.map(itinerary => ({
          start_date: itinerary.start_date,
          end_date: itinerary.end_date
        }))

        const criteria: MatchingCriteria = {
          destination,
          adventure_preferences: currentUser.adventure_preferences,
          risk_tolerance: currentUser.risk_tolerance,
          fitness_level: currentUser.fitness_level
        }

        const compatibilityData = this.calculateCompatibilityScore(currentUser, user, criteria)

        return {
          user,
          ...compatibilityData,
          overlapping_destinations: [destination],
          overlapping_dates: overlappingDates
        }
      })

      return matches.sort((a, b) => b.compatibility_score - a.compatibility_score)
    } catch (error) {
      console.error('Error finding users by destination:', error)
      throw error
    }
  }
}

export const travelBuddyMatcher = new TravelBuddyMatcher()
