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

        .user-info-card {
          background: var(--glass-bg);
          backdrop-filter: blur(30px);
          border-radius: var(--border-radius);
          padding: 32px;
          margin: 40px;
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow-soft);
        }

        .user-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          font-family: 'JetBrains Mono', monospace;
        }

        .detail-item {
          background: #f8fafc;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .detail-label {
          font-size: 11px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 4px;
          font-weight: 600;
        }

        .detail-value {
          font-size: 14px;
          color: #1f2937;
          font-weight: 500;
        }

        .personal-greeting {
          text-align: center;
          margin-bottom: 30px;
        }

        .greeting-emoji {
          font-size: 48px;
          margin-bottom: 16px;
          display: block;
        }

        .greeting-title {
          font-size: 32px;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .greeting-message {
          font-size: 18px;
          color: #6b7280;
          line-height: 1.6;
          max-width: 500px;
          margin: 0 auto;
        }

        .features-showcase {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 60px 40px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .section-title {
          font-size: 28px;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .section-subtitle {
          font-size: 16px;
          color: #6b7280;
          max-width: 400px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-top: 40px;
        }

        .feature-card {
          background: white;
          padding: 32px;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 25%, #45b7d1 50%, #96ceb4 75%, #ffeaa7 100%);
          transform: scaleX(0);
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
          border-color: #d1d5db;
        }

        .feature-card:hover::before {
          transform: scaleX(1);
        }

        .feature-icon {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          color: white;
          margin: 0 auto 24px;
          position: relative;
          box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
        }

        .feature-title {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 12px;
        }

        .feature-description {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
        }

        .stats-highlight {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          padding: 50px 40px;
          text-align: center;
          color: white;
        }

        .stats-mascot {
          width: 100px;
          height: 100px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 50px;
          margin: 0 auto 20px;
          border: 3px solid rgba(255, 255, 255, 0.2);
        }

        .stats-title {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .stats-description {
          font-size: 16px;
          opacity: 0.9;
          max-width: 400px;
          margin: 0 auto;
          margin-bottom: 30px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-top: 40px;
        }

        .stat-item {
          background: rgba(255, 255, 255, 0.05);
          padding: 24px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .stat-number {
          font-size: 48px;
          font-weight: 900;
          color: #fbbf24;
          display: block;
          margin-bottom: 8px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .stat-label {
          font-size: 16px;
          opacity: 0.8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .action-section {
          background: white;
          padding: 50px 40px;
          text-align: center;
        }

        .action-title {
          font-size: 32px;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 12px;
        }

        .action-subtitle {
          font-size: 18px;
          color: #6b7280;
          margin-bottom: 40px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 30px;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 18px 32px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 16px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .cta-button:hover::before {
          left: 100%;
        }

        .cta-button-primary {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
        }

        .cta-button-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(99, 102, 241, 0.4);
        }

        .cta-button-secondary {
          background: white;
          color: #6366f1;
          border-color: #6366f1;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .cta-button-secondary:hover {
          background: #6366f1;
          color: white;
          transform: translateY(-2px);
        }

        .next-steps {
          background: #f8fafc;
          padding: 32px;
          text-align: center;
        }

        .next-steps-title {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .next-steps-description {
          font-size: 16px;
          color: #6b7280;
          margin-bottom: 20px;
        }

        .steps-list {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .step-item {
          background: white;
          padding: 16px 20px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          font-size: 14px;
          color: #374151;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
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

        .footer-tagline {
          font-size: 16px;
          opacity: 0.8;
          margin-bottom: 24px;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          gap: 32px;
          margin: 24px 0;
          flex-wrap: wrap;
        }

        .footer-link {
          color: #e2e8f0;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .footer-link:hover {
          color: #60a5fa;
        }

        .social-links {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin: 24px 0;
        }

        .social-link {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .social-link:hover {
          background: #60a5fa;
          transform: translateY(-2px);
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

          .features-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .cta-button {
            width: 100%;
            max-width: 280px;
          }

          .footer-links {
            flex-direction: column;
            gap: 12px;
          }

          .user-details {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 28px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .steps-list {
            flex-direction: column;
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

        <div class="user-info-card">
          <div class="user-details">
            <div class="detail-item">
              <div class="detail-label">✉️ Email</div>
              <div class="detail-value">${emailDetails.userEmail}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">📅 Joined On</div>
              <div class="detail-value">${emailDetails.signUpDate || new Date().toLocaleDateString()}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">🌐 Account Type</div>
              <div class="detail-value">${emailDetails.accountType || 'Free'}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">🗣️ Language</div>
              <div class="detail-value">${emailDetails.preferredLanguage || 'English'}</div>
            </div>
          </div>
        </div>

        <div class="personal-greeting">
          <div class="greeting-emoji">🎯</div>
          <div class="greeting-title">
            Your Learning Journey Starts Here!
          </div>
          <div class="greeting-message">
            Congratulations ${userName}! You've just unlocked a world of intelligent learning.
            Our AI-powered platform is ready to help you excel in your studies.
          </div>
        </div>

        <div class="features-showcase">
          <div class="section-header">
            <div class="section-title">
              🚀 Your AI Learning Toolkit
            </div>
            <div class="section-subtitle">
              Powerful features designed to accelerate your learning and boost your grades
            </div>
          </div>

          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🧠</div>
              <div class="feature-title">AI Quiz Generation</div>
              <div class="feature-description">
                Create intelligent quizzes tailored to your learning level and goals.
                Our AI analyzes your progress to generate questions that challenge you just right.
              </div>
            </div>

            <div class="feature-card">
              <div class="feature-icon">📚</div>
              <div class="feature-title">MDCAT & ECAT Prep</div>
              <div class="feature-description">
                Specialized preparation modules with authentic question patterns and
                detailed explanations designed for Pakistani entrance exams.
              </div>
            </div>

            <div class="feature-card">
              <div class="feature-icon">💡</div>
              <div class="feature-title">Smart Explanations</div>
              <div class="feature-description">
                Get instant, personalized explanations for every question. Learn from
                your mistakes with our intelligent tutoring system.
              </div>
            </div>

            <div class="feature-card">
              <div class="feature-icon">📊</div>
              <div class="feature-title">Performance Analytics</div>
              <div class="feature-description">
                Track your progress with detailed analytics, identify weak areas,
                and monitor your improvement over time with beautiful visualizations.
              </div>
            </div>

            <div class="feature-card">
              <div class="feature-icon">⚡</div>
              <div class="feature-title">Instant Feedback</div>
              <div class="feature-description">
                Get immediate feedback with score breakdowns, time analysis,
                and personalized recommendations for improvement.
              </div>
            </div>

            <div class="feature-card">
              <div class="feature-icon">🎯</div>
              <div class="feature-title">Multiple Formats</div>
              <div class="feature-description">
                Practice with MCQs, true/false, descriptive questions, and more.
                Variety keeps learning engaging and helps you retain information better.
              </div>
            </div>
          </div>
        </div>

        <div class="stats-highlight">
          <div class="stats-mascot">
            📈
          </div>
          <div class="stats-title">
            Join Our Growing Community
          </div>
          <div class="stats-description">
            You're now part of a thriving community of learners who are achieving academic excellence
          </div>

          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-number">50K+</span>
              <span class="stat-label">Quizzes Generated</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">10K+</span>
              <span class="stat-label">Active Learners</span>
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

        <div class="action-section">
          <div class="action-title">
            Ready to Excel?
          </div>
          <div class="action-subtitle">
            Take your learning to the next level with personalized AI-powered education
          </div>

          <div class="cta-buttons">
            <a href="https://quizzicallabz.qzz.io/generate-quiz" class="cta-button cta-button-primary">
              🚀 Create Your First Quiz
            </a>
            <a href="https://quizzicallabz.qzz.io/mdcat" class="cta-button cta-button-secondary">
              🎓 Start MDCAT Prep
            </a>
          </div>
        </div>

        <div class="next-steps">
          <div class="next-steps-title">
            📝 Your Next Steps
          </div>
          <div class="next-steps-description">
            Getting started is easy - here's what you can do right now
          </div>

          <div class="steps-list">
            <div class="step-item">🎯 Complete your profile</div>
            <div class="step-item">📝 Create your first quiz</div>
            <div class="step-item">📊 Track your progress</div>
            <div class="step-item">🏆 Start building streaks</div>
          </div>
        </div>

        <div class="footer">
          <div class="footer-logo">
            Quizzicallabs AI
          </div>
          <div class="footer-tagline">
            Your Ultimate AI-Powered Study Partner
          </div>

          <div class="footer-links">
            <a href="https://quizzicallabz.qzz.io" class="footer-link">Home</a>
            <a href="https://quizzicallabz.qzz.io/generate-quiz" class="footer-link">Create Quiz</a>
            <a href="https://quizzicallabz.qzz.io/mdcat" class="footer-link">MDCAT Prep</a>
            <a href="https://quizzicallabz.qzz.io/dashboard" class="footer-link">Dashboard</a>
            <a href="https://quizzicallabz.qzz.io/help" class="footer-link">Help Center</a>
          </div>

          <div class="social-links">
            <a href="#" class="social-link">📘</a>
            <a href="#" class="social-link">🐦</a>
            <a href="#" class="social-link">💼</a>
            <a href="#" class="social-link">📷</a>
          </div>

          <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
            <p style="font-size: 12px; opacity: 0.7; margin: 0;">
              © ${new Date().getFullYear()} Quizzicallabz AI. All rights reserved. |
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

PLATFORM FEATURES:
------------------
🚀 AI Quiz Generation - Create intelligent quizzes tailored to your learning level
📚 MDCAT & ECAT Prep - Specialized modules for Pakistani entrance exams
💡 Smart Explanations - Instant, personalized explanations for every question
📊 Performance Analytics - Track progress and identify weak areas
⚡ Instant Feedback - Immediate score breakdowns and recommendations
🎯 Multiple Formats - MCQs, descriptive questions, and more

COMMUNITY ACHIEVEMENTS:
----------------------
• 50K+ Quizzes Generated
• 10K+ Active Learners
• 95% Success Rate
• 24/7 AI Support

GET STARTED:
------------
🚀 Create Your First Quiz: https://quizzicallabz.qzz.io/generate-quiz
🎓 Start MDCAT Prep: https://quizzicallabz.qzz.io/mdcat
📊 View Dashboard: https://quizzicallabz.qzz.io/dashboard

Need help? Reply to this email or visit our help center.

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
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');

        :root {
          --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --success-gradient: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
          --warning-gradient: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          --danger-gradient: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
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
          max-width: 800px;
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
          padding: 60px 40px;
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

        .hero-content {
          position: relative;
          z-index: 3;
        }

        .performance-badge {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 50px;
          display: inline-block;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 20px;
          border: 1px solid var(--glass-border);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          box-shadow: var(--shadow-soft);
          font-family: 'Space Grotesk', sans-serif;
        }

        .hero-title {
          font-size: 36px;
          font-weight: 800;
          color: #ffffff;
          margin: 16px 0 8px;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          font-family: 'Space Grotesk', sans-serif;
          letter-spacing: -0.02em;
        }

        .hero-subtitle {
          font-size: 18px;
          color: var(--text-light);
          margin-bottom: 20px;
          font-weight: 400;
        }

        .score-display {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          margin: 30px 0;
          flex-wrap: wrap;
        }

        .score-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: ${percentage >= 80 ? 'var(--success-gradient)' : percentage >= 60 ? 'var(--warning-gradient)' : 'var(--danger-gradient)'};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          color: white;
          font-weight: 900;
          border: 4px solid var(--glass-border);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          font-family: 'Space Grotesk', sans-serif;
        }

        .score-details {
          color: white;
          text-align: left;
        }

        .score-main {
          font-size: 48px;
          font-weight: 900;
          margin-bottom: 8px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .score-label {
          font-size: 16px;
          opacity: 0.9;
          font-weight: 600;
        }

        .user-info-section {
          background: #f8fafc;
          padding: 40px;
        }

        .section-title {
          font-size: 24px;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .detail-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }

        .detail-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .detail-title {
          font-size: 16px;
          font-weight: 700;
          color: #374151;
        }

        .detail-content {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
        }

        .quiz-details-section {
          background: white;
          padding: 40px;
        }

        .quiz-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 24px;
          border-radius: 12px;
          text-align: center;
          border: 1px solid #e5e7eb;
        }

        .stat-icon {
          font-size: 32px;
          margin-bottom: 12px;
          display: block;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 900;
          color: #1f2937;
          margin-bottom: 4px;
          font-family: 'Space Grotesk', sans-serif;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .performance-analysis {
          background: #f8fafc;
          padding: 40px;
        }

        .analysis-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .analysis-card {
          background: white;
          padding: 28px;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }

        .analysis-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .analysis-title {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
        }

        .weakness-list, .strength-list, .recommendation-list {
          list-style: none;
          padding: 0;
        }

        .weakness-item, .strength-item, .recommendation-item {
          padding: 12px 16px;
          margin-bottom: 8px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .weakness-item {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .strength-item {
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
        }

        .recommendation-item {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        }

        .detailed-results {
          background: white;
          padding: 40px;
        }

        .question-card {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 20px;
        }

        .question-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .question-number {
          background: #6366f1;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }

        .question-status {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }

        .correct {
          background: #dcfce7;
          color: #16a34a;
        }

        .incorrect {
          background: #fef2f2;
          color: #dc2626;
        }

        .question-text {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 16px;
          line-height: 1.6;
        }

        .answer-section {
          display: grid;
          gap: 12px;
        }

        .answer-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
        }

        .user-answer {
          background: #fef2f2;
          border: 1px solid #fecaca;
        }

        .correct-answer {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
        }

        .explanation {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          padding: 16px;
          border-radius: 8px;
          margin-top: 12px;
          font-size: 14px;
          line-height: 1.6;
        }

        .study-plan {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          padding: 40px;
          color: white;
          text-align: center;
        }

        .study-plan-title {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 16px;
        }

        .study-plan-subtitle {
          font-size: 16px;
          opacity: 0.9;
          margin-bottom: 30px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .study-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }

        .study-step {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 24px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-align: left;
        }

        .step-number {
          background: rgba(255, 255, 255, 0.2);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .step-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .step-description {
          font-size: 14px;
          opacity: 0.9;
          line-height: 1.5;
        }

        .achievements-section {
          background: white;
          padding: 40px;
          text-align: center;
        }

        .badges-grid {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
          margin: 24px 0;
        }

        .badge {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: white;
          padding: 12px 20px;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 700;
          box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
        }

        .streak-info {
          background: #f8fafc;
          padding: 24px;
          border-radius: 12px;
          margin: 24px 0;
          border: 1px solid #e5e7eb;
        }

        .streak-stats {
          display: flex;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;
        }

        .streak-stat {
          text-align: center;
        }

        .streak-number {
          font-size: 32px;
          font-weight: 900;
          color: #6366f1;
          display: block;
          margin-bottom: 4px;
        }

        .streak-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
        }

        .cta-section {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          padding: 40px;
          text-align: center;
          color: white;
        }

        .cta-title {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .cta-subtitle {
          font-size: 16px;
          opacity: 0.9;
          margin-bottom: 30px;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-button {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          color: white;
          padding: 16px 24px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 700;
          font-size: 14px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .cta-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .footer {
          background: #1f2937;
          color: #9ca3af;
          padding: 30px 40px;
          text-align: center;
        }

        .footer-content {
          font-size: 12px;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .email-container {
            margin: 0;
            border-radius: 0;
          }

          .hero-header, .user-info-section, .quiz-details-section, 
          .performance-analysis, .detailed-results, .study-plan, 
          .achievements-section, .cta-section {
            padding: 24px 20px;
          }

          .user-details-grid, .quiz-stats, .analysis-grid, .study-steps {
            grid-template-columns: 1fr;
          }

          .score-display {
            flex-direction: column;
          }

          .hero-title {
            font-size: 28px;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .cta-button {
            width: 100%;
            max-width: 280px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <!-- Hero Header -->
        <div class="hero-header">
          <div class="hero-content">
            <div class="performance-badge">
              ${performanceEmoji} ${performanceLevel}
            </div>
            <div class="hero-title">
              Quiz Results: ${quizData.topic}
            </div>
            <div class="hero-subtitle">
              Completed on ${quizData.date || new Date().toLocaleDateString()}
            </div>
            
            <div class="score-display">
              <div class="score-circle">
                ${percentage}%
              </div>
              <div class="score-details">
                <div class="score-main">${quizData.score}/${quizData.total || 10}</div>
                <div class="score-label">Questions Correct</div>
              </div>
            </div>
          </div>
        </div>

        <!-- User Information Section -->
        <div class="user-info-section">
          <div class="section-title">
            👤 Student Information
          </div>
          <div class="user-details-grid">
            <div class="detail-card">
              <div class="detail-header">
                <span>📝</span>
                <div class="detail-title">Student Details</div>
              </div>
              <div class="detail-content">
                <strong>Name:</strong> ${quizData.userName}<br>
                ${quizData.userClass ? `<strong>Class:</strong> ${quizData.userClass}<br>` : ''}
                ${quizData.userGrade ? `<strong>Grade:</strong> ${quizData.userGrade}<br>` : ''}
                ${quizData.userSchool ? `<strong>School:</strong> ${quizData.userSchool}<br>` : ''}
                ${quizData.userAge ? `<strong>Age:</strong> ${quizData.userAge} years<br>` : ''}
              </div>
            </div>
            
            <div class="detail-card">
              <div class="detail-header">
                <span>📚</span>
                <div class="detail-title">Quiz Information</div>
              </div>
              <div class="detail-content">
                <strong>Topic:</strong> ${quizData.topic}<br>
                ${quizData.subject ? `<strong>Subject:</strong> ${quizData.subject}<br>` : ''}
                ${quizData.difficulty ? `<strong>Difficulty:</strong> ${quizData.difficulty}<br>` : ''}
                <strong>Date:</strong> ${quizData.date || new Date().toLocaleDateString()}<br>
                ${quizData.timeTaken ? `<strong>Time Taken:</strong> ${Math.floor(quizData.timeTaken / 60)}m ${quizData.timeTaken % 60}s` : ''}
              </div>
            </div>
          </div>
        </div>

        <!-- Quiz Statistics -->
        <div class="quiz-details-section">
          <div class="section-title">
            📊 Performance Statistics
          </div>
          <div class="quiz-stats">
            <div class="stat-card">
              <span class="stat-icon">🎯</span>
              <div class="stat-value">${percentage}%</div>
              <div class="stat-label">Overall Score</div>
            </div>
            <div class="stat-card">
              <span class="stat-icon">✅</span>
              <div class="stat-value">${quizData.score}</div>
              <div class="stat-label">Correct Answers</div>
            </div>
            <div class="stat-card">
              <span class="stat-icon">❌</span>
              <div class="stat-value">${(quizData.total || 10) - quizData.score}</div>
              <div class="stat-label">Incorrect Answers</div>
            </div>
            <div class="stat-card">
              <span class="stat-icon">⏱️</span>
              <div class="stat-value">${quizData.timeTaken ? `${Math.floor(quizData.timeTaken / 60)}:${String(quizData.timeTaken % 60).padStart(2, '0')}` : 'N/A'}</div>
              <div class="stat-label">Time Taken</div>
            </div>
          </div>
        </div>

        <!-- Performance Analysis -->
        <div class="performance-analysis">
          <div class="section-title">
            🔍 Performance Analysis
          </div>
          <div class="analysis-grid">
            ${quizData.weakAreas && quizData.weakAreas.length > 0 ? `
            <div class="analysis-card">
              <div class="analysis-header">
                <span>⚠️</span>
                <div class="analysis-title">Areas for Improvement</div>
              </div>
              <ul class="weakness-list">
                ${quizData.weakAreas.map(area => `
                  <li class="weakness-item">
                    <span>📌</span>
                    ${area}
                  </li>
                `).join('')}
              </ul>
            </div>
            ` : ''}
            
            ${quizData.strongAreas && quizData.strongAreas.length > 0 ? `
            <div class="analysis-card">
              <div class="analysis-header">
                <span>💪</span>
                <div class="analysis-title">Strong Areas</div>
              </div>
              <ul class="strength-list">
                ${quizData.strongAreas.map(area => `
                  <li class="strength-item">
                    <span>⭐</span>
                    ${area}
                  </li>
                `).join('')}
              </ul>
            </div>
            ` : ''}
            
            ${quizData.recommendations && quizData.recommendations.length > 0 ? `
            <div class="analysis-card">
              <div class="analysis-header">
                <span>💡</span>
                <div class="analysis-title">Recommendations</div>
              </div>
              <ul class="recommendation-list">
                ${quizData.recommendations.map(rec => `
                  <li class="recommendation-item">
                    <span>🎯</span>
                    ${rec}
                  </li>
                `).join('')}
              </ul>
            </div>
            ` : ''}
          </div>
        </div>

        ${quizData.detailedResults && quizData.detailedResults.length > 0 ? `
        <!-- Detailed Question Results -->
        <div class="detailed-results">
          <div class="section-title">
            📝 Detailed Question Analysis
          </div>
          ${quizData.detailedResults.map((result, index) => `
            <div class="question-card">
              <div class="question-header">
                <div class="question-number">Question ${index + 1}</div>
                <div class="question-status ${result.isCorrect ? 'correct' : 'incorrect'}">
                  ${result.isCorrect ? '✅ Correct' : '❌ Incorrect'}
                </div>
              </div>
              
              <div class="question-text">
                ${result.question}
              </div>
              
              <div class="answer-section">
                ${!result.isCorrect ? `
                <div class="answer-row user-answer">
                  <strong>Your Answer:</strong> ${result.userAnswer}
                </div>
                ` : ''}
                <div class="answer-row correct-answer">
                  <strong>Correct Answer:</strong> ${result.correctAnswer}
                </div>
              </div>
              
              ${result.explanation ? `
              <div class="explanation">
                <strong>💡 Explanation:</strong> ${result.explanation}
              </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        <!-- Personalized Study Plan -->
        <div class="study-plan">
          <div class="study-plan-title">
            📚 Your Personalized Study Plan
          </div>
          <div class="study-plan-subtitle">
            Based on your performance, here's what we recommend for ${quizData.userName}
          </div>
          
          <div class="study-steps">
            ${quizData.studyPlan && quizData.studyPlan.length > 0 ? 
              quizData.studyPlan.map((step, index) => `
                <div class="study-step">
                  <div class="step-number">${index + 1}</div>
                  <div class="step-title">Step ${index + 1}</div>
                  <div class="step-description">${step}</div>
                </div>
              `).join('') : `
                <div class="study-step">
                  <div class="step-number">1</div>
                  <div class="step-title">Review Weak Areas</div>
                  <div class="step-description">Focus on topics where you scored below 70%</div>
                </div>
                <div class="study-step">
                  <div class="step-number">2</div>
                  <div class="step-title">Practice More</div>
                  <div class="step-description">Take additional quizzes on ${quizData.topic}</div>
                </div>
                <div class="study-step">
                  <div class="step-number">3</div>
                  <div class="step-title">Seek Help</div>
                  <div class="step-description">Ask teachers or use our AI tutor for difficult concepts</div>
                </div>
              `
            }
          </div>
        </div>

        <!-- Achievements & Streaks -->
        <div class="achievements-section">
          <div class="section-title">
            🏆 Achievements & Progress
          </div>
          
          ${quizData.badges && quizData.badges.length > 0 ? `
          <div class="badges-grid">
            ${quizData.badges.map(badge => `
              <div class="badge">${badge}</div>
            `).join('')}
          </div>
          ` : ''}
          
          ${quizData.streakInfo ? `
          <div class="streak-info">
            <div class="streak-stats">
              <div class="streak-stat">
                <span class="streak-number">${quizData.streakInfo.currentStreak}</span>
                <span class="streak-label">Current Streak</span>
              </div>
              <div class="streak-stat">
                <span class="streak-number">${quizData.streakInfo.longestStreak}</span>
                <span class="streak-label">Longest Streak</span>
              </div>
              <div class="streak-stat">
                <span class="streak-number">${quizData.streakInfo.totalQuizzes}</span>
                <span class="streak-label">Total Quizzes</span>
              </div>
            </div>
          </div>
          ` : ''}
        </div>

        <!-- Call to Action -->
        <div class="cta-section">
          <div class="cta-title">
            Keep Learning, ${quizData.userName}! 🚀
          </div>
          <div class="cta-subtitle">
            Continue your learning journey with personalized AI-powered education
          </div>
          
          <div class="cta-buttons">
            <a href="https://quizzicallabz.qzz.io/generate-quiz" class="cta-button">
              📝 Take Another Quiz
            </a>
            <a href="https://quizzicallabz.qzz.io/dashboard" class="cta-button">
              📊 View Dashboard
            </a>
            <a href="https://quizzicallabz.qzz.io/study-plan" class="cta-button">
              📚 Get Study Plan
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="footer-content">
            <p><strong>Quizzicallabs AI</strong> - Your Ultimate AI-Powered Study Partner</p>
            <p>© ${new Date().getFullYear()} Quizzicallabs AI. All rights reserved.</p>
            <p>This email was sent to you because you completed a quiz on our platform.</p>
            <p>Need help? Reply to this email or visit our help center.</p>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;

  const text = `
QUIZ RESULTS - ${quizData.topic.toUpperCase()}
${performanceEmoji} ${performanceLevel} Performance

STUDENT INFORMATION:
-------------------
👤 Name: ${quizData.userName}
${quizData.userClass ? `📚 Class: ${quizData.userClass}` : ''}
${quizData.userGrade ? `🎓 Grade: ${quizData.userGrade}` : ''}
${quizData.userSchool ? `🏫 School: ${quizData.userSchool}` : ''}
${quizData.userAge ? `👶 Age: ${quizData.userAge} years` : ''}

QUIZ DETAILS:
------------
📝 Topic: ${quizData.topic}
${quizData.subject ? `📖 Subject: ${quizData.subject}` : ''}
${quizData.difficulty ? `⚡ Difficulty: ${quizData.difficulty}` : ''}
📅 Date: ${quizData.date || new Date().toLocaleDateString()}
${quizData.timeTaken ? `⏱️ Time Taken: ${Math.floor(quizData.timeTaken / 60)}m ${quizData.timeTaken % 60}s` : ''}

PERFORMANCE STATISTICS:
----------------------
🎯 Overall Score: ${percentage}%
✅ Correct Answers: ${quizData.score}
❌ Incorrect Answers: ${(quizData.total || 10) - quizData.score}
📊 Total Questions: ${quizData.total || 10}

${quizData.weakAreas && quizData.weakAreas.length > 0 ? `
AREAS FOR IMPROVEMENT:
---------------------
${quizData.weakAreas.map(area => `⚠️ ${area}`).join('\n')}
` : ''}

${quizData.strongAreas && quizData.strongAreas.length > 0 ? `
STRONG AREAS:
------------
${quizData.strongAreas.map(area => `💪 ${area}`).join('\n')}
` : ''}

${quizData.recommendations && quizData.recommendations.length > 0 ? `
RECOMMENDATIONS:
---------------
${quizData.recommendations.map(rec => `💡 ${rec}`).join('\n')}
` : ''}

${quizData.detailedResults && quizData.detailedResults.length > 0 ? `
DETAILED QUESTION ANALYSIS:
---------------------------
${quizData.detailedResults.map((result, index) => `
Question ${index + 1}: ${result.isCorrect ? '✅ CORRECT' : '❌ INCORRECT'}
Q: ${result.question}
${!result.isCorrect ? `Your Answer: ${result.userAnswer}` : ''}
Correct Answer: ${result.correctAnswer}
${result.explanation ? `Explanation: ${result.explanation}` : ''}
`).join('\n')}
` : ''}

PERSONALIZED STUDY PLAN:
-----------------------
${quizData.studyPlan && quizData.studyPlan.length > 0 ? 
  quizData.studyPlan.map((step, index) => `${index + 1}. ${step}`).join('\n') : 
  `1. Review weak areas and focus on topics where you scored below 70%
2. Take additional practice quizzes on ${quizData.topic}
3. Seek help from teachers or use our AI tutor for difficult concepts`
}

${quizData.streakInfo ? `
ACHIEVEMENTS & PROGRESS:
-----------------------
🔥 Current Streak: ${quizData.streakInfo.currentStreak} days
🏆 Longest Streak: ${quizData.streakInfo.longestStreak} days
📊 Total Quizzes: ${quizData.streakInfo.totalQuizzes}
` : ''}

${quizData.badges && quizData.badges.length > 0 ? `
BADGES EARNED:
-------------
${quizData.badges.map(badge => `🏅 ${badge}`).join('\n')}
` : ''}

NEXT STEPS:
----------
📝 Take Another Quiz: https://quizzicallabz.qzz.io/generate-quiz
📊 View Dashboard: https://quizzicallabz.qzz.io/dashboard
📚 Get Study Plan: https://quizzicallabz.qzz.io/study-plan

Keep learning, ${quizData.userName}! 🚀

---
Quizzicallabs AI - Your Ultimate AI-Powered Study Partner
© ${new Date().getFullYear()} Quizzicallabs AI. All rights reserved.

Need help? Reply to this email or visit our help center.
  `;

  return sendEmail({ to, subject, html, text });
}ata.score / (quizData.total || 10)) * 100);
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
