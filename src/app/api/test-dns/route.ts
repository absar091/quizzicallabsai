import { NextRequest, NextResponse } from 'next/server';
import { lookup } from 'dns/promises';

export async function GET(request: NextRequest) {
  const results = [];

  const domains = [
    'api.safepay.pk',
    'sandbox.api.safepay.pk',
    'www.safepay.pk',
    'safepay.pk'
  ];

  for (const domain of domains) {
    try {
      console.log(`🔍 Testing DNS resolution for: ${domain}`);
      const result = await lookup(domain);
      console.log(`✅ ${domain} resolved to:`, result);
      
      results.push({
        domain,
        success: true,
        address: result.address,
        family: result.family
      });
    } catch (error: any) {
      console.log(`❌ ${domain} failed:`, error.message);
      
      results.push({
        domain,
        success: false,
        error: error.message,
        code: error.code
      });
    }
  }

  // Test HTTP connectivity for successful DNS resolutions
  for (const result of results) {
    if (result.success) {
      try {
        console.log(`🌐 Testing HTTP connectivity to: https://${result.domain}`);
        
        const response = await fetch(`https://${result.domain}`, {
          method: 'HEAD',
          timeout: 5000
        });
        
        result.httpStatus = response.status;
        result.httpStatusText = response.statusText;
        result.httpSuccess = true;
        
        console.log(`✅ HTTP test for ${result.domain}: ${response.status} ${response.statusText}`);
      } catch (httpError: any) {
        result.httpSuccess = false;
        result.httpError = httpError.message;
        
        console.log(`❌ HTTP test for ${result.domain} failed:`, httpError.message);
      }
    }
  }

  return NextResponse.json({
    success: true,
    results,
    timestamp: new Date().toISOString(),
    recommendation: results.find(r => r.domain === 'api.safepay.pk' && r.success) 
      ? 'Use production API (api.safepay.pk)'
      : 'SafePay services may be unavailable'
  });
}