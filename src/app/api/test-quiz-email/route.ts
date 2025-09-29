import { NextRequest, NextResponse } from 'next/server';
import { sendQuizResultEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    console.log('📧 Testing quiz-result email...');
    
    const testData = {
      userName: 'Test User',
      topic: 'Sample Quiz Topic',
      score: 8,
      total: 10,
      percentage: 80,
      timeTaken: 300,
      date: new Date().toISOString()
    };

    const result = await sendQuizResultEmail('test@example.com', testData);
    
    console.log('✅ Test email sent:', result);
    
    return NextResponse.json({
      success: true,
      message: 'Test quiz result email sent successfully',
      result
    });
  } catch (error: any) {
    console.error('❌ Test email failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}