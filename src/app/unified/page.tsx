'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, LayoutGrid, Sparkles } from 'lucide-react'
import Navigation from '@/components/navigation'
import UnifiedTabs from '@/components/unified-tabs'

export default function UnifiedPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activePage="unified" />

      {/* Main Content */}
      <main>
        <UnifiedTabs />
      </main>
    </div>
  )
}
