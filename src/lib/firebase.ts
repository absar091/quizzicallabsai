
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, initializeAuth, indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import type { Analytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with persistence
// This helps prevent "auth/network-request-failed" errors and ensures a smoother user experience.
const auth = typeof window !== 'undefined' 
    ? initializeAuth(app, {
        persistence: [indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence]
      })
    : getAuth(app);
    
export const db = getDatabase(app);
export const firestore = getFirestore(app);

// Initialize Analytics and get a reference to the service, only if supported
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
    import("firebase/analytics").then(({ getAnalytics, isSupported }) => {
        isSupported().then((supported) => {
            if (supported) {
                analytics = getAnalytics(app);
            }
        });
    });
}

export { app, auth, analytics };
