import { sendWelcomeNotifications } from '@/services/notification-service';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { getAuth } from 'firebase-admin/auth'; // Changed import
import { initializeApp, getApps } from 'firebase-admin/app';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
        }

        // Verify the request is authenticated
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];

        // Initialize Firebase Admin if not already done
        if (getApps().length === 0) {
            // Re-initialize if needed - this handles serverless cold starts
            const admin = await import('firebase-admin');
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                }),
                databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
            });
        }

        try {
            await getAuth().verifyIdToken(token); // Changed usage
        } catch (error: any) {
            console.error('Token verification failed:', error?.message);
            return NextResponse.json({
                success: false,
                error: 'Token verification failed',
                details: error?.message
            }, { status: 401 });
        }

        // The function doesn't return a result object, so we just call it
        // Note: userId parameter is not actually used in the current implementation
        await sendWelcomeNotifications();

        return NextResponse.json({
            success: true,
            message: 'Welcome notifications processed'
        });

    } catch (error: any) {
        console.error('Welcome notification API error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
