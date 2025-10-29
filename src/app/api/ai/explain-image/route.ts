import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { explainImage } from '@/ai/flows/explain-image';
import { checkContentSafety } from '@/lib/content-safety';
import { secureLog } from '@/lib/secure-logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken, imageDataUri, query } = body;

    // Verify authentication
    if (!idToken) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Validate input
    if (!imageDataUri || !query) {
      return NextResponse.json(
        { success: false, error: 'Image and query are required' },
        { status: 400 }
      );
    }

    // Validate image data URI format
    if (!imageDataUri.startsWith('data:image/') || !imageDataUri.includes('base64,')) {
      return NextResponse.json(
        { success: false, error: 'Invalid image format. Please provide a valid base64 image data URI.' },
        { status: 400 }
      );
    }

    // Content safety check for query
    const safetyCheck = await checkContentSafety(query, 'image explanation query');
    if (!safetyCheck.isSafe) {
      secureLog('warn', 'Unsafe content detected in image explanation query', {
        userId: decodedToken.uid,
        reason: safetyCheck.reason
      });
      return NextResponse.json(
        { success: false, error: 'Content not allowed. Please modify your query.' },
        { status: 400 }
      );
    }

    const userId = decodedToken.uid;
    const userEmail = decodedToken.email;

    secureLog('info', 'Image explanation request', {
      userId,
      queryLength: query.length,
      imageSize: imageDataUri.length
    });

    try {
      // Call the AI flow
      const result = await explainImage({
        imageDataUri,
        query
      });

      if (!result || !result.explanation) {
        throw new Error('AI failed to generate explanation');
      }

      secureLog('info', 'Image explanation generated successfully', {
        userId,
        explanationLength: result.explanation.length
      });

      return NextResponse.json({
        success: true,
        explanation: result.explanation,
        timestamp: new Date().toISOString()
      });

    } catch (aiError: any) {
      secureLog('error', 'AI image explanation error', {
        userId,
        error: aiError.message,
        queryLength: query.length
      });

      // Handle specific AI errors
      if (aiError.message.includes('quota') || aiError.message.includes('rate limit')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'AI service quota exceeded. Please try again in a few minutes.',
            retryAfter: 300 // 5 minutes
          },
          { status: 429 }
        );
      } else if (aiError.message.includes('timeout')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Request timeout. The AI service is busy. Please try again.',
            retryAfter: 60 // 1 minute
          },
          { status: 408 }
        );
      } else if (aiError.message.includes('network')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Network connection issue. Please check your internet connection.',
            retryAfter: 30 // 30 seconds
          },
          { status: 503 }
        );
      } else {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Failed to generate image explanation. Please try again.',
            retryAfter: 60
          },
          { status: 500 }
        );
      }
    }

  } catch (error: any) {
    secureLog('error', 'Image explanation API error', {
      error: error.message,
      stack: error.stack?.substring(0, 500)
    });

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle GET requests for API documentation
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Image Explanation API',
    description: 'Upload an image and get AI-powered explanations',
    usage: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        idToken: 'Firebase ID token',
        imageDataUri: 'Base64 encoded image data URI',
        query: 'Question about the image'
      }
    },
    supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    maxImageSize: '10MB',
    rateLimit: '10 requests per minute'
  });
}