
import { sendDailyReminderNotifications } from '@/services/notification-service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');

    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }
    
    try {
        const result = await sendDailyReminderNotifications();
        return NextResponse.json({ success: true, ...result });
    } catch (error: any) {
        console.error('Cron job error:', error);
        return NextResponse.json({ 
            success: false, 
            error: error.message,
            note: 'This is expected if Firebase Admin is not configured'
        }, { status: 200 }); // Return 200 to prevent Vercel from retrying
    }
}
