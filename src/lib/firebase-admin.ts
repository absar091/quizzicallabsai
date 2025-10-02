import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK with comprehensive error handling
let isInitialized = false;

if (!admin.apps.length) {
  try {
    let credential;
    
    // Check for required environment variables
    const requiredVars = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.warn(`⚠️ Missing Firebase Admin environment variables: ${missingVars.join(', ')}`);
      console.warn('Firebase Admin features will be limited');
    } else {
      // Use individual environment variables (more reliable than JSON parsing)
      credential = admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      });

      const config: admin.AppOptions = { 
        credential,
        projectId: process.env.FIREBASE_PROJECT_ID,
      };

      // Add database URL if available
      if (process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL) {
        config.databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
      }

      admin.initializeApp(config);
      isInitialized = true;
      console.log('✅ Firebase Admin initialized successfully');
    }
  } catch (error: any) {
    console.error('❌ Firebase Admin initialization failed:', error.message);
    console.error('This may affect server-side Firebase operations');
  }
}

// Safe exports with lazy initialization
export const auth = (() => {
  try {
    return isInitialized && admin.apps.length > 0 ? admin.auth() : null;
  } catch (error) {
    return null;
  }
})();

export const db = (() => {
  try {
    return isInitialized && admin.apps.length > 0 && process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ? admin.database() : null;
  } catch (error) {
    return null;
  }
})();

export const firestore = (() => {
  try {
    return isInitialized && admin.apps.length > 0 ? admin.firestore() : null;
  } catch (error) {
    return null;
  }
})();

// Export initialization status for debugging
export const isFirebaseAdminInitialized = () => isInitialized;

export default admin;