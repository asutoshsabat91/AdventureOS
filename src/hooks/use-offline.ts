import { useState, useEffect, useCallback } from 'react'
import { offlineStorage, OfflineItinerary, OfflineChatMessage } from '@/lib/offline-storage'

export interface OfflineStatus {
  isOnline: boolean
  isOffline: boolean
  connectionType: string
  effectiveType: string
}

export interface SyncStatus {
  pendingItineraries: number
  pendingMessages: number
  lastSyncTime: string | null
  isSyncing: boolean
  syncErrors: string[]
}

export function useOffline() {
  const [offlineStatus, setOfflineStatus] = useState<OfflineStatus>({
    isOnline: true,
    isOffline: false,
    connectionType: 'unknown',
    effectiveType: 'unknown'
  })

  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    pendingItineraries: 0,
    pendingMessages: 0,
    lastSyncTime: null,
    isSyncing: false,
    syncErrors: []
  })

  const [isDbInitialized, setIsDbInitialized] = useState(false)

  // Initialize database
  useEffect(() => {
    const initializeDb = async () => {
      try {
        await offlineStorage.init()
        setIsDbInitialized(true)
      } catch (error) {
        console.error('Failed to initialize offline storage:', error)
        setIsDbInitialized(false)
      }
    }

    initializeDb()
  }, [])

  // Update online/offline status
  useEffect(() => {
    const updateOnlineStatus = () => {
      const isOnline = navigator.onLine
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

      setOfflineStatus({
        isOnline,
        isOffline: !isOnline,
        connectionType: connection?.type || 'unknown',
        effectiveType: connection?.effectiveType || 'unknown'
      })

      // Trigger sync when coming back online
      if (isOnline && syncStatus.pendingItineraries > 0) {
        syncPendingData()
      }
    }

    const handleOnline = () => {
      console.log('App is back online')
      updateOnlineStatus()
    }

    const handleOffline = () => {
      console.log('App is offline')
      updateOnlineStatus()
    }

    // Initial status
    updateOnlineStatus()

    // Listen for connection changes
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Listen for connection type changes (if supported)
    const connection = (navigator as any).connection
    if (connection) {
      connection.addEventListener('change', updateOnlineStatus)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      if (connection) {
        connection.removeEventListener('change', updateOnlineStatus)
      }
    }
  }, [syncStatus.pendingItineraries])

  // Update sync status periodically
  useEffect(() => {
    const updateSyncStatus = async () => {
      if (!isDbInitialized) {
        return
      }

      try {
        const pendingItineraries = await offlineStorage.getPendingItineraries()
        const pendingMessages = await offlineStorage.getPendingChatMessages()
        const lastSyncTime = await offlineStorage.getSetting('last_sync_time', null)

        setSyncStatus(prev => ({
          ...prev,
          pendingItineraries: pendingItineraries.length,
          pendingMessages: pendingMessages.length,
          lastSyncTime
        }))
      } catch (error) {
        console.error('Failed to update sync status:', error)
      }
    }

    updateSyncStatus()
    const interval = setInterval(updateSyncStatus, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [isDbInitialized])

  // Sync pending data
  const syncPendingData = useCallback(async () => {
    if (!offlineStatus.isOnline || syncStatus.isSyncing || !isDbInitialized) {
      return
    }

    setSyncStatus(prev => ({ ...prev, isSyncing: true, syncErrors: [] }))

    try {
      // Sync itineraries
      const pendingItineraries = await offlineStorage.getPendingItineraries()
      for (const itinerary of pendingItineraries) {
        try {
          const response = await fetch('/api/sync-itinerary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itinerary)
          })

          if (response.ok) {
            await offlineStorage.saveItinerary({
              ...itinerary,
              status: 'synced',
              last_sync_attempt: new Date().toISOString()
            })
            console.log('Synced itinerary:', itinerary.id)
          } else {
            throw new Error(`Sync failed: ${response.statusText}`)
          }
        } catch (error) {
          console.error('Failed to sync itinerary:', error)
          setSyncStatus(prev => ({
            ...prev,
            syncErrors: [...prev.syncErrors, `Failed to sync itinerary ${itinerary.id}`]
          }))
        }
      }

      // Sync chat messages
      const pendingMessages = await offlineStorage.getPendingChatMessages()
      for (const message of pendingMessages) {
        try {
          const response = await fetch('/api/chat/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
          })

          if (response.ok) {
            await offlineStorage.markMessageAsSent(message.id)
            console.log('Synced message:', message.id)
          } else {
            throw new Error(`Message sync failed: ${response.statusText}`)
          }
        } catch (error) {
          console.error('Failed to sync message:', error)
          setSyncStatus(prev => ({
            ...prev,
            syncErrors: [...prev.syncErrors, `Failed to sync message ${message.id}`]
          }))
        }
      }

      // Update last sync time
      await offlineStorage.saveSetting('last_sync_time', new Date().toISOString())
      setSyncStatus(prev => ({ ...prev, lastSyncTime: new Date().toISOString() }))

    } catch (error) {
      console.error('Sync failed:', error)
      setSyncStatus(prev => ({
        ...prev,
        syncErrors: [...prev.syncErrors, 'Sync process failed']
      }))
    } finally {
      setSyncStatus(prev => ({ ...prev, isSyncing: false }))
    }
  }, [offlineStatus.isOnline, syncStatus.isSyncing, isDbInitialized])

  // Save itinerary offline
  const saveItineraryOffline = useCallback(async (itinerary: Omit<OfflineItinerary, 'id' | 'created_at' | 'updated_at'>) => {
    if (!isDbInitialized) {
      console.warn('Database not initialized, cannot save itinerary offline')
      return null
    }

    try {
      const offlineItinerary: OfflineItinerary = {
        ...itinerary,
        id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      await offlineStorage.saveItinerary(offlineItinerary)
      
      // Update sync status
      setSyncStatus(prev => ({
        ...prev,
        pendingItineraries: prev.pendingItineraries + 1
      }))

      console.log('Itinerary saved offline:', offlineItinerary.id)
      return offlineItinerary
    } catch (error) {
      console.error('Failed to save itinerary offline:', error)
      throw error
    }
  }, [isDbInitialized])

  // Save chat message offline
  const saveChatMessageOffline = useCallback(async (message: Omit<OfflineChatMessage, 'id' | 'created_at' | 'status' | 'retry_count'>) => {
    if (!isDbInitialized) {
      console.warn('Database not initialized, cannot save chat message offline')
      return null
    }

    try {
      const offlineMessage: OfflineChatMessage = {
        ...message,
        id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString(),
        status: 'pending',
        retry_count: 0
      }

      await offlineStorage.saveChatMessage(offlineMessage)
      
      // Update sync status
      setSyncStatus(prev => ({
        ...prev,
        pendingMessages: prev.pendingMessages + 1
      }))

      console.log('Chat message saved offline:', offlineMessage.id)
      return offlineMessage
    } catch (error) {
      console.error('Failed to save chat message offline:', error)
      throw error
    }
  }, [isDbInitialized])

  // Get cached API response
  const getCachedResponse = useCallback(async (url: string) => {
    if (!isDbInitialized) {
      return null
    }

    try {
      return await offlineStorage.getCachedAPIResponse(url)
    } catch (error) {
      console.error('Failed to get cached response:', error)
      return null
    }
  }, [isDbInitialized])

  // Cache API response
  const cacheResponse = useCallback(async (url: string, data: any, ttlMinutes: number = 5) => {
    if (!isDbInitialized) {
      console.warn('Database not initialized, cannot cache response')
      return
    }

    try {
      await offlineStorage.cacheAPIResponse(url, data, ttlMinutes)
      console.log('Response cached:', url)
    } catch (error) {
      console.error('Failed to cache response:', error)
    }
  }, [isDbInitialized])

  // Clear expired cache
  const clearExpiredCache = useCallback(async () => {
    if (!isDbInitialized) {
      console.warn('Database not initialized, cannot clear expired cache')
      return
    }

    try {
      await offlineStorage.clearExpiredCache()
      console.log('Expired cache cleared')
    } catch (error) {
      console.error('Failed to clear expired cache:', error)
    }
  }, [isDbInitialized])

  // Get storage statistics
  const getStorageStats = useCallback(async () => {
    if (!isDbInitialized) {
      return {
        itineraries: 0,
        chat_messages: 0,
        api_cache: 0,
        estimatedSize: 'Unknown'
      }
    }

    try {
      return await offlineStorage.getStorageStats()
    } catch (error) {
      console.error('Failed to get storage stats:', error)
      return {
        itineraries: 0,
        chat_messages: 0,
        api_cache: 0,
        estimatedSize: 'Unknown'
      }
    }
  }, [isDbInitialized])

  return {
    // Status
    offlineStatus,
    syncStatus,
    
    // Actions
    syncPendingData,
    saveItineraryOffline,
    saveChatMessageOffline,
    getCachedResponse,
    cacheResponse,
    clearExpiredCache,
    getStorageStats,
    
    // Computed values
    hasPendingData: syncStatus.pendingItineraries > 0 || syncStatus.pendingMessages > 0,
    needsSync: offlineStatus.isOnline && syncStatus.pendingItineraries > 0
  }
}
