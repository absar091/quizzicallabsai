
// This file must be in the public directory

importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBart3YOoBWb82LOeNJ6iZSfkl3wJDf3xo",
  authDomain: "quizzicallabs.firebaseapp.com",
  databaseURL: "https://quizzicallabs-default-rtdb.firebaseio.com",
  projectId: "quizzicallabs",
  storageBucket: "quizzicallabs.appspot.com",
  messagingSenderId: "795131004388",
  appId: "1:795131004388:web:ca4243c99529a8c23273f1",
  measurementId: "G-7FS1LZJ01T"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

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
    icon: payload.notification.icon || '/icon.svg',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
