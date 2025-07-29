
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
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
