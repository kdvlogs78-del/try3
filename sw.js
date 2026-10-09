const CACHE_NAME = 'expense-tracker-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // Return cached version if found
            if (response) {
                return response;
            }
            // Otherwise, fetch from network
            return fetch(event.request).then(networkResponse => {
                // If the request is for a CDN asset, cache it dynamically
                if (event.request.url.startsWith('https://cdn.tailwindcss.com') ||
                    event.request.url.startsWith('https://cdnjs.cloudflare.com')) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            });
        })
    );
});
