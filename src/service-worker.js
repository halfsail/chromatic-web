/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker';

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

// Assets to cache on install
const ASSETS = [
  ...build, // all files in _app/immutable (JS, CSS chunks built by Vite)
  ...files  // everything in static folder
];

// Install event - cache all assets
self.addEventListener('install', (event) => {
  async function addFilesToCache() {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  }

  event.waitUntil(addFilesToCache());
  self.skipWaiting();
});

// Activate event - delete old caches
self.addEventListener('activate', (event) => {
  async function deleteOldCaches() {
    for (const key of await caches.keys()) {
      if (key !== CACHE) await caches.delete(key);
    }
  }

  event.waitUntil(deleteOldCaches());
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Ignore non-GET requests
  if (event.request.method !== 'GET') return;

  async function respond() {
    const url = new URL(event.request.url);
    const cache = await caches.open(CACHE);

    // Try to serve build files (JS/CSS) from cache
    if (ASSETS.includes(url.pathname)) {
      const cachedResponse = await cache.match(url.pathname);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    // For everything else, try network first, then cache
    try {
      const response = await fetch(event.request);

      // Cache successful responses
      if (response.status === 200) {
        cache.put(event.request, response.clone());
      }

      return response;
    } catch {
      // Network failed, try cache
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      // If this is a navigation request, return the cached index.html
      if (event.request.mode === 'navigate') {
        const indexResponse = await cache.match('/');
        if (indexResponse) {
          return indexResponse;
        }
      }

      throw new Error('Network request failed and no cache available');
    }
  }

  event.respondWith(respond());
});