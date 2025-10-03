
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    const url = new URL(request.url);
    const type = url.searchParams.get('type');

    console.log('🔐 Cron job request received');
    console.log('Type:', type);
    console.log('Auth header present:', !!authHeader);

    // Check authentication
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        console.error('❌ Unauthorized cron job access');
        return NextResponse.json(
            { success: false, error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        let result;

        switch (type) {
            case 'reminders':
                console.log('🔔 Running study reminder notifications job...');
                // Import and call the reminder function directly to avoid fetch issues
                const { GET: sendReminders } = await import('./send-reminders/route');
                const reminderRequest = new Request(request.url, {
                    method: 'GET',
                    headers: request.headers
                });
                const reminderResponse = await sendReminders(reminderRequest as NextRequest);
                result = await reminderResponse.json();
                break;
            
            case 'test':
                console.log('🧪 Running cron test job...');
                result = {
                    message: 'Cron job system is working',
                    timestamp: new Date().toISOString(),
                    environment: process.env.NODE_ENV
                };
                break;
            
            default:
                console.log('ℹ️ Default cron job - no action specified');
                result = {
                    message: 'Cron job received but no specific action taken',
                    availableTypes: ['reminders', 'test'],
                    timestamp: new Date().toISOString()
                };
                break;
        }

        return NextResponse.json({ 
            success: true, 
            type: type || 'default', 
            ...result 
        });
        
    } catch (error: any) {
        console.error('❌ Cron job error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            type: type || 'unknown',
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
