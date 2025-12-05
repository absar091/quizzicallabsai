import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { whopService } from '@/lib/whop';

export async function POST(request: NextRequest) {
  try {
    // Get user from Firebase Auth token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Get user's plan from Firebase Auth custom claims or metadata
    const userRecord = await auth.getUser(userId);
    const userPlan = (userRecord.customClaims?.plan as string) || 'Free';

    console.log(`🔄 Syncing plan for user ${userId}: ${userPlan}`);

    // Update usage collection with correct plan
    const updated = await whopService.updateUserPlan(userId, userPlan);

    if (updated) {
      return NextResponse.json({ 
        success: true, 
        message: `Plan synced successfully to ${userPlan}`,
        userId,
        plan: userPlan
      });
    } else {
      return NextResponse.json({ 
        error: 'Failed to sync plan' 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('❌ Error syncing user plan:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to sync plan' 
    }, { status: 500 });
  }
}
