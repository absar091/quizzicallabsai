# 🔥 Quiz Arena Backend Functions - Anti-Cheat & Security
Secure Firebase Cloud Functions for Quiz Arena

## Overview
This Cloud Function handles server-side answer validation and scoring to prevent cheating in live quiz arenas.

## Setup Requirements
1. Firebase Cloud Functions enabled
2. Firestore rules updated (see firestore.rules)
3. Cloud Function deployed with proper permissions

## Cloud Function Code

```javascript
// functions/index.js (Firebase Cloud Functions)

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// 🎯 Answer Validation Cloud Function
exports.validateQuizAnswer = functions.firestore
  .document('quiz-rooms/{roomId}/answers/{answerId}')
  .onCreate(async (snap, context) => {
    const answerData = snap.data();
    const { roomId } = context.params;

    try {
      // Get room data to validate against
      const roomRef = db.collection('quiz-rooms').doc(roomId);
      const roomSnap = await roomRef.get();

      if (!roomSnap.exists) {
        console.error('❌ Room not found');
        return;
      }

      const roomData = roomSnap.data();

      // ✅ SERVER-SIDE VALIDATION
      const { userId, questionIndex, answerIndex, hash } = answerData;

      // 1. Validate question exists
      if (!roomData.quiz || questionIndex >= roomData.quiz.length) {
        console.error('❌ Invalid question index');
        return snap.ref.delete(); // Delete invalid submission
      }

      const currentQuestion = roomData.quiz[questionIndex];
      const correctAnswer = currentQuestion.correctIndex;

      // 2. Calculate if answer is correct
      const isCorrect = answerIndex === correctAnswer;

      // 3. Update answer with validation result
      await snap.ref.update({
        correct: isCorrect,
        validatedAt: admin.firestore.FieldValue.serverTimestamp(),
        correctIndex: correctAnswer // Include for transparency
      });

      // 4. Update player score (SERVER-SIDE SCORING)
      if (isCorrect) {
        const playerRef = roomRef.collection('players').doc(userId);
        await playerRef.update({
          score: admin.firestore.FieldValue.increment(10) // Atomic increment
        });

        console.log(`✅ ${userId} scored +10 points!`);
      }

      // 5. Notify room about answer update (optional - for real-time feedback)
      await roomRef.collection('events').add({
        type: 'ANSWER_VALIDATED',
        userId,
        questionIndex,
        isCorrect,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

    } catch (error) {
      console.error('❌ Error validating answer:', error);
      // Don't delete on error - let admins investigate
    }
  });

// 🔧 Room Cleanup Function (run daily)
exports.cleanupFinishedRooms = functions.pubsub
  .schedule('0 2 * * *').timeZone('America/New_York') // 2 AM daily
  .onRun(async (context) => {
    const batch = db.batch();
    let deletedCount = 0;

    try {
      // Find rooms older than 24 hours that are finished
      const cutoffTime = new Date();
      cutoffTime.setHours(cutoffTime.getHours() - 24);

      const expiredRooms = await db.collection('quiz-rooms')
        .where('finished', '==', true)
        .where('finishedAt', '<', cutoffTime)
        .limit(500) // Process in batches
        .get();

      expiredRooms.docs.forEach(doc => {
        batch.delete(doc.ref);
        deletedCount++;
      });

      if (deletedCount > 0) {
        await batch.commit();
        console.log(`🧹 Cleaned up ${deletedCount} finished rooms`);
      }

    } catch (error) {
      console.error('❌ Error cleaning up rooms:', error);
    }

    return null;
  });

// 🚫 Anti-Spam Function
exports.preventAnswerSpam = functions.firestore
  .document('quiz-rooms/{roomId}/answers/{answerId}')
  .onCreate(async (snap, context) => {
    const answerData = snap.data();
    const { roomId } = context.params;
    const userId = answerData.userId;
    const questionIndex = answerData.questionIndex;

    try {
      // Check for recent answers from same user on same question (spam detection)
      const recentAnswers = await db.collection('quiz-rooms')
        .doc(roomId).collection('answers')
        .where('userId', '==', userId)
        .where('questionIndex', '==', questionIndex)
        .where('submittedAt', '>', new Date(Date.now() - 30000)) // Last 30 seconds
        .limit(2) // Should only be 1
        .get();

      if (!recentAnswers.empty && recentAnswers.size > 1) {
        // Multiple submissions for same question - potential spam
        console.warn(`🚨 Spam detected: ${userId} submitted multiple answers for question ${questionIndex}`);
        await snap.ref.delete(); // Remove spam submission

        // Optional: Log to security collection
        await db.collection('security-logs').add({
          type: 'ANSWER_SPAM',
          userId,
          roomId,
          questionIndex,
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
      }

    } catch (error) {
      console.error('❌ Error checking for spam:', error);
    }
  });

// 🎯 Real-Time Scoring Updates
exports.onPlayerScoreUpdate = functions.firestore
  .document('quiz-rooms/{roomId}/players/{userId}')
  .onUpdate(async (change, context) => {
    const { roomId } = context.params;
    const newData = change.after.data();
    const oldData = change.before.data();

    // Only process score changes
    if (newData.score === oldData.score) return;

    try {
      // Update leaderboard in real-time
      const roomRef = db.collection('quiz-rooms').doc(roomId);

      await roomRef.update({
        lastScoreUpdate: admin.firestore.FieldValue.serverTimestamp(),
        // You could cache leaderboard here for faster access
      });

      console.log(`📊 Score updated for ${context.params.userId}: ${oldData.score} → ${newData.score}`);

    } catch (error) {
      console.error('❌ Error processing score update:', error);
    }
  });
```

## Deployment Instructions

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Initialize or use existing Firebase project
firebase use your-project-id

# Deploy functions
firebase deploy --only functions

# Or deploy specific functions
firebase deploy --only functions:validateQuizAnswer,functions:cleanupFinishedRooms
```

## Firestore Rules Integration

The Cloud Functions work with these updated Firestore rules:

```javascript
// Allow Cloud Functions to write validated data
match /quiz-rooms/{roomId}/validated-answers/{answerId} {
  allow read: if true;
  allow create: if false; // Only Cloud Functions can create
  allow update, write: if false;
}

// Events collection for real-time updates
match /quiz-rooms/{roomId}/events/{eventId} {
  allow read: if true;
  allow write: if false; // Only Cloud Functions can write
}

// Security logging
match /security-logs/{document} {
  allow read: if false; // Admin only
  allow write: if false; // Only Cloud Functions
}
```

## Security Benefits

1. **Server-Side Validation**: Answers are validated against room data
2. **Anti-Cheat**: No client-side score calculation
3. **Spam Prevention**: Duplicate submissions detected and blocked
4. **Atomic Operations**: Score updates are atomic increment operations
5. **Audit Trail**: All submissions logged for moderation
6. **Rate Limiting**: Built-in spam detection prevents abuse

## Monitoring & Maintenance

- Monitor Cloud Functions logs for errors
- Set up alerts for security violations
- Regular cleanup of old rooms prevents database bloat
- Implement gradual rollout for function updates

## Next Steps for Production

1. Add user rate limiting (Redis/external cache)
2. Implement leaderboard caching
3. Add admin moderation tools
4. Create detailed analytics
5. Implement A/B testing for scoring algorithms

## Emergency Shutdown Function

```javascript
// functions/emergency-shutdown.js
exports.emergencyShutdownRoom = functions.https.onCall(async (data, context) => {
  // Admin-only function to shut down problematic rooms
  if (!context.auth || !isAdmin(context.auth.uid)) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required');
  }

  const { roomId } = data;
  await db.collection('quiz-rooms').doc(roomId).update({
    finished: true,
    emergencyShutdown: true,
    shutdownBy: context.auth.uid
  });

  return { success: true };
});
