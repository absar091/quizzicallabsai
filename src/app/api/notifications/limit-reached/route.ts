import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { sendAutomatedLimitReached } from '@/lib/email-automation';
import { whopService } from '@/lib/whop';

/**
 * API endpoint to send limit reached notification emails
 * Called automatically when a user hits their usage limit
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    const decoded = await auth.verifyIdToken(token);
    const userId = decoded.uid;
    const userEmail = decoded.email;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      );
    }

    // Get user's current usage and plan info
    const usage = await whopService.getUserUsage(userId);
    
    if (!usage) {
      return NextResponse.json(
        { error: 'User usage data not found' },
        { status: 404 }
      );
    }

    // Determine which limit was reached
    const { limitType } = await request.json();
    
    if (!limitType || !['tokens', 'quizzes'].includes(limitType)) {
      return NextResponse.json(
        { error: 'Invalid limit type. Must be "tokens" or "quizzes"' },
        { status: 400 }
      );
    }

    // Calculate reset date (1st of next month)
    const now = new Date();
    const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const resetDateStr = resetDate.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });

    // Get user's display name
    const userName = decoded.name || userEmail.split('@')[0];

    // Send the email
    const result = await sendAutomatedLimitReached(
      userEmail,
      userName,
      {
        limitType: limitType as 'tokens' | 'quizzes',
        currentPlan: usage.plan || 'Free',
        usedAmount: limitType === 'tokens' ? usage.tokens_used : usage.quizzes_used,
        limitAmount: limitType === 'tokens' ? usage.tokens_limit : usage.quizzes_limit,
        resetDate: resetDateStr
      }
    );

    if (result.success) {
      console.log(`✅ Limit reached email sent to ${userEmail}`);
      return NextResponse.json({
        success: true,
        message: 'Limit reached notification sent successfully'
      });
    } else {
      console.warn(`⚠️ Limit reached email blocked for ${userEmail}:`, result);
      return NextResponse.json({
        success: false,
        message: 'Email blocked by user preferences',
        blocked: true
      });
    }

  } catch (error: any) {
    console.error('❌ Error sending limit reached notification:', error);
    return NextResponse.json({
      error: 'Failed to send notification',
      details: error.message
    }, { status: 500 });
  }
}
