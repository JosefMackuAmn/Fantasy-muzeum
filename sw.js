const CACHE_STATIC_NAME = 'static-v1.2.0';
const CACHE_DYNAMIC_NAME = 'dynamic-v1.2.0';

const STATIC_PATHS = [
    'imgs/squares.svg',
    'imgs/squares-long.svg'
]

self.addEventListener('install', e => {
    self.skipWaiting();
    // Cache static files
    e.waitUntil(
        caches.open(CACHE_STATIC_NAME)
            .then(cache => {
                return Promise.all(STATIC_PATHS.map(url => {
                    return fetch(`${url}?${Math.random()}`)
                        .then(response => {
                            if (!response.ok) throw Error('Not ok');
                            return cache.put(url, response);
                        })
                }));
            })
    );
});

self.addEventListener('activate', e => {
    // Clear old caches
    e.waitUntil(
        caches.keys()
            .then(keyList => {
                return Promise.all(keyList.map(key => {
                    if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                        caches.delete(key);
                    }
                }))
            })
    )
    return self.clients.claim();
});

self.addEventListener('fetch', e => {
    // Serve cached files with network fallback
    e.respondWith(
        caches.match(e.request)
            .then(response => {
                /* if (response) {
                    return response; // REMOVED DYNAMIC CACHING FUNCTIONALITY
                } */
                return fetch(e.request)
                    .then(res => {
                        return caches.open(CACHE_DYNAMIC_NAME)
                            .then(cache => {
                                if (res.type !== 'opaque') {
                                    cache.put(e.request.url, res.clone());
                                }
                                return res;
                            })
                    })
                    .catch(err => {
                        return err;
                    })
            })
    )
});