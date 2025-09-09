// 🔥 Quiz Arena - Live Multiplayer Quiz Architecture
// Based on the user's expert blueprint

import { firestore as db } from './firebase';
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
  Timestamp
} from 'firebase/firestore';

// 🎯 TypeScript Interfaces (matching the blueprint)

export interface QuizArenaRoom {
  roomId: string;
  hostId: string;
  started: boolean;
  finished: boolean;
  currentQuestion: number;
  quiz: any[]; // [{question, options[], correctIndex}]
  createdAt: Timestamp;
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
    quiz: any[]
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

    // Create room document
    await setDoc(doc(db, 'quiz-rooms', roomId), room);

    // Add host as first player
    await QuizArenaPlayer.joinRoom(roomId, hostId, hostName);

    return room;
  }

  /**
   * Start the quiz - only host can do this
   */
  static async startQuiz(roomId: string, hostId: string): Promise<void> {
    const roomRef = doc(db, 'quiz-rooms', roomId);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) throw new Error('Room not found');
    const room = roomSnap.data() as QuizArenaRoom;

    if (room.hostId !== hostId) throw new Error('Only host can start the quiz');
    if (room.started) throw new Error('Quiz already started');

    // Start quiz and set first question
    await updateDoc(roomRef, {
      started: true,
      currentQuestion: 0,
      startedAt: Timestamp.now()
    });
  }

  /**
   * Move to next question - only host can do this
   */
  static async nextQuestion(roomId: string, hostId: string): Promise<void> {
    const roomRef = doc(db, 'quiz-rooms', roomId);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) throw new Error('Room not found');
    const room = roomSnap.data() as QuizArenaRoom;

    if (room.hostId !== hostId) throw new Error('Only host can advance questions');
    if (room.finished) throw new Error('Quiz already finished');
    if (room.currentQuestion >= room.quiz.length - 1) {
      // Finish the quiz
      await this.finishQuiz(roomId, hostId);
      return;
    }

    await updateDoc(roomRef, {
      currentQuestion: room.currentQuestion + 1
    });
  }

  /**
   * Finish the quiz
   */
  static async finishQuiz(roomId: string, hostId: string): Promise<void> {
    const roomRef = doc(db, 'quiz-rooms', roomId);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) throw new Error('Room not found');
    const room = roomSnap.data() as QuizArenaRoom;

    if (room.hostId !== hostId) throw new Error('Only host can finish the quiz');

    await updateDoc(roomRef, {
      finished: true,
      finishedAt: Timestamp.now()
    });
  }

  /**
   * Listen to room state (for host dashboard)
   */
  static listenToRoom(roomId: string, callback: (data: any) => void): () => void {
    const unsubscribe = onSnapshot(doc(db, 'quiz-rooms', roomId), (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      }
    });
    return unsubscribe;
  }
}

// 🎮 Quiz Arena Player Flow

export class QuizArenaPlayer {
  /**
   * Join an existing room
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

    // Add player to players subcollection
    await setDoc(doc(db, `quiz-rooms/${roomId}/players`, userId), player);
  }

  /**
   * Submit answer for current question
   */
  static async submitAnswer(
    roomId: string,
    userId: string,
    questionIndex: number,
    answerIndex: number,
    correct: boolean
  ): Promise<void> {
    const answer: QuizArenaAnswer = {
      userId,
      questionIndex,
      answerIndex,
      correct,
      submittedAt: Timestamp.now()
    };

    // Create answer document
    const answerId = `${userId}_${questionIndex}`;
    await setDoc(doc(db, `quiz-rooms/${roomId}/answers`, answerId), answer);

    // Update player score if correct (client-side scoring for now)
    if (correct) {
      // Get current score and increment
      const playerRef = doc(db, `quiz-rooms/${roomId}/players`, userId);
      const playerSnap = await getDoc(playerRef);

      if (playerSnap.exists()) {
        const playerData = playerSnap.data() as ArenaPlayer;
        await updateDoc(playerRef, {
          score: playerData.score + 10 // 10 points per correct answer
        });
      }
    }
  }

  /**
   * Get room players with scores (for leaderboard)
   */
  static async getLeaderboard(roomId: string): Promise<ArenaPlayer[]> {
    const playersSnapshot = await getDocs(
      collection(db, `quiz-rooms/${roomId}/players`)
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
  static listenToRoom(roomId: string, callback: (data: any) => void): () => void {
    const unsubscribe = onSnapshot(doc(db, 'quiz-rooms', roomId), (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      }
    });
    return unsubscribe;
  }

  /**
   * Listen to leaderboard changes
   */
  static listenToLeaderboard(roomId: string, callback: (players: ArenaPlayer[]) => void): () => void {
    const unsubscribe = onSnapshot(
      collection(db, `quiz-rooms/${roomId}/players`),
      (snapshot) => {
        const players: ArenaPlayer[] = [];
        snapshot.forEach((doc) => {
          players.push(doc.data() as ArenaPlayer);
        });
        players.sort((a, b) => b.score - a.score);
        callback(players);
      }
    );
    return unsubscribe;
  }
}

// 🔍 Quiz Discovery & Utilities

export class QuizArenaDiscovery {
  /**
   * Get all public rooms
   */
  static async getPublicRooms(): Promise<QuizArenaRoom[]> {
    const q = query(
      collection(db, 'quiz-rooms'),
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
   * Generate unique room code
   */
  static generateRoomCode(): string {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
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
      const roomRef = doc(db, 'quiz-rooms', roomId);
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
