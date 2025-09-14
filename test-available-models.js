#!/usr/bin/env node

/**
 * Test Available Google AI Models
 */

require('dotenv').config();

async function testAvailableModels() {
  console.log('🧪 Testing Available Google AI Models...\n');

  const workingKeys = [
    process.env.GEMINI_API_KEY_1, // This should be the working one now
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3
  ].filter(key => key && key.trim());

  const apiKey = workingKeys[0]; // Use first working key
  console.log(`🔑 Using API Key: ${apiKey.substring(0, 20)}...`);

  // Test different model names that might work
  const modelsToTest = [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-1.0-pro',
    'gemini-pro',
    'gemini-flash',
    'models/gemini-1.5-flash',
    'models/gemini-1.5-pro',
    'models/gemini-1.0-pro',
    'models/gemini-pro'
  ];

  console.log('🔍 Testing models...\n');

  for (const model of modelsToTest) {
    try {
      console.log(`Testing: ${model}`);
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Say "OK" if you can hear me.'
            }]
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
        console.log(`✅ ${model} - WORKS! Response: ${responseText}`);
      } else {
        const errorData = await response.text();
        console.log(`❌ ${model} - Status: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${model} - Error: ${error.message}`);
    }
  }

  console.log('\n🔍 Also checking available models list...');
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (response.ok) {
      const data = await response.json();
      console.log('\n📋 Available Models:');
      data.models?.forEach(model => {
        console.log(`  - ${model.name} (${model.displayName})`);
      });
    }
  } catch (error) {
    console.log('❌ Could not fetch models list:', error.message);
  }
}

testAvailableModels();