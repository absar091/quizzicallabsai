/**
 * Quick AI Service Test Endpoint
 * Tests basic AI connectivity and key availability
 */

import { NextRequest, NextResponse } from 'next/server';
import { isAiAvailable, ai } from '@/ai/genkit';

export async function GET(request: NextRequest) {
  console.log('🧪 QUICK AI CHECK STARTING...');

  const results = {
    '✅ AI Available?': isAiAvailable() ? '✅ YES' : '❌ NO',
    '✅ AI Client Exists?': !!ai ? '✅ YES' : '❌ NO',
    '⚠️ Environment Variables': {
      'GEMINI_API_KEY': !!process.env.GEMINI_API_KEY ? '✅ SET' : '❌ MISSING',
      'GEMINI_API_KEY_1': !!process.env.GEMINI_API_KEY_1 ? '✅ SET' : '❌ MISSING',
      'GEMINI_API_KEY_2': !!process.env.GEMINI_API_KEY_2 ? '✅ SET' : '❌ MISSING',
      'GEMINI_API_KEY_3': !!process.env.GEMINI_API_KEY_3 ? '✅ SET' : '❌ MISSING',
      'GEMINI_API_KEY_4': !!process.env.GEMINI_API_KEY_4 ? '✅ SET' : '❌ MISSING',
      'GEMINI_API_KEY_5': !!process.env.GEMINI_API_KEY_5 ? '✅ SET' : '❌ MISSING',
    },
    '🔑 Total Keys Available': Object.values(process.env)
      .filter((v, i) => [
        'GEMINI_API_KEY',
        'GEMINI_API_KEY_1',
        'GEMINI_API_KEY_2',
        'GEMINI_API_KEY_3',
        'GEMINI_API_KEY_4',
        'GEMINI_API_KEY_5'
      ].includes(Object.keys(process.env)[i]) && v && !v.includes('Dummy')).length,
    '🧪 Test Result': '',
    '⚡ Action Needed': ''
  };

  // Quick AI test
  try {
    if (ai && isAiAvailable()) {
      const testFlow = ai.defineFlow(
        {
          name: 'testFlow',
          inputSchema: { type: 'object' },
          outputSchema: { type: 'object' }
        },
        async () => ({ test: 'success' })
      );

      const startTime = Date.now();
      const result = await testFlow();
      const responseTime = Date.now() - startTime;

      if (result && result.test === 'success') {
        results['🧪 Test Result'] = `✅ PASS (${responseTime}ms)`;
        results['⚡ Action Needed'] = '🎉 All working! No action needed.';
      } else {
        results['🧪 Test Result'] = `❌ FAIL (${responseTime}ms)`;
        results['⚡ Action Needed'] = '❌ AI service responding but returning unexpected results';
      }
    } else {
      results['🧪 Test Result'] = '❌ CANNOT TEST - AI service unavailable';
      results['⚡ Action Needed'] = '🔑 Add API keys to .env.local';
    }
  } catch (error: any) {
    results['🧪 Test Result'] = `❌ FAIL - ${error?.message || 'Unknown error'}`;
    results['⚡ Action Needed'] = '🔍 Check API key validity and network connection';
  }

  console.log('📊 QUICK AI CHECK RESULTS:', results);

  const statusCode = results['🧪 Test Result'].includes('PASS') ? 200 :
                    results['🧪 Test Result'].includes('CANNOT') ? 400 : 500;

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    status: results['🧪 Test Result'].includes('PASS') ? 'good' : 'bad',
    diagnostics: results,
    summary: `AI Service: ${results['✅ AI Available?'].includes('YES') ? 'Online' : 'Offline'}`,
    verdict: results['🧪 Test Result'].includes('PASS') ?
      '🎉 MDCAT/ECAT/NTS quiz generation should work!' :
      '❌ Check your API keys - quiz generation will fail'
  }, { status: statusCode });
}
