
// This file must be in the public directory

importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGpF8zVzT4qY3nJ7mK9pL2wX5vB8cA1dE",
  authDomain: "quizzicallabs-ai.firebaseapp.com",
  databaseURL: "https://quizzicallabs-ai-default-rtdb.firebaseio.com",
  projectId: "quizzicallabs-ai",
  storageBucket: "quizzicallabs-ai.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789",
  measurementId: "G-ABCDEF1234"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // Sanitize payload for logging
  const sanitizedPayload = {
    notification: {
      title: payload.notification?.title?.replace(/[\r\n]/g, '') || 'No title',
      body: payload.notification?.body?.replace(/[\r\n]/g, '') || 'No body'
    }
  };
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    sanitizedPayload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/icon.svg',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
