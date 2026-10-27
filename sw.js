self.addEventListener('install', (e) => {
    e.waitUntil(caches.open('evat-v24.1').then((cache) => cache.addAll(['index.html'])));
});
self.addEventListener('fetch', (e) => {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});