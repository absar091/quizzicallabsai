import { NextRequest, NextResponse } from 'next/server';
import { firestore, auth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.replace('Bearer ', '');
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const { roomCode, questionIndex, answerIndex, submittedAt } = await request.json();

    if (!roomCode || questionIndex === undefined || answerIndex === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get room data
    const roomRef = firestore.collection('quiz-rooms').doc(roomCode.toUpperCase());
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const roomData = roomDoc.data();
    
    // Validate question and answer
    if (!roomData?.quiz || questionIndex >= roomData.quiz.length || answerIndex < 0 || answerIndex > 3) {
      return NextResponse.json({ error: 'Invalid question or answer' }, { status: 400 });
    }

    const question = roomData.quiz[questionIndex];
    const isCorrect = answerIndex === question.correctIndex;
    const points = isCorrect ? 10 : 0;

    // Store answer
    const answerRef = firestore.collection('quiz-rooms').doc(roomCode.toUpperCase())
      .collection('answers').doc(`${userId}_${questionIndex}`);
    
    await answerRef.set({
      userId,
      questionIndex,
      answerIndex,
      correct: isCorrect,
      points,
      submittedAt: new Date(submittedAt || Date.now())
    });

    // Update player score
    const playerRef = firestore.collection('quiz-rooms').doc(roomCode.toUpperCase())
      .collection('players').doc(userId);
    
    const playerDoc = await playerRef.get();
    if (playerDoc.exists) {
      const currentScore = playerDoc.data()?.score || 0;
      await playerRef.update({
        score: currentScore + points
      });
    }

    return NextResponse.json({
      success: true,
      correct: isCorrect,
      points,
      correctAnswer: question.options[question.correctIndex]
    });

  } catch (error: any) {
    console.error('Submit answer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}