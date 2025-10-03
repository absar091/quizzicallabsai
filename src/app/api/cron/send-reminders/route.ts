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

    if (!cronSecret) {
      console.error('❌ CRON_SECRET not configured');
      return NextResponse.json(
        { error: 'Cron job not configured properly' },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      console.error('❌ Unauthorized cron job access attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔔 Starting reminder email cron job...');

    // Check if email service is configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('❌ Email service not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Calculate date threshold (users inactive for 3+ days)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const threshold = Timestamp.fromDate(threeDaysAgo);

    // Fetch users who need reminders
    // Note: Using simple query to avoid composite index requirement
    const usersRef = collection(firestore, 'users');
    const usersQuery = query(
      usersRef,
      where('lastActivityAt', '<=', threshold),
      limit(100) // Limit to 100 users per run to avoid timeouts
    );

    const usersSnapshot = await getDocs(usersQuery);
    console.log(`📊 Found ${usersSnapshot.size} users eligible for reminders`);

    if (usersSnapshot.empty) {
      return NextResponse.json({
        success: true,
        message: 'No users need reminders at this time',
        sent: 0
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

    // Send batch emails using the new automation system
    const batchResult = await EmailAutomation.sendBatchEmails(
      recipients,
      'studyReminders',
      ({ userName, reminderData }) => {
        const { studyReminderEmailTemplate } = require('@/lib/email-templates');
        return studyReminderEmailTemplate(userName, reminderData);
      },
      {
        batchSize: 10,
        delayBetweenBatches: 1000
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
