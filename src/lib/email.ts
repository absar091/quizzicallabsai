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

        .content { padding: 0; }

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
        .btn-secondary:hover {
          background: #4b5563;
          box-shadow: 0 10px 15px -3px rgba(55, 65, 81, 0.2), 0 4px 6px -2px rgba(55, 65, 81, 0.05);
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
          transition: color 0.3s ease;
        }
        .footer-links a:hover {
          color: #ffffff;
        }
        .footer-divider {
          border-top: 1px solid #374151;
          padding-top: 30px;
          margin-top: 30px;
        }
        .footer-bottom {
          font-size: 13px;
          color: #6b7280;
        }
        .footer-bottom p {
          margin-bottom: 8px;
        }

        @media (max-width: 600px) {
          .header, .content, .footer { padding: 30px 20px; }
          .hero-section, .features-section, .stats-section, .cta-section {
            padding: 40px 20px;
          }
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
              <p>This email was sent to ${to}</p>
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
