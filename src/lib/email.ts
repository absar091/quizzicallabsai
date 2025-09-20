import * as nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Removed unused interface - using inline type definitions instead

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    // Validate environment variables
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('Missing email configuration. Please check SMTP environment variables.');
    }

    console.log('📧 Creating email transporter...');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Add additional options for better compatibility
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('📧 Verifying transporter connection...');
    await transporter.verify();

    console.log('📧 Sending email...');
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text,
    });

    console.log('📧 Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error: any) {
    console.error('❌ Email sending failed:', error);
    console.error('❌ Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    throw error;
  }
}

export async function sendWelcomeEmail(to: string, userName: string, emailDetails: {
  userEmail: string;
  accountType?: string;
  signUpDate?: string;
  preferredLanguage?: string;
}) {
  const subject = `🎉 Welcome ${userName}! Your AI Learning Adventure Starts Now`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Quizzicallabs AI</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

        :root {
          --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --accent-gradient: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 25%, #45b7d1 50%, #96ceb4 75%, #ffeaa7 100%);
          --dark-gradient: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          --glass-bg: rgba(255, 255, 255, 0.1);
          --glass-border: rgba(255, 255, 255, 0.2);
          --text-primary: #1f2937;
          --text-secondary: #6b7280;
          --text-light: rgba(255, 255, 255, 0.9);
          --shadow-soft: 0 10px 40px rgba(0, 0, 0, 0.1);
          --shadow-strong: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          --border-radius: 16px;
          --border-radius-lg: 24px;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.7;
          color: var(--text-primary);
          background: var(--primary-gradient);
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .email-container {
          max-width: 680px;
          margin: 20px auto;
          background: #ffffff;
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-strong);
          position: relative;
          backdrop-filter: blur(20px);
        }

        .email-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: var(--accent-gradient);
          background-size: 200% 200%;
          animation: gradientFlow 4s ease infinite;
        }

        @keyframes gradientFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .hero-header {
          background: var(--dark-gradient);
          padding: 80px 40px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 107, 107, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(78, 205, 196, 0.2) 0%, transparent 50%);
          z-index: 1;
        }

        .hero-header::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 100px;
          background: linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.1) 100%);
          z-index: 2;
        }

        .hero-content {
          position: relative;
          z-index: 3;
        }

        .welcome-badge {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          color: #ffffff;
          padding: 14px 28px;
          border-radius: 50px;
          display: inline-block;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 24px;
          border: 1px solid var(--glass-border);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          box-shadow: var(--shadow-soft);
          font-family: 'Space Grotesk', sans-serif;
        }

        .hero-title {
          font-size: 48px;
          font-weight: 800;
          color: #ffffff;
          margin: 20px 0 12px;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          font-family: 'Space Grotesk', sans-serif;
          letter-spacing: -0.02em;
        }

        .hero-subtitle {
          font-size: 20px;
          color: var(--text-light);
          margin-bottom: 24px;
          font-weight: 400;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
        }

        .user-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: var(--accent-gradient);
          background-size: 200% 200%;
          animation: gradientFlow 6s ease infinite;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          font-size: 40px;
          color: white;
          border: 3px solid var(--glass-border);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          font-weight: 700;
          font-family: 'Space Grotesk', sans-serif;
        }

        .footer {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: #9ca3af;
          padding: 40px 40px;
          text-align: center;
        }

        .footer-logo {
          color: #ffffff;
          font-size: 28px;
          font-weight: 900;
          margin-bottom: 12px;
        }

        @media (max-width: 768px) {
          .email-container {
            margin: 0;
            border-radius: 0;
          }

          .hero-header {
            padding: 40px 20px;
          }

          .hero-title {
            font-size: 32px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="hero-header">
          <div class="hero-content">
            <div class="user-avatar">
              ${userName.charAt(0).toUpperCase()}
            </div>
            <div class="welcome-badge">
              🎉 New Member
            </div>
            <div class="hero-title">
              Welcome ${userName}!
            </div>
            <div class="hero-subtitle">
              Your AI-powered learning adventure begins now
            </div>
          </div>
        </div>

        <div class="footer">
          <div class="footer-logo">
            Quizzicallabs AI
          </div>
          <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
            <p style="font-size: 12px; opacity: 0.7; margin: 0;">
              © ${new Date().getFullYear()} Quizzicallabs AI. All rights reserved. |
              Powered by Advanced AI Technology • Made with ❤️ for Students
            </p>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;

  const text = `
QUIZZICALLABS AI - WELCOME ${userName.toUpperCase()}

Hello ${userName}!

Welcome to Quizzicallabs AI, where advanced AI meets personalized learning to help you achieve academic excellence.

ACCOUNT DETAILS:
---------------
✉️ Email: ${emailDetails.userEmail}
📅 Joined On: ${emailDetails.signUpDate || new Date().toLocaleDateString()}
🌐 Account Type: ${emailDetails.accountType || 'Free'}
🗣️ Language: ${emailDetails.preferredLanguage || 'English'}

Thank you for joining Quizzicallabs AI!

Best regards,
The Quizzicallabs AI Team

---
Quizzicallabs AI - Your Ultimate AI-Powered Study Partner
© ${new Date().getFullYear()} Quizzicallabs AI. All rights reserved.
  `;

  return sendEmail({ to, subject, html, text });
}

export async function sendQuizResultEmail(to: string, quizData: {
  userName: string;
  userClass?: string;
  userGrade?: string;
  userSchool?: string;
  userAge?: number;
  topic: string;
  subject?: string;
  difficulty?: string;
  score: number;
  total?: number;
  percentage?: number;
  timeTaken?: number;
  date?: string;
  incorrectAnswers?: number;
  totalQuestions?: number;
  weakAreas?: string[];
  strongAreas?: string[];
  detailedResults?: Array<{
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation?: string;
    topic?: string;
    difficulty?: string;
  }>;
  recommendations?: string[];
  nextSteps?: string[];
  studyPlan?: string[];
  performanceHistory?: Array<{
    date: string;
    topic: string;
    score: number;
    percentage: number;
  }>;
  streakInfo?: {
    currentStreak: number;
    longestStreak: number;
    totalQuizzes: number;
  };
  badges?: string[];
  achievements?: string[];
}) {
  const subject = `📊 Quiz Results: ${quizData.topic} - ${quizData.percentage || Math.round((quizData.score / (quizData.total || 10)) * 100)}% | ${quizData.userName}`;

  const percentage = quizData.percentage || Math.round((quizData.score / (quizData.total || 10)) * 100);
  const performanceLevel = percentage >= 90 ? 'Excellent' : percentage >= 80 ? 'Very Good' : percentage >= 70 ? 'Good' : percentage >= 60 ? 'Fair' : 'Needs Improvement';
  const performanceEmoji = percentage >= 90 ? '🏆' : percentage >= 80 ? '🌟' : percentage >= 70 ? '👍' : percentage >= 60 ? '📈' : '💪';

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Quiz Results - ${quizData.topic}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Inter', sans-serif;
          line-height: 1.6;
          color: #4b5563;
          background-color: #f9fafb;
          -webkit-font-smoothing: antialiased;
        }

        .email-container {
          max-width: 700px;
          margin: 20px auto;
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .header {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          padding: 50px 30px;
          text-align: center;
        }

        .footer {
          background: #111827;
          color: #9ca3af;
          padding: 40px 30px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Quiz Results: ${quizData.topic}</h1>
          <p>${performanceEmoji} ${performanceLevel} - ${percentage}%</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Quizzicallabs AI. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
  `;

  const text = `
QUIZ RESULTS - ${quizData.topic.toUpperCase()}
${performanceEmoji} ${performanceLevel} Performance

Hello ${quizData.userName}!

Quiz Completed: ${quizData.topic}
Score: ${quizData.score}/${quizData.total || 10} (${percentage}%)

Thank you for using Quizzicallabs!

Best regards,
The Quizzicallabs Team
  `;

  return sendEmail({ to, subject, html, text });
}

export async function sendStudyReminderEmail(to: string, userName: string) {
  const subject = `${userName}, Keep Your Study Streak Going! 📚`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Study Reminder from Quizzicallabs</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Inter', sans-serif;
          line-height: 1.6;
          color: #4b5563;
          background-color: #f9fafb;
          -webkit-font-smoothing: antialiased;
        }

        .email-container {
          max-width: 700px;
          margin: 20px auto;
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .header {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          padding: 50px 30px;
          text-align: center;
        }

        .footer {
          background: #111827;
          color: #9ca3af;
          padding: 40px 30px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Keep Learning, ${userName}!</h1>
          <p>Consistency is the key to academic success</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Quizzicallabs. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
  `;

  const text = `
QUIZZICALLABS - STUDY REMINDER

Hi ${userName}!

It's time to fuel your brain with some knowledge! Regular practice is essential for retaining information and building strong academic foundations.

Best regards,
The Quizzicallabs Team
  `;

  return sendEmail({ to, subject, html, text });
}