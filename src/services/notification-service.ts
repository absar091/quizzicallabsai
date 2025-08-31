
'use server';

import * as admin from 'firebase-admin';
import { getDatabase } from 'firebase-admin/database';

// This function safely initializes the Firebase Admin SDK.
function initializeFirebaseAdmin() {
  // Prevent re-initialization
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // Use environment variables in production, which is the standard for Vercel/Firebase App Hosting
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      console.log('Initializing Firebase Admin SDK with environment variables...');
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      });
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Notifications will not work.', e);
      return null;
    }
  }

  console.warn('Firebase Admin SDK not initialized. Push notifications are disabled. Provide FIREBASE_SERVICE_ACCOUNT_KEY environment variable for production.');
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

    console.log("Running daily reminder job...");

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
            title: '🎯 Daily Goal Reminder',
            body: 'You haven’t completed a quiz today. Hop back in to keep your streak going!',
            icon: '/icon.svg',
            click_action: 'https://quizzicallabs.com/dashboard'
        },
    };

    try {
        const response = await admin.messaging().sendToDevice(tokens, payload);
        console.log('Notifications sent successfully:', response.successCount);
        console.log('Failed to send notifications:', response.failureCount);
        
        // Cleanup invalid tokens
        response.results.forEach(async (result, index) => {
            const error = result.error;
            if (error) {
                console.error('Failure sending notification to', tokens[index], error);
                if (
                    error.code === 'messaging/invalid-registration-token' ||
                    error.code === 'messaging/registration-token-not-registered'
                ) {
                    const failedToken = tokens[index];
                    // Find the user ID by the token value to delete it
                    const snapshotVal = tokensSnapshot.val();
                    for (const uid in snapshotVal) {
                        if (snapshotVal[uid].token === failedToken) {
                            const tokenToDeleteRef = dbAdmin.ref(`fcmTokens/${uid}`);
                            await tokenToDeleteRef.remove();
                            console.log(`Deleted invalid token for UID: ${uid}`);
                            break;
                        }
                    }
                }
            }
        });

        return { successCount: response.successCount, failureCount: response.failureCount };

    } catch (error) {
        console.error('Error sending notifications:', error);
        return { successCount: 0, failureCount: tokens.length, error: (error as Error).message };
    }
}
