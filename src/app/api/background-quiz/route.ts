import { NextRequest, NextResponse } from "next/server";
import * as admin from 'firebase-admin';
import { backgroundJobService } from "@/services/background-job-service";
import { generateCustomQuiz } from "@/ai/flows/generate-custom-quiz";
import { notificationService } from "@/services/notification-service";

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL!,
  });
}

export async function POST(request: NextRequest) {
  try {
    // 🔐 SERVER-SIDE AUTHENTICATION - Most Critical Security Fix
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const idToken = authHeader.replace('Bearer ', '');
    let decodedToken;

    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Get user ID from verified token (not from request body)
    const userId = decodedToken.uid;

    // Extract quiz generation parameters from request body
    const body = await request.json();
    const {
      topic,
      difficulty,
      numberOfQuestions,
      questionTypes,
      questionStyles,
      timeLimit,
      specificInstructions,
      isPro = false,
      userAge,
      userClass,
      recentQuizHistory = []
    } = body;

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'Topic is required and must be a string' },
        { status: 400 }
      );
    }

    // Create form values object for the job
    const formValues = {
      topic,
      difficulty,
      numberOfQuestions,
      questionTypes,
      questionStyles,
      timeLimit,
      specificInstructions: specificInstructions || ''
    };

    // Calculate estimated generation time based on complexity
    const baseTime = 20000; // 20 seconds base time
    const complexityMultiplier = difficulty === 'master' ? 3 :
                                difficulty === 'hard' ? 2.5 :
                                difficulty === 'medium' ? 2 : 1.5;
    const timePerQuestion = 3000; // ~3 seconds per question
    const estimatedTime = baseTime + (numberOfQuestions * timePerQuestion * complexityMultiplier);

    // Create background job
    const jobId = await backgroundJobService.createJob(
      userId,
      'quiz_generation',
      formValues,
      Math.max(estimatedTime, 45000) // Minimum 45 seconds
    );

    // Start processing the job asynchronously
    setTimeout(async () => {
      try {
        await backgroundJobService.startJob(jobId, userId);

        // Generate the quiz
        const result = await generateCustomQuiz({
          topic,
          difficulty,
          numberOfQuestions,
          questionTypes,
          questionStyles,
          timeLimit,
          specificInstructions,
          isPro,
          userAge,
          userClass,
          recentQuizHistory,
        });

        if (!result || !result.quiz || result.quiz.length === 0) {
          await backgroundJobService.failJob(
            jobId,
            userId,
            "Failed to generate quiz content"
          );
          return;
        }

        // Store the result
        const jobResult = {
          quiz: result.quiz,
          comprehensionText: result.comprehensionText || null,
          timestamp: Date.now(),
          topic,
          difficulty,
          questionCount: result.quiz.length
        };

        await backgroundJobService.completeJob(
          jobId,
          userId,
          jobResult
        );

        console.log(`🎉 Quiz generation completed for job ${jobId} - ${result.quiz.length} questions generated`);

      } catch (error) {
        console.error(`❌ Quiz generation failed for job ${jobId}:`, error);
        await backgroundJobService.failJob(
          jobId,
          userId,
          error instanceof Error ? error.message : 'Unknown error occurred'
        );
      }
    }, 1000); // Start processing after 1 second

    return NextResponse.json({
      success: true,
      jobId,
      message: `Your quiz on "${topic}" is being generated in the background.`,
      estimatedTime: Math.ceil(estimatedTime / 1000),
      status: 'background_processing'
    });

  } catch (error) {
    console.error('Error in background quiz generation:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve job status
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const jobId = url.searchParams.get('jobId');
  const userId = url.searchParams.get('userId');

  if (!jobId || !userId) {
    return NextResponse.json(
      { error: 'Job ID and User ID are required' },
      { status: 400 }
    );
  }

  try {
    const job = await backgroundJobService.getJob(jobId, userId);

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error retrieving job:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve job' },
      { status: 500 }
    );
  }
}
