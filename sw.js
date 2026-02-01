/* =========================
   Cloudflare PWA Service Worker
   ========================= */

/* ---------- INSTALL ---------- */
self.addEventListener("install", event => {
  console.log("SW installed");
  self.skipWaiting();
});

/* ---------- ACTIVATE ---------- */
self.addEventListener("activate", event => {
  console.log("SW activated");
  event.waitUntil(self.clients.claim());
});

/* ---------- PUSH RECEIVED ---------- */
self.addEventListener("push", event => {
  console.log("Push received");

  let data = {
    title: "Cloudflare Push",
    body: "Hello from your app!",
    url: "/"
  };

  // If payload exists
  if (event.data) {
    try {
      data = JSON.parse(event.data.text());
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    vibrate: [200, 100, 200],
    data: {
      url: data.url || "/"
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

/* ---------- NOTIFICATION CLICK ---------- */
self.addEventListener("notificationclick", event => {
  event.notification.close();

  const urlToOpen = event.notification.data.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientsArr => {
      for (const client of clientsArr) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      return clients.openWindow(urlToOpen);
    })
  );
});

/* ---------- OPTIONAL OFFLINE CACHE (recommended for PWA install) ---------- */
const CACHE_NAME = "pwa-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
