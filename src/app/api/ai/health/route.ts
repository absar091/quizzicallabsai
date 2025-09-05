import { NextRequest, NextResponse } from 'next/server';
import { isAiAvailable } from '@/ai/genkit';
import { getApiKeyStatus } from '@/lib/api-key-manager';

export async function GET(request: NextRequest) {
  try {
    const aiAvailable = isAiAvailable();
    const apiKeyStatus = getApiKeyStatus();

    const health = {
      aiAvailable,
      apiKeysLoaded: apiKeyStatus.totalKeys > 0,
      currentKeyIndex: apiKeyStatus.currentKeyIndex,
      totalKeys: apiKeyStatus.totalKeys,
      usageCount: apiKeyStatus.usageCount,
      models: {
        free: {
          primary: 'gemini-1.5-flash',
          fallback: 'gemini-2.0-flash'
        },
        pro: {
          primary: 'gemini-2.5-pro',
          fallback: 'gemini-2.5-flash'
        }
      },
      timestamp: new Date().toISOString()
    };

    console.log('🏥 AI Health Check:', health);

    return NextResponse.json(health);
  } catch (error: any) {
    console.error('Health check error:', error);
    return NextResponse.json({
      error: error.message,
      aiAvailable: false,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
