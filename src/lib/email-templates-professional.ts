// Professional Email Templates - Enterprise Grade Design
// Inspired by Google, Microsoft, AWS, and other major tech companies

// Clean Professional Email Templates - Google/AWS Style
const PROFESSIONAL_STYLES = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  
  * { 
    margin: 0; 
    padding: 0; 
    box-sizing: border-box; 
  }
  
  body { 
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #374151;
    background-color: #f3f4f6;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }
  
  .email-container {
    max-width: 600px;
    margin: 40px auto;
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
  }
  
  /* Clean Header - Logo Left, App Name Right */
  .header {
    padding: 24px 40px;
    border-bottom: 1px solid #e5e7eb;
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo-img {
    width: 40px;
    height: 40px;
    border-radius: 8px;
  }
  
  .header-app-name a {
    color: #4b5563;
    font-size: 16px;
    font-weight: 600;
    text-decoration: none;
  }
  
  /* Content Styles */
  .content {
    padding: 32px 40px;
  }
  
  .title {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 8px;
    line-height: 1.3;
  }
  
  .subtitle {
    font-size: 16px;
    color: #6b7280;
    margin-bottom: 32px;
  }
  
  .greeting, .paragraph {
    font-size: 16px;
    color: #374151;
    margin-bottom: 24px;
  }
  
  /* Clean Info Sections - No Cards */
  .info-section {
    margin: 32px 0;
  }
  
  .info-title {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .info-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .info-row {
    border-bottom: 1px solid #e5e7eb;
  }
  
  .info-row:last-child {
    border-bottom: none;
  }
  
  .info-label, .info-value {
    padding: 16px 0;
    font-size: 15px;
    vertical-align: top;
  }
  
  .info-label {
    color: #6b7280;
    font-weight: 400;
  }
  
  .info-value {
    text-align: right;
    color: #111827;
    font-weight: 600;
  }
  
  /* Metric Display */
  .metric {
    text-align: center;
    margin: 32px 0;
    padding: 24px 20px;
    background-color: #f0fdf4;
    border-radius: 8px;
  }
  
  .metric-value {
    font-size: 40px;
    font-weight: 700;
    color: #166534;
    line-height: 1.1;
  }
  
  .metric-label {
    font-size: 14px;
    color: #15803d;
    font-weight: 500;
    margin-top: 4px;
  }
  
  /* Buttons */
  .button-container {
    margin: 32px 0;
  }
  
  .button-primary, .button-secondary {
    display: block;
    text-decoration: none;
    padding: 14px 24px;
    border-radius: 6px;
    font-weight: 600;
    font-size: 16px;
    text-align: center;
    margin: 16px 0;
    transition: all 0.2s ease-in-out;
  }
  
  .button-primary {
    background-color: #1d4ed8;
    color: #ffffff !important;
  }
  
  .button-primary:hover {
    background-color: #1e40af;
  }
  
  .button-secondary {
    background-color: #ffffff;
    color: #374151 !important;
    border: 1px solid #d1d5db;
  }
  
  .button-secondary:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
  }
  
  /* Warning Box */
  .warning-box {
    background-color: #fffbeb;
    border-left: 4px solid #f59e0b;
    padding: 16px;
    margin: 24px 0;
  }
  
  .warning-text {
    color: #78350f;
    font-size: 14px;
    line-height: 1.6;
  }
  
  /* Professional Footer */
  .footer {
    padding: 40px;
    text-align: center;
    border-top: 1px solid #e5e7eb;
    background-color: #f9fafb;
  }
  
  .footer-logo {
    width: 48px;
    height: 48px;
    margin: 0 auto 24px auto;
    border-radius: 8px;
  }
  
  .footer-nav {
    margin-bottom: 16px;
  }
  
  .footer-nav-link {
    color: #6b7280;
    text-decoration: none;
    font-size: 13px;
    margin: 0 10px;
  }
  
  .footer-nav-link:hover {
    text-decoration: underline;
  }
  
  .footer-legal {
    font-size: 12px;
    color: #9ca3af;
    line-height: 1.5;
  }
  
  .footer-legal a {
    color: #9ca3af;
    text-decoration: underline;
  }
  
  /* Mobile Responsive */
  @media only screen and (max-width: 600px) {
    .email-container {
      margin: 0;
      border-radius: 0;
    }
    
    .header {
      padding: 20px 16px;
    }
    
    .content {
      padding: 24px 16px;
    }
    
    .footer {
      padding: 24px 16px;
    }
    
    .button-primary,
    .button-secondary {
      width: 100%;
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
            <a href="https://quizzicallabz.qzz.io/dashboard" class="button-primary">
              View Dashboard
            </a>
            <a href="https://quizzicallabz.qzz.io/dashboard" class="button-secondary">
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

View dashboard: https://quizzicallabz.qzz.io/dashboard
Continue learning: https://quizzicallabz.qzz.io/dashboard

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
            <a href="https://quizzicallabz.qzz.io/dashboard" class="button-primary">
              Launch Learning Dashboard
            </a>
            <a href="https://quizzicallabz.qzz.io/generate-quiz" class="button-secondary">
              Start Learning
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
2. Start Learning: https://quizzicallabz.qzz.io/generate-quiz

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
            <a href="https://quizzicallabz.qzz.io/dashboard" class="button-primary">
              Resume Learning Session
            </a>
            <a href="https://quizzicallabz.qzz.io/generate-quiz" class="button-secondary">
              Start Quick Quiz
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

Resume Learning: https://quizzicallabz.qzz.io/dashboard
Quick Quiz: https://quizzicallabz.qzz.io/generate-quiz

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