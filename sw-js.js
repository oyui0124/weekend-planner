const APP_URL = "https://oyui0124.github.io/weekend-planner/index.html";

self.addEventListener("push", e => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration.showNotification(data.title || "🗓️ 週末プランナー", {
      body: data.body || "今週末のスケジュールを組む時間です！",
      icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f4c5.svg",
      tag: data.tag || "wplanner",
      requireInteraction: true,
    })
  );
});

// 通知をクリックしたらアプリを開く
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url === APP_URL && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(APP_URL);
    })
  );
});

// Service Workerからローカルで通知を出す（postMessage経由）
self.addEventListener("message", e => {
  if (e.data?.type === "SHOW_NOTIF") {
    self.registration.showNotification(e.data.title, {
      body: e.data.body,
      icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f4c5.svg",
      tag: e.data.tag || "wplanner",
      requireInteraction: false,
    });
  }
});
