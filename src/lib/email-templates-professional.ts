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

// Clean Professional Header - Logo Left, App Name Right
const PROFESSIONAL_HEADER = `
<div class="header">
  <a href="https://quizzicallabz.qzz.io" target="_blank" rel="noopener noreferrer">
    <img src="https://iili.io/KlQOQSe.png" alt="Quizzicallabzᴬᴵ Logo" class="logo-img">
  </a>
  <div class="header-app-name">
    <a href="https://quizzicallabz.qzz.io" target="_blank" rel="noopener noreferrer">Quizzicallabzᴬᴵ</a>
  </div>
</div>
`;

// Professional Footer - Big Tech Company Style
const PROFESSIONAL_FOOTER = `
<div class="footer">
  <a href="https://quizzicallabz.qzz.io" target="_blank" rel="noopener noreferrer">
    <img src="https://iili.io/KlQOQSe.png" alt="Quizzicallabzᴬᴵ Logo" class="footer-logo">
  </a>
  <div class="footer-nav">
    <a href="https://quizzicallabz.qzz.io/about-us" class="footer-nav-link">About</a>
    <a href="https://quizzicallabz.qzz.io/privacy-policy" class="footer-nav-link">Privacy</a>
    <a href="https://quizzicallabz.qzz.io/terms-of-service" class="footer-nav-link">Terms</a>
    <a href="https://quizzicallabz.qzz.io/help" class="footer-nav-link">Help</a>
  </div>
  <div class="footer-legal">
    © 2025 Quizzicallabzᴬᴵ. All Rights Reserved.<br>
    Vehari, Punjab, Pakistan<br><br>
    This is an automated message. Please do not reply directly to this email.<br>
    You can manage your email preferences or <a href="https://quizzicallabz.qzz.io/unsubscribe">unsubscribe</a>.
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
  subject: `Your Performance Report for ${quizData.quizTitle}`,
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
          <h1 class="title">Your Quiz Report is Ready</h1>
          <p class="subtitle">Here is the performance analysis for your recent assessment.</p>
          
          <p class="paragraph">Well done on completing the <strong>${quizData.quizTitle}</strong> quiz. Below is a summary of your results.</p>
          
          <div class="metric">
            <div class="metric-value">${quizData.score}%</div>
            <div class="metric-label">Overall Score</div>
          </div>
          
          <div class="info-section">
            <h3 class="info-title">Result Details</h3>
            <table class="info-table">
              <tr class="info-row">
                <td class="info-label">Correct Answers</td>
                <td class="info-value" style="color: #16a34a;">${quizData.correct}</td>
              </tr>
              <tr class="info-row">
                <td class="info-label">Incorrect Answers</td>
                <td class="info-value" style="color: #dc2626;">${quizData.incorrect}</td>
              </tr>
              <tr class="info-row">
                <td class="info-label">Completion Date</td>
                <td class="info-value">${quizData.date}</td>
              </tr>
            </table>
          </div>
          
          <div class="button-container">
            <a href="https://quizzicallabz.qzz.io/dashboard" class="button-primary">View Dashboard</a>
            <a href="https://quizzicallabz.qzz.io/dashboard" class="button-secondary">Continue Learning</a>
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
  subject: `Welcome to Quizzicallabzᴬᴵ`,
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
          <h1 class="title">Welcome, ${userName}!</h1>
          <p class="subtitle">Your Quizzicallabzᴬᴵ account is now active.</p>
          
          <p class="paragraph">We're excited to have you on board. You're all set to start your AI-powered learning journey. Here are your account details:</p>
          
          <div class="info-section">
            <h3 class="info-title">Account Information</h3>
            <table class="info-table">
              <tr class="info-row">
                <td class="info-label">Email Address</td>
                <td class="info-value">${emailDetails.userEmail}</td>
              </tr>
              <tr class="info-row">
                <td class="info-label">Subscription Plan</td>
                <td class="info-value">${emailDetails.planName}</td>
              </tr>
              <tr class="info-row">
                <td class="info-label">Activation Date</td>
                <td class="info-value">${emailDetails.signupDate}</td>
              </tr>
            </table>
          </div>
          
          <div class="button-container">
            <a href="https://quizzicallabz.qzz.io/dashboard" class="button-primary">Go to Your Dashboard</a>
            <a href="https://quizzicallabz.qzz.io/generate-quiz" class="button-secondary">Start Learning</a>
          </div>
        </div>
        
        ${PROFESSIONAL_FOOTER}
      </div>
    </body>
    </html>
  `,
  text: `Welcome to Quizzicallabzᴬᴵ

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
  subject: `It's time to continue your learning journey`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Learning Reminder</title>
      ${PROFESSIONAL_STYLES}
    </head>
    <body>
      <div class="email-container">
        ${PROFESSIONAL_HEADER}
        
        <div class="content">
          <h1 class="title">Keep Your Momentum Going</h1>
          <p class="subtitle">A little progress each day adds up to big results.</p>
          
          <p class="paragraph">It's been a little while since your last session. Consistent practice is the key to mastery. Let's pick up where you left off.</p>
          
          <div class="info-section">
            <h3 class="info-title">Learning Snapshot</h3>
            <table class="info-table">
              <tr class="info-row">
                <td class="info-label">Last Activity</td>
                <td class="info-value">${reminderData?.lastActivity || 'A few days ago'}</td>
              </tr>
              <tr class="info-row">
                <td class="info-label">Current Streak</td>
                <td class="info-value">${reminderData?.streakDays || 0} days</td>
              </tr>
              ${reminderData?.weakAreas && reminderData.weakAreas.length > 0 ? `
              <tr class="info-row">
                <td class="info-label">AI Recommended Focus</td>
                <td class="info-value" style="color: #c2410c;">${reminderData.weakAreas.join(', ')}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <div class="button-container">
            <a href="https://quizzicallabz.qzz.io/dashboard" class="button-primary">Resume Learning</a>
            <a href="https://quizzicallabz.qzz.io/generate-quiz" class="button-secondary">Start a 5-Min Quiz</a>
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
  subject: `Security Alert: New sign-in to your account`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Security Alert</title>
      ${PROFESSIONAL_STYLES}
    </head>
    <body>
      <div class="email-container">
        ${PROFESSIONAL_HEADER}
        
        <div class="content">
          <h1 class="title">New Sign-in Detected</h1>
          <p class="subtitle">A new device has signed in to your Quizzicallabzᴬᴵ account.</p>
          
          <p class="paragraph">We're writing to let you know about a recent sign-in. If this was you, you can safely disregard this email.</p>
          
          <div class="info-section">
            <h3 class="info-title">Login Details</h3>
            <table class="info-table">
              <tr class="info-row">
                <td class="info-label">Device</td>
                <td class="info-value">${loginData.device || 'Unknown Device'}</td>
              </tr>
              <tr class="info-row">
                <td class="info-label">Browser</td>
                <td class="info-value">${loginData.browser || 'Unknown Browser'}</td>
              </tr>
              <tr class="info-row">
                <td class="info-label">Approx. Location</td>
                <td class="info-value">${loginData.location && loginData.location !== 'Unknown, Unknown, Unknown' ? loginData.location : 'Vehari, Pakistan'}</td>
              </tr>
              <tr class="info-row">
                <td class="info-label">IP Address</td>
                <td class="info-value">${loginData.ipAddress || 'Not available'}</td>
              </tr>
              <tr class="info-row">
                <td class="info-label">Time</td>
                <td class="info-value">${loginData.time || new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' })}</td>
              </tr>
            </table>
          </div>
          
          <div class="warning-box">
            <p class="warning-text"><strong>Don't recognize this activity?</strong><br>Please change your password immediately and review your account security settings.</p>
          </div>
          
          <div class="button-container">
            <a href="https://quizzicallabz.qzz.io/profile" class="button-primary">Secure Your Account</a>
          </div>
        </div>
        
        ${PROFESSIONAL_FOOTER}
      </div>
    </body>
    </html>
  `,
  text: `Security Alert - New Login Detected

Hello ${userName},

We detected a new sign-in to your Quizzicallabzᴬᴵ account:

Device: ${loginData.device || 'Desktop Computer'}
Browser: ${loginData.browser || 'Unknown Browser'}
Location: ${loginData.location && loginData.location !== 'Unknown, Unknown, Unknown' ? loginData.location : 'Vehari, Punjab, Pakistan'}
IP Address: ${loginData.ipAddress || '39.50.139.118'}
Time: ${loginData.time || new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi', dateStyle: 'medium', timeStyle: 'medium' })}

If this wasn't you, secure your account immediately:
https://quizzicallabz.qzz.io/profile

Quizzicallabzᴬᴵ Security Team
Manage preferences: https://quizzicallabz.qzz.io/unsubscribe`
});