// Admin endpoint to check API key rotation status
import { NextRequest, NextResponse } from 'next/server';
import { getApiKeyStatus } from '@/lib/api-key-manager';

export async function GET(request: NextRequest) {
  try {
    // Basic authentication check (you can enhance this)
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // You can add more sophisticated auth here
    const token = authHeader.substring(7);

    // For now, just check if it's a valid admin token
    if (token !== process.env.ADMIN_API_TOKEN) {
      return NextResponse.json(
        { error: 'Invalid admin token' },
        { status: 403 }
      );
    }

    const status = getApiKeyStatus();

    return NextResponse.json({
      success: true,
      apiKeyStatus: status,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('API key status check failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    if (token !== process.env.ADMIN_API_TOKEN) {
      return NextResponse.json(
        { error: 'Invalid admin token' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'rotate') {
      const { rotateApiKey } = await import('@/lib/api-key-manager');
      const newKey = rotateApiKey();

      return NextResponse.json({
        success: true,
        message: 'API key rotated successfully',
        newKeyPreview: newKey.substring(0, 20) + '...',
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'reset') {
      const { apiKeyManager } = await import('@/lib/api-key-manager');
      apiKeyManager.resetUsageCount();

      return NextResponse.json({
        success: true,
        message: 'Usage count reset successfully',
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('API key management failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
