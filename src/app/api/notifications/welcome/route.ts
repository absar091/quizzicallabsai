import { sendWelcomeNotifications } from '@/services/notification-service';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { verifyIdToken } from 'firebase-admin/auth';
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
            // Firebase Admin should already be initialized in the notification service
        }

        try {
            await verifyIdToken(token);
        } catch (error) {
            return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
        }

        const result = await sendWelcomeNotifications(userId);

        if (result.success) {
            return NextResponse.json({ success: true, message: 'Welcome notifications scheduled' });
        } else {
            return NextResponse.json({ success: false, error: result.error }, { status: 500 });
        }

    } catch (error: any) {
        console.error('Welcome notification API error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
