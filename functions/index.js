// 🔥 Quiz Arena Firebase Cloud Functions
// Anti-Cheat Security & Real-Time Processing
// Version: 2.0.0 - Production Ready

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto-js');

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// 🚨 SECURITY & MONITORING CONFIG
const CONFIG = {
  MAX_ANSWERS_PER_MINUTE: 10,
  CLEANUP_HOURS: 24,
  SPAM_DETECTION_WINDOW: 30, // seconds
  ALERT_EMAIL: functions.config().monitoring?.alert_email || 'admin@yoursite.com'
};

// 📊 SECURITY MONITORING
const logSecurityEvent = (type, data) => {
  console.warn(`🛡️ SECURITY: ${type}`, JSON.stringify(data, null, 2));

  return db.collection('security-logs').add({
    type,
    data,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    severity: type.includes('SPAM') || type.includes('CHEAT') ? 'HIGH' : 'MEDIUM'
  });
};

// 🧹 UTILITY FUNCTIONS
const validateAnswerData = (roomId, answerData) => {
  const { userId, questionIndex, answerIndex, hash } = answerData;

  // Basic validation
  if (!userId || !hash || typeof questionIndex !== 'number' || typeof answerIndex !== 'number') {
    throw new Error('Invalid answer data structure');
  }

  // Validate hash integrity (anti-cheat)
  const expectedHash = btoa(JSON.stringify({
    roomId,
    userId,
    questionIndex,
    answerIndex,
    timestamp: Math.floor(Date.now() / 10000) // 10-second tolerance
  })).replace(/[^a-zA-Z0-9]/g, '');

  if (hash !== expectedHash) {
    throw new Error('Hash validation failed - possible cheating');
  }

  return true;
};

// 🎯 ANSWER VALIDATION CLOUD FUNCTION
exports.validateQuizAnswer = functions.firestore
  .document('quiz-rooms/{roomId}/answers/{answerId}')
  .onCreate(async (snap, context) => {
    const answerData = snap.data();
    const { roomId } = context.params;

    try {
      // 🔒 SECURITY: Validate answer integrity
      validateAnswerData(roomId, answerData);

      // Get room data for validation
      const roomRef = db.collection('quiz-rooms').doc(roomId);
      const roomSnap = await roomRef.get();

      if (!roomSnap.exists()) {
        throw new Error('Room not found');
      }

      const roomData = roomSnap.data();
      const { userId, questionIndex, answerIndex } = answerData;

      // ✅ VALIDATE QUESTION EXISTS
      if (!roomData.quiz || questionIndex >= roomData.quiz.length) {
        await logSecurityEvent('INVALID_QUESTION_ACCESS', {
          userId,
          roomId,
          questionIndex,
          attemptTime: Date.now()
        });
        return snap.ref.delete();
      }

      const currentQuestion = roomData.quiz[questionIndex];
      const correctAnswer = currentQuestion.correctIndex;
      const isCorrect = answerIndex === correctAnswer;

      // 📝 UPDATE ANSWER WITH VALIDATION RESULT
      await snap.ref.update({
        correct: isCorrect,
        validatedAt: admin.firestore.FieldValue.serverTimestamp(),
        correctIndex: correctAnswer,
        validationServer: functions.config().firebase?.projectId || 'quiz-arena'
      });

      // 🏆 UPDATE PLAYER SCORE (SERVER-SIDE ONLY)
      if (isCorrect) {
        const playerRef = roomRef.collection('players').doc(userId);
        await playerRef.update({
          score: admin.firestore.FieldValue.increment(10),
          correctAnswers: admin.firestore.FieldValue.increment(1)
        });

        console.log(`🎯 ${userId} scored +10 points in ${roomId}`);
      } else {
        const playerRef = roomRef.collection('players').doc(userId);
        await playerRef.update({
          incorrectAnswers: admin.firestore.FieldValue.increment(1)
        });
      }

      // 📊 NOTIFY ROOM ABOUT ANSWER VALIDATION
      await roomRef.collection('events').add({
        type: 'ANSWER_VALIDATED',
        userId,
        questionIndex,
        isCorrect,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        points: isCorrect ? 10 : 0
      });

      return null;

    } catch (error) {
      console.error('❌ Answer validation error:', error);

      await logSecurityEvent('ANSWER_VALIDATION_ERROR', {
        roomId,
        error: error.message,
        answerData: { ...answerData, hash: '[REDACTED]' }
      });

      // Delete invalid submissions
      return snap.ref.delete();
    }
  });

// 🚫 SPAM PREVENTION FUNCTION
exports.preventAnswerSpam = functions.firestore
  .document('quiz-rooms/{roomId}/answers/{answerId}')
  .onCreate(async (snap, context) => {
    const answerData = snap.data();
    const { roomId } = context.params;
    const userId = answerData.userId;
    const questionIndex = answerData.questionIndex;

    try {
      // Check for spam (multiple submissions for same question)
      const recentAnswers = await db.collection('quiz-rooms')
        .doc(roomId).collection('answers')
        .where('userId', '==', userId)
        .where('questionIndex', '==', questionIndex)
        .where('submittedAt', '>', new Date(Date.now() - CONFIG.SPAM_DETECTION_WINDOW * 1000))
        .limit(3) // Should only be 1 or 2 max
        .get();

      if (!recentAnswers.empty && recentAnswers.size > 1) {
        // 🚨 SPAM DETECTED
        const spamDetails = {
          userId,
          roomId,
          questionIndex,
          submissionCount: recentAnswers.size,
          timeWindow: CONFIG.SPAM_DETECTION_WINDOW,
          timestamp: Date.now()
        };

        console.warn('🚨 Answer spam detected:', JSON.stringify(spamDetails, null, 2));

        await logSecurityEvent('ANSWER_SPAM_DETECTED', spamDetails);

        // Remove spam submission
        await snap.ref.delete();

        // Optional: Notify admin
        if (CONFIG.ALERT_EMAIL) {
          // Send email alert here (implement with SendGrid/Nodemailer)
          console.log(`📧 Spam alert would be sent to ${CONFIG.ALERT_EMAIL}`);
        }

        return null;
      }

    } catch (error) {
      console.error('❌ Spam detection error:', error);
      return null;
    }
  });

// 🎯 BUZZER SYSTEM (Real-Time Competition)
exports.handleBuzzer = functions.firestore
  .document('quiz-rooms/{roomId}/buzzes/{buzzId}')
  .onCreate(async (snap, context) => {
    const buzzData = snap.data();
    const { roomId } = context.params;

    try {
      const { userId, timestamp } = buzzData;
      const roomRef = db.collection('quiz-rooms').doc(roomId);

      // Get all buzzes for this room
      const buzzesRef = roomRef.collection('buzzes');
      const allBuzzesSnap = await buzzesRef.orderBy('timestamp').get();
      const allBuzzes = allBuzzesSnap.docs.map(doc => doc.data());

      // Calculate buzzer order (first to buzz gets priority)
      const buzzerOrder = allBuzzes.findIndex(buzz => buzz.userId === userId) + 1;

      // Update buzzer with order
      await snap.ref.update({
        order: buzzerOrder,
        processedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Notify all clients about buzzer update
      await roomRef.collection('events').add({
        type: 'BUZZER_UPDATE',
        userId,
        order: buzzerOrder,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`🔔 ${userId} buzzed in position ${buzzerOrder} for room ${roomId}`);

    } catch (error) {
      console.error('❌ Buzzer handling error:', error);
      return null;
    }
  });

// 🧹 ROOM CLEANUP FUNCTION
exports.cleanupFinishedRooms = functions.pubsub
  .schedule(`every ${CONFIG.CLEANUP_HOURS} hours`)
  .timeZone('America/New_York')
  .onRun(async (context) => {
    console.log('🧹 Starting room cleanup...');

    try {
      const cutoffTime = new Date();
      cutoffTime.setHours(cutoffTime.getHours() - CONFIG.CLEANUP_HOURS);

      const expiredRoomsQuery = db.collection('quiz-rooms')
        .where('finished', '==', true)
        .where('finishedAt', '<', cutoffTime);

      const batch = db.batch();
      let deletedCount = 0;
      let batchCount = 0;

      const expiredRooms = await expiredRoomsQuery.limit(500).get();

      expiredRooms.docs.forEach(doc => {
        batch.delete(doc.ref);
        deletedCount++;

        // Process in batches of 10
        if (++batchCount >= 10) {
          batch.commit();
          const newBatch = db.batch();
          batchCount = 0;
        }
      });

      // Commit remaining batch
      if (batchCount > 0) {
        await batch.commit();
      }

      console.log(`✅ Cleaned up ${deletedCount} expired rooms`);

      // Log cleanup activity
      await db.collection('system-logs').add({
        type: 'ROOM_CLEANUP',
        roomsDeleted: deletedCount,
        cutoffTime: cutoffTime.toISOString(),
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

    } catch (error) {
      console.error('❌ Room cleanup error:', error);
    }

    return null;
  });

// 📊 PERFORMANCE MONITORING
exports.monitorRoomPerformance = functions.firestore
  .document('quiz-rooms/{roomId}')
  .onUpdate(async (change, context) => {
    const { roomId } = context.params;
    const newData = change.after.data();
    const oldData = change.before.data();

    try {
      // Track room state changes
      if (newData.currentQuestion !== oldData.currentQuestion) {
        await db.collection('analytics').add({
          type: 'QUESTION_CHANGE',
          roomId,
          questionFrom: oldData.currentQuestion,
          questionTo: newData.currentQuestion,
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      // Track quiz completion
      if (newData.finished && !oldData.finished) {
        const playersRef = change.after.ref.collection('players');
        const playersSnap = await playersRef.get();
        const playerCount = playersSnap.size;

        const playerScores = [];
        playersSnap.forEach(player => {
          playerScores.push({
            userId: player.id,
            score: player.data().score || 0,
            name: player.data().name || 'Anonymous'
          });
        });

        await db.collection('completed-quizzes').add({
          roomId,
          playerCount,
          questionCount: newData.quiz?.length || 0,
          duration: newData.startedAt ? newData.finishedAt - newData.startedAt : null,
          playerScores,
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`🏁 Quiz ${roomId} completed with ${playerCount} players`);
      }

    } catch (error) {
      console.error('❌ Performance monitoring error:', error);
    }

    return null;
  });

// 🚨 SECURITY MONITORING FUNCTION
exports.monitorSecurityViolations = functions.firestore
  .document('security-logs/{logId}')
  .onCreate(async (snap, context) => {
    const logData = snap.data();
    const { type, severity } = logData;

    // Handle high severity alerts
    if (severity === 'HIGH') {
      console.error('🚨 HIGH SEVERITY SECURITY ALERT:', JSON.stringify(logData, null, 2));

      // In production, send email/SMS alerts to admin
      // Integration with PagerDuty, Slack, or email service
      await db.collection('alerts').add({
        type: 'SECURITY_ALERT',
        securityLogId: context.params.logId,
        priority: 'HIGH',
        notified: false,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    return null;
  });

// 🎯 PLAYER RANKING UPDATE
exports.updateGlobalRankings = functions.firestore
  .document('quiz-rooms/{roomId}')
  .onUpdate(async (change, context) => {
    const { roomId } = context.params;

    if (!change.after.data().finished) return;

    try {
      // Update global leaderboard
      const playersRef = change.after.ref.collection('players');
      const playersSnap = await playersRef.get();

      // Process each player's score for global rankings
      const promises = playersSnap.docs.map(async (playerDoc) => {
        const playerData = playerDoc.data();
        const userId = playerDoc.id;
        const score = playerData.score || 0;

        if (score > 0) {
          // Update user's global stats
          const userStatsRef = db.collection('user-stats').doc(userId);
          await userStatsRef.set({
            userId,
            totalScore: admin.firestore.FieldValue.increment(score),
            quizzesPlayed: admin.firestore.FieldValue.increment(1),
            lastPlayed: admin.firestore.FieldValue.serverTimestamp(),
            name: playerData.name || 'Anonymous'
          }, { merge: true });
        }
      });

      await Promise.all(promises);
      console.log(`📈 Updated global rankings for ${roomId}`);

    } catch (error) {
      console.error('❌ Global ranking update error:', error);
    }

    return null;
  });

// 🔍 ADMIN EMERGENCY FUNCTIONS
exports.emergencyShutdownRoom = functions.https.onCall(async (data, context) => {
  // Only admins can call this
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  // Check if user is admin (implement your admin check logic)
  const isAdmin = await checkIsAdmin(context.auth.uid);
  if (!isAdmin) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required');
  }

  const { roomId, reason } = data;

  try {
    await db.collection('quiz-rooms').doc(roomId).update({
      finished: true,
      emergencyShutdown: true,
      shutdownBy: context.auth.uid,
      shutdownReason: reason,
      shutdownAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Log emergency action
    await logSecurityEvent('EMERGENCY_ROOM_SHUTDOWN', {
      roomId,
      shutdownBy: context.auth.uid,
      reason: reason || 'Admin emergency shutdown'
    });

    return { success: true, roomId };
  } catch (error) {
    console.error('Emergency shutdown error:', error);
    throw new functions.https.HttpsError('internal', 'Shutdown failed');
  }
});

// 🎮 MATCHMAKING HELPER FUNCTION
exports.findOptimalRoom = functions.https.onCall(async (data, context) => {
  try {
    const { skillLevel, topics, roomSize, difficulty } = data;

    // Find suitable rooms based on criteria
    const roomsQuery = db.collection('quiz-rooms')
      .where('isPublic', '==', true)
      .where('started', '==', false)
      .where('finished', '==', false)
      .where('difficulty', '==', difficulty);

    const roomsSnap = await roomsQuery.limit(20).get();
    const suitableRooms = [];

    roomsSnap.forEach(doc => {
      const roomData = doc.data();

      // Check criteria
      const roomTopic = roomData.topic?.toLowerCase();
      const matchingTopics = topics.some(topic =>
        roomTopic?.includes(topic.toLowerCase())
      );

      if (matchingTopics && roomData.playerCount < (roomData.maxPlayers || roomSize)) {
        suitableRooms.push({
          roomId: doc.id,
          ...roomData,
          compatibility: calculateRoomCompatibility(roomData, skillLevel, topics)
        });
      }
    });

    // Return best match or null
    const bestMatch = suitableRooms
      .sort((a, b) => b.compatibility - a.compatibility)[0];

    return bestMatch || null;

  } catch (error) {
    console.error('Matchmaking error:', error);
    throw new functions.https.HttpsError('internal', 'Matchmaking failed');
  }
});

// 🛠️ UTILITY FUNCTION
const checkIsAdmin = async (userId) => {
  // Implement your admin check logic here
  // e.g., check user document for admin role
  const userDoc = await db.collection('users').doc(userId).get();
  return userDoc.data()?.role === 'admin';
};

const calculateRoomCompatibility = (roomData, userSkill, userTopics) => {
  let score = 0;

  // Skill level match
  if (roomData.skillLevel === userSkill) score += 30;

  // Topic match
  const roomTopics = Array.isArray(roomData.topics) ? roomData.topics : [roomData.topic];
  const topicMatches = roomTopics.filter(roomTopic =>
    userTopics.some(userTopic =>
      roomTopic.toLowerCase().includes(userTopic.toLowerCase())
    )
  ).length;

  score += topicMatches * 20;

  // Player count optimization
  const playerRatio = roomData.playerCount / (roomData.maxPlayers || 20);
  if (playerRatio >= 0.3 && playerRatio <= 0.8) score += 20;

  return Math.min(score, 100);
};

// 🌐 EXPORTS
module.exports = {
  validateQuizAnswer,
  preventAnswerSpam,
  handleBuzzer,
  cleanupFinishedRooms,
  monitorRoomPerformance,
  monitorSecurityViolations,
  updateGlobalRankings,
  emergencyShutdownRoom,
  findOptimalRoom
};
