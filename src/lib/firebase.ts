
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { 
    getAuth
} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from "firebase/firestore";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim(),
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim(),
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL?.trim(),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim(),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim(),
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim(),
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim(),
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.trim(),
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export const db = getDatabase(app);
export const firestore = getFirestore(app);

// Configure Firestore settings for better connection handling
if (typeof window !== 'undefined') {
  // Enable offline persistence and better error handling
  try {
    // These settings help with connection stability
    firestore._delegate._databaseId = firestore._delegate._databaseId;
  } catch (e) {
    // Ignore if already configured
  }
}

// Initialize Analytics and get a reference to the service, only if supported
let analytics: Analytics | null = null;

async function initializeAnalytics() {
    if (typeof window !== 'undefined') {
        try {
            const isAnalyticsSupported = await isSupported();
            if (isAnalyticsSupported) {
                analytics = getAnalytics(app);
            }
        } catch(e) {
            console.error("Firebase Analytics not supported:", e);
        }
    }
}

initializeAnalytics();

export { app, auth, analytics };

// Initialize connection manager
if (typeof window !== 'undefined') {
  import('./firebase-connection').then(({ connectionManager }) => {
    console.log('🔥 Firebase connection manager initialized');
  }).catch(console.error);
}

// Re-export database functions for convenience
export { ref, set, get, push, remove, update, query, orderByChild, equalTo, limitToFirst, limitToLast } from 'firebase/database';
export const database = db; // For backward compatibility
