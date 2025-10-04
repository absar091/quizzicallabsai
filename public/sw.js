 // Service Worker for Quizzicallabs AI PWA
const CACHE_NAME = 'quizzicallabs-v1.0.0';
const OFFLINE_URL = '/offline';

// Assets to cache immediately
const STATIC_CACHE_URLS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icon.svg',
  '/favicon.ico',
  '/apple-icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  // CSS and JS bundles will be cached by workbox
];

// Runtime cache for API responses
const API_CACHE_NAME = 'quizzicallabs-api-v1';
const API_CACHE_MAX_AGE = 60 * 60 * 1000; // 1 hour

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        await cache.addAll(STATIC_CACHE_URLS);
        console.log('[SW] Static assets cached');
      } catch (error) {
        console.error('[SW] Failed to cache static assets:', error);
      }
      // Force activation
      await self.skipWaiting();
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name !== API_CACHE_NAME)
          .map(name => caches.delete(name))
      );

      // Take control of all clients
      await self.clients.claim();
      console.log('[SW] Service worker activated');
    })()
  );
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Try network first for navigation
          const networkResponse = await fetch(request);
          return networkResponse;
        } catch (error) {
          // If network fails, try cache
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match('/');

          if (cachedResponse) {
            return cachedResponse;
          }

          // If no cache, return offline page
          return cache.match(OFFLINE_URL);
        }
      })()
    );
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      (async () => {
        try {
          // Try network first
          const response = await fetch(request.clone());

          // Cache successful GET requests
          if (request.method === 'GET' && response.status === 200) {
            const cache = await caches.open(API_CACHE_NAME);
            cache.put(request, response.clone());
          }

          return response;
        } catch (error) {
          // Try cache for GET requests
          if (request.method === 'GET') {
            const cache = await caches.open(API_CACHE_NAME);
            const cachedResponse = await cache.match(request);

            if (cachedResponse) {
              // Check if cache is still fresh
              const cacheTime = cachedResponse.headers.get('sw-cache-time');
              if (cacheTime && (Date.now() - parseInt(cacheTime)) < API_CACHE_MAX_AGE) {
                return cachedResponse;
              }
            }
          }

          // Return offline error for API requests
          return new Response(
            JSON.stringify({
              error: 'offline',
              message: 'You are currently offline. Please check your internet connection and try again.',
              offline: true
            }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }
      })()
    );
    return;
  }

  // Handle Google APIs and external scripts - bypass service worker
  if (url.hostname === 'apis.google.com' || 
      url.hostname === 'www.gstatic.com' ||
      url.hostname === 'accounts.google.com' ||
      url.pathname.includes('google')) {
    // Let these requests go directly to network without SW interference
    return;
  }

  // Handle static assets
  if (request.destination === 'style' ||
      request.destination === 'script' ||
      request.destination === 'image' ||
      request.destination === 'font') {
    event.respondWith(
      (async () => {
        // Try cache first for static assets
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
          return cachedResponse;
        }

        // If not in cache, fetch from network
        try {
          const response = await fetch(request);
          if (response.status === 200) {
            cache.put(request, response.clone());
          }
          return response;
        } catch (error) {
          console.error('[SW] Failed to fetch static asset:', request.url);
          return new Response('', { status: 404 });
        }
      })()
    );
    return;
  }

  // Default: try network first, then cache
  event.respondWith(
    (async () => {
      try {
        const response = await fetch(request);
        return response;
      } catch (error) {
        const cache = await caches.open(CACHE_NAME);
        return cache.match(request) || cache.match(OFFLINE_URL);
      }
    })()
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);

  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click:', event);
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});

// Background sync function
async function doBackgroundSync() {
  try {
    // Get pending offline actions from IndexedDB
    const pendingActions = await getPendingActions();

    for (const action of pendingActions) {
      try {
        await fetch(action.url, action.options);
        await removePendingAction(action.id);
      } catch (error) {
        console.error('[SW] Background sync failed:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync error:', error);
  }
}

// IndexedDB helpers for offline actions
async function getPendingActions() {
  // This would interact with IndexedDB to get pending actions
  return [];
}

async function removePendingAction(id) {
  // This would remove completed actions from IndexedDB
}

// Periodic cleanup
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAN_CACHE') {
    cleanOldCache();
  }
});

async function cleanOldCache() {
  try {
    const cache = await caches.open(API_CACHE_NAME);
    const keys = await cache.keys();

    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const cacheTime = response.headers.get('sw-cache-time');
        if (cacheTime && (Date.now() - parseInt(cacheTime)) > API_CACHE_MAX_AGE) {
          await cache.delete(request);
        }
      }
    }
  } catch (error) {
    console.error('[SW] Cache cleanup error:', error);
  }
}
