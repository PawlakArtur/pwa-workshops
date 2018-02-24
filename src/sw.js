/* eslint no-restricted-globals: 0 */
const cacheName = 'cache-v1';
self.addEventListener('install', event => {
    // eslint-disable-next-line no-undef
    const { assets } = serviceWorkerOption;
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(assets);
          })
    )
});

self.addEventListener('activate', event => {
});

self.addEventListener('fetch', event => {
});
