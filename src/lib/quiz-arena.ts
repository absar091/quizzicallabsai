// 🔥 Quiz Arena - Live Multiplayer Quiz Architecture
// Based on the user's expert blueprint

import { firestore } from './firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  Timestamp,
  deleteDoc
} from 'firebase/firestore';
import { ReliableListener } from './firebase-listeners';
import { QUIZ_ARENA_CONSTANTS } from './quiz-arena-constants';

// 🎯 TypeScript Interfaces (matching the blueprint)

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  type?: string;
}

export interface QuizArenaRoom {
  roomId: string;
  hostId: string;
  started: boolean;
  finished: boolean;
  currentQuestion: number;
  quiz: QuizQuestion[];
  createdAt: Timestamp;
  startedAt?: Timestamp;
  finishedAt?: Timestamp;
  questionStartTime?: Timestamp;
  isPublic?: boolean;
}

export interface ArenaPlayer {
  userId: string;
  name: string;
  score: number;
  joinedAt: Timestamp;
}

export interface QuizArenaAnswer {
  userId: string;
  questionIndex: number;
  answerIndex: number;
  correct: boolean;
  submittedAt: Timestamp;
}

// 🚀 Quiz Arena Host Flow

export class QuizArenaHost {
  /**
   * Create a new quiz room
   */
  static async createRoom(
    roomId: string,
    hostId: string,
    hostName: string,
    quiz: QuizQuestion[]
  ): Promise<QuizArenaRoom> {
    const room: QuizArenaRoom = {
      roomId,
      hostId,
      started: false,
      finished: false,
      currentQuestion: -1, // -1 means waiting room
      quiz,
      createdAt: Timestamp.now()
    };

    try {
      // Create room document
      await setDoc(doc(firestore, 'quiz-rooms', roomId), room);

      // Add host as first player
      await QuizArenaPlayer.joinRoom(roomId, hostId, hostName);

      return room;
    } catch (error) {
      console.error('Failed to create room:', error);
      throw new Error(QUIZ_ARENA_CONSTANTS.ERRORS.CREATION_FAILED);
    }
  }

  /**
   * Start the quiz - only host can do this
   */
  static async startQuiz(roomId: string, hostId: string): Promise<void> {
    const roomRef = doc(firestore, 'quiz-rooms', roomId);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) throw new Error(QUIZ_ARENA_CONSTANTS.ERRORS.ROOM_NOT_FOUND);
    const room = roomSnap.data() as QuizArenaRoom;

    if (room.hostId !== hostId) throw new Error(QUIZ_ARENA_CONSTANTS.ERRORS.HOST_ONLY);
    if (room.started) throw new Error(QUIZ_ARENA_CONSTANTS.ERRORS.QUIZ_ALREADY_STARTED);

    // Check minimum players and validate they're still connected
    const playersSnap = await getDocs(collection(firestore, `quiz-rooms/${roomId}/players`));
    if (playersSnap.size < QUIZ_ARENA_CONSTANTS.MIN_PLAYERS_TO_START) {
      throw new Error(QUIZ_ARENA_CONSTANTS.ERRORS.MIN_PLAYERS);
    }

    // Validate host is still in the room
    const hostExists = playersSnap.docs.some(doc => doc.id === hostId);
    if (!hostExists) {
      throw new Error('Host is no longer in the room');
    }

    try {
      // Start quiz and set first question with server timestamp
      await updateDoc(roomRef, {
        started: true,
        currentQuestion: 0,
        startedAt: Timestamp.now(),
        questionStartTime: Timestamp.now() // For timer sync
      });
    } catch (error) {
      throw new Error('Failed to start quiz');
    }
  }

  /**
   * Move to next question - only host can do this
   */
  static async nextQuestion(roomId: string, hostId: string): Promise<void> {
    const roomRef = doc(firestore, 'quiz-rooms', roomId);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) throw new Error(QUIZ_ARENA_CONSTANTS.ERRORS.ROOM_NOT_FOUND);
    const room = roomSnap.data() as QuizArenaRoom;

    if (room.hostId !== hostId) throw new Error(QUIZ_ARENA_CONSTANTS.ERRORS.HOST_ONLY);
    if (!room.started) throw new Error(QUIZ_ARENA_CONSTANTS.ERRORS.QUIZ_NOT_STARTED);
    if (room.finished) throw new Error(QUIZ_ARENA_CONSTANTS.ERRORS.QUIZ_FINISHED);
    if (room.currentQuestion >= room.quiz.length - 1) {
      // Finish the quiz
      await this.finishQuiz(roomId, hostId);
      return;
    }

    try {
      await updateDoc(roomRef, {
        currentQuestion: room.currentQuestion + 1,
        questionStartTime: Timestamp.now() // Reset timer for all clients
      });
    } catch (error) {
      console.error('Failed to advance question:', error);
      throw new Error('Failed to advance to next question');
    }
  }

  /**
   * Finish the quiz
   */
  static async finishQuiz(roomId: string, hostId: string): Promise<void> {
    const roomRef = doc(firestore, 'quiz-rooms', roomId);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) throw new Error(QUIZ_ARENA_CONSTANTS.ERRORS.ROOM_NOT_FOUND);
    const room = roomSnap.data() as QuizArenaRoom;

    if (room.hostId !== hostId) throw new Error(QUIZ_ARENA_CONSTANTS.ERRORS.HOST_ONLY);

    try {
      await updateDoc(roomRef, {
        finished: true,
        finishedAt: Timestamp.now()
      });
    } catch (error) {
      throw new Error('Failed to finish quiz');
    }
  }

  /**
   * Listen to room state (for host dashboard) with host presence tracking
   */
  static listenToRoom(roomId: string, callback: (data: QuizArenaRoom | null) => void): () => void {
    const listener = new ReliableListener(
      doc(firestore, 'quiz-rooms', roomId),
      (data) => {
        if (data) {
          // Update host last seen timestamp
          this.updateHostPresence(roomId).catch(console.error);
        }
        callback(data);
      },
      () => callback(null)
    );
    listener.start();
    return () => listener.stop();
  }

  /**
   * Update host presence timestamp
   */
  static async updateHostPresence(roomId: string): Promise<void> {
    try {
      const roomRef = doc(firestore, 'quiz-rooms', roomId);
      await updateDoc(roomRef, {
        hostLastSeen: Timestamp.now()
      });
    } catch (error) {
      // Silently fail - this is just for presence tracking
      console.warn('Failed to update host presence:', error);
    }
  }

  /**
   * Check if host is still present (called by participants)
   */
  static async checkHostPresence(roomId: string): Promise<boolean> {
    try {
      const roomRef = doc(firestore, 'quiz-rooms', roomId);
      const roomSnap = await getDoc(roomRef);
      
      if (!roomSnap.exists()) return false;
      
      const roomData = roomSnap.data() as QuizArenaRoom & { hostLastSeen?: Timestamp };
      
      if (!roomData.hostLastSeen) return true; // Assume present if no timestamp
      
      const timeSinceLastSeen = Date.now() - roomData.hostLastSeen.toMillis();
      const hostTimeout = 60000; // 1 minute timeout
      
      return timeSinceLastSeen < hostTimeout;
    } catch (error) {
      console.error('Error checking host presence:', error);
      return true; // Assume present on error
    }
  }

  /**
   * Handle host abandonment - promote a participant to host
   */
  static async handleHostAbandonment(roomId: string): Promise<string | null> {
    try {
      const playersSnapshot = await getDocs(
        collection(firestore, `quiz-rooms/${roomId}/players`)
      );

      if (playersSnapshot.empty) return null;

      // Find the player who joined earliest (excluding current host)
      const players = playersSnapshot.docs.map(doc => ({
        userId: doc.id,
        ...doc.data()
      })) as (ArenaPlayer & { userId: string })[];

      const roomRef = doc(firestore, 'quiz-rooms', roomId);
      const roomSnap = await getDoc(roomRef);
      
      if (!roomSnap.exists()) return null;
      
      const roomData = roomSnap.data() as QuizArenaRoom;
      
      // Find new host (earliest joiner who isn't the current host)
      const newHost = players
        .filter(p => p.userId !== roomData.hostId)
        .sort((a, b) => a.joinedAt.toMillis() - b.joinedAt.toMillis())[0];

      if (!newHost) return null;

      // Update room with new host
      await updateDoc(roomRef, {
        hostId: newHost.userId,
        hostTransferredAt: Timestamp.now(),
        previousHostId: roomData.hostId
      });

      return newHost.userId;
    } catch (error) {
      console.error('Error handling host abandonment:', error);
      return null;
    }
  }
}

// 🎮 Quiz Arena Player Flow

export class QuizArenaPlayer {
  /**
   * Join an existing room with optimized connection
   */
  static async joinRoom(
    roomId: string,
    userId: string,
    userName: string
  ): Promise<void> {
    const player: ArenaPlayer = {
      userId,
      name: userName,
      score: 0,
      joinedAt: Timestamp.now()
    };

    // Optimized: Use setDoc with merge to reduce database operations
    const playerRef = doc(firestore, `quiz-rooms/${roomId}/players`, userId);
    
    try {
      await setDoc(playerRef, player, { merge: true });
    } catch (error) {
      console.error('Failed to join room:', error);
      throw new Error(QUIZ_ARENA_CONSTANTS.ERRORS.JOIN_FAILED);
    }
  }

  /**
   * Leave a room (allows players to exit before quiz starts)
   */
  static async leaveRoom(
    roomId: string,
    userId: string
  ): Promise<void> {
    try {
      // Remove player from players subcollection
      await deleteDoc(doc(firestore, `quiz-rooms/${roomId}/players`, userId));
    } catch (error) {
      console.error('Failed to leave room:', error);
      throw new Error(QUIZ_ARENA_CONSTANTS.ERRORS.LEAVE_FAILED);
    }
  }

  /**
   * Get room players with scores (for leaderboard)
   */
  static async getLeaderboard(roomId: string): Promise<ArenaPlayer[]> {
    const playersSnapshot = await getDocs(
      collection(firestore, `quiz-rooms/${roomId}/players`)
    );

    const players: ArenaPlayer[] = [];
    playersSnapshot.forEach((doc) => {
      players.push(doc.data() as ArenaPlayer);
    });

    // Sort by score descending
    return players.sort((a, b) => b.score - a.score);
  }

  /**
   * Listen to room state (for player dashboard)
   */
  static listenToRoom(roomId: string, callback: (data: QuizArenaRoom | null) => void): () => void {
    const listener = new ReliableListener(
      doc(firestore, 'quiz-rooms', roomId),
      callback,
      () => callback(null)
    );
    listener.start();
    return () => listener.stop();
  }

  /**
   * Listen to leaderboard changes
   */
  static listenToLeaderboard(roomId: string, callback: (players: ArenaPlayer[]) => void): () => void {
    const listener = new ReliableListener(
      collection(firestore, `quiz-rooms/${roomId}/players`),
      (players: ArenaPlayer[]) => {
        players.sort((a, b) => b.score - a.score);
        callback(players);
      }
    );
    listener.start();
    return () => listener.stop();
  }
}

// 🔍 Quiz Discovery & Utilities

export class QuizArenaDiscovery {
  /**
   * Get all public rooms
   */
  static async getPublicRooms(): Promise<QuizArenaRoom[]> {
    const q = query(
      collection(firestore, 'quiz-rooms'),
      where('isPublic', '==', true),
      where('started', '==', false)
    );

    const querySnapshot = await getDocs(q);
    const rooms: QuizArenaRoom[] = [];

    querySnapshot.forEach((doc) => {
      rooms.push({ roomId: doc.id, ...doc.data() } as QuizArenaRoom);
    });

    return rooms;
  }

  /**
   * Generate unique room code with enhanced collision detection
   */
  static async generateRoomCode(): Promise<string> {
    const maxAttempts = 20; // Increased attempts
    const usedCodes = new Set<string>();
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      let code: string;
      
      // Use a more robust code generation strategy
      if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        // Use crypto.getRandomValues for better randomness
        const array = new Uint8Array(3);
        crypto.getRandomValues(array);
        code = Array.from(array, byte => 
          'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[byte % 36]
        ).join('') + 
        Array.from(crypto.getRandomValues(new Uint8Array(3)), byte => 
          'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[byte % 36]
        ).join('');
      } else if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        // Fallback to randomUUID
        code = crypto.randomUUID().replace(/[^A-Z0-9]/g, '').substring(0, 6);
        if (code.length < 6) {
          code = code.padEnd(6, Math.random().toString(36).substring(2, 8).toUpperCase());
        }
      } else {
        // Final fallback
        code = Math.random().toString(36).substring(2, 8).toUpperCase();
        // Ensure it's exactly 6 characters
        while (code.length < 6) {
          code += Math.random().toString(36).substring(2, 3).toUpperCase();
        }
        code = code.substring(0, 6);
      }

      // Ensure code is exactly 6 characters and alphanumeric
      code = code.replace(/[^A-Z0-9]/g, '').substring(0, 6);
      if (code.length < 6) {
        continue; // Try again if code is too short
      }

      // Skip if we've already tried this code
      if (usedCodes.has(code)) {
        continue;
      }
      usedCodes.add(code);

      try {
        // Check if room code already exists
        const roomRef = doc(firestore, 'quiz-rooms', code);
        const roomSnap = await getDoc(roomRef);

        if (!roomSnap.exists()) {
          // Double-check by trying to create a placeholder
          try {
            await setDoc(roomRef, { 
              _placeholder: true, 
              _createdAt: Timestamp.now() 
            }, { merge: false });
            
            // If successful, delete placeholder and return code
            await updateDoc(roomRef, { _placeholder: null });
            return code;
          } catch (createError) {
            // If creation failed, code might be taken, try next
            console.warn('Code creation failed, trying next:', code);
            continue;
          }
        }
      } catch (error) {
        console.warn('Error checking room code:', code, error);
        continue;
      }
    }

    // Enhanced fallback with timestamp and random suffix
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomSuffix = Math.random().toString(36).substring(2, 4).toUpperCase();
    const fallbackCode = `${timestamp.substring(-2)}${randomSuffix}${Math.random().toString(36).substring(2, 4).toUpperCase()}`;
    
    return fallbackCode.substring(0, 6).padEnd(6, '0');
  }

  /**
   * Hash room code to minimize collisions
   */
  static hashRoomCode(code: string): string {
    return btoa(code).replace(/[^\w]/g, '').substring(0, 8);
  }

  /**
   * Validate room exists and is joinable
   */
  static async validateRoom(roomId: string): Promise<boolean> {
    try {
      const roomRef = doc(firestore, 'quiz-rooms', roomId);
      const roomSnap = await getDoc(roomRef);

      if (!roomSnap.exists()) return false;

      const room = roomSnap.data() as QuizArenaRoom;
      return !room.finished; // Can't join finished rooms
    } catch (error) {
      console.error('Error validating room:', error);
      return false;
    }
  }
}

// 🎊 Real-Time Event Types (for when we implement socket-like features)
export interface QuizArenaEvent {
  type: 'QUESTION_START' | 'QUESTION_END' | 'SCORE_UPDATE' | 'PLAYER_JOIN' | 'PLAYER_LEAVE' | 'QUIZ_FINISH';
  roomId: string;
  data: any;
}

// Singleton for arena management
export const QuizArena = {
  Host: QuizArenaHost,
  Player: QuizArenaPlayer,
  Discovery: QuizArenaDiscovery
};

export default QuizArena;
