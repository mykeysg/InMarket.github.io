const cacheName = "in-market-app-v1";
const assets = [
    "./app/index.html",
    "./app/criptomonedas.html",
    "./app/assets/css/crypto.css",
    "./app/assets/css/style.css",
    "./app/assets/js/index.js",
    "./app/assets/js/formValid.js",
    "./app/assets/img/btc-1.jpg",
    "./app/assets/img/c-1.png",
    "./app/assets/img/c-2.png",
    "./app/assets/img/c-3.png",
    "./app/assets/img/c-4.png",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
];

// Evento de instalación
self.addEventListener('install', (event) => {
    console.log('Service Worker instalado');
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                console.log('Archivos cacheados');
                return cache.addAll(assets);
            })
    );
    self.skipWaiting();
});

// Evento de activación
self.addEventListener('activate', (event) => {
    console.log('Service Worker activado');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log('Service Worker limpiando caché antigua');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Evento de fetch
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request).then(networkResponse => {
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }
                    let responseToCache = networkResponse.clone();
                    caches.open(cacheName).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                    return networkResponse;
                });
            })
    );
});
