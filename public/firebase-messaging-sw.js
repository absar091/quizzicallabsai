
// Import the Firebase app and messaging libraries.
// In a service worker, you can't use ES6 modules, so we use importScripts.
importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-messaging-compat.js');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzRpRNFBAodjKhmmJAMvaBiDNH9-vK1Yg",
  authDomain: "quizzicallab-ai.firebaseapp.com",
  databaseURL: "https://quizzicallab-ai-default-rtdb.firebaseio.com",
  projectId: "quizzicallab-ai",
  storageBucket: "quizzicallab-ai.appspot.com",
  messagingSenderId: "208281807503",
  appId: "1:208281807503:web:e2b34335a9601f0c7f1efa"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico' // You can add a default icon here
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
