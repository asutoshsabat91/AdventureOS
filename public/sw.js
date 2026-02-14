const CACHE_NAME = 'adventure-os-v1'
const STATIC_CACHE_NAME = 'adventure-os-static-v1'
const DYNAMIC_CACHE_NAME = 'adventure-os-dynamic-v1'
const ITINERARY_CACHE_NAME = 'adventure-os-itineraries-v1'

// Files to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/community',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

// API endpoints to cache for offline access
const CACHEABLE_APIS = [
  '/api/generate-itinerary',
  '/api/comprehensive-search'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== ITINERARY_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch event - handle requests with offline strategy
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleAPIRequest(request))
    return
  }

  // Handle static assets
  if (STATIC_ASSETS.some(asset => url.pathname === asset || url.pathname.startsWith('/static/'))) {
    event.respondWith(handleStaticRequest(request))
    return
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request))
    return
  }

  // Handle other requests with cache-first strategy
  event.respondWith(
    caches.match(request)
      .then((response) => {
        return response || fetch(request)
      })
  )
})

// Handle API requests with cache-first strategy for GET, network-first for POST
async function handleAPIRequest(request) {
  const url = new URL(request.url)
  
  // Cache GET requests
  if (request.method === 'GET' && CACHEABLE_APIS.some(api => url.pathname === api)) {
    try {
      // Try network first for fresh data
      const networkResponse = await fetch(request)
      
      if (networkResponse.ok) {
        // Cache the response
        const cache = await caches.open(DYNAMIC_CACHE_NAME)
        cache.put(request, networkResponse.clone())
        return networkResponse
      }
    } catch (error) {
      console.log('Service Worker: Network failed, trying cache:', error)
    }
    
    // Fallback to cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline response for API failures
    return new Response(
      JSON.stringify({
        error: 'Offline - No cached data available',
        offline: true,
        message: 'This request requires an internet connection'
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
  
  // For POST requests (itinerary generation, search), try network
  try {
    return await fetch(request)
  } catch (error) {
    console.log('Service Worker: POST request failed offline:', error)
    
    return new Response(
      JSON.stringify({
        error: 'Offline - Cannot complete request',
        offline: true,
        message: 'This action requires an internet connection'
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// Handle static assets with cache-first strategy
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Service Worker: Static asset fetch failed:', error)
    return new Response('Offline - Asset not available', { status: 503 })
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
      return networkResponse
    }
  } catch (error) {
    console.log('Service Worker: Navigation failed, trying cache:', error)
  }
  
  // Try to serve from cache
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }
  
  // Fallback to offline page
  const offlineResponse = await caches.match('/')
  if (offlineResponse) {
    return offlineResponse
  }
  
  return new Response('Offline - No cached page available', { status: 503 })
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered:', event.tag)
  
  if (event.tag === 'sync-itineraries') {
    event.waitUntil(syncItineraries())
  }
  
  if (event.tag === 'sync-user-data') {
    event.waitUntil(syncUserData())
  }
})

// Sync offline itineraries when back online
async function syncItineraries() {
  try {
    // Get offline itineraries from IndexedDB
    const offlineItineraries = await getOfflineItineraries()
    
    for (const itinerary of offlineItineraries) {
      try {
        const response = await fetch('/api/sync-itinerary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itinerary)
        })
        
        if (response.ok) {
          // Remove from offline storage
          await removeOfflineItinerary(itinerary.id)
          console.log('Service Worker: Synced itinerary:', itinerary.id)
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync itinerary:', error)
      }
    }
  } catch (error) {
    console.error('Service Worker: Sync failed:', error)
  }
}

// Sync user data when back online
async function syncUserData() {
  try {
    // Implementation for syncing user preferences, profile updates, etc.
    console.log('Service Worker: Syncing user data...')
  } catch (error) {
    console.error('Service Worker: User data sync failed:', error)
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received')
  
  const options = {
    body: event.data?.text() || 'New notification from AdventureOS',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('AdventureOS', options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click received')
  
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/community')
    )
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// IndexedDB helpers for offline storage
async function getOfflineItineraries() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AdventureOS', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['itineraries'], 'readonly')
      const store = transaction.objectStore('itineraries')
      const getAllRequest = store.getAll()
      
      getAllRequest.onerror = () => reject(getAllRequest.error)
      getAllRequest.onsuccess = () => resolve(getAllRequest.result || [])
    }
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains('itineraries')) {
        db.createObjectStore('itineraries', { keyPath: 'id' })
      }
    }
  })
}

async function removeOfflineItinerary(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AdventureOS', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['itineraries'], 'readwrite')
      const store = transaction.objectStore('itineraries')
      const deleteRequest = store.delete(id)
      
      deleteRequest.onerror = () => reject(deleteRequest.error)
      deleteRequest.onsuccess = () => resolve(deleteRequest.result)
    }
  })
}

// Cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'CACHE_UPDATE') {
    updateCache()
  }
})

async function updateCache() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME)
    const keys = await cache.keys()
    
    // Remove old entries (older than 1 hour)
    const now = Date.now()
    const oneHour = 60 * 60 * 1000
    
    for (const request of keys) {
      const response = await cache.match(request)
      if (response) {
        const dateHeader = response.headers.get('date')
        if (dateHeader) {
          const responseDate = new Date(dateHeader).getTime()
          if (now - responseDate > oneHour) {
            await cache.delete(request)
          }
        }
      }
    }
  } catch (error) {
    console.error('Service Worker: Cache update failed:', error)
  }
}
