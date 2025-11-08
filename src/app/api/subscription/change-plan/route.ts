import { NextRequest, NextResponse } from 'next/server';
import { planSwitchingService } from '@/lib/plan-switching';
import { auth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    // Get user from Firebase Auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Please sign in to change your plan.',
        code: 'AUTH_REQUIRED' 
      }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: 'Invalid token',
        message: 'Your session has expired. Please sign in again.',
        code: 'INVALID_TOKEN'
      }, { status: 401 });
    }

    const userId = decodedToken.uid;
    const userEmail = decodedToken.email || '';

    const { requestedPlan, currentPlan } = await request.json();

    // Validate input
    if (!requestedPlan || !currentPlan) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
        message: 'Please select a plan to switch to.',
        code: 'MISSING_FIELDS'
      }, { status: 400 });
    }

    // Request plan change
    const result = await planSwitchingService.requestPlanChange(
      userId,
      currentPlan,
      requestedPlan,
      userEmail
    );

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error || 'Plan change failed',
        message: result.message,
        code: result.error || 'PLAN_CHANGE_FAILED'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      isImmediate: result.isImmediate,
      effectiveDate: result.effectiveDate,
      checkoutUrl: result.checkoutUrl,
    });

  } catch (error: any) {
    console.error('❌ Plan change API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred. Please try again or contact support.',
      code: 'INTERNAL_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// Cancel pending plan change
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Please sign in to cancel plan change.',
        code: 'AUTH_REQUIRED' 
      }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const result = await planSwitchingService.cancelPlanChange(userId);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: 'Cancellation failed',
        message: result.message,
        code: 'CANCEL_FAILED'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message
    });

  } catch (error: any) {
    console.error('❌ Cancel plan change error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to cancel plan change. Please try again.',
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}

// Get pending plan change
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        code: 'AUTH_REQUIRED' 
      }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const result = await planSwitchingService.getPendingPlanChange(userId);

    return NextResponse.json({
      success: true,
      hasPending: result.hasPending,
      change: result.change
    });

  } catch (error: any) {
    console.error('❌ Get pending change error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}
