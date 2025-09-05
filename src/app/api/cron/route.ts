
import {
    sendDailyReminderNotifications,
    sendEngagementNotifications,
    sendInactiveUserNotifications
} from '@/services/notification-service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    const url = new URL(request.url);
    const type = url.searchParams.get('type');

    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }

    try {
        let result;

        switch (type) {
            case 'engagement':
                console.log('Running engagement notifications job...');
                result = await sendEngagementNotifications();
                break;
            case 'inactive':
                console.log('Running inactive user notifications job...');
                result = await sendInactiveUserNotifications();
                break;
            case 'daily':
            default:
                console.log('Running daily reminder notifications job...');
                result = await sendDailyReminderNotifications();
                break;
        }

        return NextResponse.json({ success: true, type: type || 'daily', ...result });
    } catch (error: any) {
        console.error('Cron job error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            note: 'This is expected if Firebase Admin is not configured'
        }, { status: 200 }); // Return 200 to prevent Vercel from retrying
    }
}
