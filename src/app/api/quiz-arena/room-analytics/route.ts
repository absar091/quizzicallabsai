import { NextRequest, NextResponse } from 'next/server';
import { firestore, auth } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.replace('Bearer ', '');
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const { searchParams } = new URL(request.url);
    const roomCode = searchParams.get('roomCode');

    if (!roomCode) {
      return NextResponse.json({ error: 'Room code required' }, { status: 400 });
    }

    const roomRef = firestore.collection('quiz-rooms').doc(roomCode.toUpperCase());
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const roomData = roomDoc.data();

    if (roomData?.hostId !== userId) {
      return NextResponse.json({ error: 'Only host can access analytics' }, { status: 403 });
    }

    const playersSnapshot = await firestore.collection('quiz-rooms').doc(roomCode.toUpperCase())
      .collection('players').get();

    const players = playersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const answersSnapshot = await firestore.collection('quiz-rooms').doc(roomCode.toUpperCase())
      .collection('answers').get();

    const answers = answersSnapshot.docs.map(doc => doc.data());

    const analytics = {
      roomInfo: {
        roomCode: roomCode.toUpperCase(),
        totalQuestions: roomData?.quiz?.length || 0,
        totalPlayers: players.length,
        started: roomData?.started || false,
        finished: roomData?.finished || false
      },
      playerStats: players.map(player => {
        const playerAnswers = answers.filter(a => a.userId === player.id);
        const correctAnswers = playerAnswers.filter(a => a.correct).length;
        
        return {
          userId: player.id,
          name: player.name,
          score: player.score || 0,
          correctAnswers,
          totalAnswers: playerAnswers.length,
          accuracy: playerAnswers.length > 0 ? (correctAnswers / playerAnswers.length * 100).toFixed(1) : '0.0'
        };
      }).sort((a, b) => b.score - a.score),
      summary: {
        averageScore: players.length > 0 ? 
          (players.reduce((sum, p) => sum + (p.score || 0), 0) / players.length).toFixed(1) : '0.0',
        totalAnswers: answers.length,
        correctAnswers: answers.filter(a => a.correct).length,
        overallAccuracy: answers.length > 0 ? 
          (answers.filter(a => a.correct).length / answers.length * 100).toFixed(1) : '0.0'
      }
    };

    return NextResponse.json(analytics);

  } catch (error: any) {
    console.error('Room analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}