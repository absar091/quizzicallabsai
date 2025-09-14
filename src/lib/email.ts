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

export async function sendQuizResultEmail(to: string, data: QuizResultEmailData) {
  const subject = `🎯 Quiz Results: ${data.topic} - ${data.percentage.toFixed(1)}% Score | Quizzicallabz`;
  
  // Calculate performance level
  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { level: 'Excellent', color: '#10B981', emoji: '🏆' };
    if (percentage >= 80) return { level: 'Very Good', color: '#3B82F6', emoji: '🌟' };
    if (percentage >= 70) return { level: 'Good', color: '#8B5CF6', emoji: '👍' };
    if (percentage >= 60) return { level: 'Fair', color: '#F59E0B', emoji: '📈' };
    return { level: 'Needs Improvement', color: '#EF4444', emoji: '💪' };
  };

  const performance = getPerformanceLevel(data.percentage);
  const timeInMinutes = Math.floor(data.timeTaken / 60);
  const timeInSeconds = data.timeTaken % 60;
  const completionDate = new Date(data.date);
  const wrongAnswers = data.total - data.score;
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Quiz Results - Quizzicallabz</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
          line-height: 1.6; 
          color: #1f2937; 
          background-color: #f9fafb; 
        }
        .email-container { 
          max-width: 650px; 
          margin: 0 auto; 
          background: #ffffff; 
          box-shadow: 0 10px 25px rgba(0,0,0,0.1); 
        }
        
        /* Header */
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
          position: relative;
          overflow: hidden;
        }
        .header::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
          z-index: 1;
        }
        .header-content { position: relative; z-index: 2; }
        .logo { 
          font-size: 28px; 
          font-weight: 800; 
          margin-bottom: 10px; 
          letter-spacing: -0.5px;
        }
        .header h1 { 
          font-size: 32px; 
          margin: 15px 0 10px; 
          font-weight: 700; 
        }
        .header p { 
          font-size: 18px; 
          opacity: 0.95; 
          margin-bottom: 0;
        }
        
        /* Content */
        .content { 
          padding: 40px 30px; 
          background: #ffffff; 
        }
        
        /* User Info Card */
        .user-info {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 25px;
          border-radius: 12px;
          margin-bottom: 30px;
          border-left: 4px solid #667eea;
        }
        .user-info h2 {
          color: #1e293b;
          font-size: 20px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .user-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }
        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .detail-label {
          font-weight: 600;
          color: #64748b;
          font-size: 14px;
        }
        .detail-value {
          font-weight: 700;
          color: #1e293b;
          font-size: 14px;
        }
        
        /* Score Card */
        .score-card { 
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); 
          padding: 35px; 
          border-radius: 16px; 
          margin: 30px 0; 
          box-shadow: 0 8px 25px rgba(0,0,0,0.08); 
          border: 1px solid #e2e8f0;
          text-align: center;
        }
        .quiz-topic {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 12px 24px;
          border-radius: 25px;
          display: inline-block;
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 25px;
          text-transform: capitalize;
        }
        .performance-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: ${performance.color};
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 20px;
        }
        .score-big { 
          font-size: 64px; 
          font-weight: 800; 
          color: ${performance.color}; 
          margin: 20px 0; 
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        /* Stats Grid */
        .stats-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); 
          gap: 20px; 
          margin: 30px 0; 
        }
        .stat-card { 
          background: #f8fafc; 
          padding: 20px; 
          border-radius: 12px; 
          text-align: center; 
          border: 1px solid #e2e8f0;
          transition: transform 0.2s ease;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .stat-value { 
          font-size: 28px; 
          font-weight: 800; 
          color: #1e293b; 
          display: block;
          margin-bottom: 5px;
        }
        .stat-label { 
          font-size: 13px; 
          color: #64748b; 
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        /* Action Buttons */
        .action-section {
          text-align: center;
          margin: 40px 0;
          padding: 30px;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          border-radius: 12px;
        }
        .action-section h3 {
          color: #1e293b;
          margin-bottom: 15px;
          font-size: 20px;
        }
        .action-section p {
          color: #64748b;
          margin-bottom: 25px;
          font-size: 16px;
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
          background: linear-gradient(135deg, #667eea, #764ba2); 
          color: white; 
          padding: 14px 28px; 
          text-decoration: none; 
          border-radius: 8px; 
          font-weight: 600;
          font-size: 15px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        .btn-secondary {
          background: linear-gradient(135deg, #64748b, #475569);
          box-shadow: 0 4px 12px rgba(100, 116, 139, 0.3);
        }
        .btn-secondary:hover {
          box-shadow: 0 6px 20px rgba(100, 116, 139, 0.4);
        }
        
        /* Footer */
        .footer { 
          background: #1e293b; 
          color: #94a3b8; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .footer-logo {
          color: #ffffff;
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 15px;
        }
        .footer-links {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin: 20px 0;
          flex-wrap: wrap;
        }
        .footer-links a {
          color: #94a3b8;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }
        .footer-links a:hover {
          color: #ffffff;
        }
        .footer-bottom {
          border-top: 1px solid #334155;
          padding-top: 20px;
          margin-top: 20px;
          font-size: 14px;
        }
        
        /* Responsive */
        @media (max-width: 600px) {
          .email-container { margin: 0; }
          .header, .content, .footer { padding: 30px 20px; }
          .score-big { font-size: 48px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .btn-group { flex-direction: column; align-items: center; }
          .btn { width: 100%; max-width: 280px; justify-content: center; }
          .footer-links { flex-direction: column; gap: 15px; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <!-- Header -->
        <div class="header">
          <div class="header-content">
            <div class="logo">🎯 Quizzicallabz</div>
            <h1>Quiz Results</h1>
            <p>Congratulations on completing your quiz!</p>
          </div>
        </div>
        
        <!-- Content -->
        <div class="content">
          <!-- User Info -->
          <div class="user-info">
            <h2>👤 Quiz Summary</h2>
            <div class="user-details">
              <div class="detail-item">
                <span class="detail-label">Student Name</span>
                <span class="detail-value">${data.userName}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Email</span>
                <span class="detail-value">${to}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Quiz Topic</span>
                <span class="detail-value">${data.topic}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Date Completed</span>
                <span class="detail-value">${completionDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Time Completed</span>
                <span class="detail-value">${completionDate.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}</span>
              </div>
            </div>
          </div>
          
          <!-- Score Card -->
          <div class="score-card">
            <div class="quiz-topic">${data.topic}</div>
            <div class="performance-badge">
              <span>${performance.emoji}</span>
              <span>${performance.level}</span>
            </div>
            <div class="score-big">${data.percentage.toFixed(1)}%</div>
            
            <!-- Stats Grid -->
            <div class="stats-grid">
              <div class="stat-card">
                <span class="stat-value">${data.score}</span>
                <span class="stat-label">Correct</span>
              </div>
              <div class="stat-card">
                <span class="stat-value">${wrongAnswers}</span>
                <span class="stat-label">Wrong</span>
              </div>
              <div class="stat-card">
                <span class="stat-value">${data.total}</span>
                <span class="stat-label">Total</span>
              </div>
              <div class="stat-card">
                <span class="stat-value">${timeInMinutes}:${timeInSeconds.toString().padStart(2, '0')}</span>
                <span class="stat-label">Time</span>
              </div>
            </div>
          </div>
          
          <!-- Action Section -->
          <div class="action-section">
            <h3>🚀 Keep Learning!</h3>
            <p>Ready to challenge yourself with more quizzes? Continue your learning journey!</p>
            <div class="btn-group">
              <a href="https://quizzicallabz.qzz.io/generate-quiz" class="btn">
                <span>🎯</span>
                <span>Take Another Quiz</span>
              </a>
              <a href="https://quizzicallabz.qzz.io/dashboard" class="btn btn-secondary">
                <span>📊</span>
                <span>View Dashboard</span>
              </a>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <div class="footer-logo">Quizzicallabz</div>
          <p>Your Ultimate AI-Powered Study Partner</p>
          
          <div class="footer-links">
            <a href="https://quizzicallabz.qzz.io">Home</a>
            <a href="https://quizzicallabz.qzz.io/generate-quiz">Create Quiz</a>
            <a href="https://quizzicallabz.qzz.io/mdcat">MDCAT Prep</a>
            <a href="https://quizzicallabz.qzz.io/dashboard">Dashboard</a>
          </div>
          
          <div class="footer-bottom">
            <p>© ${new Date().getFullYear()} Quizzicallabz. All rights reserved.</p>
            <p>Powered by Advanced AI Technology | Made with ❤️ for Students</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
🎯 QUIZ RESULTS - QUIZZICALLABZ
================================

Hi ${data.userName},

Congratulations on completing your quiz!

QUIZ DETAILS:
-------------
• Student: ${data.userName}
• Email: ${to}
• Topic: ${data.topic}
• Date: ${completionDate.toLocaleDateString()}
• Time: ${completionDate.toLocaleTimeString()}

RESULTS:
--------
• Score: ${data.score}/${data.total} questions
• Percentage: ${data.percentage.toFixed(1)}%
• Performance: ${performance.level} ${performance.emoji}
• Time Taken: ${timeInMinutes}:${timeInSeconds.toString().padStart(2, '0')}
• Wrong Answers: ${wrongAnswers}

PERFORMANCE BREAKDOWN:
---------------------
✅ Correct Answers: ${data.score}
❌ Wrong Answers: ${wrongAnswers}
⏱️ Total Time: ${timeInMinutes} minutes ${timeInSeconds} seconds
📊 Success Rate: ${data.percentage.toFixed(1)}%

Keep up the excellent work! Ready for your next challenge?

🚀 CONTINUE LEARNING:
• Take Another Quiz: https://quizzicallabz.qzz.io/generate-quiz
• View Dashboard: https://quizzicallabz.qzz.io/dashboard
• MDCAT Preparation: https://quizzicallabz.qzz.io/mdcat

---
Quizzicallabz - Your Ultimate AI-Powered Study Partner
Visit: https://quizzicallabz.qzz.io
© ${new Date().getFullYear()} Quizzicallabz. All rights reserved.
  `;

  return sendEmail({ to, subject, html, text });
}

export async function sendWelcomeEmail(to: string, userName: string) {
  const subject = '🎉 Welcome to Quizzicallabz - Your AI Study Partner Awaits!';
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Quizzicallabz</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
          line-height: 1.6; 
          color: #1f2937; 
          background-color: #f9fafb; 
        }
        .email-container { 
          max-width: 650px; 
          margin: 0 auto; 
          background: #ffffff; 
          box-shadow: 0 10px 25px rgba(0,0,0,0.1); 
        }
        
        /* Header */
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 50px 30px; 
          text-align: center; 
          position: relative;
          overflow: hidden;
        }
        .header::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
          z-index: 1;
        }
        .header-content { position: relative; z-index: 2; }
        .logo { 
          font-size: 36px; 
          font-weight: 800; 
          margin-bottom: 15px; 
          letter-spacing: -0.5px;
        }
        .welcome-badge {
          background: rgba(255,255,255,0.2);
          padding: 8px 20px;
          border-radius: 25px;
          display: inline-block;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 20px;
          backdrop-filter: blur(10px);
        }
        .header h1 { 
          font-size: 32px; 
          margin: 15px 0 10px; 
          font-weight: 700; 
        }
        .header p { 
          font-size: 18px; 
          opacity: 0.95; 
          margin-bottom: 0;
        }
        
        /* Content */
        .content { 
          padding: 50px 30px; 
          background: #ffffff; 
        }
        
        /* Welcome Message */
        .welcome-message {
          text-align: center;
          margin-bottom: 40px;
          padding: 30px;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 16px;
          border-left: 4px solid #667eea;
        }
        .welcome-message h2 {
          color: #1e293b;
          font-size: 24px;
          margin-bottom: 15px;
        }
        .welcome-message p {
          color: #64748b;
          font-size: 16px;
          line-height: 1.7;
        }
        
        /* Features Grid */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px;
          margin: 40px 0;
        }
        .feature-card { 
          background: #ffffff; 
          padding: 30px; 
          border-radius: 16px; 
          box-shadow: 0 8px 25px rgba(0,0,0,0.08); 
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 35px rgba(0,0,0,0.12);
        }
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }
        .feature-icon {
          font-size: 48px;
          margin-bottom: 20px;
          display: block;
        }
        .feature-card h3 {
          color: #1e293b;
          font-size: 20px;
          margin-bottom: 15px;
          font-weight: 700;
        }
        .feature-card p {
          color: #64748b;
          font-size: 15px;
          line-height: 1.6;
        }
        
        /* Stats Section */
        .stats-section {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: white;
          padding: 40px 30px;
          border-radius: 16px;
          margin: 40px 0;
          text-align: center;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 30px;
          margin-top: 30px;
        }
        .stat-item {
          text-align: center;
        }
        .stat-number {
          font-size: 36px;
          font-weight: 800;
          color: #60a5fa;
          display: block;
          margin-bottom: 8px;
        }
        .stat-label {
          font-size: 14px;
          color: #94a3b8;
          font-weight: 500;
        }
        
        /* Action Buttons */
        .action-section {
          text-align: center;
          margin: 50px 0;
          padding: 40px 30px;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          border-radius: 16px;
        }
        .action-section h3 {
          color: #1e293b;
          margin-bottom: 15px;
          font-size: 24px;
          font-weight: 700;
        }
        .action-section p {
          color: #64748b;
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
          background: linear-gradient(135deg, #667eea, #764ba2); 
          color: white; 
          padding: 16px 32px; 
          text-decoration: none; 
          border-radius: 10px; 
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
        }
        .btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }
        .btn-secondary {
          background: linear-gradient(135deg, #10b981, #059669);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
        }
        .btn-secondary:hover {
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }
        
        /* Footer */
        .footer { 
          background: #1e293b; 
          color: #94a3b8; 
          padding: 50px 30px; 
          text-align: center; 
        }
        .footer-logo {
          color: #ffffff;
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 20px;
        }
        .footer-description {
          font-size: 16px;
          margin-bottom: 30px;
          color: #cbd5e1;
        }
        .footer-links {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin: 30px 0;
          flex-wrap: wrap;
        }
        .footer-links a {
          color: #94a3b8;
          text-decoration: none;
          font-weight: 500;
          font-size: 15px;
          transition: color 0.3s ease;
        }
        .footer-links a:hover {
          color: #ffffff;
        }
        .footer-bottom {
          border-top: 1px solid #334155;
          padding-top: 30px;
          margin-top: 30px;
        }
        .footer-bottom p {
          margin-bottom: 10px;
          font-size: 14px;
        }
        
        /* Responsive */
        @media (max-width: 600px) {
          .email-container { margin: 0; }
          .header, .content, .footer { padding: 40px 20px; }
          .features-grid { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .btn-group { flex-direction: column; align-items: center; }
          .btn { width: 100%; max-width: 300px; justify-content: center; }
          .footer-links { flex-direction: column; gap: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <!-- Header -->
        <div class="header">
          <div class="header-content">
            <div class="logo">🎯 Quizzicallabz</div>
            <div class="welcome-badge">NEW MEMBER</div>
            <h1>Welcome Aboard!</h1>
            <p>Your AI-powered learning journey starts now</p>
          </div>
        </div>
        
        <!-- Content -->
        <div class="content">
          <!-- Welcome Message -->
          <div class="welcome-message">
            <h2>Hi ${userName}! 👋</h2>
            <p>Welcome to Quizzicallabz, the most advanced AI-powered study platform designed to supercharge your learning experience. We're thrilled to have you join our community of successful learners!</p>
          </div>
          
          <!-- Features Grid -->
          <div class="features-grid">
            <div class="feature-card">
              <span class="feature-icon">🎯</span>
              <h3>Smart Quiz Generation</h3>
              <p>Create personalized quizzes on any topic using advanced AI. Get questions tailored to your learning level and goals.</p>
            </div>
            
            <div class="feature-card">
              <span class="feature-icon">📚</span>
              <h3>MDCAT/ECAT/NTS Prep</h3>
              <p>Specialized preparation modules for Pakistani entrance exams with authentic question patterns and detailed explanations.</p>
            </div>
            
            <div class="feature-card">
              <span class="feature-icon">🧠</span>
              <h3>AI-Powered Explanations</h3>
              <p>Get instant, detailed explanations for every question. Learn from mistakes with our intelligent tutoring system.</p>
            </div>
            
            <div class="feature-card">
              <span class="feature-icon">📊</span>
              <h3>Advanced Analytics</h3>
              <p>Track your progress with comprehensive performance analytics, identify weak areas, and monitor improvement over time.</p>
            </div>
            
            <div class="feature-card">
              <span class="feature-icon">⚡</span>
              <h3>Instant Results</h3>
              <p>Get immediate feedback on your performance with detailed score breakdowns and personalized recommendations.</p>
            </div>
            
            <div class="feature-card">
              <span class="feature-icon">🎨</span>
              <h3>Multiple Question Types</h3>
              <p>Practice with MCQs, true/false, descriptive questions, and more. Variety keeps learning engaging and effective.</p>
            </div>
          </div>
          
          <!-- Stats Section -->
          <div class="stats-section">
            <h3>Join Thousands of Successful Students</h3>
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
          
          <!-- Action Section -->
          <div class="action-section">
            <h3>🚀 Ready to Start Learning?</h3>
            <p>Take your first step towards academic excellence. Create your first quiz or explore our specialized exam preparation modules!</p>
            <div class="btn-group">
              <a href="https://quizzicallabz.qzz.io/generate-quiz" class="btn">
                <span>🎯</span>
                <span>Create Your First Quiz</span>
              </a>
              <a href="https://quizzicallabz.qzz.io/mdcat" class="btn btn-secondary">
                <span>📚</span>
                <span>Start MDCAT Prep</span>
              </a>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <div class="footer-logo">Quizzicallabz</div>
          <p class="footer-description">Your Ultimate AI-Powered Study Partner</p>
          
          <div class="footer-links">
            <a href="https://quizzicallabz.qzz.io">Home</a>
            <a href="https://quizzicallabz.qzz.io/generate-quiz">Create Quiz</a>
            <a href="https://quizzicallabz.qzz.io/mdcat">MDCAT Prep</a>
            <a href="https://quizzicallabz.qzz.io/dashboard">Dashboard</a>
            <a href="https://quizzicallabz.qzz.io/help">Help Center</a>
          </div>
          
          <div class="footer-bottom">
            <p>© ${new Date().getFullYear()} Quizzicallabz. All rights reserved.</p>
            <p>Powered by Advanced AI Technology | Made with ❤️ for Students</p>
            <p>Need help? Reply to this email or visit our help center</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
🎉 WELCOME TO QUIZZICALLABZ
===========================

Hi ${userName}!

Welcome to Quizzicallabz, your ultimate AI-powered study partner!

WHAT YOU CAN DO:
----------------
🎯 Smart Quiz Generation - Create personalized quizzes on any topic
📚 MDCAT/ECAT/NTS Prep - Specialized exam preparation modules  
🧠 AI Explanations - Get detailed explanations for every question
📊 Progress Tracking - Monitor your performance with advanced analytics
⚡ Instant Results - Get immediate feedback and recommendations
🎨 Multiple Question Types - Practice with various question formats

COMMUNITY STATS:
----------------
• 50K+ Quizzes Generated
• 10K+ Active Students  
• 95% Success Rate
• 24/7 AI Support

GET STARTED:
------------
🚀 Create Your First Quiz: https://quizzicallabz.qzz.io/generate-quiz
📚 Start MDCAT Prep: https://quizzicallabz.qzz.io/mdcat
📊 View Dashboard: https://quizzicallabz.qzz.io/dashboard

Need help? Reply to this email or visit our help center.

Happy studying! 📖✨

---
Quizzicallabz - Your Ultimate AI-Powered Study Partner
Visit: https://quizzicallabz.qzz.io
© ${new Date().getFullYear()} Quizzicallabz. All rights reserved.
  `;

  return sendEmail({ to, subject, html, text });
}

export async function sendStudyReminderEmail(to: string, userName: string) {
  const subject = '📚 Study Time! Your Daily Learning Boost Awaits | Quizzicallabz';
  
  const currentHour = new Date().getHours();
  const timeOfDay = currentHour < 12 ? 'morning' : currentHour < 17 ? 'afternoon' : 'evening';
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';
  
  const studyTips = [
    "Review topics you found challenging in previous quizzes",
    "Try the Pomodoro Technique: 25 minutes study, 5 minutes break",
    "Create flashcards for key concepts you want to remember",
    "Practice active recall by testing yourself without looking at notes",
    "Set specific learning goals for each study session",
    "Use spaced repetition to reinforce long-term memory",
    "Take breaks every 45-60 minutes to maintain focus",
    "Study in a quiet, well-lit environment free from distractions"
  ];
  
  const randomTip = studyTips[Math.floor(Math.random() * studyTips.length)];
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Study Reminder - Quizzicallabz</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
          line-height: 1.6; 
          color: #1f2937; 
          background-color: #f9fafb; 
        }
        .email-container { 
          max-width: 650px; 
          margin: 0 auto; 
          background: #ffffff; 
          box-shadow: 0 10px 25px rgba(0,0,0,0.1); 
        }
        
        /* Header */
        .header { 
          background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
          position: relative;
          overflow: hidden;
        }
        .header::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
          z-index: 1;
        }
        .header-content { position: relative; z-index: 2; }
        .logo { 
          font-size: 28px; 
          font-weight: 800; 
          margin-bottom: 10px; 
          letter-spacing: -0.5px;
        }
        .time-badge {
          background: rgba(255,255,255,0.2);
          padding: 6px 16px;
          border-radius: 20px;
          display: inline-block;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 15px;
          backdrop-filter: blur(10px);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .header h1 { 
          font-size: 32px; 
          margin: 15px 0 10px; 
          font-weight: 700; 
        }
        .header p { 
          font-size: 18px; 
          opacity: 0.95; 
          margin-bottom: 0;
        }
        
        /* Content */
        .content { 
          padding: 40px 30px; 
          background: #ffffff; 
        }
        
        /* Motivation Section */
        .motivation-section {
          text-align: center;
          margin-bottom: 40px;
          padding: 30px;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border-radius: 16px;
          border-left: 4px solid #10b981;
        }
        .motivation-section h2 {
          color: #1e293b;
          font-size: 24px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .motivation-section p {
          color: #64748b;
          font-size: 16px;
          line-height: 1.7;
        }
        
        /* Study Stats */
        .study-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          margin: 30px 0;
        }
        .stat-card {
          background: #f8fafc;
          padding: 25px 20px;
          border-radius: 12px;
          text-align: center;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .stat-icon {
          font-size: 32px;
          margin-bottom: 10px;
          display: block;
        }
        .stat-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 5px;
        }
        .stat-desc {
          font-size: 13px;
          color: #64748b;
        }
        
        /* Study Tip */
        .study-tip {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          padding: 25px;
          border-radius: 12px;
          margin: 30px 0;
          border-left: 4px solid #f59e0b;
        }
        .study-tip h3 {
          color: #92400e;
          font-size: 18px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .study-tip p {
          color: #78350f;
          font-size: 15px;
          margin: 0;
          font-weight: 500;
        }
        
        /* Quick Actions */
        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 40px 0;
        }
        .action-card {
          background: #ffffff;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          border: 1px solid #e2e8f0;
          text-align: center;
          transition: all 0.3s ease;
        }
        .action-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.12);
        }
        .action-icon {
          font-size: 40px;
          margin-bottom: 15px;
          display: block;
        }
        .action-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 10px;
        }
        .action-desc {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 20px;
        }
        
        /* Action Buttons */
        .action-section {
          text-align: center;
          margin: 40px 0;
          padding: 35px 30px;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          border-radius: 16px;
        }
        .action-section h3 {
          color: #1e293b;
          margin-bottom: 15px;
          font-size: 22px;
          font-weight: 700;
        }
        .action-section p {
          color: #64748b;
          margin-bottom: 25px;
          font-size: 16px;
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
          background: linear-gradient(135deg, #10b981, #059669); 
          color: white; 
          padding: 14px 28px; 
          text-decoration: none; 
          border-radius: 8px; 
          font-weight: 600;
          font-size: 15px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }
        .btn-secondary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        .btn-secondary:hover {
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }
        
        /* Footer */
        .footer { 
          background: #1e293b; 
          color: #94a3b8; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .footer-logo {
          color: #ffffff;
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 15px;
        }
        .footer-links {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin: 20px 0;
          flex-wrap: wrap;
        }
        .footer-links a {
          color: #94a3b8;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }
        .footer-links a:hover {
          color: #ffffff;
        }
        .footer-bottom {
          border-top: 1px solid #334155;
          padding-top: 20px;
          margin-top: 20px;
          font-size: 14px;
        }
        
        /* Responsive */
        @media (max-width: 600px) {
          .email-container { margin: 0; }
          .header, .content, .footer { padding: 30px 20px; }
          .study-stats { grid-template-columns: repeat(2, 1fr); }
          .quick-actions { grid-template-columns: 1fr; }
          .btn-group { flex-direction: column; align-items: center; }
          .btn { width: 100%; max-width: 280px; justify-content: center; }
          .footer-links { flex-direction: column; gap: 15px; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <!-- Header -->
        <div class="header">
          <div class="header-content">
            <div class="logo">📚 Quizzicallabz</div>
            <div class="time-badge">${timeOfDay} REMINDER</div>
            <h1>Study Time, ${userName}!</h1>
            <p>Consistency is the key to success</p>
          </div>
        </div>
        
        <!-- Content -->
        <div class="content">
          <!-- Motivation Section -->
          <div class="motivation-section">
            <h2>
              <span>🌟</span>
              <span>${greeting}, ${userName}!</span>
            </h2>
            <p>Just a friendly reminder that consistent practice leads to better results! Even 15 minutes of focused study can make a significant difference in your learning journey.</p>
          </div>
          
          <!-- Study Stats -->
          <div class="study-stats">
            <div class="stat-card">
              <span class="stat-icon">⚡</span>
              <div class="stat-title">Quick Session</div>
              <div class="stat-desc">5-10 minutes</div>
            </div>
            <div class="stat-card">
              <span class="stat-icon">🎯</span>
              <div class="stat-title">Focused Study</div>
              <div class="stat-desc">15-30 minutes</div>
            </div>
            <div class="stat-card">
              <span class="stat-icon">🏆</span>
              <div class="stat-title">Deep Learning</div>
              <div class="stat-desc">45+ minutes</div>
            </div>
            <div class="stat-card">
              <span class="stat-icon">📈</span>
              <div class="stat-title">Progress</div>
              <div class="stat-desc">Every day counts</div>
            </div>
          </div>
          
          <!-- Study Tip -->
          <div class="study-tip">
            <h3>
              <span>💡</span>
              <span>Today's Study Tip</span>
            </h3>
            <p>${randomTip}</p>
          </div>
          
          <!-- Quick Actions -->
          <div class="quick-actions">
            <div class="action-card">
              <span class="action-icon">⚡</span>
              <div class="action-title">Quick Quiz</div>
              <div class="action-desc">5-minute focused practice session</div>
            </div>
            <div class="action-card">
              <span class="action-icon">📚</span>
              <div class="action-title">MDCAT Prep</div>
              <div class="action-desc">Specialized exam preparation</div>
            </div>
            <div class="action-card">
              <span class="action-icon">🎯</span>
              <div class="action-title">Custom Quiz</div>
              <div class="action-desc">Create personalized practice</div>
            </div>
            <div class="action-card">
              <span class="action-icon">📊</span>
              <div class="action-title">Progress</div>
              <div class="action-desc">Check your performance</div>
            </div>
          </div>
          
          <!-- Action Section -->
          <div class="action-section">
            <h3>🚀 Ready to Study?</h3>
            <p>Choose your preferred study method and start learning right now!</p>
            <div class="btn-group">
              <a href="https://quizzicallabz.qzz.io/generate-quiz" class="btn">
                <span>⚡</span>
                <span>Quick 5-Min Quiz</span>
              </a>
              <a href="https://quizzicallabz.qzz.io/dashboard" class="btn btn-secondary">
                <span>📊</span>
                <span>View Progress</span>
              </a>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <div class="footer-logo">Quizzicallabz</div>
          <p>Your Ultimate AI-Powered Study Partner</p>
          
          <div class="footer-links">
            <a href="https://quizzicallabz.qzz.io">Home</a>
            <a href="https://quizzicallabz.qzz.io/generate-quiz">Create Quiz</a>
            <a href="https://quizzicallabz.qzz.io/mdcat">MDCAT Prep</a>
            <a href="https://quizzicallabz.qzz.io/dashboard">Dashboard</a>
          </div>
          
          <div class="footer-bottom">
            <p>© ${new Date().getFullYear()} Quizzicallabz. All rights reserved.</p>
            <p>Keep up the great work! You're on the path to success 🌟</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
📚 STUDY REMINDER - QUIZZICALLABZ
=================================

${greeting}, ${userName}!

Time for your daily learning boost! Consistency is the key to success.

STUDY OPTIONS:
--------------
⚡ Quick Session (5-10 minutes)
🎯 Focused Study (15-30 minutes)  
🏆 Deep Learning (45+ minutes)
📈 Progress Review

💡 TODAY'S STUDY TIP:
${randomTip}

QUICK ACTIONS:
--------------
• Quick 5-Min Quiz: https://quizzicallabz.qzz.io/generate-quiz
• MDCAT Preparation: https://quizzicallabz.qzz.io/mdcat
• View Progress: https://quizzicallabz.qzz.io/dashboard
• Create Custom Quiz: https://quizzicallabz.qzz.io/generate-quiz

Remember: Even 15 minutes of focused study can make a significant difference!

Keep up the great work! 🌟

---
Quizzicallabz - Your Ultimate AI-Powered Study Partner
Visit: https://quizzicallabz.qzz.io
© ${new Date().getFullYear()} Quizzicallabz. All rights reserved.
  `;

  return sendEmail({ to, subject, html, text });
}