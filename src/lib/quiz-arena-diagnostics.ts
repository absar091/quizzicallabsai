// 🔧 Quiz Arena Diagnostics and Auto-Fix System
import { auth, firestore } from './firebase';
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc
} from 'firebase/firestore';

export interface DiagnosticResult {
  component: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  fix?: () => Promise<void>;
}

export class QuizArenaDiagnostics {
  private results: DiagnosticResult[] = [];

  async runFullDiagnostic(): Promise<DiagnosticResult[]> {
    this.results = [];
    
    console.log('🔧 Starting Quiz Arena Diagnostics...');
    
    await this.checkFirebaseConnection();
    await this.checkAuthentication();
    await this.checkFirestoreRules();
    await this.checkAIEndpoint();
    await this.checkQuizArenaModule();
    await this.checkRoomCreation();
    
    console.log('🔧 Diagnostics complete:', this.results);
    return this.results;
  }

  private async checkFirebaseConnection(): Promise<void> {
    try {
      // Test basic Firestore connection
      const testDoc = doc(firestore, 'test', 'connection');
      await getDoc(testDoc);
      
      this.addResult('Firebase Connection', 'pass', 'Firebase connection is working');
    } catch (error: any) {
      this.addResult('Firebase Connection', 'fail', `Firebase connection failed: ${error.message}`, async () => {
        console.log('🔧 Firebase connection issue detected. Please check your Firebase configuration.');
      });
    }
  }

  private async checkAuthentication(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (user) {
        // Test if getIdToken works
        try {
          const token = await user.getIdToken();
          if (token) {
            this.addResult('Authentication', 'pass', `User authenticated: ${user.uid}`);
          } else {
            this.addResult('Authentication', 'fail', 'Failed to get authentication token');
          }
        } catch (tokenError: any) {
          this.addResult('Authentication', 'fail', `Auth error: ${tokenError.message}`);
        }
      } else {
        this.addResult('Authentication', 'warning', 'No user currently authenticated');
      }
    } catch (error: any) {
      this.addResult('Authentication', 'fail', `Authentication error: ${error.message}`);
    }
  }

  private async checkFirestoreRules(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        this.addResult('Firestore Rules', 'warning', 'Cannot test rules without authentication');
        return;
      }

      // Test room creation permission
      const testRoomId = `TEST_${Date.now()}`;
      const testRoom = {
        roomId: testRoomId,
        hostId: user.uid,
        started: false,
        finished: false,
        currentQuestion: -1,
        quiz: [],
        createdAt: new Date()
      };

      const roomRef = doc(firestore, 'quiz-rooms', testRoomId);
      await setDoc(roomRef, testRoom);
      
      // Clean up test room
      await deleteDoc(roomRef);
      
      this.addResult('Firestore Rules', 'pass', 'Firestore rules allow room creation');
    } catch (error: any) {
      this.addResult('Firestore Rules', 'fail', `Firestore rules error: ${error.message}`, async () => {
        console.log('🔧 Firestore rules need to be updated. Please deploy the correct rules.');
      });
    }
  }

  private async checkAIEndpoint(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        this.addResult('AI Endpoint', 'warning', 'Cannot test AI endpoint without authentication');
        return;
      }

      const token = await user.getIdToken();
      const response = await fetch('/api/ai/custom-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          topic: 'Test Topic',
          difficulty: 'easy',
          numberOfQuestions: 1,
          questionTypes: ['Multiple Choice'],
          questionStyles: ['Conceptual'],
          timeLimit: 30,
          userClass: 'Test',
          isPro: false,
          specificInstructions: 'This is a test quiz for diagnostics'
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.quiz && result.quiz.length > 0) {
          this.addResult('AI Endpoint', 'pass', 'AI quiz generation is working');
        } else {
          this.addResult('AI Endpoint', 'fail', 'AI returned empty quiz');
        }
      } else {
        const error = await response.text();
        this.addResult('AI Endpoint', 'fail', `AI endpoint error: ${response.status} - ${error}`);
      }
    } catch (error: any) {
      this.addResult('AI Endpoint', 'fail', `AI endpoint connection failed: ${error.message}`);
    }
  }

  private async checkQuizArenaModule(): Promise<void> {
    try {
      const { QuizArena } = await import('./quiz-arena');
      
      if (QuizArena && QuizArena.Host && QuizArena.Player && QuizArena.Discovery) {
        this.addResult('Quiz Arena Module', 'pass', 'Quiz Arena module loaded successfully');
        
        // Test room code generation
        const roomCode = await QuizArena.Discovery.generateRoomCode();
        if (roomCode && roomCode.length === 6) {
          this.addResult('Room Code Generation', 'pass', `Generated room code: ${roomCode}`);
        } else {
          this.addResult('Room Code Generation', 'fail', 'Room code generation failed');
        }
      } else {
        this.addResult('Quiz Arena Module', 'fail', 'Quiz Arena module is incomplete');
      }
    } catch (error: any) {
      this.addResult('Quiz Arena Module', 'fail', `Quiz Arena module error: ${error.message}`);
    }
  }

  private async checkRoomCreation(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        this.addResult('Room Creation', 'warning', 'Cannot test room creation without authentication');
        return;
      }

      const { QuizArena } = await import('./quiz-arena');
      const testRoomCode = `TEST${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      const testQuiz = [{
        question: 'Test question?',
        options: ['A', 'B', 'C', 'D'],
        correctIndex: 0,
        type: 'multiple-choice'
      }];

      await QuizArena.Host.createRoom(
        testRoomCode,
        user.uid,
        user.displayName || 'Test User',
        testQuiz
      );

      // Verify room was created
      const roomRef = doc(firestore, 'quiz-rooms', testRoomCode);
      const roomDoc = await getDoc(roomRef);
      
      if (roomDoc.exists()) {
        this.addResult('Room Creation', 'pass', `Test room created successfully: ${testRoomCode}`);
        
        // Clean up test room
        await deleteDoc(roomRef);
      } else {
        this.addResult('Room Creation', 'fail', 'Room creation succeeded but room not found in database');
      }
    } catch (error: any) {
      this.addResult('Room Creation', 'fail', `Room creation failed: ${error.message}`);
    }
  }

  private addResult(component: string, status: 'pass' | 'fail' | 'warning', message: string, fix?: () => Promise<void>): void {
    this.results.push({ component, status, message, fix });
  }

  async autoFix(): Promise<void> {
    console.log('🔧 Running auto-fix for failed components...');
    
    for (const result of this.results) {
      if (result.status === 'fail' && result.fix) {
        try {
          console.log(`🔧 Fixing: ${result.component}`);
          await result.fix();
        } catch (error) {
          console.error(`❌ Failed to fix ${result.component}:`, error);
        }
      }
    }
  }

  getFailedComponents(): DiagnosticResult[] {
    return this.results.filter(r => r.status === 'fail');
  }

  getWarningComponents(): DiagnosticResult[] {
    return this.results.filter(r => r.status === 'warning');
  }

  isHealthy(): boolean {
    return this.results.every(r => r.status === 'pass' || r.status === 'warning');
  }
}

// Utility function to run quick diagnostics
export async function runQuickDiagnostic(): Promise<boolean> {
  const diagnostics = new QuizArenaDiagnostics();
  const results = await diagnostics.runFullDiagnostic();
  
  const failed = results.filter(r => r.status === 'fail');
  if (failed.length > 0) {
    console.error('❌ Quiz Arena has issues:', failed);
    return false;
  }
  
  console.log('✅ Quiz Arena is healthy');
  return true;
}

export default QuizArenaDiagnostics;