'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Navigation from '@/components/navigation'
import { ArrowLeft, BarChart3 } from 'lucide-react'
import PriceTracker from '@/components/price-tracker'

export default function PriceTrackerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activePage="price-tracker" />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <PriceTracker />
      </main>
    </div>
  )
}
