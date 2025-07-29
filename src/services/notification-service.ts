
'use server';

import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK only if the necessary credentials are provided
// This prevents build errors when environment variables or serviceAccountKey.json are not populated.
if (!admin.apps.length) {
    const hasEnvVars = process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY;

    try {
        if (hasEnvVars) {
            const serviceAccount = {
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            };
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        } else {
             console.warn("Firebase Admin credentials are not fully available. Skipping Admin SDK initialization.");
        }
    } catch (error) {
        console.error("Firebase Admin initialization failed:", error);
    }
}


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
            icon: '/icon-192x192.png',
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
