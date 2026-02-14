'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useOffline } from '@/hooks/use-offline'
import { 
  Wifi, 
  WifiOff, 
  Cloud, 
  CloudOff, 
  RefreshCw, 
  Database, 
  MessageSquare, 
  MapPin,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

export function OfflineStatus() {
  const [showDetails, setShowDetails] = useState(false)
  const [storageStats, setStorageStats] = useState<any>(null)
  
  const {
    offlineStatus,
    syncStatus,
    syncPendingData,
    hasPendingData,
    needsSync,
    getStorageStats,
    clearExpiredCache
  } = useOffline()

  // Load storage stats when showing details
  useEffect(() => {
    if (showDetails) {
      getStorageStats().then(setStorageStats)
    }
  }, [showDetails, getStorageStats])

  const getStatusColor = () => {
    if (!offlineStatus.isOnline) return 'text-red-600'
    if (syncStatus.isSyncing) return 'text-yellow-600'
    if (hasPendingData) return 'text-orange-600'
    return 'text-green-600'
  }

  const getStatusIcon = () => {
    if (!offlineStatus.isOnline) return <WifiOff className="h-4 w-4" />
    if (syncStatus.isSyncing) return <RefreshCw className="h-4 w-4 animate-spin" />
    if (hasPendingData) return <Cloud className="h-4 w-4" />
    return <Wifi className="h-4 w-4" />
  }

  const getStatusText = () => {
    if (!offlineStatus.isOnline) return 'Offline'
    if (syncStatus.isSyncing) return 'Syncing...'
    if (hasPendingData) return 'Pending Sync'
    return 'Online'
  }

  const getConnectionTypeText = () => {
    if (offlineStatus.connectionType === 'wifi') return 'WiFi'
    if (offlineStatus.connectionType === 'cellular') return 'Mobile'
    if (offlineStatus.connectionType === 'ethernet') return 'Ethernet'
    return 'Unknown'
  }

  const formatLastSync = (timestamp: string | null) => {
    if (!timestamp) return 'Never'
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return `${Math.floor(diffMins / 1440)}d ago`
  }

  const handleClearCache = async () => {
    await clearExpiredCache()
    if (storageStats) {
      setStorageStats({ ...storageStats, api_cache: 0 })
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`w-80 shadow-lg border-2 ${
        !offlineStatus.isOnline ? 'border-red-200 bg-red-50' : 
        hasPendingData ? 'border-orange-200 bg-orange-50' : 
        'border-green-200 bg-green-50'
      }`}>
        <CardContent className="p-4">
          {/* Main Status */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={getStatusColor()}>
                {getStatusIcon()}
              </div>
              <span className={`font-medium ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {offlineStatus.isOnline && hasPendingData && (
                <Badge variant="outline" className="text-xs">
                  {syncStatus.pendingItineraries + syncStatus.pendingMessages} pending
                </Badge>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Hide' : 'Details'}
              </Button>
            </div>
          </div>

          {/* Connection Info */}
          <div className="text-xs text-gray-600 mb-2">
            {offlineStatus.isOnline ? (
              <div className="flex items-center gap-2">
                <span>Connection: {getConnectionTypeText()}</span>
                {offlineStatus.effectiveType !== 'unknown' && (
                  <span>• {offlineStatus.effectiveType}</span>
                )}
              </div>
            ) : (
              <span>No internet connection</span>
            )}
          </div>

          {/* Sync Progress */}
          {syncStatus.isSyncing && (
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Syncing data...</span>
                <span>{syncStatus.pendingItineraries + syncStatus.pendingMessages} items</span>
              </div>
              <Progress value={75} className="h-1" />
            </div>
          )}

          {/* Sync Button */}
          {offlineStatus.isOnline && hasPendingData && !syncStatus.isSyncing && (
            <Button
              onClick={syncPendingData}
              size="sm"
              className="w-full mb-2"
              disabled={syncStatus.isSyncing}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Sync Now
            </Button>
          )}

          {/* Error Messages */}
          {syncStatus.syncErrors.length > 0 && (
            <div className="mb-2 p-2 bg-red-100 rounded text-xs">
              <div className="flex items-center gap-1 text-red-700 mb-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Sync Errors</span>
              </div>
              {syncStatus.syncErrors.slice(0, 2).map((error, index) => (
                <div key={index} className="text-red-600 truncate">
                  {error}
                </div>
              ))}
              {syncStatus.syncErrors.length > 2 && (
                <div className="text-red-600">
                  +{syncStatus.syncErrors.length - 2} more errors
                </div>
              )}
            </div>
          )}

          {/* Detailed Information */}
          {showDetails && (
            <div className="border-t pt-3 mt-3 space-y-3">
              {/* Sync Status */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium">Sync Status</span>
                  <span>{formatLastSync(syncStatus.lastSyncTime)}</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>Itineraries</span>
                    </div>
                    <Badge variant={syncStatus.pendingItineraries > 0 ? 'destructive' : 'secondary'} className="text-xs">
                      {syncStatus.pendingItineraries}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      <span>Messages</span>
                    </div>
                    <Badge variant={syncStatus.pendingMessages > 0 ? 'destructive' : 'secondary'} className="text-xs">
                      {syncStatus.pendingMessages}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Storage Stats */}
              {storageStats && (
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium">Storage</span>
                    <Button
                      onClick={handleClearCache}
                      variant="outline"
                      size="sm"
                      className="text-xs h-6"
                    >
                      Clear Cache
                    </Button>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Database className="h-3 w-3" />
                        <span>Itineraries</span>
                      </div>
                      <span>{storageStats.itineraries}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>Messages</span>
                      </div>
                      <span>{storageStats.chat_messages}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Cloud className="h-3 w-3" />
                        <span>API Cache</span>
                      </div>
                      <span>{storageStats.api_cache}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Offline Features */}
              <div>
                <div className="font-medium text-xs mb-1">Offline Features</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>View saved itineraries</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Browse cached content</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {offlineStatus.isOnline ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-orange-600" />
                    )}
                    <span>Real-time chat {offlineStatus.isOnline ? 'available' : 'unavailable'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
