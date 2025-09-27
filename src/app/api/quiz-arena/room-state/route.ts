import { NextRequest, NextResponse } from 'next/server';
import { firestore, auth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.replace('Bearer ', '');
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const { roomCode, action, data } = await request.json();

    if (!roomCode || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const roomRef = firestore.collection('quiz-rooms').doc(roomCode.toUpperCase());
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const roomData = roomDoc.data();

    if (roomData?.hostId !== userId) {
      return NextResponse.json({ error: 'Only host can modify room state' }, { status: 403 });
    }

    let updateData: any = {};

    switch (action) {
      case 'START_QUIZ':
        updateData = {
          started: true,
          currentQuestion: 0,
          startedAt: new Date()
        };
        break;

      case 'NEXT_QUESTION':
        const nextQuestion = (roomData?.currentQuestion || 0) + 1;
        if (nextQuestion >= (roomData?.quiz?.length || 0)) {
          updateData = {
            finished: true,
            finishedAt: new Date()
          };
        } else {
          updateData = {
            currentQuestion: nextQuestion,
            questionStartedAt: new Date()
          };
        }
        break;

      case 'FINISH_QUIZ':
        updateData = {
          finished: true,
          finishedAt: new Date()
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await roomRef.update(updateData);
    return NextResponse.json({ success: true, data: updateData });

  } catch (error: any) {
    console.error('Room state update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}