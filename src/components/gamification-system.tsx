'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Trophy, 
  Star, 
  Award, 
  Target, 
  Zap, 
  Flame, 
  Compass,
  Camera,
  Heart,
  Users,
  MapPin,
  Calendar,
  TrendingUp,
  Crown,
  Gem,
  Medal,
  Rocket,
  Shield,
  Mountain,
  Waves,
  Bike,
  Plane,
  Hotel,
  Gift,
  Lock,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  category: 'exploration' | 'social' | 'booking' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  progress: number
  maxProgress: number
  unlocked: boolean
  points: number
  reward?: string
}

interface UserLevel {
  level: number
  title: string
  points: number
  nextLevelPoints: number
  perks: string[]
}

interface Challenge {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  progress: number
  maxProgress: number
  reward: string
  deadline: string
  completed: boolean
}

export default function GamificationSystem() {
  const [userLevel, setUserLevel] = useState<UserLevel>({
    level: 12,
    title: 'Adventure Expert',
    points: 2450,
    nextLevelPoints: 3000,
    perks: ['5% booking discount', 'Priority support', 'Exclusive deals']
  })

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'First Adventure',
      description: 'Book your first adventure',
      icon: <Mountain className="h-6 w-6" />,
      category: 'booking',
      rarity: 'common',
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      points: 50,
      reward: '₹500 booking credit'
    },
    {
      id: '2',
      title: 'Globetrotter',
      description: 'Visit 5 different countries',
      icon: <Plane className="h-6 w-6" />,
      category: 'exploration',
      rarity: 'rare',
      progress: 3,
      maxProgress: 5,
      unlocked: false,
      points: 200,
      reward: 'Free travel insurance'
    },
    {
      id: '3',
      title: 'Social Butterfly',
      description: 'Connect with 20 travel buddies',
      icon: <Users className="h-6 w-6" />,
      category: 'social',
      rarity: 'rare',
      progress: 12,
      maxProgress: 20,
      unlocked: false,
      points: 150,
      reward: 'Premium community features'
    },
    {
      id: '4',
      title: 'Adventure Seeker',
      description: 'Complete 10 adventures',
      icon: <Compass className="h-6 w-6" />,
      category: 'exploration',
      rarity: 'epic',
      progress: 7,
      maxProgress: 10,
      unlocked: false,
      points: 300,
      reward: 'Exclusive adventure packages'
    },
    {
      id: '5',
      title: 'Superhost',
      description: 'Host 5 group trips',
      icon: <Crown className="h-6 w-6" />,
      category: 'social',
      rarity: 'epic',
      progress: 2,
      maxProgress: 5,
      unlocked: false,
      points: 400,
      reward: 'Host commission bonus'
    },
    {
      id: '6',
      title: 'Legend of Travel',
      description: 'Complete 50 adventures across 3 continents',
      icon: <Trophy className="h-6 w-6" />,
      category: 'special',
      rarity: 'legendary',
      progress: 23,
      maxProgress: 50,
      unlocked: false,
      points: 1000,
      reward: 'Lifetime VIP status'
    }
  ])

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Weekend Warrior',
      description: 'Book any adventure for this weekend',
      icon: <Calendar className="h-5 w-5" />,
      progress: 0,
      maxProgress: 1,
      reward: '₹1000 bonus points',
      deadline: '2 days left',
      completed: false
    },
    {
      id: '2',
      title: 'Social Connector',
      description: 'Join 3 travel groups',
      icon: <Users className="h-5 w-5" />,
      progress: 1,
      maxProgress: 3,
      reward: 'Exclusive group access',
      deadline: '5 days left',
      completed: false
    },
    {
      id: '3',
      title: 'Deal Hunter',
      description: 'Book using 3 different discount codes',
      icon: <Gift className="h-5 w-5" />,
      progress: 1,
      maxProgress: 3,
      reward: 'Mystery reward',
      deadline: '1 week left',
      completed: false
    }
  ])

  const [streak, setStreak] = useState({
    current: 7,
    longest: 23,
    thisMonth: 15
  })

  const [leaderboard] = useState([
    { rank: 1, name: 'AdventureKing', points: 5420, badge: '👑' },
    { rank: 2, name: 'TravelGuru', points: 4890, badge: '🏆' },
    { rank: 3, name: 'ExplorerPro', points: 4560, badge: '🥉' },
    { rank: 4, name: 'You', points: 2450, badge: '⭐' },
    { rank: 5, name: 'Wanderlust', points: 2340, badge: '🌟' }
  ])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'legendary': return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-300'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300'
      case 'rare': return 'border-blue-400'
      case 'epic': return 'border-purple-400'
      case 'legendary': return 'border-gradient-to-r from-yellow-400 to-orange-400'
      default: return 'border-gray-300'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'exploration': return <Compass className="h-4 w-4" />
      case 'social': return <Users className="h-4 w-4" />
      case 'booking': return <Calendar className="h-4 w-4" />
      case 'special': return <Star className="h-4 w-4" />
      default: return <Award className="h-4 w-4" />
    }
  }

  const levelProgress = (userLevel.points / userLevel.nextLevelPoints) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
            Adventure Rewards & Achievements
          </h1>
          <p className="text-gray-600">Level up your travel game and unlock exclusive rewards!</p>
        </div>

        {/* User Level & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Crown className="h-8 w-8" />
                <Badge className="bg-white/20 text-white">Level {userLevel.level}</Badge>
              </div>
              <h3 className="text-xl font-bold mb-1">{userLevel.title}</h3>
              <p className="text-sm opacity-90 mb-4">{userLevel.points} / {userLevel.nextLevelPoints} XP</p>
              <Progress value={levelProgress} className="bg-white/30" />
              <p className="text-xs mt-2 opacity-75">{Math.round(levelProgress)}% to next level</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Flame className="h-8 w-8" />
                <Badge className="bg-white/20 text-white">{streak.current} days</Badge>
              </div>
              <h3 className="text-xl font-bold mb-1">Current Streak</h3>
              <p className="text-sm opacity-90 mb-2">Keep the adventure going!</p>
              <div className="flex items-center gap-2 text-xs">
                <span>Longest: {streak.longest} days</span>
                <span>•</span>
                <span>This month: {streak.thisMonth}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Trophy className="h-8 w-8" />
                <Badge className="bg-white/20 text-white">#{leaderboard.find(u => u.name === 'You')?.rank}</Badge>
              </div>
              <h3 className="text-xl font-bold mb-1">Global Rank</h3>
              <p className="text-sm opacity-90 mb-2">Top {Math.round((leaderboard.find(u => u.name === 'You')?.rank || 1) / leaderboard.length * 100)}%</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-300 text-yellow-300" />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Gift className="h-8 w-8" />
                <Badge className="bg-white/20 text-white">3 Available</Badge>
              </div>
              <h3 className="text-xl font-bold mb-1">Rewards</h3>
              <p className="text-sm opacity-90 mb-2">Redeem your points</p>
              <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white">
                View Rewards
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6 text-purple-600" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`relative overflow-hidden transition-all hover:shadow-lg ${
                    achievement.unlocked ? '' : 'opacity-75'
                  } ${getRarityBorder(achievement.rarity)}`}
                >
                  {!achievement.unlocked && (
                    <div className="absolute inset-0 bg-black/20 z-10 flex items-center justify-center">
                      <Lock className="h-8 w-8 text-white/70" />
                    </div>
                  )}
                  
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${achievement.unlocked ? 'bg-purple-100' : 'bg-gray-100'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{achievement.title}</h4>
                          <Badge className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                          </div>
                          <Progress 
                            value={(achievement.progress / achievement.maxProgress) * 100} 
                            className="h-2"
                          />
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs font-medium">{achievement.points} pts</span>
                          </div>
                          {achievement.reward && (
                            <Badge variant="outline" className="text-xs">
                              {achievement.reward}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {achievement.unlocked && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Challenges & Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Challenges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-orange-600" />
                Active Challenges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      {challenge.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{challenge.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>Progress</span>
                          <span>{challenge.progress}/{challenge.maxProgress}</span>
                        </div>
                        <Progress 
                          value={(challenge.progress / challenge.maxProgress) * 100} 
                          className="h-2"
                        />
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 text-xs text-red-600">
                          <Clock className="h-3 w-3" />
                          <span>{challenge.deadline}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {challenge.reward}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-600" />
                Global Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((user) => (
                  <div 
                    key={user.rank} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      user.name === 'You' ? 'bg-purple-50 border border-purple-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        user.rank === 1 ? 'bg-yellow-500 text-white' :
                        user.rank === 2 ? 'bg-gray-400 text-white' :
                        user.rank === 3 ? 'bg-orange-600 text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {user.rank}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{user.badge}</span>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-600">{user.points.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">points</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                View Full Leaderboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Perks Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gem className="h-6 w-6 text-purple-600" />
              Your Current Perks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {userLevel.perks.map((perk, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">{perk}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-yellow-800">Next Level Perks</h4>
                  <p className="text-sm text-yellow-700">Unlock 10% booking discount and more!</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-yellow-600">550 XP to go</p>
                  <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                    Keep Exploring
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
