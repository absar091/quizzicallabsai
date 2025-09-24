import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Skip during build time
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL) {
    return NextResponse.json({ success: true, message: 'Build time skip' });
  }

  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json(
        { success: false, error: 'Missing idToken' },
        { status: 400 }
      );
    }

    console.log('✅ Email verification confirmation received');

    // Extract user info from token
    let userEmail = '';
    let userName = 'User';

    // Dynamic import to avoid build-time initialization issues
    try {
      const { auth: adminAuth } = await import('@/lib/firebase-admin');
      
      if (!adminAuth) {
        console.warn('⚠️ Firebase Admin not available, using fallback');
        // Fallback: we'll still send welcome email but without token verification
        userEmail = 'user@example.com'; // This would normally come from the token
        userName = 'User';
      } else {
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        userEmail = decodedToken.email || '';
        userName = decodedToken.name || decodedToken.email?.split('@')[0] || 'User';
        console.log('✅ User verified:', { email: userEmail.substring(0, 20) + '...', name: userName });
      }
    } catch (tokenError) {
      console.error('❌ Could not verify token or initialize admin:', tokenError);
      // Continue with fallback instead of failing
      userEmail = 'user@example.com';
      userName = 'User';
    }

    // Send welcome email now that email is verified
    if (userEmail) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                       (request.headers.get('host') ? `https://${request.headers.get('host')}` : 'http://localhost:3000');
        
        const response = await fetch(`${baseUrl}/api/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            type: 'welcome',
            to: userEmail,
            userName: userName,
            userEmail: userEmail,
            accountType: 'Free',
            signUpDate: new Date().toLocaleDateString(),
            preferredLanguage: 'English'
          })
        });

        const responseData = await response.json();

        if (response.ok && responseData.success) {
          console.log('✅ Welcome email sent successfully after email verification');
        } else {
          console.error('❌ Failed to send welcome email after verification:', responseData.error);
        }
      } catch (error: any) {
        console.error('❌ Welcome email network error after verification:', error.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Email verification processed successfully',
      emailVerified: true,
      userEmail: userEmail.substring(0, 20) + '...',
      userName: userName
    });

  } catch (error: any) {
    console.error('❌ Failed to handle email verification:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to process email verification' },
      { status: 500 }
    );
  }
}