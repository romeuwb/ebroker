importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')
// // Initialize the Firebase app in the service worker by passing the generated config

const firebaseConfig = {
    apiKey: "AIzaSyB0860i1PmjXrvga3ahYTPNo4o97NtYfqA",
      authDomain: "ebroker-778c8.firebaseapp.com",
      projectId: "ebroker-778c8",
      storageBucket: "ebroker-778c8.appspot.com",
      messagingSenderId: "814508849332",
      appId: "1:814508849332:web:e95e01af4e4bd9611a3fe1",
      measurementId: "G-QWBTJX776Z"
};


firebase?.initializeApp(firebaseConfig)


// Retrieve firebase messaging
const messaging = firebase.messaging();

self.addEventListener('install', function (event) {
  console.log('Hello world from the Service Worker :call_me_hand:');
});

// Handle background messages
self.addEventListener('push', function (event) {
  const payload = event.data.json();
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});