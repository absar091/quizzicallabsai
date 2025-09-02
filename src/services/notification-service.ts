'use server';

import * as admin from 'firebase-admin';
import { getDatabase } from 'firebase-admin/database';
import { sanitizeLogInput, timingSafeEqual } from '@/lib/security';

// This function safely initializes the Firebase Admin SDK.
function initializeFirebaseAdmin() {
  // Prevent re-initialization
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // Use individual environment variables (more reliable than JSON parsing)
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    try {
      const serviceAccount = {
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`,
        universe_domain: 'googleapis.com'
      };
      
      console.log('Initializing Firebase Admin SDK with environment variables...');
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      });
    } catch (e) {
      console.error('Failed to initialize Firebase Admin SDK:', e);
      return null;
    }
  }

  console.warn('Firebase Admin SDK not initialized. Push notifications are disabled. Provide Firebase environment variables for production.');
  return null;
}

// Initialize the SDK
const firebaseApp = initializeFirebaseAdmin();
const dbAdmin = firebaseApp ? getDatabase(firebaseApp) : null;

export async function sendDailyReminderNotifications() {
    if (!dbAdmin) {
        const message = "Firebase Admin is not initialized. Skipping sending notifications.";
        console.log(message);
        return { successCount: 0, failureCount: 0, error: message };
    }

    console.log("Running daily reminder job at 9 AM...");

    const tokensRef = dbAdmin.ref('fcmTokens');
    const tokensSnapshot = await tokensRef.once('value');

    if (!tokensSnapshot.exists()) {
        console.log('No tokens found to send notifications.');
        return { successCount: 0, failureCount: 0 };
    }

    const tokensData = tokensSnapshot.val();
    const tokens: string[] = Object.values(tokensData).map((entry: any) => entry.token);
    
    if (tokens.length === 0) {
        console.log('No tokens available to send notifications.');
        return { successCount: 0, failureCount: 0 };
    }

    const payload = {
        notification: {
            title: '🎯 Daily Quiz Reminder - 9 AM',
            body: 'Good morning! Start your day with a quick quiz to boost your learning. Take a quiz now!',
            icon: '/icon-192x192.png',
            click_action: 'https://quizzicallabs.com/generate-quiz'
        },
        data: {
            type: 'daily_reminder',
            time: '09:00',
            action: 'take_quiz'
        }
    };

    try {
        const response = await admin.messaging().sendToDevice(tokens, payload);
        console.log('Notifications sent successfully:', response.successCount);
        console.log('Failed to send notifications:', response.failureCount);
        
        // Cleanup invalid tokens
        response.results.forEach(async (result, index) => {
            const error = result.error;
            if (error) {
                console.error('Failure sending notification to', sanitizeLogInput(tokens[index] || ''), sanitizeLogInput(error?.message || ''));
                if (
                    error.code === 'messaging/invalid-registration-token' ||
                    error.code === 'messaging/registration-token-not-registered'
                ) {
                    const failedToken = tokens[index];
                    // Find the user ID by the token value to delete it
                    const snapshotVal = tokensSnapshot.val();
                    for (const uid of Object.keys(snapshotVal)) {
                        if (timingSafeEqual(snapshotVal[uid].token || '', failedToken)) {
                            const tokenToDeleteRef = dbAdmin.ref(`fcmTokens/${uid}`);
                            await tokenToDeleteRef.remove();
                            console.log(`Deleted invalid token for UID: ${sanitizeLogInput(uid)}`);
                            break;
                        }
                    }
                }
            }
        });

        return { successCount: response.successCount, failureCount: response.failureCount };

    } catch (error) {
        console.error('Error sending notifications:', sanitizeLogInput((error as Error)?.message || 'Unknown error'));
        return { successCount: 0, failureCount: tokens.length, error: (error as Error).message };
    }
}