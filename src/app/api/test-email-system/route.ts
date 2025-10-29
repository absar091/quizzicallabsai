import { NextRequest, NextResponse } from 'next/server';
import { generateVerificationCode, storeVerificationCode, verifyCodeFromDB } from '@/lib/email-verification';
import { getTransporter, getFromAddress } from '@/lib/email-config';

export async function POST(request: NextRequest) {
  try {
    const { action, email, code, name } = await request.json();

    if (action === 'send') {
      if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
      }

      // Generate verification code
      const verificationCode = generateVerificationCode();
      
      // Store in Firebase
      await storeVerificationCode(email, verificationCode);

      // Get verification transporter
      const transporter = getTransporter('verification');
      const fromAddress = getFromAddress('verification');

      // Send email
      await transporter.sendMail({
        from: fromAddress,
        to: email,
        subject: 'Test Verification Code - Quizzicallabzᴬᴵ',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #4f46e5;">Email Verification Test</h2>
            <p>Hello ${name || 'User'},</p>
            <p>Your verification code is:</p>
            <div style="font-size: 32px; font-weight: bold; color: #4f46e5; text-align: center; margin: 20px 0; padding: 20px; background: #f8f9ff; border-radius: 8px; letter-spacing: 4px;">
              ${verificationCode}
            </div>
            <p>This code expires in 15 minutes.</p>
            <p style="color: #666; font-size: 12px;">© 2025 Quizzicallabzᴬᴵ Test System</p>
          </div>
        `,
        text: `Your verification code is: ${verificationCode}. This code expires in 15 minutes.`
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Test verification code sent successfully',
        code: verificationCode // Only for testing - REMOVE IN PRODUCTION
      });

    } else if (action === 'verify') {
      if (!email || !code) {
        return NextResponse.json({ error: 'Email and code required' }, { status: 400 });
      }

      const isValid = await verifyCodeFromDB(email, code);

      return NextResponse.json({ 
        success: isValid,
        message: isValid ? 'Code verified successfully' : 'Invalid or expired code'
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error: any) {
    console.error('Test email system error:', error);
    return NextResponse.json({ 
      error: 'System test failed: ' + error.message 
    }, { status: 500 });
  }
}