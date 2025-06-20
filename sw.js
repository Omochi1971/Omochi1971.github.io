self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('bodylog-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/weight-history.html',
        '/settings.html',
        '/style.css',
        '/script.js',
        '/assets/chart_active.png',
        '/assets/chart_inactive.png',
        '/assets/home_active.png',
        '/assets/home_inactive.png',
        '/assets/settings_active.png',
        '/assets/settings_inactive.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});