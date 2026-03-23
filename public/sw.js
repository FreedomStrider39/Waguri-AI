self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : { title: 'Karouko', body: 'She sent you a message...' };
  
  const options = {
    body: data.body,
    icon: '/src/assets/karouko.png',
    badge: '/src/assets/karouko.png',
    vibrate: [100, 50, 100],
    data: {
      url: '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});