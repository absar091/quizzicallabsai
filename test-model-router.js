// Test script for model router
// Run with: node test-model-router.js

const { getModelForUser, getPrimaryModel, getFallbackModel, getModelWithFallback } = require('./src/lib/modelRouter.ts');

console.log('🧪 Testing Model Router...\n');

// Test free tier
console.log('📋 FREE TIER:');
console.log('Primary model:', getPrimaryModel('free'));
console.log('Fallback model:', getFallbackModel('free'));
console.log('Full config:', getModelForUser('free'));
console.log('With fallback (false):', getModelWithFallback('free', false));
console.log('With fallback (true):', getModelWithFallback('free', true));
console.log();

// Test pro tier
console.log('💎 PRO TIER:');
console.log('Primary model:', getPrimaryModel('pro'));
console.log('Fallback model:', getFallbackModel('pro'));
console.log('Full config:', getModelForUser('pro'));
console.log('With fallback (false):', getModelWithFallback('pro', false));
console.log('With fallback (true):', getModelWithFallback('pro', true));
console.log();

console.log('✅ Model Router Test Complete!');
