// Quiz Arena Constants
export const QUIZ_ARENA_CONSTANTS = {
  // Timing
  DEFAULT_TIMER_DURATION: 30, // seconds per question
  MIN_TIMER_DURATION: 10,
  MAX_TIMER_DURATION: 120,

  // Scoring
  POINTS_PER_CORRECT_ANSWER: 10,
  POINTS_PER_WRONG_ANSWER: 0,

  // Room Settings
  MIN_PLAYERS_TO_START: 1,
  DEFAULT_MAX_PLAYERS: 20,
  MIN_QUESTIONS: 5,
  MAX_QUESTIONS: 50,
  DEFAULT_QUESTIONS: 10,
  ROOM_CODE_LENGTH: 6,

  // Timeouts
  API_TIMEOUT: 25000, // 25 seconds
  RECONNECT_TIMEOUT: 2000,
  CONNECTION_CHECK_INTERVAL: 5000,
  NEXT_QUESTION_DELAY: 2000,

  // Error Messages
  ERRORS: {
    ROOM_NOT_FOUND: 'Room not found or has expired',
    NOT_AUTHENTICATED: 'User not authenticated',
    SUBMISSION_FAILED: 'Your answer may not have been recorded. Please try again.',
    CREATION_FAILED: 'Failed to create quiz arena. Please try again.',
    JOIN_FAILED: 'Failed to join quiz room',
    LEAVE_FAILED: 'Failed to leave room',
    MIN_PLAYERS: 'Need at least 2 players to start',
    QUIZ_ALREADY_STARTED: 'Quiz already started',
    QUIZ_NOT_STARTED: 'Quiz not started yet',
    QUIZ_FINISHED: 'Quiz already finished',
    HOST_ONLY: 'Only host can perform this action',
    TIMEOUT: 'Operation timed out. Please try again.',
    NETWORK: 'Please check your internet connection and try again.',
    SERVICE_UNAVAILABLE: 'Service temporarily unavailable. Please try again later.',
  },

  // Success Messages
  SUCCESS: {
    ROOM_CREATED: 'Arena Ready!',
    QUIZ_STARTED: 'Quiz Started! 🎯',
    QUIZ_FINISHED: 'Quiz Finished! 🏆',
    ANSWER_CORRECT: 'Correct! 🎉',
    ANSWER_INCORRECT: 'Incorrect',
    JOINED_ROOM: 'Successfully joined the battle!',
    LEFT_ROOM: 'Left the room successfully',
  }
} as const;

export type QuizArenaConstants = typeof QUIZ_ARENA_CONSTANTS;
