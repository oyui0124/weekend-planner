const APP_URL = "/weekend-planner/";

self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(clients.claim()); });

self.addEventListener("message", e => {
  if (e.data?.type === "SHOW_NOTIF") {
    e.waitUntil(
      self.registration.showNotification(e.data.title || "🗓️ 週末プランナー", {
        body: e.data.body || "通知テストです",
        tag: e.data.tag || "wplanner",
        icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f4c5.svg",
        data: { url: APP_URL }
      })
    );
  }
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = e.notification.data?.url || APP_URL;
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.includes("weekend-planner") && "focus" in c) return c.focus();
      }
      return clients.openWindow(url);
    })
  );
});
