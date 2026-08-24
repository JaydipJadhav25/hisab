// Minimal offline-friendly app-shell cache.
// Networked API calls (anything under /api) always go to the network;
// only the static shell is cached so the app can boot offline.
const CACHE_NAME = "hisab-shell-v1";
const APP_SHELL = ["/", "/index.html", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// self.addEventListener("fetch", (event) => {
//   const url = new URL(event.request.url);
//   if (url.pathname.startsWith("/api")) return; // never cache API responses
//   event.respondWith(
//     caches.match(event.request).then((cached) => cached || fetch(event.request))
//   );
// });



self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith("/api")) return; // never cache API responses
  event.respondWith(
    caches
      .match(event.request)
      .then((cached) => cached || fetch(event.request))
      .catch(() => caches.match("/index.html"))
  );
});
