
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzRpRNFBAodjKhmmJAMvaBiDNH9-vK1Yg",
  authDomain: "quizzicallab-ai.firebaseapp.com",
  databaseURL: "https://quizzicallab-ai-default-rtdb.firebaseio.com",
  projectId: "quizzicallab-ai",
  storageBucket: "quizzicallab-ai.firebasestorage.app",
  messagingSenderId: "208281807503",
  appId: "1:208281807503:web:8130ddca90c6068a7f1efa"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getDatabase(app);
export const firestore = getFirestore(app);

// Initialize Analytics and get a reference to the service, only if supported
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}


export { app, analytics };
