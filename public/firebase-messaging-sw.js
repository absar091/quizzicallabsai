
// Import the Firebase app and messaging packages
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzRpRNFBAodjKhmmJAMvaBiDNH9-vK1Yg",
  authDomain: "quizzical-ai.firebaseapp.com",
  databaseURL: "https://quizzical-ai-default-rtdb.firebaseio.com",
  projectId: "quizzical-ai",
  storageBucket: "quizzical-ai.appspot.com",
  messagingSenderId: "208281807503",
  appId: "1:208281807503:web:8130ddca90c6068a7f1efa"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Optional: Set up a background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/icon.svg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
