import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomCode = searchParams.get('code');

    if (!roomCode) {
      return NextResponse.json({ error: 'Room code required' }, { status: 400 });
    }

    const roomDoc = await firestore.collection('quiz-rooms').doc(roomCode.toUpperCase()).get();
    
    if (!roomDoc.exists) {
      return NextResponse.json({ valid: false, reason: 'Room not found' }, { status: 404 });
    }

    const roomData = roomDoc.data();
    
    if (roomData?.finished) {
      return NextResponse.json({ valid: false, reason: 'Quiz finished' }, { status: 410 });
    }

    return NextResponse.json({ 
      valid: true,
      roomData: {
        started: roomData?.started || false,
        playerCount: roomData?.playerCount || 0,
        questionCount: roomData?.quiz?.length || 0
      }
    });

  } catch (error) {
    console.error('Room validation error:', error);
    return NextResponse.json({ error: 'Validation failed' }, { status: 500 });
  }
}