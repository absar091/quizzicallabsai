import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK with comprehensive error handling
let isInitialized = false;
let initializationError: string | null = null;

// Function to initialize Firebase Admin
function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    console.log('ℹ️ Firebase Admin already initialized');
    isInitialized = true;
    return true;
  }

  try {
    console.log('🔥 Initializing Firebase Admin...');
    
    // Check for required environment variables
    const requiredVars = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      const errorMsg = `Missing Firebase Admin environment variables: ${missingVars.join(', ')}`;
      console.error(`❌ ${errorMsg}`);
      initializationError = errorMsg;
      return false;
    }
    
    // Process private key properly
    let privateKey = process.env.FIREBASE_PRIVATE_KEY!;
    
    // Handle different private key formats
    if (privateKey.includes('\\n')) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }
    
    // Validate private key format
    if (!privateKey.includes('-----BEGIN PRIVATE KEY-----') || !privateKey.includes('-----END PRIVATE KEY-----')) {
      const errorMsg = 'Invalid private key format';
      console.error(`❌ ${errorMsg}`);
      initializationError = errorMsg;
      return false;
    }
    
    // Create credential
    const credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    });

    const config: admin.AppOptions = { 
      credential,
      projectId: process.env.FIREBASE_PROJECT_ID,
    };

    // Add database URL if available
    if (process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL) {
      config.databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
    }

    // Initialize Firebase Admin
    const app = admin.initializeApp(config);
    isInitialized = true;
    
    console.log('🎉 Firebase Admin initialized successfully!');
    console.log(`- Project: ${app.options.projectId}`);
    console.log(`- Database: ${app.options.databaseURL || 'Not configured'}`);
    
    return true;
  } catch (error: any) {
    const errorMsg = `Firebase Admin initialization failed: ${error.message}`;
    console.error(`💥 ${errorMsg}`);
    initializationError = errorMsg;
    isInitialized = false;
    return false;
  }
}

// Initialize immediately
initializeFirebaseAdmin();

// Safe exports with lazy initialization and retry logic
export const auth = (() => {
  try {
    if (!isInitialized) {
      initializeFirebaseAdmin();
    }
    return isInitialized && admin.apps.length > 0 ? admin.auth() : null;
  } catch (error) {
    console.error('Error getting Firebase Auth:', error);
    return null;
  }
})();

export const db = (() => {
  try {
    if (!isInitialized) {
      initializeFirebaseAdmin();
    }
    return isInitialized && admin.apps.length > 0 && process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ? admin.database() : null;
  } catch (error) {
    console.error('Error getting Firebase Database:', error);
    return null;
  }
})();

export const firestore = (() => {
  try {
    if (!isInitialized) {
      initializeFirebaseAdmin();
    }
    return isInitialized && admin.apps.length > 0 ? admin.firestore() : null;
  } catch (error) {
    console.error('Error getting Firebase Firestore:', error);
    return null;
  }
})();

// Export initialization status and error info for debugging
export const isFirebaseAdminInitialized = () => isInitialized;
export const getFirebaseAdminError = () => initializationError;
export const getFirebaseAdminStatus = () => ({
  initialized: isInitialized,
  error: initializationError,
  appsCount: admin.apps.length,
  hasDatabase: !!process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
});

export default admin;