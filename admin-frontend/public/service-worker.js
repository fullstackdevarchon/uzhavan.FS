self.addEventListener("push", (event) => {
  const data = event.data.json();
  const title = data.title || "Notification";
  const options = {
    body: data.body,
    icon: "/icon.png", // optional
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("http://localhost:5173") // redirect on click
  );
});
