import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp, orderBy, limit } from 'firebase/firestore';
import { studyReminderEmailTemplate } from '@/lib/email-templates';
import nodemailer from 'nodemailer';

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

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
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
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
    const usersRef = collection(firestore, 'users');
    const usersQuery = query(
      usersRef,
      where('lastActivityAt', '<=', threshold),
      orderBy('lastActivityAt', 'asc'),
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

    const transporter = createTransporter();
    let sentCount = 0;
    let errorCount = 0;

    // Send reminders
    for (const userDoc of usersSnapshot.docs) {
      try {
        const userData = userDoc.data();
        const userId = userDoc.id;

        // Skip if user has unsubscribed
        const preferencesRef = collection(firestore, 'email-preferences');
        const prefQuery = query(preferencesRef, where('email', '==', userData.email));
        const prefSnapshot = await getDocs(prefQuery);

        let shouldSkip = false;
        if (!prefSnapshot.empty) {
          const prefs = prefSnapshot.docs[0].data();
          if (prefs.preferences?.all === true || prefs.preferences?.studyReminders === false) {
            console.log(`⏭️ Skipping ${userData.email} - unsubscribed from reminders`);
            shouldSkip = true;
          }
        }

        if (shouldSkip) continue;

        // Fetch user's quiz history for personalized data
        const quizzesRef = collection(firestore, 'users', userId, 'quizHistory');
        const quizzesQuery = query(quizzesRef, orderBy('completedAt', 'desc'), limit(5));
        const quizzesSnapshot = await getDocs(quizzesQuery);

        let reminderData = {
          topic: 'General Study',
          weakAreas: 'Review recommended',
          lastActivityDate: userData.lastActivityAt?.toDate()?.toLocaleDateString() || 'A while ago'
        };

        // Analyze recent quiz data for weak areas
        if (!quizzesSnapshot.empty) {
          const recentQuizzes = quizzesSnapshot.docs.map(doc => doc.data());
          const topics = new Set<string>();
          const weakTopics = new Set<string>();

          recentQuizzes.forEach((quiz: any) => {
            if (quiz.topic) topics.add(quiz.topic);
            if (quiz.score < 70 && quiz.topic) weakTopics.add(quiz.topic);
          });

          if (topics.size > 0) {
            reminderData.topic = Array.from(topics).slice(0, 3).join(', ');
          }
          if (weakTopics.size > 0) {
            reminderData.weakAreas = Array.from(weakTopics).slice(0, 3).join(', ');
          }
        }

        // Generate email
        const emailTemplate = studyReminderEmailTemplate(
          userData.displayName || userData.name || 'Student',
          reminderData
        );

        // Send email
        await transporter.sendMail({
          from: `"Quizzicallabz AI" <${process.env.EMAIL_USER}>`,
          to: userData.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text,
        });

        console.log(`✅ Reminder sent to ${userData.email}`);
        sentCount++;

        // Add small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error: any) {
        console.error(`❌ Error sending reminder to user ${userDoc.id}:`, error.message);
        errorCount++;
      }
    }

    console.log(`🎉 Reminder cron job completed: ${sentCount} sent, ${errorCount} errors`);

    return NextResponse.json({
      success: true,
      message: 'Reminder emails sent successfully',
      sent: sentCount,
      errors: errorCount,
      total: usersSnapshot.size
    });

  } catch (error: any) {
    console.error('❌ Cron job error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to send reminder emails'
      },
      { status: 500 }
    );
  }
}
