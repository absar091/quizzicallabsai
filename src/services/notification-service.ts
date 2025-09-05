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

  // Check for required environment variables
  const requiredVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY', 
    'FIREBASE_CLIENT_EMAIL',
    'NEXT_PUBLIC_FIREBASE_DATABASE_URL'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.warn(`Firebase Admin SDK not initialized. Missing environment variables: ${missingVars.join(', ')}`);
    return null;
  }

  try {
    const serviceAccount = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID!,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL!,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`,
      universe_domain: 'googleapis.com'
    };

    console.log('Initializing Firebase Admin SDK with environment variables...');
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as any),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
  } catch (e) {
    console.error('Failed to initialize Firebase Admin SDK:', e);
    return null;
  }
}

// Initialize the SDK
let firebaseApp: admin.app.App | null = null;
let dbAdmin: admin.database.Database | null = null;

try {
  firebaseApp = initializeFirebaseAdmin();
  dbAdmin = firebaseApp ? getDatabase(firebaseApp) : null;
} catch (error) {
  console.warn('Firebase Admin initialization failed during module load:', error);
  firebaseApp = null;
  dbAdmin = null;
}

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

// Enhanced notification types for user onboarding and engagement
export async function sendWelcomeNotifications(userId: string) {
    if (!dbAdmin) {
        console.log("Firebase Admin not initialized. Skipping welcome notifications.");
        return { success: false, error: "Firebase Admin not initialized" };
    }

    try {
        // Get user's FCM token
        const tokenRef = dbAdmin.ref(`fcmTokens/${userId}`);
        const tokenSnapshot = await tokenRef.once('value');

        if (!tokenSnapshot.exists()) {
            console.log(`No FCM token found for user ${sanitizeLogInput(userId)}`);
            return { success: false, error: "No FCM token found" };
        }

        const token = tokenSnapshot.val().token;

        // Send welcome notification
        const welcomePayload = {
            notification: {
                title: '🎉 Welcome to Quizzicallabs!',
                body: 'Thanks for joining! Let\'s start your learning journey with a quick quiz.',
                icon: '/icon-192x192.png'
            },
            data: {
                type: 'welcome',
                action: 'take_first_quiz',
                click_action: 'https://quizzicallabs.com/generate-quiz'
            }
        };

        await admin.messaging().sendToDevice(token, welcomePayload);
        console.log(`Welcome notification sent to user ${sanitizeLogInput(userId)}`);

        // Schedule feature introduction notifications
        setTimeout(async () => {
            await sendFeatureIntroductionNotification(userId, 'quiz_generation');
        }, 24 * 60 * 60 * 1000); // 24 hours later

        setTimeout(async () => {
            await sendFeatureIntroductionNotification(userId, 'study_guides');
        }, 3 * 24 * 60 * 60 * 1000); // 3 days later

        setTimeout(async () => {
            await sendFeatureIntroductionNotification(userId, 'shared_quizzes');
        }, 7 * 24 * 60 * 60 * 1000); // 7 days later

        return { success: true };

    } catch (error) {
        console.error('Error sending welcome notification:', sanitizeLogInput((error as Error)?.message || 'Unknown error'));
        return { success: false, error: (error as Error).message };
    }
}

export async function sendFeatureIntroductionNotification(userId: string, feature: string) {
    if (!dbAdmin) {
        console.log("Firebase Admin not initialized. Skipping feature notification.");
        return { success: false, error: "Firebase Admin not initialized" };
    }

    try {
        const tokenRef = dbAdmin.ref(`fcmTokens/${userId}`);
        const tokenSnapshot = await tokenRef.once('value');

        if (!tokenSnapshot.exists()) {
            return { success: false, error: "No FCM token found" };
        }

        const token = tokenSnapshot.val().token;
        let notificationData;

        switch (feature) {
            case 'quiz_generation':
                notificationData = {
                    title: '🚀 Try Our AI Quiz Generator!',
                    body: 'Create personalized quizzes on any topic instantly. Perfect for exam prep!',
                    click_action: 'https://quizzicallabs.com/generate-quiz'
                };
                break;
            case 'study_guides':
                notificationData = {
                    title: '📚 Discover AI Study Guides',
                    body: 'Get comprehensive study guides tailored to your learning style.',
                    click_action: 'https://quizzicallabs.com/generate-study-guide'
                };
                break;
            case 'shared_quizzes':
                notificationData = {
                    title: '👥 Share & Challenge Friends',
                    body: 'Share your quizzes and challenge friends to beat your score!',
                    click_action: 'https://quizzicallabs.com/dashboard'
                };
                break;
            case 'practice_questions':
                notificationData = {
                    title: '🎯 Practice Questions Available',
                    body: 'Generate unlimited practice questions for any topic.',
                    click_action: 'https://quizzicallabs.com/generate-questions'
                };
                break;
            case 'exam_papers':
                notificationData = {
                    title: '📝 Create Exam Papers',
                    body: 'Generate professional exam papers with multiple variants.',
                    click_action: 'https://quizzicallabs.com/generate-paper'
                };
                break;
            default:
                return { success: false, error: "Unknown feature" };
        }

        const payload = {
            notification: {
                ...notificationData,
                icon: '/icon-192x192.png'
            },
            data: {
                type: 'feature_intro',
                feature: feature,
                action: 'explore_feature'
            }
        };

        await admin.messaging().sendToDevice(token, payload);
        console.log(`Feature introduction notification sent to user ${sanitizeLogInput(userId)} for ${feature}`);

        return { success: true };

    } catch (error) {
        console.error('Error sending feature notification:', sanitizeLogInput((error as Error)?.message || 'Unknown error'));
        return { success: false, error: (error as Error).message };
    }
}

export async function sendEngagementNotifications() {
    if (!dbAdmin) {
        console.log("Firebase Admin not initialized. Skipping engagement notifications.");
        return { successCount: 0, failureCount: 0, error: "Firebase Admin not initialized" };
    }

    let tokens: string[] = [];

    try {
        const tokensRef = dbAdmin.ref('fcmTokens');
        const tokensSnapshot = await tokensRef.once('value');

        if (!tokensSnapshot.exists()) {
            return { successCount: 0, failureCount: 0 };
        }

        const tokensData = tokensSnapshot.val();
        tokens = Object.values(tokensData).map((entry: any) => entry.token);

        if (tokens.length === 0) {
            return { successCount: 0, failureCount: 0 };
        }

        // Send different types of engagement notifications
        const engagementNotifications = [
            {
                title: '🧠 Boost Your Learning Streak!',
                body: 'Complete a quiz today to maintain your learning streak.',
                data: { type: 'streak_reminder', action: 'take_quiz' }
            },
            {
                title: '📈 Track Your Progress',
                body: 'Check your dashboard to see how much you\'ve improved!',
                data: { type: 'progress_check', action: 'view_dashboard' }
            },
            {
                title: '🎯 New Study Challenges Available',
                body: 'Try our new study guides and practice questions.',
                data: { type: 'new_features', action: 'explore_features' }
            }
        ];

        const randomNotification = engagementNotifications[Math.floor(Math.random() * engagementNotifications.length)];

        const payload = {
            notification: {
                title: randomNotification.title,
                body: randomNotification.body,
                icon: '/icon-192x192.png'
            },
            data: {
                ...randomNotification.data,
                click_action: 'https://quizzicallabs.com/dashboard'
            }
        };

        const response = await admin.messaging().sendToDevice(tokens, payload);
        console.log('Engagement notifications sent successfully:', response.successCount);

        return { successCount: response.successCount, failureCount: response.failureCount };

    } catch (error) {
        console.error('Error sending engagement notifications:', sanitizeLogInput((error as Error)?.message || 'Unknown error'));
        return { successCount: 0, failureCount: tokens.length, error: (error as Error).message };
    }
}

export async function sendInactiveUserNotifications() {
    if (!dbAdmin) {
        console.log("Firebase Admin not initialized. Skipping inactive user notifications.");
        return { successCount: 0, failureCount: 0, error: "Firebase Admin not initialized" };
    }

    let inactiveUserTokens: string[] = [];

    try {
        // Get users who haven't been active for 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const usersRef = dbAdmin.ref('users');
        const usersSnapshot = await usersRef.once('value');

        if (!usersSnapshot.exists()) {
            return { successCount: 0, failureCount: 0 };
        }

        const usersData = usersSnapshot.val();
        const inactiveUsers = Object.keys(usersData).filter(uid => {
            const userData = usersData[uid];
            if (!userData.lastActive) return false;
            const lastActive = new Date(userData.lastActive);
            return lastActive < sevenDaysAgo;
        });

        if (inactiveUsers.length === 0) {
            return { successCount: 0, failureCount: 0 };
        }

        // Get tokens for inactive users
        const tokensRef = dbAdmin.ref('fcmTokens');
        const tokensSnapshot = await tokensRef.once('value');

        if (!tokensSnapshot.exists()) {
            return { successCount: 0, failureCount: 0 };
        }

        const tokensData = tokensSnapshot.val();
        const inactiveUserTokens = inactiveUsers
            .map(uid => tokensData[uid]?.token)
            .filter(token => token);

        if (inactiveUserTokens.length === 0) {
            return { successCount: 0, failureCount: 0 };
        }

        const payload = {
            notification: {
                title: '🌟 We Miss You!',
                body: 'It\'s been a while! Come back and continue your learning journey.',
                icon: '/icon-192x192.png',
                click_action: 'https://quizzicallabs.com/dashboard'
            },
            data: {
                type: 'reengagement',
                action: 'return_to_app'
            }
        };

        const response = await admin.messaging().sendToDevice(inactiveUserTokens, payload);
        console.log('Inactive user notifications sent successfully:', response.successCount);

        return { successCount: response.successCount, failureCount: response.failureCount };

    } catch (error) {
        console.error('Error sending inactive user notifications:', sanitizeLogInput((error as Error)?.message || 'Unknown error'));
        return { successCount: 0, failureCount: inactiveUserTokens?.length || 0, error: (error as Error).message };
    }
}
