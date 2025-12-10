# 🔧 Quiz Arena Fix Guide

## 🚨 Common Issues & Solutions

Your Quiz Arena system has several potential issues. Here's a comprehensive guide to diagnose and fix them:

### 1. **Questions Not Generating**

**Symptoms:**
- Loading spinner shows but no questions appear
- Error messages about AI service
- Timeout errors during quiz creation

**Causes & Solutions:**

#### A. API Key Issues
```bash
# Check your .env file has valid Gemini API key
GEMINI_API_KEY=your_actual_api_key_here
```

#### B. Authentication Problems
- Ensure user is logged in before creating quiz
- Check Firebase Auth token is valid
- Verify API endpoint receives proper Authorization header

#### C. AI Service Limits
- Check Gemini API quota in Google Cloud Console
- Verify API key has proper permissions
- Try reducing number of questions if hitting limits

**Quick Fix:**
1. Go to `/quiz-arena/diagnostics`
2. Run "Test Quiz Generation"
3. Check browser console for detailed errors

### 2. **Participants Cannot Join Rooms**

**Symptoms:**
- "Room not found" errors
- Players can't see room after entering code
- Join button doesn't work

**Causes & Solutions:**

#### A. Firebase Security Rules
Your Firestore rules need to be updated. Deploy these rules:

```javascript
// Fixed rules - deploy to Firebase Console
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /quiz-rooms/{roomId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.hostId;
      allow update: if request.auth != null && request.auth.uid == resource.data.hostId;
      allow delete: if false;
    }
    
    match /quiz-rooms/{roomId}/players/{userId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;
    }
    
    match /quiz-rooms/{roomId}/answers/{answerId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update, delete: if false;
    }
  }
}
```

#### B. Room Code Issues
- Ensure room codes are exactly 6 characters
- Check room code generation function works
- Verify room exists in Firestore before joining

**Quick Fix:**
1. Go to Firebase Console → Firestore → Rules
2. Replace rules with the fixed version above
3. Click "Publish"

### 3. **Quiz Not Starting (Host Issues)**

**Symptoms:**
- "Start Quiz" button doesn't work
- Quiz stays in "waiting" state
- Host gets permission errors

**Causes & Solutions:**

#### A. Minimum Players Check
```typescript
// Ensure at least 1 player (including host) has joined
if (roomData.playerCount < 1) {
  // This should allow starting with just the host
}
```

#### B. Firebase Permissions
- Host must be authenticated
- Host ID must match room creator
- Check Firebase rules allow host updates

#### C. Quiz Data Issues
- Ensure quiz questions were generated properly
- Check quiz array is not empty
- Verify question format is correct

**Quick Fix:**
1. Check browser console for errors
2. Ensure you're logged in as the room creator
3. Try refreshing the page and creating a new room

### 4. **Real-time Updates Not Working**

**Symptoms:**
- Players don't see questions when host starts
- Leaderboard doesn't update
- Timer doesn't sync

**Causes & Solutions:**

#### A. Firebase Listeners
The `ReliableListener` class handles real-time updates:

```typescript
// Check if listeners are properly set up
const unsubscribe = QuizArena.Player.listenToRoom(roomCode, (data) => {
  console.log('Room update:', data); // Should log when room changes
});
```

#### B. Network Issues
- Check internet connection
- Verify Firebase connection is stable
- Try refreshing the page

**Quick Fix:**
1. Open browser developer tools
2. Check Network tab for failed requests
3. Look for WebSocket connection errors

## 🛠️ Step-by-Step Diagnostic Process

### Step 1: Run Automated Diagnostics
1. Go to `/quiz-arena/diagnostics`
2. Click "Run Diagnostics"
3. Review all failed tests
4. Click "Auto-Fix" for any failures

### Step 2: Manual Checks

#### Check Firebase Configuration
```javascript
// Run in browser console
console.log('Firebase Config:', {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10) + '...',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
});
```

#### Test Authentication
```javascript
// Run in browser console
import { auth } from './src/lib/firebase';
console.log('Current user:', auth.currentUser);
```

#### Test Room Creation
```javascript
// Run in browser console (when logged in)
import { QuizArena } from './src/lib/quiz-arena';
const roomCode = await QuizArena.Discovery.generateRoomCode();
console.log('Generated room code:', roomCode);
```

### Step 3: Check Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for red error messages
4. Check Network tab for failed API calls

### Step 4: Verify Environment Variables
Ensure these are set in your `.env` files:

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# AI
GEMINI_API_KEY=
NEXT_PUBLIC_FREE_MODEL_NAME=gemini-1.5-flash
NEXT_PUBLIC_PRO_MODEL_NAME=gemini-2.5-pro
```

## 🚀 Quick Recovery Steps

If Quiz Arena is completely broken:

1. **Clear Browser Cache**
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

2. **Redeploy Firebase Rules**
   - Go to Firebase Console
   - Copy the fixed rules from above
   - Deploy immediately

3. **Check API Keys**
   - Verify Gemini API key is valid
   - Check quota limits in Google Cloud Console
   - Ensure API key has proper permissions

4. **Test with Simple Quiz**
   - Try creating 1 question quiz
   - Use basic topic like "Math"
   - Test with easy difficulty

## 📞 Getting Help

If issues persist:

1. **Check Browser Console** - Look for specific error messages
2. **Run Test Script** - Use the `test-quiz-arena.js` file
3. **Firebase Console** - Check Firestore data and rules
4. **Network Tab** - Look for failed API requests

## 🔍 Debug Information

To get debug info, run this in browser console:
```javascript
console.log('Quiz Arena Debug Info:', {
  timestamp: new Date().toISOString(),
  userAgent: navigator.userAgent,
  url: window.location.href,
  localStorage: Object.keys(localStorage),
  sessionStorage: Object.keys(sessionStorage)
});
```

## ✅ Success Indicators

Quiz Arena is working properly when:
- ✅ Questions generate within 30 seconds
- ✅ Room codes are 6 characters and unique
- ✅ Participants can join with room codes
- ✅ Host can start quiz with 1+ players
- ✅ Real-time updates work (questions, scores, timer)
- ✅ No console errors during normal operation

---

**Need immediate help?** Go to `/quiz-arena/diagnostics` and run the automated diagnostic tool!