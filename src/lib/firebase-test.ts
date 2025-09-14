import { ref, set, get } from 'firebase/database';
import { db } from './firebase';

export async function testFirebaseConnection(userId: string): Promise<{
  canRead: boolean;
  canWrite: boolean;
  error?: string;
}> {
  try {
    console.log('🧪 Testing Firebase connection for user:', userId);
    
    // Test read permission
    let canRead = false;
    try {
      const testReadRef = ref(db, `quizResults/${userId}`);
      await get(testReadRef);
      canRead = true;
      console.log('✅ Firebase read test passed');
    } catch (readError: any) {
      console.error('❌ Firebase read test failed:', readError);
    }

    // Test write permission
    let canWrite = false;
    try {
      const testWriteRef = ref(db, `quizResults/${userId}/test-${Date.now()}`);
      const testData = {
        test: true,
        timestamp: Date.now(),
        userId: userId
      };
      await set(testWriteRef, testData);
      canWrite = true;
      console.log('✅ Firebase write test passed');
      
      // Clean up test data
      await set(testWriteRef, null);
    } catch (writeError: any) {
      console.error('❌ Firebase write test failed:', writeError);
      return {
        canRead,
        canWrite: false,
        error: `Write failed: ${writeError.code || writeError.message}`
      };
    }

    return { canRead, canWrite };
  } catch (error: any) {
    console.error('❌ Firebase connection test failed:', error);
    return {
      canRead: false,
      canWrite: false,
      error: error.code || error.message
    };
  }
}