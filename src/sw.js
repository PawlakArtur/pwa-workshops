/* eslint no-restricted-globals: 0 */
const cacheName = 'cache-v3';
self.addEventListener('install', event => {
    // eslint-disable-next-line no-undef
    const { assets } = serviceWorkerOption;
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(assets);
          })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== cacheName)
                    .map(key => caches.delete(key))
            );
        }));
});

self.addEventListener('fetch', event => {
});
