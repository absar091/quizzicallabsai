/**
 * Debug Endpoint - Comprehensive API Testing
 * Tests all systems to identify issues
 */

import { NextRequest, NextResponse } from 'next/server';
import { isAiAvailable, ai } from '@/ai/genkit';
import { getModel } from '@/lib/getModel';
import { getApiKeyStatus, getNextApiKey } from '@/lib/api-key-manager';
import { errorLogger } from '@/lib/error-logger';
import { generateCustomQuiz } from '@/ai/flows/generate-custom-quiz';

export async function GET(request: NextRequest) {
  console.log('🧪 Comprehensive Debug Test Started');

  const diagnostics = {
    timestamp: new Date().toISOString(),
    systemStatus: 'operational',
    environment: {
      nodeEnv: process.env.NODE_ENV,
      isServer: typeof process !== 'undefined',
      hasWindow: typeof window !== 'undefined'
    },
    aiSystem: {} as any,
    firebaseSystem: {} as any,
    quizGeneration: {} as any,
    serverSoftware: {
      nextVersion: process.env.npm_package_dependencies__next || 'unknown',
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch
    },
    databaseConnections: {} as any,
    recommendations: [] as string[]
  };

  try {
    // 🔍 **AI SYSTEM TESTS**
    console.log('🔍 Testing AI Systems...');

    // 1. API Key Status
    try {
      const keyStatus = getApiKeyStatus();
      diagnostics.aiSystem.apiKeys = {
        available: keyStatus.totalKeys > 0,
        count: keyStatus.totalKeys,
        current: keyStatus.currentKeyIndex + 1,
        usage: keyStatus.usageCount,
        status: keyStatus.totalKeys > 0 ? '✅ Available' : '❌ Missing'
      };

      if (keyStatus.totalKeys === 0) {
        diagnostics.recommendations.push('🔑 Add GEMINI_API_KEY_1, GEMINI_API_KEY_2, etc. to environment variables');
        diagnostics.systemStatus = 'critical';
      }
    } catch (error) {
      diagnostics.aiSystem.apiKeys = { error: error instanceof Error ? error.message : String(error) };
      diagnostics.recommendations.push('🔑 API key manager initialization failed');
      diagnostics.systemStatus = 'critical';
    }

    // 2. AI Client Status
    diagnostics.aiSystem.client = {
      available: isAiAvailable(),
      clientExists: !!ai,
      type: typeof ai,
      status: isAiAvailable() ? '✅ Ready' : '❌ Not Available'
    };

    if (!isAiAvailable()) {
      diagnostics.recommendations.push('🤖 AI client initialization failed - check API keys and network');
      diagnostics.systemStatus = diagnostics.systemStatus !== 'critical' ? 'error' : diagnostics.systemStatus;
    }

    // 3. Model Selection Test
    try {
      const basicModel = getModel(false, false);
      const proModel = getModel(true, false);
      const fallbackModel = getModel(true, true);

      diagnostics.aiSystem.models = {
        basic: basicModel || 'undefined',
        pro: proModel || 'undefined',
        fallback: fallbackModel || 'undefined',
        status: basicModel ? '✅ Available' : '❌ Not Available'
      };

      if (!basicModel) {
        diagnostics.recommendations.push('🎯 Model selection failed - check AI client setup');
      }
    } catch (error) {
      diagnostics.aiSystem.models = { error: error instanceof Error ? error.message : String(error) };
    }

    // 4. AI Connectivity Test
    try {
      if (ai && isAiAvailable()) {
        console.log('🧪 Testing AI connectivity with simple request...');

        const testResult = await ai.defineFlow({
          name: 'debugTest',
          inputSchema: { type: 'object' },
          outputSchema: { type: 'object' }
        }, async () => ({ debug: 'success', timestamp: new Date().toISOString() }))();

        diagnostics.aiSystem.connectivity = {
          success: testResult?.debug === 'success',
          response: testResult,
          status: testResult?.debug === 'success' ? '✅ Connected' : '❌ Connection Failed'
        };

        if (testResult?.debug !== 'success') {
          diagnostics.recommendations.push('🌐 AI service connection test failed');
        }
      } else {
        diagnostics.aiSystem.connectivity = {
          success: false,
          status: '❌ Cannot Test - AI Not Available'
        };
      }
    } catch (error: any) {
      diagnostics.aiSystem.connectivity = {
        success: false,
        error: error.message || 'Unknown connectivity error',
        status: '❌ Connection Failed'
      };

      const errorMsg = error.message || '';
      if (errorMsg.includes('quota')) {
        diagnostics.recommendations.push('⏱️ API quota exceeded - consider rotating keys or waiting');
      } else if (errorMsg.includes('invalid') || errorMsg.includes('auth')) {
        diagnostics.recommendations.push('🔐 API key authentication failed - check key validity');
      } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
        diagnostics.recommendations.push('🌐 Network connectivity issue - check internet connection');
      } else {
        diagnostics.recommendations.push('🤕 AI service error - check service status and API keys');
      }
    }

    // 🔍 **QUIZ GENERATION TESTS**
    console.log('🔍 Testing Quiz Generation...');

    try {
      // Test quiz generation with minimal input
      const testInput = {
        topic: 'Debug Test - Basic Algebra',
        difficulty: 'easy' as const,
        numberOfQuestions: 3,
        questionTypes: ['Multiple Choice' as const],
        questionStyles: ['Past Paper Style'],
        timeLimit: 15,
        userAge: undefined,
        userClass: 'Test Class',
        specificInstructions: 'Debug test - ignore if working'
      };

      console.log('🧮 Testing quiz generation...');
      const startTime = Date.now();
      const result = await generateCustomQuiz(testInput);
      const duration = Date.now() - startTime;

      diagnostics.quizGeneration.status = '✅ Working';
      diagnostics.quizGeneration.testResult = {
        questionsGenerated: result.quiz?.length || 0,
        duration: duration,
        hasQuestions: result.quiz && result.quiz.length > 0
      };

      if (!result.quiz || result.quiz.length === 0) {
        diagnostics.recommendations.push('📝 Quiz generation returned empty - check prompt templates');
        diagnostics.quizGeneration.status = '⚠️ Working but Empty Results';
      }

    } catch (error: any) {
      diagnostics.quizGeneration.status = '❌ Failed';
      diagnostics.quizGeneration.error = error.message || 'Quiz generation error';

      console.error('❌ Quiz generation test failed:', error);

      errorLogger.logError(error, {
        operation: 'debug_quiz_generation_test',
        component: 'debug_system',
        severity: 'high'
      });
    }

    // 🔍 **FIREBASE SYSTEM TESTS**
    console.log('🔍 Testing Firebase Systems...');

    try {
      const { db } = await import('@/lib/firebase');
      const { ref, set, get } = await import('firebase/database');

      // Test database connectivity
      const testRef = ref(db, 'system/debug/test');
      const testData = { debug: true, timestamp: new Date().toISOString() };

      await set(testRef, testData);
      const snapshot = await get(testRef);

      diagnostics.firebaseSystem.connectivity = {
        write: true,
        read: snapshot.exists(),
        data: snapshot.val(),
        status: snapshot.exists() ? '✅ Connected' : '❌ Read Failed'
      };

    } catch (error: any) {
      diagnostics.firebaseSystem.connectivity = {
        success: false,
        error: error.message,
        status: '❌ Connection Failed'
      };

      if (error.message?.includes('permission')) {
        diagnostics.recommendations.push('🔒 Firebase permission denied - check database rules');
      } else if (error.message?.includes('auth')) {
        diagnostics.recommendations.push('🔐 Firebase authentication issue');
      } else if (error.message?.includes('network')) {
        diagnostics.recommendations.push('🌐 Firebase network connection issue');
      }
    }

    // 🔍 **MONGO DB TESTS**
    console.log('🔍 Testing MongoDB Connections...');

    try {
      const { connectMongoDB } = await import('@/lib/mongodb');
      await connectMongoDB();

      diagnostics.databaseConnections.mongodb = {
        connected: true,
        status: '✅ Connected'
      };
    } catch (error: any) {
      diagnostics.databaseConnections.mongodb = {
        connected: false,
        error: error.message,
        status: '❌ Connection Failed'
      };
    }

    // 🔍 **OVERALL SYSTEM ASSESSMENT**
    const aiIssues = !diagnostics.aiSystem.apiKeys?.available ||
                     !diagnostics.aiSystem.client?.available ||
                     diagnostics.aiSystem.connectivity?.success === false ||
                     diagnostics.quizGeneration.status === '❌ Failed';

    const firebaseIssues = diagnostics.firebaseSystem.connectivity?.status === '❌ Connection Failed';

    const dbIssues = diagnostics.databaseConnections.mongodb?.connected === false;

    if (aiIssues) {
      diagnostics.recommendations.unshift('🚨 PRIMARY ISSUE: AI/Quiz Generation System - This affects MDCAT/ECAT/NTS quiz creation');
    }

    if (firebaseIssues) {
      diagnostics.recommendations.unshift('🚨 CRITICAL ISSUE: Firebase Database - Affects user data, quiz results, and sharing');
    }

    if (dbIssues) {
      diagnostics.recommendations.unshift('🚨 SERIOUS ISSUE: MongoDB Connection - Affects user management and analytics');
    }

    console.log('✅ Debug test completed successfully');
    console.table({
      'AI System': diagnostics.aiSystem.client?.status || 'Unknown',
      'API Keys': diagnostics.aiSystem.apiKeys?.status || 'Unknown',
      'Quiz Generation': diagnostics.quizGeneration.status || 'Unknown',
      'Firebase': diagnostics.firebaseSystem.connectivity?.status || 'Unknown',
      'MongoDB': diagnostics.databaseConnections.mongodb?.status || 'Unknown'
    });

    return NextResponse.json({
      success: diagnostics.systemStatus === 'operational',
      diagnostics,
      summary: {
        status: diagnostics.systemStatus.toUpperCase(),
        message: diagnostics.recommendations.length > 0
          ? `Issues detected: ${diagnostics.recommendations.length} recommendations available`
          : 'All systems operating normally',
        issuesDetected: [
          diagnostics.aiSystem.apiKeys?.status !== '✅ Available',
          diagnostics.aiSystem.client?.status !== '✅ Ready',
          diagnostics.aiSystem.connectivity?.status?.includes('❌'),
          diagnostics.quizGeneration.status === '❌ Failed',
          diagnostics.firebaseSystem.connectivity?.status?.includes('❌'),
          diagnostics.databaseConnections.mongodb?.status?.includes('❌')
        ].filter(Boolean).length
      },
      quickFixes: diagnostics.recommendations.slice(0, 5)
    });

  } catch (criticalError) {
    console.error('🚨 CRITICAL: Debug system itself failed:', criticalError);

    errorLogger.logError(criticalError as Error, {
      operation: 'debug_system_failure',
      component: 'debug_endpoint',
      severity: 'critical'
    });

    return NextResponse.json({
      success: false,
      error: 'Debug system failure',
      details: criticalError instanceof Error ? criticalError.message : String(criticalError),
      emergencyRepairs: [
        'Check environment variables are properly set',
        'Verify API keys are valid and current',
        'Ensure network connectivity and DNS resolution',
        'Check Firebase and MongoDB service status',
        'Review recent code changes that might have introduced issues'
      ]
    }, { status: 500 });
  }
}
