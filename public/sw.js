const KEY = 'MY_CACHE';

this.addEventListener('install', (event) => {
    console.log('SW установлен');
    event.waitUntil(
        caches.open(KEY)
            .then( cache => cache.addAll([
                '/',
                '/index.html',
                '/css/style.css',
                '/js/index.js',
                '/js/components/About/About.mjs',
            ]) )
            // TODO сюда надо добавить все файлы для раздачи из оффлайна.
            // TODO делается это ручками :(
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
