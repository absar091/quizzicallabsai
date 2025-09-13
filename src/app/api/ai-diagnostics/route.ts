/**
 * AI Diagnostics API Route
 * Provides comprehensive AI service status and diagnostics
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkAIStatus } from '@/lib/ai-debug';
import { getApiKeyStatus } from '@/lib/api-key-manager';
import { isAiAvailable, ai } from '@/ai/genkit';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Running AI diagnostics via API...');

    // Run comprehensive diagnostics
    const diagnostics = await checkAIStatus();

    // Additional server-side checks
    const serverChecks = {
      environmentVariables: {
        hasGeminiKey: !!process.env.GEMINI_API_KEY,
        hasGeminiKey1: !!process.env.GEMINI_API_KEY_1,
        hasGeminiKey2: !!process.env.GEMINI_API_KEY_2,
        hasGeminiKey3: !!process.env.GEMINI_API_KEY_3,
        hasGeminiKey4: !!process.env.GEMINI_API_KEY_4,
        hasGeminiKey5: !!process.env.GEMINI_API_KEY_5,
        nodeEnv: process.env.NODE_ENV,
        port: process.env.PORT
      },
      apiKeyManager: {
        status: getApiKeyStatus(),
        canGetNextKey: false,
        nextKeyError: null
      },
      genkitPlugins: {
        hasAi: !!ai,
        isAiAvailable: isAiAvailable(),
        aiType: typeof ai
      }
    };

    // Test API key rotation
    try {
      const { getNextApiKey } = await import('@/lib/api-key-manager');
      const nextKey = getNextApiKey();
      serverChecks.apiKeyManager.canGetNextKey = !!nextKey;
    } catch (error) {
      serverChecks.apiKeyManager.nextKeyError = error instanceof Error ? error.message : String(error);
    }

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      diagnostics,
      serverChecks,
      recommendations: [],
      status: 'operational'
    };

    // Generate recommendations based on results
    if (!serverChecks.apiKeyManager.status.totalKeys) {
      response.recommendations.push({
        priority: 'critical',
        issue: 'Missing API keys',
        solution: 'Add GEMINI_API_KEY_1, GEMINI_API_KEY_2, etc. to .env.local',
        details: 'No Gemini API keys detected - quiz generation will fail'
      });
      response.status = 'critical';
    }

    if (!serverChecks.genkitPlugins.hasAi) {
      response.recommendations.push({
        priority: 'critical',
        issue: 'AI client not initialized',
        solution: 'Check AI initialization in genkit.ts',
        details: 'Genkit AI client failed to load - quiz generation blocked'
      });
      response.status = 'critical';
    }

    if (!serverChecks.genkitPlugins.isAiAvailable) {
      response.recommendations.push({
        priority: 'high',
        issue: 'AI service unavailable',
        solution: 'Run AI diagnostics and check network/API quota',
        details: 'AI service reports unavailable - generation may fail'
      });
      response.status = 'warning';
    }

    if (response.recommendations.length === 0) {
      response.recommendations.push({
        priority: 'info',
        issue: 'All systems operational',
        solution: 'No actions needed',
        details: 'AI services are working correctly'
      });
    }

    console.log(`✅ AI Diagnostics completed with status: ${response.status.toUpperCase()}`);
    return NextResponse.json(response);

  } catch (error) {
    console.error('AI Diagnostics API error:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown diagnostic error',
      timestamp: new Date().toISOString(),
      recommendations: [{
        priority: 'critical',
        issue: 'Diagnostics failed',
        solution: 'Check server logs for detailed error information',
        details: 'Unable to run AI diagnostics - service may be malfunctioning'
      }]
    }, { status: 500 });
  }
}

// POST endpoint for manual troubleshooting
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, params } = body;

    console.log(`🔧 AI Diagnostic Action: ${action}`, params);

    switch (action) {
      case 'rotate_api_key':
        try {
          const { handleApiKeyError } = await import('@/lib/api-key-manager');
          handleApiKeyError();
          return NextResponse.json({
            success: true,
            message: 'API key rotated successfully',
            status: getApiKeyStatus()
          });
        } catch (error) {
          return NextResponse.json({
            success: false,
            error: 'Failed to rotate API key',
            details: error instanceof Error ? error.message : String(error)
          }, { status: 500 });
        }

      case 'test_ai_request':
        try {
          if (!ai) {
            return NextResponse.json({
              success: false,
              error: 'AI client not initialized'
            }, { status: 500 });
          }

          // Create a simple test flow
          const testFlow = ai.defineFlow(
            {
              name: 'diagnosticTest',
              inputSchema: { $schema: 'http://json-schema.org/draft-07/schema#', type: 'object' },
              outputSchema: { $schema: 'http://json-schema.org/draft-07/schema#', type: 'object' }
            },
            async () => ({
              success: true,
              timestamp: new Date().toISOString(),
              message: 'AI test completed successfully'
            })
          );

          const result = await testFlow();
          return NextResponse.json({
            success: true,
            message: 'AI request successful',
            response: result
          });

        } catch (error) {
          return NextResponse.json({
            success: false,
            error: 'AI test request failed',
            details: error instanceof Error ? error.message : String(error)
          }, { status: 500 });
        }

      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown action',
          availableActions: ['rotate_api_key', 'test_ai_request']
        }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Action failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
