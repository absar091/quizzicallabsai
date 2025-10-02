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

    // Check minimum players
    const playersSnap = await getDocs(collection(firestore, `quiz-rooms/${roomId}/players`));
    if (playersSnap.size < QUIZ_ARENA_CONSTANTS.MIN_PLAYERS_TO_START) {
      throw new Error(QUIZ_ARENA_CONSTANTS.ERRORS.MIN_PLAYERS);
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
   * Listen to room state (for host dashboard)
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
   * Generate unique room code with collision detection
   */
  static async generateRoomCode(): Promise<string> {
    const maxAttempts = 10;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      let code: string;
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        code = crypto.randomUUID().substring(0, 6).toUpperCase();
      } else {
        code = Math.random().toString(36).substring(2, 8).toUpperCase();
      }

      // Check if room code already exists
      const roomRef = doc(firestore, 'quiz-rooms', code);
      const roomSnap = await getDoc(roomRef);

      if (!roomSnap.exists()) {
        return code; // Unique code found
      }
      // If exists, loop will retry
    }

    // Fallback: add timestamp to ensure uniqueness
    const timestamp = Date.now().toString(36).substring(-3).toUpperCase();
    return `${Math.random().toString(36).substring(2, 5).toUpperCase()}${timestamp}`;
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
