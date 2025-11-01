import { NextResponse } from 'next/server';

interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  message?: string;
  responseTime?: number;
}

interface HealthStatus {
  database: HealthCheck;
  ai: HealthCheck;
  email: HealthCheck;
  storage: HealthCheck;
  timestamp: string;
  uptime: number;
  version: string;
}

async function checkFirebaseConnection(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    const { auth } = await import('@/lib/firebase-admin');
    // Simple auth check - try to get user count (will fail gracefully if no users)
    await auth.listUsers(1);
    return {
      status: 'healthy',
      responseTime: Date.now() - start
    };
  } catch (error: any) {
    return {
      status: 'unhealthy',
      message: `Firebase connection failed: ${error.message}`,
      responseTime: Date.now() - start
    };
  }
}

async function checkGeminiAPI(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    // Simple check - verify API key exists
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }
    
    // Test with a minimal request
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned ${response.status}`);
    }

    return {
      status: 'healthy',
      responseTime: Date.now() - start
    };
  } catch (error: any) {
    return {
      status: 'unhealthy',
      message: `Gemini API check failed: ${error.message}`,
      responseTime: Date.now() - start
    };
  }
}

async function checkSMTPConnection(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    // Check if SMTP credentials are configured
    const requiredEnvVars = [
      'SMTP_HOST',
      'SMTP_PORT', 
      'SMTP_USER',
      'SMTP_PASS'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`Missing SMTP configuration: ${missingVars.join(', ')}`);
    }

    return {
      status: 'healthy',
      message: 'SMTP configuration verified',
      responseTime: Date.now() - start
    };
  } catch (error: any) {
    return {
      status: 'unhealthy',
      message: `SMTP check failed: ${error.message}`,
      responseTime: Date.now() - start
    };
  }
}

async function checkStorageConnection(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    // Check Firebase Storage configuration
    if (!process.env.FIREBASE_ADMIN_PROJECT_ID) {
      throw new Error('Firebase Storage not configured');
    }

    return {
      status: 'healthy',
      message: 'Storage configuration verified',
      responseTime: Date.now() - start
    };
  } catch (error: any) {
    return {
      status: 'unhealthy',
      message: `Storage check failed: ${error.message}`,
      responseTime: Date.now() - start
    };
  }
}

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Run all health checks in parallel
    const [database, ai, email, storage] = await Promise.all([
      checkFirebaseConnection(),
      checkGeminiAPI(),
      checkSMTPConnection(),
      checkStorageConnection()
    ]);

    const healthStatus: HealthStatus = {
      database,
      ai,
      email,
      storage,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0'
    };

    // Determine overall health
    const allHealthy = [database, ai, email, storage].every(
      check => check.status === 'healthy'
    );

    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      ...healthStatus,
      overall: {
        status: allHealthy ? 'healthy' : 'unhealthy',
        responseTime
      }
    }, { 
      status: allHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error: any) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      overall: {
        status: 'unhealthy',
        message: `Health check system failure: ${error.message}`
      },
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0'
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
}