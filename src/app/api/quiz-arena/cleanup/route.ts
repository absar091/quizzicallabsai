import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    // Clean up rooms older than 24 hours
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const roomsSnapshot = await firestore
      .collection('quiz-rooms')
      .where('createdAt', '<', cutoffTime)
      .get();

    const batch = firestore.batch();
    let deletedCount = 0;

    for (const roomDoc of roomsSnapshot.docs) {
      // Delete players subcollection
      const playersSnapshot = await firestore
        .collection('quiz-rooms')
        .doc(roomDoc.id)
        .collection('players')
        .get();

      playersSnapshot.docs.forEach(playerDoc => {
        batch.delete(playerDoc.ref);
      });

      // Delete answers subcollection
      const answersSnapshot = await firestore
        .collection('quiz-rooms')
        .doc(roomDoc.id)
        .collection('answers')
        .get();

      answersSnapshot.docs.forEach(answerDoc => {
        batch.delete(answerDoc.ref);
      });

      // Delete room document
      batch.delete(roomDoc.ref);
      deletedCount++;
    }

    await batch.commit();

    return NextResponse.json({ 
      message: `Cleaned up ${deletedCount} expired rooms`,
      deletedCount 
    });

  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
  }
}