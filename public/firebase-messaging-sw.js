// This file must be in the /public directory

importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker
// Be sure to replace the config values below with your app's own
// config values from your project's settings page
const firebaseConfig = {
  apiKey: "AIzaSyCzRpRNFBAodjKhmmJAMvaBiDNH9-vK1Yg",
  authDomain: "quizzicallab-ai.firebaseapp.com",
  databaseURL: "https://quizzicallab-ai-default-rtdb.firebaseio.com",
  projectId: "quizzicallab-ai",
  storageBucket: "quizzicallab-ai.appspot.com",
  messagingSenderId: "208281807503",
  appId: "1:208281807503:web:6185af3a3b1c80ee7f1efa"
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
