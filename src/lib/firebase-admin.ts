import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    const config: any = {
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    };

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
export const auth = admin.apps.length > 0 ? admin.auth() : null;
export const db = admin.apps.length > 0 && process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ? admin.database() : null;
export const firestore = admin.apps.length > 0 ? admin.firestore() : null;

export default admin;