#!/usr/bin/env node

require('dotenv').config();

async function finalTest() {
  console.log('🎯 Final Test - Quiz Generation Setup\n');

  const apiKey = process.env.GEMINI_API_KEY_1; // Should be working key now
  console.log(`🔑 API Key: ${apiKey.substring(0, 20)}...`);
  console.log(`📋 Primary Model: gemini-1.5-flash`);
  console.log(`📋 Fallback Model: gemini-1.5-flash-8b`);

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Generate a simple math question: What is 2 + 2?'
          }]
        }]
      })
    });

    if (response.ok) {
      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
      console.log('\n✅ SUCCESS! AI Response:');
      console.log(responseText);
      console.log('\n🚀 Your quiz generation should now work!');
      console.log('   1. Restart your dev server: npm run dev');
      console.log('   2. Go to: http://localhost:3000/generate-quiz');
      console.log('   3. Try generating a quiz');
    } else {
      console.log(`❌ Failed: Status ${response.status}`);
      const errorText = await response.text();
      console.log('Error:', errorText);
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
}

finalTest();