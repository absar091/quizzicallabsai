#!/usr/bin/env node

/**
 * Quick AI Setup Test
 * This script tests if your AI configuration is working properly
 */

// Load environment variables from .env file
require('dotenv').config();

console.log('🧪 Testing AI Setup...\n');

// Test 1: Environment Variables
console.log('1️⃣ Testing Environment Variables:');
const apiKeys = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5
].filter(key => key && key.trim() && !key.includes('Dummy'));

console.log(`   ✅ Found ${apiKeys.length} valid API keys`);
if (apiKeys.length > 0) {
  console.log(`   🔑 First key starts with: ${apiKeys[0].substring(0, 20)}...`);
} else {
  console.log('   ❌ No valid API keys found!');
  process.exit(1);
}

// Test 2: Model Configuration
console.log('\n2️⃣ Testing Model Configuration:');
const models = {
  free_primary: process.env.MODEL_ROUTER_FREE_PRIMARY || 'gemini-1.5-flash',
  free_fallback: process.env.MODEL_ROUTER_FREE_FALLBACK || 'gemini-2.0-flash',
  pro_primary: process.env.MODEL_ROUTER_PRO_PRIMARY || 'gemini-2.5-pro',
  pro_fallback: process.env.MODEL_ROUTER_PRO_FALLBACK || 'gemini-2.5-flash'
};

console.log('   ✅ Model configuration:');
Object.entries(models).forEach(([key, value]) => {
  console.log(`      ${key}: ${value}`);
});

// Test 3: Firebase Configuration
console.log('\n3️⃣ Testing Firebase Configuration:');
const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY
};

const firebaseValid = Object.values(firebaseConfig).every(val => val && val.trim());
console.log(`   ${firebaseValid ? '✅' : '❌'} Firebase config: ${firebaseValid ? 'Valid' : 'Missing values'}`);

// Test 4: MongoDB Configuration
console.log('\n4️⃣ Testing MongoDB Configuration:');
const mongoUri = process.env.MONGODB_URI;
console.log(`   ${mongoUri ? '✅' : '❌'} MongoDB URI: ${mongoUri ? 'Configured' : 'Missing'}`);

// Summary
console.log('\n📊 SUMMARY:');
const allGood = apiKeys.length >= 3 && firebaseValid && mongoUri;

if (allGood) {
  console.log('🎉 ALL SYSTEMS GO! Your AI features should work properly.');
  console.log('\n🚀 Next steps:');
  console.log('   1. Run: npm run dev');
  console.log('   2. Go to: http://localhost:3000/generate-quiz');
  console.log('   3. Try generating a quiz with topic: "Basic Math"');
  console.log('   4. Check browser console for any errors');
} else {
  console.log('⚠️  ISSUES DETECTED:');
  if (apiKeys.length < 3) console.log('   - Need at least 3 API keys for reliable operation');
  if (!firebaseValid) console.log('   - Firebase configuration incomplete');
  if (!mongoUri) console.log('   - MongoDB URI missing');
}

console.log('\n🔧 If you see any issues, check your .env file and restart the server.');