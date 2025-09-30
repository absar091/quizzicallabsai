import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-middleware';
import { withRateLimit, RateLimitPresets } from '@/lib/api-rate-limiter';
import { db } from '@/lib/firebase-admin';

/**
 * GET /api/study-rooms
 * Fetch all active study rooms
 */
export const GET = withRateLimit(
  RateLimitPresets.API_READ,
  async (request: NextRequest) => {
    try {
      if (!db) {
        return NextResponse.json(
          { error: 'Database not available' },
          { status: 503 }
        );
      }

      const roomsRef = db.ref('study-rooms');
      const snapshot = await roomsRef
        .orderByChild('status')
        .equalTo('active')
        .once('value');

      const rooms: any[] = [];
      snapshot.forEach((childSnapshot) => {
        const room = childSnapshot.val();
        rooms.push({
          id: childSnapshot.key,
          ...room,
        });
      });

      // Sort by creation time (newest first)
      rooms.sort((a, b) => b.createdAt - a.createdAt);

      return NextResponse.json({
        success: true,
        rooms,
      });
    } catch (error: any) {
      console.error('Error fetching study rooms:', error);
      return NextResponse.json(
        { error: 'Failed to fetch study rooms', details: error.message },
        { status: 500 }
      );
    }
  }
);

/**
 * POST /api/study-rooms
 * Create a new study room
 */
export const POST = withRateLimit(
  RateLimitPresets.API_STANDARD,
  withAuth(async (request: NextRequest, user: any) => {
    try {
      const body = await request.json();
      const { name, subject, description, isPublic, maxParticipants, password } = body;

      // Validation
      if (!name || !subject || !description) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      if (name.length < 3 || name.length > 50) {
        return NextResponse.json(
          { error: 'Room name must be between 3 and 50 characters' },
          { status: 400 }
        );
      }

      if (description.length < 10 || description.length > 500) {
        return NextResponse.json(
          { error: 'Description must be between 10 and 500 characters' },
          { status: 400 }
        );
      }

      if (!isPublic && !password) {
        return NextResponse.json(
          { error: 'Password required for private rooms' },
          { status: 400 }
        );
      }

      if (!db) {
        return NextResponse.json(
          { error: 'Database not available' },
          { status: 503 }
        );
      }

      // Create room
      const roomsRef = db.ref('study-rooms');
      const newRoomRef = roomsRef.push();

      const roomData = {
        name,
        subject,
        description,
        hostId: user.uid,
        hostName: user.displayName || user.email || 'Anonymous',
        isPublic: isPublic !== false,
        maxParticipants: maxParticipants || 10,
        participants: 1,
        participantsList: {
          [user.uid]: {
            uid: user.uid,
            displayName: user.displayName || user.email || 'Anonymous',
            photoURL: user.photoURL || null,
            joinedAt: Date.now(),
            isHost: true,
          },
        },
        status: 'active',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // Add password for private rooms (in production, use proper encryption)
      if (!isPublic && password) {
        (roomData as any).password = password; // TODO: Hash this in production
      }

      await newRoomRef.set(roomData);

      return NextResponse.json({
        success: true,
        roomId: newRoomRef.key,
        room: {
          id: newRoomRef.key,
          ...roomData,
        },
      });
    } catch (error: any) {
      console.error('Error creating study room:', error);
      return NextResponse.json(
        { error: 'Failed to create study room', details: error.message },
        { status: 500 }
      );
    }
  })
);