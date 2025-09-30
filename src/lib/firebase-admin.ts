import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    // Try to parse service account key from environment variable first
    let credential;

    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      // Parse the service account JSON
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      credential = admin.credential.cert(serviceAccount);
    } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      // Fallback to individual environment variables
      credential = admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      });
    } else {
      throw new Error('Firebase Admin credentials not found in environment variables');
    }

    const config: any = { credential };

    // Only add databaseURL if it exists
    if (process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL) {
      config.databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
    }

    admin.initializeApp(config);
    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error);
  }
}

// Safe exports with error handling
export const auth = (() => {
  try {
    return admin.apps.length > 0 ? admin.auth() : null;
  } catch (error) {
    console.warn('⚠️ Firebase Admin Auth not available:', error);
    return null;
  }
})();

export const db = (() => {
  try {
    return admin.apps.length > 0 && process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ? admin.database() : null;
  } catch (error) {
    console.warn('⚠️ Firebase Admin Database not available:', error);
    return null;
  }
})();

export const firestore = (() => {
  try {
    return admin.apps.length > 0 ? admin.firestore() : null;
  } catch (error) {
    console.warn('⚠️ Firebase Admin Firestore not available:', error);
    return null;
  }
})();

export default admin;