self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

/* Background notification support */
self.addEventListener("push", event => {
  const data = event.data?.text() || "Hello from Cloudflare!";

  event.waitUntil(
    self.registration.showNotification("Push Message", {
      body: data,
      icon: "/icon-192.png"
    })
  );
});

/* Click opens app */
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
