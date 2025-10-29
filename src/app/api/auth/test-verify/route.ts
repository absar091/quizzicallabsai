import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;
    console.log('Test verify request:', { email, code });
    
    // Direct Firestore check
    const { firestore } = await import('@/lib/firebase-admin');
    const userDoc = await firestore.collection('users').doc(email || 'ahmadraoabsar@gmail.com').get();
    
    if (userDoc.exists) {
      const data = userDoc.data();
      console.log('User data:', {
        storedCode: data?.emailVerificationToken,
        providedCode: code,
        expires: data?.emailVerificationExpires,
        now: Date.now()
      });
      
      if (data?.emailVerificationToken === code) {
        // Mark as verified
        await firestore.collection('users').doc(email || 'ahmadraoabsar@gmail.com').update({
          isEmailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpires: null
        });
        
        return NextResponse.json({ success: true, message: 'Verified successfully' });
      }
      
      return NextResponse.json({ 
        error: 'Code mismatch', 
        debug: {
          expected: data?.emailVerificationToken,
          received: code
        }
      }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'User not found' }, { status: 400 });
  } catch (error: any) {
    console.error('Test verify error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}