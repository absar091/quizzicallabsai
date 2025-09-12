import { NextRequest, NextResponse } from 'next/server';
import { firestore as db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code')?.toUpperCase();

    if (!code) {
      return NextResponse.json({ error: 'Room code required' }, { status: 400 });
    }

    // Ultra-fast room validation (database lookup only)
    const roomRef = db.collection('quiz-rooms').doc(code);
    const roomSnap = await roomRef.get();

    if (!roomSnap.exists) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const roomData = roomSnap.data();

    // Validate room is joinable
    if (roomData?.finished) {
      return NextResponse.json({ error: 'Room finished' }, { status: 410 });
    }

    if (roomData?.started && !roomData?.allowLateJoining) {
      return NextResponse.json({ error: 'Room in progress' }, { status: 403 });
    }

    // Return room info for instant display
    return NextResponse.json({
      valid: true,
      roomId: code,
      hostName: roomData?.hostName || 'Host',
      playerCount: roomData?.playerCount || 1,
      maxPlayers: roomData?.maxPlayers || 10,
      quizLength: roomData?.quiz?.length || 0,
      started: roomData?.started || false
    });

  } catch (error) {
    console.error('Room check error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
