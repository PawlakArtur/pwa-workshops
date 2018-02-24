/* eslint no-restricted-globals: 0 */
const CACHE_NAME = 'cache-v5';
const URLS_TO_IGNORE = ['chrome-extension', 'sockjs-node'];

self.addEventListener('install', event => {
    // eslint-disable-next-line no-undef
    const { assets } = serviceWorkerOption;
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(assets);
          })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then(function(response) {
            if (response) {
                return response;
            }
    
            if (!navigator.isOnline && isHtmlRequest(event.request)) {
                return cache.match(new Request('/index.html'));
            }
    
            if (shouldIgnoreRequest(event.request)) {
                return fetch(event.request);
            }
    
            return fetchAndUpdate(event.request);
        });
    }));
  });
  
function shouldIgnoreRequest(request) {
    return URLS_TO_IGNORE
        .map((urlPart) => request.url.includes(urlPart))
        .indexOf(true) > -1;
}
  
function isHtmlRequest(request) {
    return request.headers.get('accept').includes('text/html');
}
  
function fetchCors(request) {
    return fetch(new Request(request), { mode: 'cors', credentials: 'same-origin' });
}

function fetchAndUpdate(request) {
    // DevTools opening will trigger these o-i-c requests, which this SW can't handle.
    // There's probaly more going on here, but I'd rather just ignore this problem. :)
    // https://github.com/paulirish/caltrainschedule.io/issues/49
    if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') return;
  
    return caches.open(CACHE_NAME).then((cache) => {
        return fetchCors(request).then((response) => {
        // foreign requests may be res.type === 'opaque' and missing a url
        if (!response.url) return response;

        cache.put(request, response.clone());
        return response;
        });
    });
}