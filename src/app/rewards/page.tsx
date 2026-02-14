'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Navigation from '@/components/navigation'
import { ArrowLeft, Trophy } from 'lucide-react'
import GamificationSystem from '@/components/gamification-system'

export default function RewardsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activePage="rewards" />

      {/* Main Content */}
      <main>
        <GamificationSystem />
      </main>
    </div>
  )
}
