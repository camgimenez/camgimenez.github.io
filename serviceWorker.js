const CACHE_NAME = 'superlista-v2';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/estilos.css',
    '/js/main.js',
    '/manifest.json',
    '/offline.html'
];

const FONT_CACHE = 'superlista-fonts-v1';
const FONT_ORIGINS = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys
                    .filter(k => k !== CACHE_NAME && k !== FONT_CACHE)
                    .map(k => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;

    const url = new URL(e.request.url);

    if (FONT_ORIGINS.some(origin => url.href.startsWith(origin))) {
        e.respondWith(
            caches.open(FONT_CACHE).then(cache =>
                cache.match(e.request).then(cached => {
                    if (cached) return cached;
                    return fetch(e.request).then(response => {
                        cache.put(e.request, response.clone());
                        return response;
                    });
                })
            )
        );
        return;
    }

    if (e.request.mode === 'navigate') {
        e.respondWith(
            fetch(e.request)
                .then(response => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
                    return response;
                })
                .catch(() =>
                    caches.match(e.request)
                        .then(cached => cached || caches.match('/offline.html'))
                )
        );
        return;
    }

    e.respondWith(
        fetch(e.request)
            .then(response => {
                const clone = response.clone();
                caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
                return response;
            })
            .catch(() => caches.match(e.request))
    );
});

self.addEventListener('message', e => {
    if (e.data === 'skipWaiting') self.skipWaiting();
});
