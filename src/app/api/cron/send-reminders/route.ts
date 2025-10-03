import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { EmailAutomation } from '@/lib/email-automation';

// Using the new email automation system with built-in preference checking

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('Authorization');
    const cronSecret = process.env.CRON_SECRET;

    console.log('🔐 Cron job authentication check...');
    console.log('Auth header present:', !!authHeader);
    console.log('CRON_SECRET configured:', !!cronSecret);

    if (!cronSecret) {
      console.error('❌ CRON_SECRET not configured');
      return NextResponse.json(
        { error: 'Cron job not configured properly', success: false },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      console.error('❌ Unauthorized cron job access attempt');
      console.log('Expected:', `Bearer ${cronSecret}`);
      console.log('Received:', authHeader);
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    console.log('🔔 Starting reminder email cron job...');

    // Check if email service is configured
    const emailConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
    console.log('📧 Email service configured:', emailConfigured);
    
    if (!emailConfigured) {
      console.error('❌ Email service not configured');
      console.log('SMTP_HOST:', !!process.env.SMTP_HOST);
      console.log('SMTP_USER:', !!process.env.SMTP_USER);
      console.log('SMTP_PASS:', !!process.env.SMTP_PASS);
      return NextResponse.json(
        { error: 'Email service not configured', success: false },
        { status: 500 }
      );
    }

    // Check if Firebase Admin is initialized
    if (!db) {
      console.error('❌ Firebase Admin Realtime Database not initialized');
      return NextResponse.json(
        { error: 'Firebase Admin Database not configured', success: false },
        { status: 500 }
      );
    }

    // For testing, let's get all users first (we'll add the date filter later)
    console.log('📊 Fetching users for reminder emails...');
    
    const usersRef = db.ref('users');
    // Start with a simple query to test - limit to 10 users
    const usersQuery = usersRef.limitToFirst(10);
    
    const usersSnapshot = await usersQuery.once('value');
    const usersData = usersSnapshot.val();
    
    console.log(`📊 Found ${usersData ? Object.keys(usersData).length : 0} users in database`);

    if (!usersData || Object.keys(usersData).length === 0) {
      console.log('ℹ️ No users found in database');
      return NextResponse.json({
        success: true,
        message: 'No users found in database',
        sent: 0,
        blocked: 0,
        failed: 0,
        total: 0
      });
    }

    // Prepare user data for batch sending
    const recipients = [];
    
    for (const [userId, userData] of Object.entries(usersData)) {
      const user = userData as any;

      if (!user.email) continue;

      // Fetch user's quiz history for personalized data
      try {
        const quizzesRef = db.ref(`users/${userId}/quizHistory`);
        const quizzesQuery = quizzesRef.orderByChild('completedAt').limitToLast(5);
        const quizzesSnapshot = await quizzesQuery.once('value');
        const quizzesData = quizzesSnapshot.val();

        let reminderData = {
          lastActivity: user.lastActivityAt ? new Date(user.lastActivityAt).toLocaleDateString() : 'A while ago',
          weakAreas: [] as string[],
          streakDays: user.streakDays || 0
        };

        // Analyze recent quiz data for weak areas
        if (quizzesData) {
          const recentQuizzes = Object.values(quizzesData);
          const weakTopics = new Set<string>();

          recentQuizzes.forEach((quiz: any) => {
            if (quiz.score < 70 && quiz.topic) weakTopics.add(quiz.topic);
          });

          if (weakTopics.size > 0) {
            reminderData.weakAreas = Array.from(weakTopics).slice(0, 3);
          }
        }

        recipients.push({
          email: user.email,
          data: {
            userName: user.displayName || user.name || 'Student',
            reminderData
          }
        });
      } catch (error) {
        console.error(`Error processing user ${userId}:`, error);
      }
    }

    console.log(`📧 Prepared ${recipients.length} recipients for batch sending`);

    if (recipients.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No valid recipients found',
        sent: 0,
        blocked: 0,
        failed: 0,
        total: 0
      });
    }

    // Send batch emails using the new automation system
    console.log('📤 Starting batch email sending...');
    
    // Import the template function
    const { studyReminderEmailTemplate } = await import('@/lib/email-templates-professional');
    
    const batchResult = await EmailAutomation.sendBatchEmails(
      recipients,
      'studyReminders',
      ({ userName, reminderData }) => {
        return studyReminderEmailTemplate(userName, reminderData);
      },
      {
        batchSize: 5, // Smaller batch size for testing
        delayBetweenBatches: 2000 // Longer delay for testing
      }
    );

    console.log(`🎉 Reminder cron job completed: ${batchResult.sent} sent, ${batchResult.blocked} blocked, ${batchResult.failed} failed`);

    return NextResponse.json({
      success: true,
      message: 'Reminder emails processed successfully',
      sent: batchResult.sent,
      blocked: batchResult.blocked,
      failed: batchResult.failed,
      total: batchResult.total,
      details: batchResult.results
    });

  } catch (error: any) {
    console.error('❌ Cron job error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to send reminder emails',
        details: error.stack || 'No stack trace available'
      },
      { status: 500 }
    );
  }
}
