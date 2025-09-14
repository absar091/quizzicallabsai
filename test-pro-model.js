#!/usr/bin/env node

require('dotenv').config();

async function testProModel() {
  console.log('🧪 Testing Pro Model Availability...\n');

  const apiKey = process.env.GEMINI_API_KEY_1; // Working key
  console.log(`🔑 Using API Key: ${apiKey.substring(0, 20)}...`);

  const modelsToTest = [
    'gemini-1.5-pro',
    'gemini-1.5-pro-latest',
    'gemini-2.5-pro',
    'gemini-1.5-flash' // Fallback
  ];

  for (const model of modelsToTest) {
    try {
      console.log(`\n🧪 Testing: ${model}`);
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Generate a simple quiz question about basic math.'
            }]
          }]
        })
      });

      console.log(`📡 Status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
        console.log(`✅ ${model} - WORKS!`);
        console.log(`📝 Sample response: ${responseText.substring(0, 100)}...`);
      } else {
        const errorData = await response.text();
        if (response.status === 429) {
          console.log(`⚠️ ${model} - Rate limited (but model exists)`);
        } else if (response.status === 404) {
          console.log(`❌ ${model} - Model not found`);
        } else {
          console.log(`❌ ${model} - Error: ${response.status}`);
        }
      }
    } catch (error) {
      console.log(`❌ ${model} - Network Error: ${error.message}`);
    }
  }

  console.log('\n📊 RECOMMENDATION:');
  console.log('Based on the test results above, I will update your Pro model configuration.');
}

testProModel();