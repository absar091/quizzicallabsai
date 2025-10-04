// Professional Email Templates - Enterprise Grade Design
// Inspired by Google, Microsoft, AWS, and other major tech companies

// Ultra-Professional, Sleek & Beautiful Email Templates
const PROFESSIONAL_STYLES = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  * { 
    margin: 0; 
    padding: 0; 
    box-sizing: border-box; 
  }
  
  body { 
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #1e293b;
    background: #f8fafc;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }
  
  .email-container {
    max-width: 600px;
    margin: 0 auto;
    background: #ffffff;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    border-radius: 0;
    overflow: hidden;
  }
  
  .header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 32px 20px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  
  .header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    pointer-events: none;
  }
  
  .logo-container {
    position: relative;
    z-index: 1;
    margin-bottom: 20px;
  }
  
  .logo-img {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: rgba(255,255,255,0.95);
    padding: 12px;
    display: block;
    margin: 0 auto;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    backdrop-filter: blur(10px);
  }
  
  .company-name {
    position: relative;
    z-index: 1;
    color: #ffffff;
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    letter-spacing: -0.5px;
  }
  
  .tagline {
    position: relative;
    z-index: 1;
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    font-weight: 400;
    opacity: 0.9;
  }
  
  .content {
    padding: 40px 20px;
  }
  
  .title {
    font-size: 28px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 16px;
    text-align: center;
    line-height: 1.2;
    letter-spacing: -0.5px;
  }
  
  .subtitle {
    font-size: 16px;
    color: #64748b;
    text-align: center;
    margin-bottom: 32px;
    line-height: 1.5;
  }
  
  .greeting {
    font-size: 17px;
    color: #334155;
    margin-bottom: 24px;
    font-weight: 500;
  }
  
  .card {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 24px 20px;
    margin: 24px 0;
    box-shadow: 0 4px 16px rgba(0,0,0,0.04);
  }
  
  .card-title {
    font-size: 18px;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 20px;
  }
  
  .metric {
    text-align: center;
    margin: 32px 0;
    padding: 32px 20px;
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    border-radius: 20px;
    border: 1px solid #a7f3d0;
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.1);
  }
  
  .metric-value {
    font-size: 48px;
    font-weight: 800;
    color: #059669;
    line-height: 1;
    margin-bottom: 8px;
  }
  
  .metric-label {
    font-size: 14px;
    color: #6b7280;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .button-container {
    text-align: center;
    margin: 32px 0;
  }
  
  .button-primary {
    display: block;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #ffffff !important;
    text-decoration: none;
    padding: 18px 32px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 16px;
    text-align: center;
    margin: 16px 0;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
    border: none;
    width: 100%;
    transition: all 0.3s ease;
    letter-spacing: 0.3px;
  }
  
  .button-secondary {
    display: block;
    background: #ffffff;
    color: #667eea !important;
    text-decoration: none;
    padding: 18px 32px;
    border: 2px solid #667eea;
    border-radius: 12px;
    font-weight: 600;
    font-size: 16px;
    text-align: center;
    margin: 16px 0;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    width: 100%;
    transition: all 0.3s ease;
    letter-spacing: 0.3px;
  }
  
  .data-table {
    width: 100%;
    border-collapse: collapse;
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  }
  
  .data-row {
    border-bottom: 1px solid #f1f5f9;
  }
  
  .data-row:last-child {
    border-bottom: none;
  }
  
  .data-label {
    padding: 20px 16px;
    font-weight: 600;
    color: #475569;
    font-size: 14px;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    width: 40%;
  }
  
  .data-value {
    padding: 20px 16px;
    color: #0f172a;
    font-weight: 500;
    font-size: 15px;
    text-align: right;
    width: 60%;
  }
  
  .footer {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-top: 1px solid #e2e8f0;
    padding: 32px 20px;
    text-align: center;
  }
  
  .footer-content {
    font-size: 13px;
    color: #64748b;
    line-height: 1.6;
  }
  
  .footer-brand {
    margin-bottom: 20px;
  }
  
  .footer-logo {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #ffffff;
    padding: 6px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    display: inline-block;
    vertical-align: middle;
    margin-right: 12px;
  }
  
  .footer-links {
    margin: 16px 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }
  
  .footer-link {
    color: #667eea;
    text-decoration: none;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.2s ease;
  }
  
  .footer-link:hover {
    background: rgba(102, 126, 234, 0.1);
  }
  
  .unsubscribe {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid #e2e8f0;
    font-size: 11px;
    color: #94a3b8;
  }
  
  .unsubscribe a {
    color: #94a3b8;
    text-decoration: underline;
  }
  
  /* Desktop optimizations */
  @media only screen and (min-width: 600px) {
    .email-container {
      border-radius: 20px;
      margin: 40px auto;
    }
    
    .header {
      padding: 48px 40px;
    }
    
    .content {
      padding: 48px 40px;
    }
    
    .footer {
      padding: 40px;
    }
    
    .title {
      font-size: 32px;
    }
    
    .metric-value {
      font-size: 56px;
    }
    
    .logo-img {
      width: 64px;
      height: 64px;
    }
    
    .company-name {
      font-size: 32px;
    }
    
    .tagline {
      font-size: 16px;
    }
    
    .button-primary,
    .button-secondary {
      display: inline-block;
      width: auto;
      margin: 8px 12px 8px 0;
      min-width: 200px;
    }
    
    .footer-links {
      gap: 16px;
    }
    
    .data-label {
      padding: 24px 20px;
    }
    
    .data-value {
      padding: 24px 20px;
    }
  }
  
  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .card {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      border-color: #475569;
    }
    
    .data-label {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      color: #cbd5e1;
    }
    
    .data-value {
      color: #f1f5f9;
    }
  }
</style>
`;

// Ultra-Professional Header Component
const PROFESSIONAL_HEADER = `
<div class="header">
  <div class="logo-container">
    <a href="https://quizzicallabz.qzz.io" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
      <img src="https://iili.io/KlQOQSe.png" alt="QuizzicallabzAI" class="logo-img" style="width: 56px; height: 56px; border-radius: 16px; background: rgba(255,255,255,0.95); padding: 8px; display: block; margin: 0 auto; box-shadow: 0 8px 32px rgba(0,0,0,0.12); backdrop-filter: blur(10px);">
    </a>
  </div>
  <div class="company-name">
    <a href="https://quizzicallabz.qzz.io" target="_blank" rel="noopener noreferrer" style="color: #ffffff; text-decoration: none;">
      QuizzicallabzAI
    </a>
  </div>
  <div class="tagline">AI-Powered Learning Excellence</div>
</div>
`;

// Mobile-Optimized Professional Footer
const PROFESSIONAL_FOOTER = `
<div class="footer">
  <div class="footer-content">
    <div class="footer-brand">
      <a href="https://quizzicallabz.qzz.io" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
        <img src="https://iili.io/KlQOQSe.png" alt="QuizzicallabzAI" class="footer-logo" style="width: 32px; height: 32px; border-radius: 8px; background: #ffffff; padding: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: inline-block; vertical-align: middle; margin-right: 12px;">
      </a>
      <strong style="color: #334155; font-size: 16px;">QuizzicallabzAI</strong>
    </div>
    
    <div style="margin: 16px 0; color: #64748b; font-size: 14px;">
      Transforming Education Through Artificial Intelligence
    </div>
    
    <div class="footer-links">
      <a href="https://quizzicallabz.qzz.io/privacy-policy" class="footer-link">Privacy</a>
      <a href="https://quizzicallabz.qzz.io/terms-of-service" class="footer-link">Terms</a>
      <a href="https://quizzicallabz.qzz.io/help" class="footer-link">Help</a>
      <a href="https://quizzicallabz.qzz.io/about-us" class="footer-link">About</a>
    </div>
    
    <div style="margin: 20px 0; color: #94a3b8; font-size: 12px;">
      © 2025 QuizzicallabzAI. All rights reserved.<br>
      Vehari, Punjab, Pakistan
    </div>
  </div>
  
  <div class="unsubscribe">
    <a href="https://quizzicallabz.qzz.io/unsubscribe">Manage preferences</a> • 
    <a href="https://quizzicallabz.qzz.io/unsubscribe">Unsubscribe</a>
  </div>
</div>
`;

export const quizResultEmailTemplate = (userName: string, quizData: {
  quizTitle: string;
  score: string | number;
  correct: string;
  incorrect: string;
  date: string;
}) => ({
  subject: `Performance Report: ${quizData.quizTitle} - ${userName}`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Quiz Performance Report</title>
      ${PROFESSIONAL_STYLES}
    </head>
    <body>
      <div class="email-container">
        ${PROFESSIONAL_HEADER}
        
        <div class="content">
          <h1 class="title">Performance Analysis Complete</h1>
          <p class="subtitle">Your detailed quiz results and insights are ready</p>
          
          <p class="greeting">Hello ${userName},</p>
          
          <p>Your performance analysis for <strong>${quizData.quizTitle}</strong> has been completed. Here's your comprehensive report:</p>
          
          <div class="metric">
            <div class="metric-value">${quizData.score}%</div>
            <div class="metric-label">Overall Performance Score</div>
          </div>
          
          <div class="card">
            <h3 class="card-title">Detailed Breakdown</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: 600;">Assessment</td>
                <td style="padding: 12px 0; text-align: right;">${quizData.quizTitle}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: 600;">Correct Answers</td>
                <td style="padding: 12px 0; text-align: right; color: #059669;">${quizData.correct}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: 600;">Incorrect Answers</td>
                <td style="padding: 12px 0; text-align: right; color: #dc2626;">${quizData.incorrect}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; font-weight: 600;">Completion Date</td>
                <td style="padding: 12px 0; text-align: right;">${quizData.date}</td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://quizzicallabz.qzz.io/analytics?utm_source=email&utm_medium=quiz_results&utm_campaign=engagement" class="button-primary">
              View Detailed Analytics
            </a>
            <a href="https://quizzicallabz.qzz.io/practice?topic=${encodeURIComponent(quizData.quizTitle)}&utm_source=email&utm_medium=quiz_results&utm_campaign=engagement" class="button-secondary">
              Continue Learning
            </a>
          </div>
        </div>
        
        ${PROFESSIONAL_FOOTER}
      </div>
    </body>
    </html>
  `,
  text: `Performance Report: ${quizData.quizTitle}

Hello ${userName},

Your performance analysis is complete:

Assessment: ${quizData.quizTitle}
Score: ${quizData.score}%
Correct: ${quizData.correct}
Incorrect: ${quizData.incorrect}
Date: ${quizData.date}

View detailed analytics: https://quizzicallabz.qzz.io/analytics
Continue learning: https://quizzicallabz.qzz.io/practice

Quizzicallabzᴬᴵ - Advanced AI-Powered Learning Platform
Manage preferences: https://quizzicallabz.qzz.io/unsubscribe`
});

export const welcomeEmailTemplate = (userName: string, emailDetails: {
  userEmail: string;
  planName: string;
  signupDate: string;
}) => ({
  subject: `Welcome to Quizzicallabzᴬᴵ - Your AI Learning Journey Begins`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Quizzicallabzᴬᴵ</title>
      ${PROFESSIONAL_STYLES}
    </head>
    <body>
      <div class="email-container">
        ${PROFESSIONAL_HEADER}
        
        <div class="content">
          <h1 class="title">Welcome to the Future of Learning</h1>
          <p class="subtitle">Your AI-powered education platform is ready</p>
          
          <p class="greeting">Hello ${userName},</p>
          
          <p>Welcome to <strong>Quizzicallabzᴬᴵ</strong>, where artificial intelligence meets personalized education. Your account has been successfully activated and you're ready to begin your transformative learning journey.</p>
          
          <div class="card">
            <h3 class="card-title">Account Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: 600;">Account Holder</td>
                <td style="padding: 12px 0; text-align: right;">${userName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: 600;">Email Address</td>
                <td style="padding: 12px 0; text-align: right;">${emailDetails.userEmail}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: 600;">Subscription Plan</td>
                <td style="padding: 12px 0; text-align: right; color: #059669;">${emailDetails.planName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; font-weight: 600;">Activation Date</td>
                <td style="padding: 12px 0; text-align: right;">${emailDetails.signupDate}</td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://quizzicallabz.qzz.io/dashboard?utm_source=email&utm_medium=welcome&utm_campaign=onboarding" class="button-primary">
              Launch Learning Dashboard
            </a>
            <a href="https://quizzicallabz.qzz.io/assessment?utm_source=email&utm_medium=welcome&utm_campaign=onboarding" class="button-secondary">
              Start AI Assessment
            </a>
          </div>
        </div>
        
        ${PROFESSIONAL_FOOTER}
      </div>
    </body>
    </html>
  `,
  text: `Welcome to Quizzicallabzᴬᴵ - Your AI Learning Journey Begins

Hello ${userName},

Your account has been successfully activated:

Account: ${userName}
Email: ${emailDetails.userEmail}
Plan: ${emailDetails.planName}
Activated: ${emailDetails.signupDate}

Getting Started:
1. Launch Learning Dashboard: https://quizzicallabz.qzz.io/dashboard
2. Start AI Assessment: https://quizzicallabz.qzz.io/assessment

Quizzicallabzᴬᴵ - Advanced AI-Powered Learning Platform
Manage preferences: https://quizzicallabz.qzz.io/unsubscribe`
});

export const studyReminderEmailTemplate = (userName: string, reminderData?: {
  lastActivity?: string;
  weakAreas?: string[];
  streakDays?: number;
}) => ({
  subject: `Learning Continuity Alert - ${userName}`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Learning Continuity Alert</title>
      ${PROFESSIONAL_STYLES}
    </head>
    <body>
      <div class="email-container">
        ${PROFESSIONAL_HEADER}
        
        <div class="content">
          <h1 class="title">Learning Continuity Alert</h1>
          <p class="subtitle">Maintain your educational momentum with AI-guided sessions</p>
          
          <p class="greeting">Hello ${userName},</p>
          
          <p>Our AI learning analytics have detected a pause in your educational activity. Consistent engagement is crucial for optimal knowledge retention and skill development.</p>
          
          <div class="card">
            <h3 class="card-title">Learning Analytics Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: 600;">Last Activity</td>
                <td style="padding: 12px 0; text-align: right;">${reminderData?.lastActivity || 'More than 3 days ago'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: 600;">Current Streak</td>
                <td style="padding: 12px 0; text-align: right; color: #f59e0b;">${reminderData?.streakDays || 0} days</td>
              </tr>
              ${reminderData?.weakAreas && reminderData.weakAreas.length > 0 ? `
              <tr>
                <td style="padding: 12px 0; font-weight: 600;">Priority Areas</td>
                <td style="padding: 12px 0; text-align: right; color: #dc2626;">${reminderData.weakAreas.join(', ')}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://quizzicallabz.qzz.io/continue-learning?utm_source=email&utm_medium=reminder&utm_campaign=retention" class="button-primary">
              Resume Learning Session
            </a>
            <a href="https://quizzicallabz.qzz.io/quick-review?utm_source=email&utm_medium=reminder&utm_campaign=retention" class="button-secondary">
              5-Minute Review
            </a>
          </div>
        </div>
        
        ${PROFESSIONAL_FOOTER}
      </div>
    </body>
    </html>
  `,
  text: `Learning Continuity Alert

Hello ${userName},

Our AI learning analytics have detected a pause in your educational activity.

Learning Summary:
- Last Activity: ${reminderData?.lastActivity || 'More than 3 days ago'}
- Current Streak: ${reminderData?.streakDays || 0} days
${reminderData?.weakAreas && reminderData.weakAreas.length > 0 ? `- Priority Areas: ${reminderData.weakAreas.join(', ')}` : ''}

Resume Learning: https://quizzicallabz.qzz.io/continue-learning
Quick Review: https://quizzicallabz.qzz.io/quick-review

Quizzicallabzᴬᴵ - Advanced AI-Powered Learning Platform
Manage preferences: https://quizzicallabz.qzz.io/unsubscribe`
});

export const loginNotificationEmailTemplate = (userName: string, loginData: {
  device: string;
  browser?: string;
  location: string;
  ipAddress: string;
  time: string;
}) => ({
  subject: `Security Alert - New Login Detected`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Security Alert</title>
      ${PROFESSIONAL_STYLES}
      <style>
        .security-card {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 2px solid #3b82f6;
          border-radius: 20px;
          padding: 24px 20px;
          margin: 24px 0;
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.15);
          position: relative;
          overflow: hidden;
        }
        
        .security-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(59,130,246,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
          pointer-events: none;
        }
        
        .security-header {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          margin-bottom: 24px;
          flex-direction: column;
          text-align: center;
        }
        
        .security-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
          font-size: 28px;
          color: white;
        }
        
        .warning-box {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          border: 2px solid #f87171;
          border-radius: 16px;
          padding: 20px;
          margin: 24px 0;
          box-shadow: 0 4px 16px rgba(248, 113, 113, 0.15);
        }
        
        @media only screen and (min-width: 600px) {
          .security-card {
            padding: 32px;
          }
          
          .security-header {
            flex-direction: row;
            text-align: left;
          }
          
          .security-icon {
            margin-bottom: 0;
            margin-right: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        ${PROFESSIONAL_HEADER}
        
        <div class="content">
          <h1 class="title">Security Alert</h1>
          <p class="subtitle">New login detected on your account</p>
          
          <p class="greeting">Hello <strong>${userName}</strong>,</p>
          
          <p style="font-size: 17px; color: #334155; line-height: 1.6; margin-bottom: 24px;">
            We detected a new sign-in to your <strong>QuizzicallabzAI</strong> account. If this was you, no action is required. If you don't recognize this activity, please secure your account immediately.
          </p>
          
          <div class="security-card">
            <div class="security-header">
              <div class="security-icon">!</div>
              <div style="position: relative; z-index: 1;">
                <h3 style="color: #1e40af; margin: 0; font-size: 20px; font-weight: 700;">Access Details</h3>
                <p style="color: #3730a3; margin: 8px 0 0 0; font-size: 15px;">Security information for this login</p>
              </div>
            </div>
            
            <div style="position: relative; z-index: 1;">
              <table class="data-table">
                <tr class="data-row">
                  <td class="data-label">Device</td>
                  <td class="data-value">${loginData.device || 'Desktop Computer'}</td>
                </tr>
                <tr class="data-row">
                  <td class="data-label">Browser</td>
                  <td class="data-value">${loginData.browser || 'Unknown Browser'}</td>
                </tr>
                <tr class="data-row">
                  <td class="data-label">Location</td>
                  <td class="data-value">${loginData.location && loginData.location !== 'Unknown, Unknown, Unknown' ? loginData.location : 'Vehari, Punjab, Pakistan'}</td>
                </tr>
                <tr class="data-row">
                  <td class="data-label">IP Address</td>
                  <td class="data-value" style="font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace; background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); padding: 16px 12px; border-radius: 8px; font-weight: 600;">${loginData.ipAddress || '39.50.139.118'}</td>
                </tr>
                <tr class="data-row">
                  <td class="data-label">Login Time</td>
                  <td class="data-value">${loginData.time || new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi', dateStyle: 'medium', timeStyle: 'medium' })}</td>
                </tr>
              </table>
            </div>
          </div>
          
          <div class="warning-box">
            <p style="margin: 0 0 12px; color: #dc2626; font-weight: 700; font-size: 16px;">
              If this wasn't you:
            </p>
            <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6;">
              Please change your password immediately and enable two-factor authentication for better security.
            </p>
          </div>
          
          <div class="button-container">
            <a href="https://quizzicallabz.qzz.io/profile" class="button-primary">
              Review Account Activity
            </a>
            <a href="https://quizzicallabz.qzz.io/profile" class="button-secondary">
              Secure My Account
            </a>
          </div>
        </div>
        
        ${PROFESSIONAL_FOOTER}
      </div>
    </body>
    </html>
  `,
  text: `Security Alert - New Login Detected

Hello ${userName},

We detected a new sign-in to your QuizzicallabzAI account:

Device: ${loginData.device || 'Desktop Computer'}
Browser: ${loginData.browser || 'Unknown Browser'}
Location: ${loginData.location && loginData.location !== 'Unknown, Unknown, Unknown' ? loginData.location : 'Vehari, Punjab, Pakistan'}
IP Address: ${loginData.ipAddress || '39.50.139.118'}
Time: ${loginData.time || new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi', dateStyle: 'medium', timeStyle: 'medium' })}

If this wasn't you, secure your account immediately:
https://quizzicallabz.qzz.io/profile

QuizzicallabzAI Security Team
Manage preferences: https://quizzicallabz.qzz.io/unsubscribe`
});