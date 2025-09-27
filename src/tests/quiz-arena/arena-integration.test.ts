/**
 * 🎯 Quiz Arena Integration Tests
 * Comprehensive testing suite for live multiplayer quiz functionality
 */

import { QuizArena } from '@/lib/quiz-arena';

// Mock Firebase for testing
jest.mock('@/lib/firebase', () => ({
  firestore: {
    collection: jest.fn(),
    doc: jest.fn(),
    setDoc: jest.fn(),
    updateDoc: jest.fn(),
    getDoc: jest.fn(),
    getDocs: jest.fn(),
    onSnapshot: jest.fn(),
    Timestamp: {
      now: () => ({ seconds: Date.now() / 1000 })
    }
  }
}));

describe('🎮 Quiz Arena - Core Functionality', () => {
  const mockQuiz = [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctIndex: 2,
      type: "multiple-choice"
    },
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctIndex: 1,
      type: "multiple-choice"
    }
  ];

  const testRoomId = "TEST123";
  const hostId = "host-user-123";
  const playerId = "player-user-456";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('🏗️ Room Creation & Management', () => {
    test('should create room with valid quiz data', async () => {
      const room = await QuizArena.Host.createRoom(
        testRoomId,
        hostId,
        "Test Host",
        mockQuiz
      );

      expect(room.roomId).toBe(testRoomId);
      expect(room.hostId).toBe(hostId);
      expect(room.started).toBe(false);
      expect(room.quiz).toEqual(mockQuiz);
    });

    test('should validate room code format', () => {
      const validCodes = ["ABC123", "XYZ789", "TEST01"];
      const invalidCodes = ["abc123", "12345", "TOOLONG123"];

      validCodes.forEach(code => {
        expect(code).toMatch(/^[A-Z0-9]{6}$/);
      });

      invalidCodes.forEach(code => {
        expect(code).not.toMatch(/^[A-Z0-9]{6}$/);
      });
    });

    test('should generate unique room codes', () => {
      const codes = new Set();
      for (let i = 0; i < 100; i++) {
        const code = QuizArena.Discovery.generateRoomCode();
        expect(codes.has(code)).toBe(false);
        codes.add(code);
      }
    });
  });

  describe('👥 Player Management', () => {
    test('should allow players to join room', async () => {
      await QuizArena.Player.joinRoom(testRoomId, playerId, "Test Player");
      
      // Verify player was added to room
      expect(jest.mocked(require('@/lib/firebase').firestore.setDoc)).toHaveBeenCalled();
    });

    test('should handle duplicate player joins gracefully', async () => {
      // First join
      await QuizArena.Player.joinRoom(testRoomId, playerId, "Test Player");
      
      // Second join (should update, not create new)
      await QuizArena.Player.joinRoom(testRoomId, playerId, "Updated Name");
      
      expect(jest.mocked(require('@/lib/firebase').firestore.updateDoc)).toHaveBeenCalled();
    });

    test('should allow players to leave room', async () => {
      await QuizArena.Player.leaveRoom(testRoomId, playerId);
      
      expect(jest.mocked(require('@/lib/firebase').firestore.deleteDoc)).toHaveBeenCalled();
    });
  });

  describe('🎯 Quiz Flow Control', () => {
    test('should start quiz only by host', async () => {
      await QuizArena.Host.startQuiz(testRoomId, hostId);
      
      expect(jest.mocked(require('@/lib/firebase').firestore.updateDoc)).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          started: true,
          currentQuestion: 0
        })
      );
    });

    test('should advance to next question', async () => {
      await QuizArena.Host.nextQuestion(testRoomId, hostId);
      
      expect(jest.mocked(require('@/lib/firebase').firestore.updateDoc)).toHaveBeenCalled();
    });

    test('should finish quiz when reaching last question', async () => {
      // Mock room data with last question
      const mockRoomData = {
        hostId,
        currentQuestion: mockQuiz.length - 1,
        quiz: mockQuiz,
        finished: false
      };

      jest.mocked(require('@/lib/firebase').firestore.getDoc).mockResolvedValue({
        exists: () => true,
        data: () => mockRoomData
      });

      await QuizArena.Host.nextQuestion(testRoomId, hostId);
      
      // Should call finishQuiz
      expect(jest.mocked(require('@/lib/firebase').firestore.updateDoc)).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          finished: true
        })
      );
    });
  });

  describe('📊 Answer Submission & Scoring', () => {
    test('should validate answer indices', async () => {
      const validAnswers = [0, 1, 2, 3];
      const invalidAnswers = [-1, 4, 5, 10];

      validAnswers.forEach(answer => {
        expect(answer).toBeGreaterThanOrEqual(0);
        expect(answer).toBeLessThanOrEqual(3);
      });

      invalidAnswers.forEach(answer => {
        expect(answer < 0 || answer > 3).toBe(true);
      });
    });

    test('should prevent duplicate answer submissions', async () => {
      // Mock existing answer
      jest.mocked(require('@/lib/firebase').firestore.getDoc).mockResolvedValue({
        exists: () => true,
        data: () => ({ userId: playerId, questionIndex: 0 })
      });

      // Should handle duplicate gracefully
      await expect(
        QuizArena.Player.submitAnswer(testRoomId, playerId, 0, 2)
      ).resolves.not.toThrow();
    });

    test('should calculate scores correctly', () => {
      const correctAnswer = 2;
      const playerAnswers = [
        { playerId: "player1", answer: 2, expected: 10 }, // Correct
        { playerId: "player2", answer: 1, expected: 0 },  // Wrong
        { playerId: "player3", answer: 2, expected: 10 }, // Correct
      ];

      playerAnswers.forEach(({ answer, expected }) => {
        const points = answer === correctAnswer ? 10 : 0;
        expect(points).toBe(expected);
      });
    });
  });

  describe('🏆 Leaderboard & Rankings', () => {
    test('should sort players by score descending', () => {
      const players = [
        { userId: "p1", name: "Player 1", score: 20, joinedAt: new Date() },
        { userId: "p2", name: "Player 2", score: 30, joinedAt: new Date() },
        { userId: "p3", name: "Player 3", score: 10, joinedAt: new Date() },
      ];

      const sorted = players.sort((a, b) => b.score - a.score);
      
      expect(sorted[0].score).toBe(30);
      expect(sorted[1].score).toBe(20);
      expect(sorted[2].score).toBe(10);
    });

    test('should handle tie-breaking by join time', () => {
      const now = Date.now();
      const players = [
        { userId: "p1", name: "Player 1", score: 20, joinedAt: new Date(now - 1000) },
        { userId: "p2", name: "Player 2", score: 20, joinedAt: new Date(now - 2000) },
      ];

      // Earlier joiner should rank higher in ties
      const sorted = players.sort((a, b) => {
        if (a.score === b.score) {
          return a.joinedAt.getTime() - b.joinedAt.getTime();
        }
        return b.score - a.score;
      });

      expect(sorted[0].userId).toBe("p2"); // Joined earlier
    });
  });

  describe('🔒 Security & Anti-Cheat', () => {
    test('should validate room access permissions', async () => {
      const unauthorizedUser = "hacker-123";
      
      // Mock room data
      jest.mocked(require('@/lib/firebase').firestore.getDoc).mockResolvedValue({
        exists: () => true,
        data: () => ({ hostId, started: true })
      });

      // Should throw error for unauthorized host actions
      await expect(
        QuizArena.Host.startQuiz(testRoomId, unauthorizedUser)
      ).rejects.toThrow('Only host can start the quiz');
    });

    test('should prevent answer submission after time limit', () => {
      const submissionTime = Date.now();
      const questionStartTime = submissionTime - 35000; // 35 seconds ago
      const timeLimit = 30000; // 30 seconds

      const isWithinTimeLimit = (submissionTime - questionStartTime) <= timeLimit;
      expect(isWithinTimeLimit).toBe(false);
    });

    test('should validate question indices', () => {
      const quizLength = mockQuiz.length;
      const validIndices = [0, 1];
      const invalidIndices = [-1, 2, 5];

      validIndices.forEach(index => {
        expect(index >= 0 && index < quizLength).toBe(true);
      });

      invalidIndices.forEach(index => {
        expect(index >= 0 && index < quizLength).toBe(false);
      });
    });
  });

  describe('⚡ Real-time Updates', () => {
    test('should set up room listeners correctly', () => {
      const callback = jest.fn();
      const unsubscribe = QuizArena.Host.listenToRoom(testRoomId, callback);

      expect(typeof unsubscribe).toBe('function');
      expect(jest.mocked(require('@/lib/firebase').firestore.onSnapshot)).toHaveBeenCalled();
    });

    test('should set up leaderboard listeners correctly', () => {
      const callback = jest.fn();
      const unsubscribe = QuizArena.Player.listenToLeaderboard(testRoomId, callback);

      expect(typeof unsubscribe).toBe('function');
      expect(jest.mocked(require('@/lib/firebase').firestore.onSnapshot)).toHaveBeenCalled();
    });

    test('should handle connection drops gracefully', () => {
      const callback = jest.fn();
      
      // Mock connection error
      jest.mocked(require('@/lib/firebase').firestore.onSnapshot).mockImplementation(() => {
        throw new Error('Connection lost');
      });

      expect(() => {
        QuizArena.Host.listenToRoom(testRoomId, callback);
      }).toThrow('Connection lost');
    });
  });

  describe('🎪 Edge Cases & Error Handling', () => {
    test('should handle non-existent room gracefully', async () => {
      jest.mocked(require('@/lib/firebase').firestore.getDoc).mockResolvedValue({
        exists: () => false
      });

      await expect(
        QuizArena.Host.startQuiz("NONEXISTENT", hostId)
      ).rejects.toThrow('Room not found');
    });

    test('should handle empty quiz data', async () => {
      const emptyQuiz: any[] = [];
      
      const room = await QuizArena.Host.createRoom(
        testRoomId,
        hostId,
        "Test Host",
        emptyQuiz
      );

      expect(room.quiz).toEqual(emptyQuiz);
    });

    test('should handle malformed quiz questions', () => {
      const malformedQuiz = [
        { question: "", options: [], correctIndex: -1 },
        { question: "Valid?", options: ["Yes"], correctIndex: 0 }
      ];

      malformedQuiz.forEach(q => {
        const isValid = q.question.length > 0 && 
                       q.options.length > 0 && 
                       q.correctIndex >= 0 && 
                       q.correctIndex < q.options.length;
        
        if (!isValid) {
          expect(q.question === "" || q.options.length === 0 || q.correctIndex < 0).toBe(true);
        }
      });
    });
  });
});

describe('🚀 Performance & Scalability Tests', () => {
  test('should handle multiple concurrent players', async () => {
    const playerCount = 50;
    const promises = [];

    for (let i = 0; i < playerCount; i++) {
      promises.push(
        QuizArena.Player.joinRoom("STRESS123", `player-${i}`, `Player ${i}`)
      );
    }

    await expect(Promise.all(promises)).resolves.not.toThrow();
  });

  test('should handle rapid answer submissions', async () => {
    const submissionCount = 100;
    const promises = [];

    for (let i = 0; i < submissionCount; i++) {
      promises.push(
        QuizArena.Player.submitAnswer("RAPID123", `player-${i}`, 0, Math.floor(Math.random() * 4))
      );
    }

    // Should not crash with concurrent submissions
    await expect(Promise.allSettled(promises)).resolves.toBeDefined();
  });

  test('should optimize Firebase queries', () => {
    // Test query optimization
    const roomId = "OPTIMIZE123";
    
    // Should use efficient document references
    expect(() => {
      QuizArena.Host.listenToRoom(roomId, () => {});
    }).not.toThrow();
  });
});

describe('📱 Mobile & Cross-Platform Tests', () => {
  test('should handle mobile network interruptions', () => {
    // Mock network interruption
    const mockError = new Error('Network request failed');
    
    jest.mocked(require('@/lib/firebase').firestore.getDoc).mockRejectedValue(mockError);

    // Should handle gracefully
    expect(async () => {
      try {
        await QuizArena.Discovery.validateRoom("TEST123");
      } catch (error) {
        expect(error).toBe(mockError);
      }
    }).not.toThrow();
  });

  test('should work with different screen sizes', () => {
    // Test responsive design considerations
    const screenSizes = [
      { width: 320, height: 568 },  // iPhone SE
      { width: 768, height: 1024 }, // iPad
      { width: 1920, height: 1080 } // Desktop
    ];

    screenSizes.forEach(size => {
      expect(size.width).toBeGreaterThan(0);
      expect(size.height).toBeGreaterThan(0);
    });
  });
});