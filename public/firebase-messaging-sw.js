// Import and initialize the Firebase SDK
// This is required to get the service worker running in the background for notifications
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging/sw';

const firebaseConfig = {
  apiKey: "AIzaSyCzRpRNFBAodjKhmmJAMvaBiDNH9-vK1Yg",
  authDomain: "quizzicallab-ai.firebaseapp.com",
  databaseURL: "https://quizzicallab-ai-default-rtdb.firebaseio.com",
  projectId: "quizzicallab-ai",
  storageBucket: "quizzicallab-ai.firebasestorage.app",
  messagingSenderId: "208281807503",
  appId: "1:208281807503:web:8130ddca90c6068a7f1efa"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Service Worker for basic PWA functionality (caching for offline use)
const CACHE_NAME = 'quizzicallabs-cache-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/bookmarks',
  '/genlab',
  '/exam-prep',
  '/how-to-use',
  '/profile',
  '/manifest.json',
  '/icon-192x192.svg',
  '/icon-512x512.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
