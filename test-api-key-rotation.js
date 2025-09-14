#!/usr/bin/env node

/**
 * Test API Key Rotation Logic
 */

require('dotenv').config();

async function testApiKeyRotation() {
  console.log('🧪 Testing API Key Rotation Logic...\n');

  // Import the API key manager
  const { getDetailedApiKeyStatus, getCurrentApiKey, handleApiKeyError, resetFailedApiKeys } = require('./src/lib/api-key-manager.ts');

  console.log('📊 Initial Status:');
  console.log(getDetailedApiKeyStatus());

  console.log('\n🔑 Current API Key:', getCurrentApiKey().substring(0, 20) + '...');

  console.log('\n🚨 Simulating API key failure...');
  const nextKey = handleApiKeyError();
  console.log('🔄 Next working key:', nextKey.substring(0, 20) + '...');

  console.log('\n📊 Status after failure:');
  console.log(getDetailedApiKeyStatus());

  console.log('\n🔄 Resetting failed keys...');
  resetFailedApiKeys();

  console.log('\n📊 Final Status:');
  console.log(getDetailedApiKeyStatus());

  console.log('\n✅ API Key rotation logic test completed!');
  console.log('🚀 The system will now automatically try the next key if one fails.');
}

testApiKeyRotation().catch(console.error);