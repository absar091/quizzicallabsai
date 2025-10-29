import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Test verify request:', body);
    
    // Direct Firestore check
    const { firestore } = await import('@/lib/firebase-admin');
    const userDoc = await firestore.collection('users').doc('ahmadraoabsar@gmail.com').get();
    
    if (userDoc.exists) {
      const data = userDoc.data();
      console.log('User data:', data);
      
      if (data?.emailVerificationToken === '875649') {
        // Mark as verified
        await firestore.collection('users').doc('ahmadraoabsar@gmail.com').update({
          isEmailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpires: null
        });
        
        return NextResponse.json({ success: true, message: 'Verified successfully' });
      }
    }
    
    return NextResponse.json({ error: 'Code not found' }, { status: 400 });
  } catch (error: any) {
    console.error('Test verify error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}