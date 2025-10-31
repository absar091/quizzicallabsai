import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { firestore } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  let roomCode: string | undefined;
  let userId: string | undefined;
  
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized - Missing or invalid authorization header' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      userId = decodedToken.uid;
    } catch (authError) {
      console.error('Token verification failed:', authError);
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
    }

    const requestBody = await request.json();
    const { roomCode: reqRoomCode, questionIndex, answerIndex, submittedAt, submissionId } = requestBody;
    roomCode = reqRoomCode;

    // Enhanced input validation
    if (!roomCode || typeof roomCode !== 'string') {
      return NextResponse.json({ error: 'Invalid room code' }, { status: 400 });
    }

    if (typeof questionIndex !== 'number' || questionIndex < 0) {
      return NextResponse.json({ error: 'Invalid question index' }, { status: 400 });
    }

    if (typeof answerIndex !== 'number' || answerIndex < 0) {
      return NextResponse.json({ error: 'Invalid answer index' }, { status: 400 });
    }

    if (!submittedAt || typeof submittedAt !== 'number') {
      return NextResponse.json({ error: 'Invalid submission timestamp' }, { status: 400 });
    }

    // Get room data with timeout
    const roomRef = firestore.collection('quiz-rooms').doc(roomCode.toUpperCase());
    
    let roomDoc;
    try {
      roomDoc = await Promise.race([
        roomRef.get(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
      ]) as FirebaseFirestore.DocumentSnapshot;
    } catch (timeoutError) {
      console.error('Room fetch timeout:', timeoutError);
      return NextResponse.json({ error: 'Request timeout - please try again' }, { status: 408 });
    }

    if (!roomDoc.exists) {
      return NextResponse.json({ error: 'Room not found or expired' }, { status: 404 });
    }

    const roomData = roomDoc.data();
    
    // Enhanced quiz state validation
    if (!roomData?.started) {
      return NextResponse.json({ error: 'Quiz has not started yet' }, { status: 400 });
    }

    if (roomData.finished) {
      return NextResponse.json({ error: 'Quiz has already finished' }, { status: 410 });
    }

    if (questionIndex !== roomData.currentQuestion) {
      return NextResponse.json({ 
        error: 'Question mismatch', 
        details: {
          submitted: questionIndex,
          current: roomData.currentQuestion
        }
      }, { status: 400 });
    }

    // Validate question exists
    if (!roomData.quiz || !Array.isArray(roomData.quiz) || questionIndex >= roomData.quiz.length) {
      return NextResponse.json({ error: 'Invalid question' }, { status: 400 });
    }

    // Check submission timing (prevent submissions too far in the past/future)
    const now = Date.now();
    const submissionAge = now - submittedAt;
    if (submissionAge > 60000 || submissionAge < -5000) { // 1 minute old or 5 seconds in future
      return NextResponse.json({ error: 'Submission timestamp out of range' }, { status: 400 });
    }

    // Check for duplicate submission with enhanced logic
    const answerId = `${userId}_${questionIndex}`;
    const existingAnswerRef = firestore
      .collection('quiz-rooms')
      .doc(roomCode.toUpperCase())
      .collection('answers')
      .doc(answerId);

    const existingAnswer = await existingAnswerRef.get();

    if (existingAnswer.exists) {
      const existingData = existingAnswer.data();
      
      // Return the existing result instead of error for better UX
      return NextResponse.json({
        correct: existingData?.correct || false,
        points: existingData?.points || 0,
        correctAnswer: roomData.quiz[questionIndex].options[roomData.quiz[questionIndex].correctIndex],
        alreadySubmitted: true
      });
    }

    // Validate answer and calculate score
    const question = roomData.quiz[questionIndex];
    if (!question || !question.options || !Array.isArray(question.options)) {
      return NextResponse.json({ error: 'Invalid question data' }, { status: 500 });
    }

    // FIXED: Validate answer index against actual options length
    if (answerIndex >= question.options.length) {
      return NextResponse.json({ error: 'Answer index out of range for this question' }, { status: 400 });
    }

    const isCorrect = answerIndex === question.correctIndex;
    const points = isCorrect ? 10 : 0;

    // Use transaction for atomic updates with retry logic
    let transactionAttempts = 0;
    const maxTransactionAttempts = 3;

    while (transactionAttempts < maxTransactionAttempts) {
      try {
        await firestore.runTransaction(async (transaction) => {
          // Double-check for duplicate within transaction
          const existingCheck = await transaction.get(existingAnswerRef);
          if (existingCheck.exists) {
            throw new Error('DUPLICATE_SUBMISSION');
          }

          // Store answer with enhanced metadata
          transaction.set(existingAnswerRef, {
            userId,
            questionIndex,
            answerIndex,
            correct: isCorrect,
            points,
            submittedAt: new Date(submittedAt),
            serverTimestamp: new Date(),
            submissionId: submissionId || `${userId}_${questionIndex}_${Date.now()}`,
            roomCode: roomCode.toUpperCase()
          });

          // Update player score
          const playerRef = firestore
            .collection('quiz-rooms')
            .doc(roomCode.toUpperCase())
            .collection('players')
            .doc(userId);

          const playerDoc = await transaction.get(playerRef);
          if (playerDoc.exists) {
            const currentScore = playerDoc.data()?.score || 0;
            transaction.update(playerRef, {
              score: currentScore + points,
              lastAnswerAt: new Date(),
              totalAnswers: (playerDoc.data()?.totalAnswers || 0) + 1
            });
          } else {
            // Player doesn't exist, create them
            transaction.set(playerRef, {
              userId,
              name: 'Unknown Player',
              score: points,
              joinedAt: new Date(),
              lastAnswerAt: new Date(),
              totalAnswers: 1
            });
          }
        });

        // Transaction successful, break out of retry loop
        break;

      } catch (transactionError: any) {
        transactionAttempts++;
        
        if (transactionError.message === 'DUPLICATE_SUBMISSION') {
          // Handle duplicate gracefully
          const duplicateAnswer = await existingAnswerRef.get();
          const duplicateData = duplicateAnswer.data();
          
          return NextResponse.json({
            correct: duplicateData?.correct || false,
            points: duplicateData?.points || 0,
            correctAnswer: question.options[question.correctIndex],
            alreadySubmitted: true
          });
        }

        if (transactionAttempts >= maxTransactionAttempts) {
          console.error('Transaction failed after retries:', transactionError);
          throw transactionError;
        }

        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, transactionAttempts - 1)));
      }
    }

    return NextResponse.json({
      correct: isCorrect,
      points,
      correctAnswer: question.options[question.correctIndex],
      submissionId: submissionId || `${userId}_${questionIndex}_${Date.now()}`
    });

  } catch (error: any) {
    console.error('Submit answer error:', {
      error: error.message,
      stack: error.stack,
      roomCode,
      userId,
      timestamp: new Date().toISOString()
    });

    // Return appropriate error based on error type
    if (error.message?.includes('timeout')) {
      return NextResponse.json({ error: 'Request timeout - please try again' }, { status: 408 });
    }

    if (error.message?.includes('permission')) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    if (error.message?.includes('network')) {
      return NextResponse.json({ error: 'Network error - please check your connection' }, { status: 503 });
    }

    return NextResponse.json({ 
      error: 'Server error - please try again',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}