// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASag0FHvasaArFfuwpswiIQPHsPZ0rq54",
  authDomain: "formidable-gate-465600-k4.firebaseapp.com",
  projectId: "formidable-gate-465600-k4",
  storageBucket: "formidable-gate-465600-k4.firebasestorage.app",
  messagingSenderId: "604957505162",
  appId: "1:604957505162:web:e97e357608bd5ca08b5f73",
  measurementId: "G-TC9HHM2TQQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
