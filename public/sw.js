importScripts('./sw-files.js');

const KEY = 'MY_CACHE';


this.addEventListener('install', (event) => {
    console.log('SW установлен');
    event.waitUntil(
        caches.open(KEY)
            .then(cache => {
                console.log(cacheFiles);
                return cache.addAll([
                    '/',
                    ...cacheFiles,
                ]);
            })
            .catch( (err) => {
                console.log(err.stack || err);
            })
    );
});

this.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then( (cacheResponse) => {
                if (navigator.onLine) {
                    return fetch(event.request);
                }
                if (cacheResponse) {
                    return cacheResponse;
                }
                return fetch(event.request);
            })
            .catch( (err) => {
                console.log(err.stack || err);
            })
    );
});
