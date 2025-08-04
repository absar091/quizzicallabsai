
'use server';

import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { serviceAccountKey } from './serviceAccountKey-temp';

// This function safely initializes the Firebase Admin SDK.
function initializeFirebaseAdmin() {
  // Prevent re-initialization
  if (admin.apps.length > 0) {
    return;
  }

  // Use environment variables in production, which is the standard for Vercel/Firebase App Hosting
  if (process.env.NODE_ENV === 'production' && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK initialized using environment variable.');
      return;
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', e);
    }
  }

  // Fallback for local development using the temporary service account key file
  // This check ensures we don't try to use placeholder credentials and crash.
  if (serviceAccountKey.project_id && serviceAccountKey.project_id !== 'your-project-id') {
     try {
       admin.initializeApp({
         credential: admin.credential.cert(serviceAccountKey as admin.ServiceAccount),
       });
       console.log('Firebase Admin SDK initialized using local service account file.');
     } catch (e) {
        console.error('Error initializing Firebase Admin with local key file:', e);
     }
  } else {
    console.warn('Firebase Admin SDK not initialized. Push notifications will not work. Please provide service account credentials.');
  }
}

// Initialize the SDK
initializeFirebaseAdmin();


const db = admin.apps.length ? getFirestore() : null;

export async function sendDailyReminderNotifications() {
    if (!db) {
        const message = "Firebase Admin is not initialized. Skipping sending notifications.";
        console.log(message);
        return { successCount: 0, failureCount: 0, error: message };
    }

    console.log("Running daily reminder job...");

    const tokensSnapshot = await db.collection('fcmTokens').get();

    if (tokensSnapshot.empty) {
        console.log('No tokens found to send notifications.');
        return { successCount: 0, failureCount: 0 };
    }

    const tokens: string[] = [];
    tokensSnapshot.forEach(doc => {
        tokens.push(doc.data().token);
    });

    const payload = {
        notification: {
            title: '🎯 Daily Goal Reminder',
            body: 'You haven’t completed a quiz today. Hop back in to keep your streak going!',
            icon: '/icon-192x192.svg',
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
                    const tokenDocRef = db.collection('fcmTokens').where('token', '==', failedToken);
                    const docToDelete = await tokenDocRef.get();
                    if (!docToDelete.empty) {
                        docToDelete.forEach(doc => doc.ref.delete());
                        console.log('Deleted invalid token from Firestore.');
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
