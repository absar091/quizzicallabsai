import { NextRequest, NextResponse } from 'next/server';
import { isAiAvailable } from '@/ai/genkit';
import { getApiKeyStatus } from '@/lib/api-key-manager';
import { getModelForUser, getPrimaryModel, getFallbackModel } from '@/lib/modelRouter';

export async function GET(request: NextRequest) {
  try {
    const aiAvailable = isAiAvailable();
    const apiKeyStatus = getApiKeyStatus();

    // Test model router
    const freeModels = getModelForUser('free');
    const proModels = getModelForUser('pro');

    const health = {
      aiAvailable,
      apiKeysLoaded: apiKeyStatus.totalKeys > 0,
      currentKeyIndex: apiKeyStatus.currentKeyIndex,
      totalKeys: apiKeyStatus.totalKeys,
      usageCount: apiKeyStatus.usageCount,
      modelRouter: {
        free: freeModels,
        pro: proModels,
        freePrimary: getPrimaryModel('free'),
        freeFallback: getFallbackModel('free'),
        proPrimary: getPrimaryModel('pro'),
        proFallback: getFallbackModel('pro')
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
