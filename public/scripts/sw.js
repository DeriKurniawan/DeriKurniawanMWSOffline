const cacheName = 'v1-reatmap-deri';

const filesToCache = [
    '../index.html',
    '../styles/style.css',
    '../scripts/all.js',
    '../assets/images/search.svg',
    '../assets/images/burger.png',
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName)
        .then((cache) => {
            return cache.addAll(filesToCache);
        })
    )
});

self.addEventListener('fetch', function(event) {
    console.log('event : -> ', event.request);
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            if (response){ 
                console.log(`Found ${event.request.url} in cache`)
                return response; 
            }

            console.log(`Network request for ${event.request.url}`)
            return fetch(event.request).then(response => {
                return caches.open(cacheName).then(c => {
                    c.put(event.request.url, response.clone());
                    return response;
                });
            });
        })
        .catch(err => {
            console.log('Error fetch : ', err);
        })
    )
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(c) {
            return Promise.all(
                c.filter(function(cn) {
                    return cn !== cacheName;
                })
                .map(function(cn) {
                    caches.delete(cn);
                })
            );
        })
    );
});

self.addEventListener('message', function(event) {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});