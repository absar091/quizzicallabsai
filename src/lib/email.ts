import * as nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface QuizResultEmailData {
  userName: string;
  topic: string;
  score: number;
  total: number;
  percentage: number;
  timeTaken: number;
  date: string;
}

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

export async function sendWelcomeEmail(to: string, userName: string) {
  const subject = 'Welcome to Quizzicallabz - Your AI Learning Journey Begins';

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Quizzicallabz</title>
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
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          padding: 50px 30px;
          text-align: center;
        }
        .logo {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 12px;
          color: #ffffff;
        }
        .welcome-badge {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          padding: 6px 16px;
          border-radius: 20px;
          display: inline-block;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 16px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .header h1 {
          font-size: 32px;
          margin: 16px 0 12px;
          font-weight: 700;
          letter-spacing: -0.025em;
        }
        .header p {
          font-size: 18px;
          opacity: 0.95;
        }

        .hero-section {
          padding: 50px 30px;
          text-align: center;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }
        .hero-content h2 {
          font-size: 28px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 16px;
          line-height: 1.2;
        }
        .hero-content p {
          font-size: 18px;
          color: #6b7280;
          line-height: 1.7;
          max-width: 500px;
          margin: 0 auto;
        }

        .features-section {
          padding: 50px 30px;
          background: #ffffff;
        }
        .section-title {
          font-size: 24px;
          font-weight: 600;
          color: #111827;
          text-align: center;
          margin-bottom: 40px;
          position: relative;
        }
        .section-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background: #4f46e5;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
        }
        .feature-card {
          background: #f8fafc;
          padding: 32px 30px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          text-align: center;
        }
        .feature-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .feature-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 24px;
          background: #4f46e5;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          color: #ffffff;
        }
        .feature-card h3 {
          color: #111827;
          font-size: 20px;
          margin-bottom: 16px;
          font-weight: 600;
        }
        .feature-card p {
          color: #6b7280;
          font-size: 16px;
          line-height: 1.6;
        }

        .stats-section {
          background: #f9fafb;
          padding: 50px 30px;
          text-align: center;
        }
        .stats-section h3 {
          font-size: 24px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 20px;
        }
        .stats-section p {
          font-size: 16px;
          color: #6b7280;
          margin-bottom: 30px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 30px;
        }
        .stat-item {
          background: #ffffff;
          padding: 30px 20px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
        }
        .stat-number {
          font-size: 36px;
          font-weight: 700;
          color: #4f46e5;
          display: block;
          margin-bottom: 8px;
        }
        .stat-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .cta-section {
          background: #f8fafc;
          padding: 50px 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .cta-section h3 {
          color: #111827;
          margin-bottom: 16px;
          font-size: 24px;
          font-weight: 600;
        }
        .cta-section p {
          color: #6b7280;
          margin-bottom: 30px;
          font-size: 16px;
        }
        .btn-group {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #4f46e5;
          color: white;
          padding: 16px 32px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.1), 0 2px 4px -1px rgba(79, 70, 229, 0.06);
        }
        .btn:hover {
          background: #4338ca;
          box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.2), 0 4px 6px -2px rgba(79, 70, 229, 0.05);
        }
        .btn-secondary {
          background: #374151;
          box-shadow: 0 4px 6px -1px rgba(55, 65, 81, 0.1), 0 2px 4px -1px rgba(55, 65, 81, 0.06);
        }

        .footer {
          background: #111827;
          color: #9ca3af;
          padding: 50px 30px;
          text-align: center;
        }
        .footer-logo {
          color: #ffffff;
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 20px;
        }
        .footer-tagline {
          font-size: 16px;
          margin-bottom: 30px;
          color: #d1d5db;
        }
        .footer-links {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin: 30px 0;
          flex-wrap: wrap;
        }
        .footer-links a {
          color: #9ca3af;
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
        }

        @media (max-width: 600px) {
          .features-grid { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .btn-group { flex-direction: column; }
          .btn { width: 100%; max-width: 300px; justify-content: center; }
          .footer-links { flex-direction: column; gap: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="header-content">
            <div class="logo">Quizzicallabz</div>
            <div class="welcome-badge">NEW MEMBER</div>
            <h1>Welcome Aboard!</h1>
            <p>Your AI-powered learning journey starts now</p>
          </div>
        </div>

        <div class="content">
          <div class="hero-section">
            <div class="hero-content">
              <h2>Hello ${userName}!</h2>
              <p>Welcome to Quizzicallabz, where advanced AI meets personalized learning to help you achieve academic excellence.</p>
            </div>
          </div>

          <div class="features-section">
            <h2 class="section-title">Platform Features</h2>
            <div class="features-grid">
              <div class="feature-card">
                <div class="feature-icon">📝</div>
                <h3>Smart Quiz Generation</h3>
                <p>Create personalized quizzes on any topic using advanced AI. Get questions tailored to your learning level and goals.</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">🎓</div>
                <h3>MDCAT/ECAT Preparation</h3>
                <p>Specialized preparation modules for Pakistani entrance exams with authentic question patterns and detailed explanations.</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">🧠</div>
                <h3>AI-Powered Explanations</h3>
                <p>Get instant, detailed explanations for every question. Learn from mistakes with intelligent tutoring system.</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">📊</div>
                <h3>Advanced Analytics</h3>
                <p>Track your progress with comprehensive performance analytics, identify weak areas, and monitor improvement over time.</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">⚡</div>
                <h3>Instant Results</h3>
                <p>Get immediate feedback on your performance with detailed score breakdowns and personalized recommendations.</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">🎯</div>
                <h3>Multiple Question Types</h3>
                <p>Practice with MCQs, true/false, descriptive questions, and more. Variety keeps learning engaging and effective.</p>
              </div>
            </div>
          </div>

          <div class="stats-section">
            <h3>Join Our Growing Community</h3>
            <p>See what our community has achieved with Quizzicallabz</p>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-number">50K+</span>
                <span class="stat-label">Quizzes Generated</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">10K+</span>
                <span class="stat-label">Active Students</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">95%</span>
                <span class="stat-label">Success Rate</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">24/7</span>
                <span class="stat-label">AI Support</span>
              </div>
            </div>
          </div>

          <div class="cta-section">
            <h3>Ready to Start Learning?</h3>
            <p>Take your first step towards academic excellence. Create your first quiz or explore our specialized exam preparation modules.</p>
            <div class="btn-group">
              <a href="https://quizzicallabz.qzz.io/generate-quiz" class="btn">
                Create Your First Quiz
              </a>
              <a href="https://quizzicallabz.qzz.io/mdcat" class="btn btn-secondary">
                Start MDCAT Prep
              </a>
            </div>
          </div>
        </div>

        <div class="footer">
          <div class="footer-logo">Quizzicallabz</div>
          <div class="footer-tagline">Your Ultimate AI-Powered Study Partner</div>

          <div class="footer-links">
            <a href="https://quizzicallabz.qzz.io">Home</a>
            <a href="https://quizzicallabz.qzz.io/generate-quiz">Create Quiz</a>
            <a href="https://quizzicallabz.qzz.io/mdcat">MDCAT Prep</a>
            <a href="https://quizzicallabz.qzz.io/dashboard">Dashboard</a>
            <a href="https://quizzicallabz.qzz.io/help">Help Center</a>
          </div>

          <div class="footer-divider">
            <div class="footer-bottom">
              <p>&copy; ${new Date().getFullYear()} Quizzicallabz. All rights reserved.</p>
              <p>Powered by Advanced AI Technology | Made with ❤️ for Students</p>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;

  const text = `
QUIZZICALLABZ - PLATFORM FEATURES

Hello ${userName}!

Welcome to Quizzicallabz, where advanced AI meets personalized learning to help you achieve academic excellence.

PLATFORM FEATURES:
------------------
• Smart Quiz Generation - Create personalized quizzes on any topic using advanced AI
• MDCAT/ECAT Preparation - Specialized preparation modules for Pakistani entrance exams
• AI-Powered Explanations - Get instant, detailed explanations for every question
• Advanced Analytics - Track progress and identify weak areas
• Instant Results - Get immediate feedback and recommendations
• Multiple Question Types - Practice with MCQs, descriptive questions, and more

COMMUNITY ACHIEVEMENTS:
----------------------
• 50K+ Quizzes Generated
• 10K+ Active Students
• 95% Success Rate
• 24/7 AI Support

GET STARTED:
------------
Create Your First Quiz: https://quizzicallabz.qzz.io/generate-quiz
Start MDCAT Prep: https://quizzicallabz.qzz.io/mdcat
View Dashboard: https://quizzicallabz.qzz.io/dashboard

Need help? Reply to this email or visit our help center.

Thank you for joining Quizzicallabz!

Best regards,
The Quizzicallabz Team

---
Quizzicallabz - Your Ultimate AI-Powered Study Partner
© ${new Date().getFullYear()} Quizzicallabz. All rights reserved.
  `;

  return sendEmail({ to, subject, html, text });
}

export async function sendQuizResultEmail(to: string, quizData: {
  userName: string;
  topic: string;
  score: number;
  total?: number;
  percentage?: number;
  timeTaken?: number;
  date?: string;
  incorrectAnswers?: number;
  totalQuestions?: number;
}) {
  const subject = `Quiz Results: ${quizData.topic} - ${quizData.percentage || Math.round((quizData.score / (quizData.total || 10)) * 100)}%`;

  const percentage = quizData.percentage || Math.round((quizData.score / (quizData.total || 10)) * 100);
  const totalQuestions = quizData.totalQuestions || quizData.total || 10;
  const timeTaken = quizData.timeTaken ? `${Math.round(quizData.timeTaken / 60)}m ${quizData.timeTaken % 60}s` : 'N/A';
  const date = quizData.date ? new Date(quizData.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const performanceColor = percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444';
  const performanceLabel = percentage >= 80 ? 'Excellent' : percentage >= 60 ? 'Good' : 'Needs Improvement';

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Quiz Results</title>
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
          background: linear-gradient(135deg, ${performanceColor} 0%, #7c3aed 100%);
          color: white;
          padding: 50px 30px;
          text-align: center;
        }
        .logo {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 12px;
          color: #ffffff;
        }
        .performance-badge {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          padding: 8px 16px;
          border-radius: 20px;
          display: inline-block;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 16px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .score-display {
          font-size: 48px;
          font-weight: 700;
          color: #ffffff;
          margin: 16px 0;
        }
        .percentage-label {
          font-size: 18px;
          opacity: 0.95;
        }

        .result-card {
          background: #f8fafc;
          margin: 30px;
          border-radius: 8px;
          padding: 30px;
          text-align: center;
          border: 1px solid #e2e8f0;
        }
        .result-header h2 {
          font-size: 24px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 16px;
        }
        .topic-display {
          font-size: 18px;
          color: #6b7280;
          margin-bottom: 20px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          margin: 30px;
        }
        .stat-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
        }
        .stat-number {
          font-size: 28px;
          font-weight: 700;
          color: #4f46e5;
          display: block;
          margin-bottom: 8px;
        }
        .stat-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .feedback-section {
          background: #f9fafb;
          padding: 40px 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .feedback-title {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 16px;
        }
        .feedback-text {
          font-size: 16px;
          color: #6b7280;
          max-width: 500px;
          margin: 0 auto 30px;
          line-height: 1.6;
        }

        .cta-section {
          padding: 30px;
          text-align: center;
          background: #ffffff;
        }
        .btn-group {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .btn-primary {
          background: #4f46e5;
          color: white;
        }
        .btn-primary:hover {
          background: #4338ca;
        }
        .btn-secondary {
          background: #374151;
          color: white;
        }
        .btn-secondary:hover {
          background: #1f2937;
        }

        .footer {
          background: #111827;
          color: #9ca3af;
          padding: 40px 30px;
          text-align: center;
        }
        .footer-logo {
          color: #ffffff;
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 16px;
        }
        .footer-tagline {
          font-size: 14px;
          margin-bottom: 20px;
          color: #d1d5db;
        }

        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .btn-group { flex-direction: column; }
          .btn { width: 100%; max-width: 280px; justify-content: center; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="header-content">
            <div class="logo">Quizzicallabz</div>
            <div class="performance-badge">${performanceLabel}</div>
            <div class="score-display">${quizData.score}/${totalQuestions}</div>
            <div class="percentage-label">${percentage}% Score</div>
          </div>
        </div>

        <div class="result-card">
          <div class="result-header">
            <h2>Quiz Completed!</h2>
            <p class="topic-display">${quizData.topic}</p>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-number">${percentage}%</span>
            <span class="stat-label">Accuracy</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">${timeTaken}</span>
            <span class="stat-label">Time Taken</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">${date}</span>
            <span class="stat-label">Completed On</span>
          </div>
          ${quizData.incorrectAnswers !== undefined ? `
          <div class="stat-card">
            <span class="stat-number">${quizData.incorrectAnswers}</span>
            <span class="stat-label">Incorrect</span>
          </div>
          ` : ''}
        </div>

        <div class="feedback-section">
          <h3 class="feedback-title">Your Performance Analysis</h3>
          <p class="feedback-text">
            ${percentage >= 80 ?
              'Excellent work! You have demonstrated strong understanding of the material. Keep up the great performance!' :
              percentage >= 60 ?
              'Good effort! You understand most concepts but could benefit from reviewing the challenging areas.' :
              'It looks like you faced some challenges. Consider reviewing the material and taking practice quizzes to improve.'
            }
          </p>
        </div>

        <div class="cta-section">
          <div class="btn-group">
            <a href="https://quizzicallabz.qzz.io/generate-quiz" class="btn btn-primary">
              📚 Take Another Quiz
            </a>
            <a href="https://quizzicallabz.qzz.io/dashboard" class="btn btn-secondary">
              📊 View Dashboard
            </a>
          </div>
        </div>

        <div class="footer">
          <div class="footer-logo">Quizzicallabz</div>
          <div class="footer-tagline">Continue learning and track your progress</div>
          <p>© ${new Date().getFullYear()} Quizzicallabz. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
  `;

  const text = `
QUIZZICALLABZ - QUIZ RESULTS

Hello ${quizData.userName}!

Quiz Completed: ${quizData.topic}

SCORE: ${quizData.score}/${totalQuestions} (${percentage}%)
TIME TAKEN: ${timeTaken}
DATE: ${date}

PERFORMANCE ANALYSIS:
${percentage >= 80 ?
  'Excellent work! You have demonstrated strong understanding of the material.' :
  percentage >= 60 ?
  'Good effort! You understand most concepts but could review challenging areas.' :
  'Consider reviewing the material and taking practice quizzes to improve.'
}

TAKE ANOTHER QUIZ: https://quizzicallabz.qzz.io/generate-quiz
VIEW DASHBOARD: https://quizzicallabz.qzz.io/dashboard

Thank you for using Quizzicallabz!

Best regards,
The Quizzicallabz Team

---
Quizzicallabz - Continue learning and track your progress
© ${new Date().getFullYear()} Quizzicallabz. All rights reserved.
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
      <title>Study Reminder from Quizzicallabz</title>
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
        .logo {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 12px;
          color: #ffffff;
        }
        .reminder-badge {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          padding: 8px 16px;
          border-radius: 20px;
          display: inline-block;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 16px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .header h1 {
          font-size: 32px;
          margin: 16px 0 12px;
          font-weight: 700;
          letter-spacing: -0.025em;
        }
        .header p {
          font-size: 18px;
          opacity: 0.95;
        }

        .content-section {
          padding: 50px 30px;
          text-align: center;
          background: #ffffff;
        }
        .greeting {
          font-size: 24px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 16px;
        }
        .message {
          font-size: 18px;
          color: #6b7280;
          line-height: 1.7;
          max-width: 500px;
          margin: 0 auto 30px;
        }

        .benefits-section {
          background: #f8fafc;
          padding: 40px 30px;
          text-align: center;
        }
        .section-title {
          font-size: 24px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 30px;
          position: relative;
        }
        .section-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background: #f59e0b;
        }
        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
        }
        .benefit-card {
          background: #ffffff;
          padding: 30px 20px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          text-align: center;
        }
        .benefit-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .benefit-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 20px;
          background: #f59e0b;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #ffffff;
        }
        .benefit-card h3 {
          color: #111827;
          font-size: 18px;
          margin-bottom: 12px;
          font-weight: 600;
        }
        .benefit-card p {
          color: #6b7280;
          font-size: 16px;
          line-height: 1.6;
        }

        .cta-section {
          background: #f9fafb;
          padding: 50px 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .cta-section h3 {
          color: #111827;
          margin-bottom: 16px;
          font-size: 24px;
          font-weight: 600;
        }
        .cta-section p {
          color: #6b7280;
          margin-bottom: 30px;
          font-size: 16px;
        }
        .btn-group {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #f59e0b;
          color: white;
          padding: 16px 32px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.1), 0 2px 4px -1px rgba(245, 158, 11, 0.06);
        }
        .btn:hover {
          background: #d97706;
          box-shadow: 0 10px 15px -3px rgba(245, 158, 11, 0.2), 0 4px 6px -2px rgba(245, 158, 11, 0.05);
        }
        .btn-secondary {
          background: #4f46e5;
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.1), 0 2px 4px -1px rgba(79, 70, 229, 0.06);
        }

        .footer {
          background: #111827;
          color: #9ca3af;
          padding: 40px 30px;
          text-align: center;
        }
        .footer-logo {
          color: #ffffff;
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 16px;
        }
        .footer-tagline {
          font-size: 14px;
          margin-bottom: 20px;
          color: #d1d5db;
        }

        @media (max-width: 600px) {
          .benefits-grid { grid-template-columns: 1fr; }
          .btn-group { flex-direction: column; }
          .btn { width: 100%; max-width: 280px; justify-content: center; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="header-content">
            <div class="logo">Quizzicallabz</div>
            <div class="reminder-badge">STUDY REMINDER</div>
            <h1>Keep Learning!</h1>
            <p>Consistency is the key to academic success</p>
          </div>
        </div>

        <div class="content-section">
          <h2 class="greeting">Hi ${userName}!</h2>
          <p class="message">
            It's time to fuel your brain with some knowledge! Regular practice is essential for retaining information and building strong academic foundations.
          </p>
        </div>

        <div class="benefits-section">
          <h2 class="section-title">Study Session Benefits</h2>
          <div class="benefits-grid">
            <div class="benefit-card">
              <div class="benefit-icon">🧠</div>
              <h3>Enhanced Memory</h3>
              <p>Regular study sessions strengthen neural connections and improve long-term memory retention.</p>
            </div>
            <div class="benefit-card">
              <div class="benefit-icon">📈</div>
              <h3>Better Performance</h3>
              <p>Consistent practice leads to higher scores and better understanding of complex topics.</p>
            </div>
            <div class="benefit-card">
              <div class="benefit-icon">🎯</div>
              <h3>Focused Learning</h3>
              <p>Short, focused study sessions are more effective than cramming large amounts of material.</p>
            </div>
            <div class="benefit-card">
              <div class="benefit-icon">🏆</div>
              <h3>Achievement Tracking</h3>
              <p>Monitor your progress and celebrate milestones as you advance through your learning journey.</p>
            </div>
          </div>
        </div>

        <div class="cta-section">
          <h3>Ready to Study?</h3>
          <p>Jump into a quick quiz session and keep your momentum going!</p>
          <div class="btn-group">
            <a href="https://quizzicallabz.qzz.io/generate-quiz" class="btn">
              Start Learning Now
            </a>
            <a href="https://quizzicallabz.qzz.io/dashboard" class="btn btn-secondary">
              View My Progress
            </a>
          </div>
        </div>

        <div class="footer">
          <div class="footer-logo">Quizzicallabz</div>
          <div class="footer-tagline">Your daily study companion</div>
          <p>&copy; ${new Date().getFullYear()} Quizzicallabz. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
  `;

  const text = `
QUIZZICALLABZ - STUDY REMINDER

Hi ${userName}!

It's time to fuel your brain with some knowledge! Regular practice is essential for retaining information and building strong academic foundations.

STUDY SESSION BENEFITS:
----------------------
• Enhanced Memory - Strengthen neural connections and improve retention
• Better Performance - Higher scores and deeper understanding
• Focused Learning - Short sessions are more effective than cramming
• Achievement Tracking - Monitor progress and celebrate success

START LEARNING NOW: https://quizzicallabz.qzz.io/generate-quiz
VIEW MY PROGRESS: https://quizzicallabz.qzz.io/dashboard

Consistency is the key to academic success. Keep up the great work!

Best regards,
The Quizzicallabz Team

---
Quizzicallabz - Your daily study companion
© ${new Date().getFullYear()} Quizzicallabz. All rights reserved.
  `;

  return sendEmail({ to, subject, html, text });
}
