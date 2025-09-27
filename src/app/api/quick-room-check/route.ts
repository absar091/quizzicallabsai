import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomCode = searchParams.get('code');

    if (!roomCode) {
      return NextResponse.json({ error: 'Room code required' }, { status: 400 });
    }

    // Quick room validation
    const roomRef = firestore.collection('quiz-rooms').doc(roomCode.toUpperCase());
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      return NextResponse.json({ exists: false }, { status: 404 });
    }

    const roomData = roomDoc.data();
    
    return NextResponse.json({
      exists: true,
      started: roomData?.started || false,
      finished: roomData?.finished || false,
      playerCount: roomData?.playerCount || 0
    });

  } catch (error) {
    console.error('Quick room check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}