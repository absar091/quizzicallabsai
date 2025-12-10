// 🧪 Quick test to check if Firebase rules are deployed
// Run this in browser console after logging in

async function testFirebaseRulesDeployed() {
  console.log('🧪 Testing if Firebase rules are deployed...');
  
  try {
    // Import Firebase
    const { auth, firestore } = await import('./src/lib/firebase.js');
    const { doc, setDoc, getDoc, deleteDoc } = await import('firebase/firestore');
    
    // Check if user is authenticated
    const user = auth.currentUser;
    if (!user) {
      console.log('❌ Please log in first');
      return false;
    }
    
    console.log('✅ User authenticated:', user.uid);
    
    // Test 1: Try to create a test document
    console.log('🧪 Test 1: Creating test document...');
    const testDoc = doc(firestore, 'test', 'rules-check');
    
    try {
      await setDoc(testDoc, {
        message: 'Rules deployment test',
        timestamp: new Date(),
        userId: user.uid
      });
      console.log('✅ Test document created successfully');
      
      // Test 2: Try to read the document
      console.log('🧪 Test 2: Reading test document...');
      const docSnap = await getDoc(testDoc);
      if (docSnap.exists()) {
        console.log('✅ Test document read successfully');
        
        // Test 3: Clean up
        console.log('🧪 Test 3: Cleaning up...');
        await deleteDoc(testDoc);
        console.log('✅ Test document deleted successfully');
        
        console.log('🎉 Firebase rules are properly deployed!');
        return true;
      } else {
        console.log('❌ Could not read test document');
        return false;
      }
    } catch (error) {
      console.log('❌ Firebase rules test failed:', error.message);
      
      if (error.code === 'permission-denied') {
        console.log('🚨 FIREBASE RULES NOT DEPLOYED!');
        console.log('📋 Follow these steps:');
        console.log('1. Go to https://console.firebase.google.com');
        console.log('2. Select your project');
        console.log('3. Go to Firestore Database → Rules');
        console.log('4. Copy content from firestore.rules file');
        console.log('5. Paste and click "Publish"');
      }
      
      return false;
    }
    
  } catch (error) {
    console.log('❌ Test setup failed:', error.message);
    return false;
  }
}

// Run the test
testFirebaseRulesDeployed();