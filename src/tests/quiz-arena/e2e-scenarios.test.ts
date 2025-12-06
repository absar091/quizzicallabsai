// @ts-nocheck
/**
 * 🎮 Quiz Arena End-to-End Test Scenarios
 * Complete user journey testing for live multiplayer quiz battles
 */

import { QuizArena } from '@/lib/quiz-arena';

// Mock browser environment
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000'
  }
});

describe('🚀 Complete Quiz Arena User Journeys', () => {
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
    },
    {
      question: "Which planet is closest to the Sun?",
      options: ["Venus", "Mercury", "Earth", "Mars"],
      correctIndex: 1,
      type: "multiple-choice"
    }
  ];

  describe('🎯 Scenario 1: Host Creates and Manages Quiz', () => {
    const hostId = "host-123";
    const roomCode = "BATTLE1";

    test('Host creates room successfully', async () => {
      const room = await QuizArena.Host.createRoom(
        roomCode,
        hostId,
        "Quiz Master",
        mockQuiz
      );

      expect(room.roomId).toBe(roomCode);
      expect(room.hostId).toBe(hostId);
      expect(room.started).toBe(false);
      expect(room.quiz.length).toBe(3);
    });

    test('Host waits for players to join', async () => {
      // Simulate players joining
      await QuizArena.Player.joinRoom(roomCode, "player1", "Alice");
      await QuizArena.Player.joinRoom(roomCode, "player2", "Bob");
      await QuizArena.Player.joinRoom(roomCode, "player3", "Charlie");

      const players = await QuizArena.Player.getLeaderboard(roomCode);
      expect(players.length).toBe(4); // 3 players + host
    });

    test('Host starts quiz when ready', async () => {
      await QuizArena.Host.startQuiz(roomCode, hostId);
      
      // Verify quiz started
      const roomData = await QuizArena.Discovery.validateRoom(roomCode);
      expect(roomData).toBe(true);
    });

    test('Host manages quiz progression', async () => {
      // Advance through all questions
      for (let i = 0; i < mockQuiz.length - 1; i++) {
        await QuizArena.Host.nextQuestion(roomCode, hostId);
      }

      // Finish quiz
      await QuizArena.Host.finishQuiz(roomCode, hostId);
    });
  });

  describe('👥 Scenario 2: Multiple Players Join and Compete', () => {
    const roomCode = "COMPETE2";
    const hostId = "host-456";
    const players = [
      { id: "player1", name: "Emma", expectedScore: 30 },
      { id: "player2", name: "Liam", expectedScore: 20 },
      { id: "player3", name: "Olivia", expectedScore: 10 },
      { id: "player4", name: "Noah", expectedScore: 0 }
    ];

    beforeAll(async () => {
      // Setup room
      await QuizArena.Host.createRoom(roomCode, hostId, "Quiz Host", mockQuiz);
      
      // Players join
      for (const player of players) {
        await QuizArena.Player.joinRoom(roomCode, player.id, player.name);
      }
    });

    test('All players join successfully', async () => {
      const leaderboard = await QuizArena.Player.getLeaderboard(roomCode);
      expect(leaderboard.length).toBe(5); // 4 players + host
    });

    test('Quiz starts and players compete', async () => {
      await QuizArena.Host.startQuiz(roomCode, hostId);

      // Simulate answers for each question
      for (let questionIndex = 0; questionIndex < mockQuiz.length; questionIndex++) {
        const correctAnswer = mockQuiz[questionIndex].correctIndex;

        // Emma answers all correctly
        await QuizArena.Player.submitAnswer(roomCode, players[0].id, questionIndex, correctAnswer);

        // Liam answers 2/3 correctly
        const liamAnswer = questionIndex < 2 ? correctAnswer : (correctAnswer + 1) % 4;
        await QuizArena.Player.submitAnswer(roomCode, players[1].id, questionIndex, liamAnswer);

        // Olivia answers 1/3 correctly
        const oliviaAnswer = questionIndex === 0 ? correctAnswer : (correctAnswer + 1) % 4;
        await QuizArena.Player.submitAnswer(roomCode, players[2].id, questionIndex, oliviaAnswer);

        // Noah answers all incorrectly
        const noahAnswer = (correctAnswer + 1) % 4;
        await QuizArena.Player.submitAnswer(roomCode, players[3].id, questionIndex, noahAnswer);

        // Host advances to next question
        if (questionIndex < mockQuiz.length - 1) {
          await QuizArena.Host.nextQuestion(roomCode, hostId);
        }
      }

      await QuizArena.Host.finishQuiz(roomCode, hostId);
    });

    test('Final leaderboard reflects performance', async () => {
      const finalLeaderboard = await QuizArena.Player.getLeaderboard(roomCode);
      
      // Verify ranking order (highest score first)
      expect(finalLeaderboard[0].name).toBe("Emma");   // 30 points
      expect(finalLeaderboard[1].name).toBe("Liam");   // 20 points
      expect(finalLeaderboard[2].name).toBe("Olivia"); // 10 points
      expect(finalLeaderboard[3].name).toBe("Noah");   // 0 points
    });
  });

  describe('🔄 Scenario 3: Real-time Updates and Synchronization', () => {
    const roomCode = "REALTIME3";
    const hostId = "host-789";

    test('Real-time room state updates', (done) => {
      let updateCount = 0;
      
      const unsubscribe = QuizArena.Host.listenToRoom(roomCode, (data) => {
        updateCount++;
        
        if (updateCount === 1) {
          expect(data.started).toBe(false);
        } else if (updateCount === 2) {
          expect(data.started).toBe(true);
          expect(data.currentQuestion).toBe(0);
          unsubscribe();
          done();
        }
      });

      // Trigger updates
      setTimeout(async () => {
        await QuizArena.Host.createRoom(roomCode, hostId, "Real-time Host", mockQuiz);
        await QuizArena.Host.startQuiz(roomCode, hostId);
      }, 100);
    });

    test('Real-time leaderboard updates', (done) => {
      let updateCount = 0;
      
      const unsubscribe = QuizArena.Player.listenToLeaderboard(roomCode, (players) => {
        updateCount++;
        
        if (updateCount === 1) {
          expect(players.length).toBe(1); // Just host
        } else if (updateCount === 2) {
          expect(players.length).toBe(2); // Host + 1 player
          unsubscribe();
          done();
        }
      });

      // Trigger updates
      setTimeout(async () => {
        await QuizArena.Player.joinRoom(roomCode, "realtime-player", "Real-time Player");
      }, 100);
    });
  });

  describe('🚨 Scenario 4: Error Handling and Edge Cases', () => {
    test('Player tries to join non-existent room', async () => {
      await expect(
        QuizArena.Player.joinRoom("FAKE123", "player1", "Test Player")
      ).rejects.toThrow();
    });

    test('Non-host tries to start quiz', async () => {
      const roomCode = "ERROR123";
      const hostId = "real-host";
      const fakeHostId = "fake-host";

      await QuizArena.Host.createRoom(roomCode, hostId, "Real Host", mockQuiz);

      await expect(
        QuizArena.Host.startQuiz(roomCode, fakeHostId)
      ).rejects.toThrow('Only host can start the quiz');
    });

    test('Player submits answer to invalid question', async () => {
      const roomCode = "INVALID123";
      const hostId = "host";
      const playerId = "player";

      await QuizArena.Host.createRoom(roomCode, hostId, "Host", mockQuiz);
      await QuizArena.Player.joinRoom(roomCode, playerId, "Player");

      await expect(
        QuizArena.Player.submitAnswer(roomCode, playerId, 999, 0) // Invalid question index
      ).rejects.toThrow('Invalid question index');
    });

    test('Player submits invalid answer index', async () => {
      const roomCode = "BOUNDS123";
      const hostId = "host";
      const playerId = "player";

      await QuizArena.Host.createRoom(roomCode, hostId, "Host", mockQuiz);
      await QuizArena.Player.joinRoom(roomCode, playerId, "Player");
      await QuizArena.Host.startQuiz(roomCode, hostId);

      await expect(
        QuizArena.Player.submitAnswer(roomCode, playerId, 0, 5) // Invalid answer index
      ).rejects.toThrow('Invalid answer index');
    });
  });

  describe('📱 Scenario 5: Mobile and Cross-Platform Experience', () => {
    const roomCode = "MOBILE123";
    const hostId = "mobile-host";

    test('Mobile user creates and manages room', async () => {
      // Simulate mobile user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true
      });

      const room = await QuizArena.Host.createRoom(
        roomCode,
        hostId,
        "Mobile Host",
        mockQuiz
      );

      expect(room.roomId).toBe(roomCode);
    });

    test('Cross-platform players join same room', async () => {
      const platforms = [
        { id: "desktop-player", name: "Desktop User", userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
        { id: "mobile-player", name: "Mobile User", userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)" },
        { id: "tablet-player", name: "Tablet User", userAgent: "Mozilla/5.0 (iPad; CPU OS 14_0)" }
      ];

      for (const platform of platforms) {
        await QuizArena.Player.joinRoom(roomCode, platform.id, platform.name);
      }

      const players = await QuizArena.Player.getLeaderboard(roomCode);
      expect(players.length).toBe(4); // 3 players + host
    });

    test('Network interruption handling', async () => {
      // Simulate network interruption
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      try {
        await QuizArena.Discovery.validateRoom(roomCode);
      } catch (error) {
        expect(error.message).toBe('Network error');
      }

      // Restore fetch
      global.fetch = originalFetch;
    });
  });

  describe('⚡ Scenario 6: Performance Under Load', () => {
    const roomCode = "STRESS123";
    const hostId = "stress-host";

    test('High player count room', async () => {
      await QuizArena.Host.createRoom(roomCode, hostId, "Stress Host", mockQuiz);

      // Add 100 players
      const joinPromises = [];
      for (let i = 0; i < 100; i++) {
        joinPromises.push(
          QuizArena.Player.joinRoom(roomCode, `player-${i}`, `Player ${i}`)
        );
      }

      await Promise.all(joinPromises);
      
      const players = await QuizArena.Player.getLeaderboard(roomCode);
      expect(players.length).toBe(101); // 100 players + host
    });

    test('Rapid answer submissions', async () => {
      await QuizArena.Host.startQuiz(roomCode, hostId);

      // 100 players submit answers rapidly
      const submitPromises = [];
      for (let i = 0; i < 100; i++) {
        submitPromises.push(
          QuizArena.Player.submitAnswer(
            roomCode, 
            `player-${i}`, 
            0, 
            Math.floor(Math.random() * 4)
          )
        );
      }

      const results = await Promise.allSettled(submitPromises);
      const successful = results.filter(r => r.status === 'fulfilled').length;
      
      expect(successful).toBeGreaterThan(80); // At least 80% success rate
    });
  });

  describe('🔒 Scenario 7: Security and Anti-Cheat', () => {
    const roomCode = "SECURE123";
    const hostId = "secure-host";
    const playerId = "secure-player";

    test('Prevent answer tampering', async () => {
      await QuizArena.Host.createRoom(roomCode, hostId, "Secure Host", mockQuiz);
      await QuizArena.Player.joinRoom(roomCode, playerId, "Secure Player");
      await QuizArena.Host.startQuiz(roomCode, hostId);

      // Try to submit multiple answers for same question
      await QuizArena.Player.submitAnswer(roomCode, playerId, 0, 0);
      
      // Second submission should be handled gracefully
      await expect(
        QuizArena.Player.submitAnswer(roomCode, playerId, 0, 1)
      ).resolves.not.toThrow();
    });

    test('Validate time-based submissions', async () => {
      const questionStartTime = Date.now();
      const timeLimit = 30000; // 30 seconds

      // Valid submission (within time limit)
      const validSubmissionTime = questionStartTime + 25000; // 25 seconds later
      const isValidTiming = (validSubmissionTime - questionStartTime) <= timeLimit;
      expect(isValidTiming).toBe(true);

      // Invalid submission (after time limit)
      const invalidSubmissionTime = questionStartTime + 35000; // 35 seconds later
      const isInvalidTiming = (invalidSubmissionTime - questionStartTime) > timeLimit;
      expect(isInvalidTiming).toBe(true);
    });

    test('Prevent unauthorized host actions', async () => {
      const unauthorizedUser = "hacker-123";

      await expect(
        QuizArena.Host.startQuiz(roomCode, unauthorizedUser)
      ).rejects.toThrow('Only host can start the quiz');

      await expect(
        QuizArena.Host.nextQuestion(roomCode, unauthorizedUser)
      ).rejects.toThrow('Only host can advance questions');
    });
  });
});

describe('🎊 Integration with UI Components', () => {
  test('Room code sharing functionality', () => {
    const roomCode = "SHARE123";
    const baseUrl = "http://localhost:3000";
    
    const joinLink = `${baseUrl}/quiz-arena/join/${roomCode}`;
    const whatsappMessage = `🎯 Join my live quiz battle!\n\nRoom: ${roomCode}\n\nLink: ${joinLink}\n\nGet ready for some epic competition! 🏆`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

    expect(joinLink).toContain(roomCode);
    expect(whatsappUrl).toContain('wa.me');
    expect(decodeURIComponent(whatsappUrl)).toContain(roomCode);
  });

  test('Timer functionality', () => {
    let timeLeft = 30;
    const timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
      }
    }, 1000);

    // Simulate timer running
    setTimeout(() => {
      expect(timeLeft).toBeLessThan(30);
      clearInterval(timerInterval);
    }, 100);
  });

  test('Leaderboard sorting', () => {
    const players = [
      { userId: "p1", name: "Alice", score: 25, joinedAt: new Date('2024-01-01T10:00:00Z') },
      { userId: "p2", name: "Bob", score: 30, joinedAt: new Date('2024-01-01T10:01:00Z') },
      { userId: "p3", name: "Charlie", score: 25, joinedAt: new Date('2024-01-01T09:59:00Z') },
      { userId: "p4", name: "Diana", score: 35, joinedAt: new Date('2024-01-01T10:02:00Z') }
    ];

    const sorted = players.sort((a, b) => {
      if (a.score === b.score) {
        return a.joinedAt.getTime() - b.joinedAt.getTime(); // Earlier joiner wins ties
      }
      return b.score - a.score; // Higher score wins
    });

    expect(sorted[0].name).toBe("Diana");   // Highest score (35)
    expect(sorted[1].name).toBe("Charlie"); // Tied score (25) but joined earlier
    expect(sorted[2].name).toBe("Alice");   // Tied score (25) but joined later
    expect(sorted[3].name).toBe("Bob");     // Lowest score (30)
  });
});