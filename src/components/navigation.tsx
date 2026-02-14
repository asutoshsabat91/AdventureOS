'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Plane,
  Hotel,
  Mountain,
  Users,
  Globe,
  TrendingUp,
  Trophy,
  Sparkles,
  Heart,
  CreditCard,
  MessageCircle
} from 'lucide-react'

interface NavigationProps {
  activePage?: string
}

export default function Navigation({ activePage = 'dashboard' }: NavigationProps) {
  const router = useRouter()
  
  const handleWishlist = () => {
    router.push('/wishlist')
  }

  const handleProfile = () => {
    router.push('/profile')
  }
  const navItems = [
    { 
      href: '/flights', 
      label: 'Flights', 
      icon: Plane,
      id: 'flights'
    },
    { 
      href: '/hotels', 
      label: 'Hotels', 
      icon: Hotel,
      id: 'hotels'
    },
    { 
      href: '/adventures', 
      label: 'Adventures', 
      icon: Mountain,
      id: 'adventures'
    },
    { 
      href: '/community', 
      label: 'Community', 
      icon: Users,
      id: 'community'
    },
    { 
      href: '/destinations', 
      label: 'Destinations', 
      icon: Globe,
      id: 'destinations'
    },
    { 
      href: '/price-tracker', 
      label: 'Price Tracker', 
      icon: TrendingUp,
      id: 'price-tracker'
    },
    { 
      href: '/rewards', 
      label: 'Rewards', 
      icon: Trophy,
      id: 'rewards'
    },
    { 
      href: '/unified', 
      label: 'Unified View', 
      icon: Sparkles,
      id: 'unified'
    },
    { 
      href: '/payment', 
      label: 'Payment', 
      icon: CreditCard,
      id: 'payment'
    },
    { 
      href: '/chat', 
      label: 'Chat', 
      icon: MessageCircle,
      id: 'chat'
    }
  ]

  const getNavClassName = (itemId: string) => {
    const isActive = activePage === itemId
    if (isActive) {
      if (['destinations', 'price-tracker', 'rewards', 'unified', 'payment', 'chat'].includes(itemId)) {
        return 'flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium'
      }
      return 'flex items-center gap-1 text-blue-600 font-medium'
    }
    if (['destinations', 'price-tracker', 'rewards', 'unified', 'payment', 'chat'].includes(itemId)) {
      return 'flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium'
    }
    return 'flex items-center gap-1 text-gray-700 hover:text-blue-600'
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4 lg:gap-8">
            <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Mountain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold hidden sm:block">AdventureOS</span>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6 overflow-x-auto">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.id} href={item.href} className={getNavClassName(item.id)}>
                    <Icon className="h-4 w-4" />
                    <span className="hidden xl:inline">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="ghost" size="sm" onClick={handleWishlist} className="hidden sm:flex">
              <Heart className="h-4 w-4" />
              <span className="hidden lg:inline ml-1">Wishlist</span>
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600" 
              size="sm"
              onClick={handleProfile}
            >
              <Users className="h-4 w-4" />
              <span className="hidden lg:inline ml-1">Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
