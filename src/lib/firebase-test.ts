// Firebase data storage test functions
import { db } from '@/lib/firebase';
import { ref, set, get, push } from 'firebase/database';

export class FirebaseTest {
  // Test basic data storage
  static async testBasicStorage() {
    try {
      const testRef = ref(db, 'test/basic');
      const testData = {
        message: 'Hello Firebase',
        timestamp: Date.now(),
        user: 'test-user'
      };
      
      await set(testRef, testData);
      console.log('✅ Basic storage test passed');
      
      const snapshot = await get(testRef);
      if (snapshot.exists()) {
        console.log('✅ Basic retrieval test passed:', snapshot.val());
      } else {
        console.log('❌ Basic retrieval test failed');
      }
    } catch (error) {
      console.error('❌ Basic storage test failed:', error);
    }
  }

  // Test quiz sharing data structure
  static async testQuizSharing() {
    try {
      const quizData = {
        id: 'test_quiz_123',
        title: 'Test Quiz',
        shareCode: 'TEST123',
        creatorId: 'user123',
        creatorName: 'Test User',
        questions: [
          {
            type: 'multiple-choice',
            question: 'What is 2+2?',
            answers: ['3', '4', '5', '6'],
            correctAnswer: '4'
          }
        ],
        topic: 'Mathematics',
        difficulty: 'easy',
        isPublic: true,
        likes: 0,
        attempts: 0,
        averageScore: 0,
        createdAt: Date.now()
      };

      const quizRef = ref(db, `shared_quizzes/${quizData.id}`);
      await set(quizRef, quizData);
      console.log('✅ Quiz sharing storage test passed');

      const snapshot = await get(quizRef);
      if (snapshot.exists()) {
        console.log('✅ Quiz sharing retrieval test passed');
      }
    } catch (error) {
      console.error('❌ Quiz sharing test failed:', error);
    }
  }

  // Test question bank storage
  static async testQuestionBank() {
    try {
      const bankRef = ref(db, 'question_bank');
      const questionData = {
        id: 'q_test_123',
        question: 'Test question?',
        type: 'multiple-choice',
        answers: ['A', 'B', 'C', 'D'],
        correctAnswer: 'B',
        subject: 'Mathematics',
        topic: 'Algebra',
        difficulty: 'medium',
        tags: ['test', 'algebra'],
        verified: false,
        createdAt: Date.now(),
        usageCount: 0
      };

      await push(bankRef, questionData);
      console.log('✅ Question bank storage test passed');
    } catch (error) {
      console.error('❌ Question bank test failed:', error);
    }
  }

  // Test user data storage
  static async testUserData() {
    try {
      const userData = {
        study_streak: {
          userId: 'test123',
          currentStreak: 5,
          longestStreak: 10,
          lastStudyDate: new Date().toDateString(),
          totalStudyDays: 25,
          streakMilestones: [7, 14]
        },
        shared_quizzes: {
          'quiz_123': {
            id: 'quiz_123',
            title: 'My Quiz',
            shareCode: 'ABC123',
            createdAt: Date.now()
          }
        }
      };

      const userRef = ref(db, 'users/test123');
      await set(userRef, userData);
      console.log('✅ User data storage test passed');
    } catch (error) {
      console.error('❌ User data test failed:', error);
    }
  }

  // Run all tests
  static async runAllTests() {
    console.log('🧪 Starting Firebase data storage tests...');
    await this.testBasicStorage();
    await this.testQuizSharing();
    await this.testQuestionBank();
    await this.testUserData();
    console.log('🏁 Firebase tests completed');
  }
}