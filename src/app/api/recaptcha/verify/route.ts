import { NextRequest, NextResponse } from 'next/server';
import { verifyRecaptchaToken } from '@/lib/recaptcha-v3';

export async function POST(request: NextRequest) {
  try {
    const { token, action } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 reCAPTCHA v3: Verifying token for action: ${action || 'unknown'}`);

    const result = await verifyRecaptchaToken(token, action);

    if (!result.success) {
      console.warn(`⚠️ reCAPTCHA v3: Verification failed - ${result.error}`);
      return NextResponse.json(
        { 
          success: false, 
          error: result.error,
          score: result.score 
        },
        { status: 400 }
      );
    }

    if (!result.isHuman) {
      console.warn(`🤖 reCAPTCHA v3: Bot detected - Score: ${result.score}`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Bot activity detected',
          score: result.score,
          isBot: true
        },
        { status: 403 }
      );
    }

    console.log(`✅ reCAPTCHA v3: Human verified - Score: ${result.score}`);

    return NextResponse.json({
      success: true,
      score: result.score,
      isHuman: result.isHuman,
      message: 'Human verification successful'
    });

  } catch (error: any) {
    console.error('❌ reCAPTCHA v3: API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}