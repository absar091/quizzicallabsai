
'use server';

import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Fallback to serviceAccountKey.json for local development if env vars are not set
try {
    if (!admin.apps.length) {
        const serviceAccount = process.env.FIREBASE_PRIVATE_KEY
            ? {
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }
            : require('../../serviceAccountKey.json');

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
} catch (error) {
    console.error("Firebase Admin initialization failed:", error);
    // Prevent further execution if initialization fails
}


const db = getFirestore();

export async function sendDailyReminderNotifications() {
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
