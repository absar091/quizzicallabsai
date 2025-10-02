import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Room code required' }, { status: 400 });
    }

    const roomDoc = await firestore.collection('quiz-rooms').doc(code).get();
    
    if (!roomDoc.exists) {
      return NextResponse.json({ exists: false }, { status: 404 });
    }

    const roomData = roomDoc.data();
    return NextResponse.json({ 
      exists: true, 
      started: roomData?.started || false,
      finished: roomData?.finished || false 
    });

  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}