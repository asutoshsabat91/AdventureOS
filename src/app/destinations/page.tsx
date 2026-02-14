'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Navigation from '@/components/navigation'
import { ArrowLeft, Globe } from 'lucide-react'
import DestinationPreview from '@/components/destination-preview'

export default function DestinationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activePage="destinations" />

      {/* Main Content */}
      <main>
        <DestinationPreview />
      </main>
    </div>
  )
}
