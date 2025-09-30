import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-middleware';
import { withRateLimit, RateLimitPresets } from '@/lib/api-rate-limiter';
import { db } from '@/lib/firebase-admin';

/**
 * POST /api/study-rooms/[roomId]/join
 * Join a study room
 */
export const POST = withRateLimit(
  RateLimitPresets.API_STANDARD,
  withAuth(async (request: NextRequest, user: any) => {
    try {
      // Extract roomId from URL
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/');
      const roomId = pathParts[pathParts.length - 2];

      if (!roomId) {
        return NextResponse.json(
          { error: 'Room ID is required' },
          { status: 400 }
        );
      }

      if (!db) {
        return NextResponse.json(
          { error: 'Database not available' },
          { status: 503 }
        );
      }

      const roomRef = db.ref(`study-rooms/${roomId}`);
      const snapshot = await roomRef.once('value');

      if (!snapshot.exists()) {
        return NextResponse.json(
          { error: 'Room not found' },
          { status: 404 }
        );
      }

      const room = snapshot.val();

      // Check if room is full
      if (room.participants >= room.maxParticipants) {
        return NextResponse.json(
          { error: 'Room is full' },
          { status: 403 }
        );
      }

      // Check if room is ended
      if (room.status === 'ended') {
        return NextResponse.json(
          { error: 'Room has ended' },
          { status: 403 }
        );
      }

      // Check password for private rooms
      if (!room.isPublic) {
        const body = await request.json();
        if (body.password !== room.password) {
          return NextResponse.json(
            { error: 'Incorrect password' },
            { status: 403 }
          );
        }
      }

      // Check if user is already in the room
      if (room.participantsList && room.participantsList[user.uid]) {
        return NextResponse.json({
          success: true,
          message: 'Already in room',
          roomId,
        });
      }

      // Add user to participants
      await roomRef.child('participants').set(room.participants + 1);
      await roomRef.child(`participantsList/${user.uid}`).set({
        uid: user.uid,
        displayName: user.displayName || user.email || 'Anonymous',
        photoURL: user.photoURL || null,
        joinedAt: Date.now(),
        isHost: false,
      });
      await roomRef.child('updatedAt').set(Date.now());

      return NextResponse.json({
        success: true,
        message: 'Joined room successfully',
        roomId,
      });
    } catch (error: any) {
      console.error('Error joining study room:', error);
      return NextResponse.json(
        { error: 'Failed to join study room', details: error.message },
        { status: 500 }
      );
    }
  })
);