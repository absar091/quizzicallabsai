/**
 * AI Debugging and Diagnostics Utility
 * Helps diagnose quiz generation failures
 */

import { isAiAvailable, ai } from '@/ai/genkit';
import { getApiKeyStatus, getNextApiKey } from '@/lib/api-key-manager';

// Export function to check AI status
export async function checkAIStatus() {
  console.log('🔍 AI Diagnostic Check Starting...');

  const diagnostics = {
    timestamp: new Date().toISOString(),
    environmentCheck: {
      isServer: typeof process !== 'undefined',
      hasWindow: typeof window !== 'undefined',
      nodeEnv: process?.env?.NODE_ENV
    },
    apiKeyStatus: {
      available: false,
      count: 0,
      error: null
    },
    aiInitialization: {
      initialized: false,
      clientExists: false,
      error: null
    },
    sampleRequest: {
      tested: false,
      success: false,
      error: null
    }
  };

  // Check environment
  console.log('📋 Environment Check:');
  console.log('  - Is Server:', diagnostics.environmentCheck.isServer);
  console.log('  - Has Window:', diagnostics.environmentCheck.hasWindow);
  console.log('  - Node ENV:', diagnostics.environmentCheck.nodeEnv);

  try {
    // Check API key status
    console.log('🔑 API Key Status Check:');
    const keyStatus = getApiKeyStatus();
    diagnostics.apiKeyStatus.available = keyStatus.totalKeys > 0;
    diagnostics.apiKeyStatus.count = keyStatus.totalKeys;

    console.log('  - API Keys Available:', diagnostics.apiKeyStatus.available);
    console.log('  - Total Keys:', diagnostics.apiKeyStatus.count);
    console.log('  - Current Key Index:', keyStatus.currentKeyIndex);
    console.log('  - Usage Count:', keyStatus.usageCount);

  } catch (error) {
    diagnostics.apiKeyStatus.error = error instanceof Error ? error.message : String(error);
    console.log('❌ API Key Check Failed:', diagnostics.apiKeyStatus.error);
  }

  // Check AI initialization
  console.log('🤖 AI Initialization Check:');
  const aiAvailable = isAiAvailable();
  diagnostics.aiInitialization.initialized = !!ai;
  diagnostics.aiInitialization.clientExists = !!aiAvailable;

  console.log('  - AI Client Initialized:', diagnostics.aiInitialization.initialized);
  console.log('  - AI Client Available:', diagnostics.aiInitialization.clientExists);
  console.log('  - isAiAvailable():', aiAvailable);

  // Try a simple test request
  console.log('🧪 Sample API Test:');
  if (ai && aiAvailable) {
    try {
      // Simple test request
      const genkitAi = await ai;
      if (genkitAi) {
        const testFlow = genkitAi.defineFlow(
          {
            name: 'testFlow',
            inputSchema: { $schema: 'http://json-schema.org/draft-07/schema#', type: 'object' },
            outputSchema: { $schema: 'http://json-schema.org/draft-07/schema#', type: 'object' }
          },
          async () => ({ test: 'success' })
        );

        const result = await testFlow();
        diagnostics.sampleRequest.tested = true;
        diagnostics.sampleRequest.success = !!result;
        console.log('  ✅ Sample request successful');
      }
    } catch (error: any) {
      diagnostics.sampleRequest.error = error?.message || String(error);
      console.log('❌ Sample request failed:', diagnostics.sampleRequest.error);
    }
  } else {
    console.log('  ⚠️ Skipping sample request - AI not available');
    diagnostics.sampleRequest.error = 'AI not available';
  }

  // Provide recommendations
  console.log('📋 RECOMMENDATIONS:');

  if (!diagnostics.apiKeyStatus.available) {
    console.log('  🚨 CRITICAL: No API keys found in environment variables');
    console.log('     Solution: Add GEMINI_API_KEY_1, GEMINI_API_KEY_2, etc. to .env.local');
  }

  if (!diagnostics.aiInitialization.clientExists) {
    console.log('  🚨 CRITICAL: AI client failed to initialize');
    console.log('     Solution: Check API key validity and network connection');
  }

  if (!diagnostics.aiInitialization.initialized) {
    console.log('  ⚠️ WARNING: AI client not initialized at module load');
    console.log('     Solution: Check for initialization errors in console');
  }

  if (diagnostics.sampleRequest.error && diagnostics.sampleRequest.error !== 'AI not available') {
    console.log('  ❌ ERROR: AI requests are failing');
    console.log('     Solution: Check API quotas, keys, or network connectivity');
  }

  console.log('🔍 AI Diagnostic Check Completed');
  console.log('📝 Summary:', {
    apiKeys: diagnostics.apiKeyStatus.available ? '✅' : '❌',
    initialization: diagnostics.aiInitialization.initialized ? '✅' : '❌',
    availability: diagnostics.aiInitialization.clientExists ? '✅' : '❌',
    testRequest: diagnostics.sampleRequest.success ? '✅' : '❌'
  });

  return diagnostics;
}

// Export for immediate diagnostic check
export const runAIDiagnostics = () => {
  if (typeof process !== 'undefined') {
    checkAIStatus().catch(console.error);
  } else {
    console.log('⚠️ AI diagnostics only available on server-side');
  }
};

// Call diagnostics on module load
if (typeof process !== 'undefined') {
  // Delay diagnostics slightly to allow other modules to load
  setTimeout(() => {
    console.log('🚀 Starting AI diagnostics...');
    runAIDiagnostics();
  }, 1000);
}
