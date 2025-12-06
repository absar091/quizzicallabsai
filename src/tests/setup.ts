/**
 * 🧪 Jest Test Setup for Quiz Arena
 * Global test configuration and mocks
 */

import '@testing-library/jest-dom';

// Mock Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn()
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn()
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  onSnapshot: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  Timestamp: {
    now: jest.fn(() => ({ seconds: Date.now() / 1000 })),
    fromDate: jest.fn((date) => ({ seconds: date.getTime() / 1000 }))
  },
  deleteDoc: jest.fn()
}));

// Mock Next.js
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn()
  })),
  useParams: jest.fn(() => ({})),
  useSearchParams: jest.fn(() => new URLSearchParams())
}));

// Mock window.location (only in browser-like environments)
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'location', {
    value: {
      href: 'http://localhost:3000',
      origin: 'http://localhost:3000',
      pathname: '/',
      search: '',
      hash: ''
    },
    writable: true
  });
}

// Mock navigator (only in browser-like environments)
if (typeof navigator !== 'undefined') {
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: jest.fn(() => Promise.resolve())
    }
  });
}

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve('')
  })
) as jest.Mock;

// Console setup for cleaner test output
const originalError = console.error;
const originalLog = console.log;
const originalWarn = console.warn;

beforeAll(() => {
  // Suppress console.log during tests
  console.log = jest.fn();
  
  // Suppress console.warn during tests
  console.warn = jest.fn();
  
  // Filter console.error
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.log = originalLog;
  console.warn = originalWarn;
});

// Global test utilities
global.testUtils = {
  createMockUser: (overrides = {}) => ({
    uid: 'test-user-123',
    email: 'test@example.com',
    displayName: 'Test User',
    getIdToken: jest.fn(() => Promise.resolve('mock-token')),
    ...overrides
  }),
  
  createMockQuiz: (questionCount = 3) => 
    Array.from({ length: questionCount }, (_, i) => ({
      question: `Test question ${i + 1}?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctIndex: Math.floor(Math.random() * 4),
      type: 'multiple-choice'
    })),
  
  createMockRoom: (overrides = {}) => ({
    roomId: 'TEST123',
    hostId: 'host-123',
    started: false,
    finished: false,
    currentQuestion: -1,
    quiz: global.testUtils.createMockQuiz(),
    createdAt: { seconds: Date.now() / 1000 },
    ...overrides
  }),
  
  createMockPlayer: (overrides = {}) => ({
    userId: 'player-123',
    name: 'Test Player',
    score: 0,
    joinedAt: { seconds: Date.now() / 1000 },
    ...overrides
  }),
  
  waitFor: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  
  mockFirebaseSuccess: (data: any) => {
    const mockDoc = {
      exists: () => true,
      data: () => data,
      id: 'mock-id'
    };
    
    require('firebase/firestore').getDoc.mockResolvedValue(mockDoc);
    require('firebase/firestore').getDocs.mockResolvedValue({
      docs: [mockDoc],
      forEach: (callback: Function) => callback(mockDoc)
    });
  },
  
  mockFirebaseError: (error: Error) => {
    require('firebase/firestore').getDoc.mockRejectedValue(error);
    require('firebase/firestore').setDoc.mockRejectedValue(error);
    require('firebase/firestore').updateDoc.mockRejectedValue(error);
  }
};

// Type declarations for global utilities
declare global {
  var testUtils: {
    createMockUser: (overrides?: any) => any;
    createMockQuiz: (questionCount?: number) => any[];
    createMockRoom: (overrides?: any) => any;
    createMockPlayer: (overrides?: any) => any;
    waitFor: (ms: number) => Promise<void>;
    mockFirebaseSuccess: (data: any) => void;
    mockFirebaseError: (error: Error) => void;
  };
}