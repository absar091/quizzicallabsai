import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp, orderBy, limit } from 'firebase/firestore';
import { EmailAutomation, sendAutomatedStudyReminder } from '@/lib/email-automation';

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

    // For testing, let's get all users first (we'll add the date filter later)
    console.log('📊 Fetching users for reminder emails...');
    
    const usersRef = collection(firestore, 'users');
    // Start with a simple query to test
    const usersQuery = query(usersRef, limit(10)); // Start with just 10 users for testing
    
    const usersSnapshot = await getDocs(usersQuery);
    console.log(`📊 Found ${usersSnapshot.size} users in database`);

    if (usersSnapshot.empty) {
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
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const userId = userDoc.id;

      if (!userData.email) continue;

      // Fetch user's quiz history for personalized data
      try {
        const quizzesRef = collection(firestore, 'users', userId, 'quizHistory');
        const quizzesQuery = query(quizzesRef, orderBy('completedAt', 'desc'), limit(5));
        const quizzesSnapshot = await getDocs(quizzesQuery);

        let reminderData = {
          lastActivity: userData.lastActivityAt?.toDate()?.toLocaleDateString() || 'A while ago',
          weakAreas: [] as string[],
          streakDays: userData.streakDays || 0
        };

        // Analyze recent quiz data for weak areas
        if (!quizzesSnapshot.empty) {
          const recentQuizzes = quizzesSnapshot.docs.map(doc => doc.data());
          const weakTopics = new Set<string>();

          recentQuizzes.forEach((quiz: any) => {
            if (quiz.score < 70 && quiz.topic) weakTopics.add(quiz.topic);
          });

          if (weakTopics.size > 0) {
            reminderData.weakAreas = Array.from(weakTopics).slice(0, 3);
          }
        }

        recipients.push({
          email: userData.email,
          data: {
            userName: userData.displayName || userData.name || 'Student',
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
    const batchResult = await EmailAutomation.sendBatchEmails(
      recipients,
      'studyReminders',
      ({ userName, reminderData }) => {
        const { studyReminderEmailTemplate } = require('@/lib/email-templates-professional');
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
