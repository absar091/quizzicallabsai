import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { firestore } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const { roomCode, questionIndex, answerIndex, submittedAt } = await request.json();

    // Validate inputs
    if (!roomCode || questionIndex < 0 || answerIndex < 0 || answerIndex > 3) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Get room data
    const roomRef = firestore.collection('quiz-rooms').doc(roomCode);
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const roomData = roomDoc.data();
    
    // Validate quiz state
    if (!roomData?.started || roomData.finished) {
      return NextResponse.json({ error: 'Quiz not active' }, { status: 400 });
    }

    if (questionIndex !== roomData.currentQuestion) {
      return NextResponse.json({ error: 'Question mismatch' }, { status: 400 });
    }

    // Check for duplicate submission
    const answerId = `${userId}_${questionIndex}`;
    const existingAnswer = await firestore
      .collection('quiz-rooms')
      .doc(roomCode)
      .collection('answers')
      .doc(answerId)
      .get();

    if (existingAnswer.exists) {
      return NextResponse.json({ error: 'Answer already submitted' }, { status: 409 });
    }

    // Validate answer and calculate score
    const question = roomData.quiz[questionIndex];
    const isCorrect = answerIndex === question.correctIndex;
    const points = isCorrect ? 10 : 0;

    // Use transaction for atomic updates
    await firestore.runTransaction(async (transaction) => {
      // Store answer
      const answerRef = firestore
        .collection('quiz-rooms')
        .doc(roomCode)
        .collection('answers')
        .doc(answerId);

      transaction.set(answerRef, {
        userId,
        questionIndex,
        answerIndex,
        correct: isCorrect,
        points,
        submittedAt: new Date(submittedAt),
        serverTimestamp: new Date()
      });

      // Update player score
      const playerRef = firestore
        .collection('quiz-rooms')
        .doc(roomCode)
        .collection('players')
        .doc(userId);

      const playerDoc = await transaction.get(playerRef);
      if (playerDoc.exists) {
        const currentScore = playerDoc.data()?.score || 0;
        transaction.update(playerRef, {
          score: currentScore + points
        });
      }
    });

    return NextResponse.json({
      correct: isCorrect,
      points,
      correctAnswer: question.options[question.correctIndex]
    });

  } catch (error) {
    console.error('Submit answer error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}