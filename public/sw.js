importScripts('./sw-files.js');

const KEY = 'MY_CACHE';

this.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(KEY)
            .then(cache => cache.addAll([
                '/',
                '/about',
                '/pregame',
                '/play',
                ...cacheFiles,
            ]) )
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
                    const url1 = event.request.url.replace('https://dmstudio.now.sh', '');
                    const url2 = url1.replace('https://playketnipz.ru/', '');

                    if (!/^(?!.*\..*$)(.*)$/.test(url2) && cacheResponse) {
                        return cacheResponse;
                    }
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
