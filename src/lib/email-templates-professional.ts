// Professional Email Templates - Enterprise Grade Design
// Inspired by Google, Microsoft, AWS, and other major tech companies

// Clean Professional Email Templates - Modern Enterprise Style
const PROFESSIONAL_STYLES = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  
  * { 
    margin: 0; 
    padding: 0; 
    box-sizing: border-box; 
  }
  
  body { 
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.7;
    color: #1f2937;
    background-color: #f8fafc;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    font-size: 16px;
  }
  
  .email-container {
    max-width: 640px;
    margin: 0 auto;
    background-color: #ffffff;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    overflow: hidden;
    width: 100%;
  }
  
  /* Clean Header - Minimal and Professional */
  .header {
    padding: 24px 32px;
    border-bottom: 1px solid #f1f5f9;
    background-color: #ffffff;
    text-align: center;
  }
  
  .logo-img {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    margin-bottom: 12px;
  }
  
  .header-app-name a {
    color: #0f172a;
    font-size: 18px;
    font-weight: 700;
    text-decoration: none;
    letter-spacing: -0.025em;
  }
  
  /* Content Styles - Clean Typography */
  .content {
    padding: 32px 24px;
  }
  
  .title {
    font-size: 28px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 12px;
    line-height: 1.2;
    letter-spacing: -0.025em;
  }
  
  .subtitle {
    font-size: 18px;
    color: #64748b;
    margin-bottom: 40px;
    font-weight: 400;
    line-height: 1.5;
  }
  
  .greeting, .paragraph {
    font-size: 16px;
    color: #334155;
    margin-bottom: 28px;
    line-height: 1.7;
  }
  
  /* Clean Info Sections - Minimal Design */
  .info-section {
    margin: 24px 0;
    background-color: #f8fafc;
    border-radius: 8px;
    padding: 20px;
  }
  
  .info-title {
    font-size: 13px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }
  
  .info-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .info-row {
    border-bottom: 1px solid #e2e8f0;
  }
  
  .info-row:last-child {
    border-bottom: none;
  }
  
  .info-label, .info-value {
    padding: 18px 0;
    font-size: 15px;
    vertical-align: top;
  }
  
  .info-label {
    color: #64748b;
    font-weight: 500;
    width: 40%;
  }
  
  .info-value {
    text-align: right;
    color: #0f172a;
    font-weight: 600;
  }
  
  /* Metric Display - Clean and Modern */
  .metric {
    text-align: center;
    margin: 40px 0;
    padding: 40px 32px;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border-radius: 12px;
    border: 1px solid #e0f2fe;
  }
  
  .metric-value {
    font-size: 48px;
    font-weight: 800;
    color: #0369a1;
    line-height: 1;
    letter-spacing: -0.025em;
  }
  
  .metric-label {
    font-size: 15px;
    color: #0284c7;
    font-weight: 600;
    margin-top: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  /* Buttons - Modern and Clean */
  .button-container {
    margin: 40px 0;
    text-align: center;
  }
  
  .button-primary, .button-secondary {
    display: inline-block;
    text-decoration: none;
    padding: 16px 32px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    text-align: center;
    margin: 8px 12px;
    transition: all 0.2s ease-in-out;
    letter-spacing: 0.025em;
  }
  
  .button-primary {
    background-color: #2563eb;
    color: #ffffff !important;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
  
  .button-primary:hover {
    background-color: #1d4ed8;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .button-secondary {
    background-color: #ffffff;
    color: #475569 !important;
    border: 1px solid #cbd5e1;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
  
  .button-secondary:hover {
    background-color: #f8fafc;
    border-color: #94a3b8;
  }
  
  /* Warning Box - Clean Alert Design */
  .warning-box {
    background-color: #fef3c7;
    border: 1px solid #fbbf24;
    border-radius: 8px;
    padding: 24px;
    margin: 32px 0;
  }
  
  .warning-text {
    color: #92400e;
    font-size: 15px;
    line-height: 1.6;
    font-weight: 500;
  }
  
  /* Professional Footer - Minimal and Clean */
  .footer {
    padding: 48px;
    text-align: center;
    border-top: 1px solid #f1f5f9;
    background-color: #fafafa;
  }
  
  .footer-logo {
    width: 40px;
    height: 40px;
    margin: 0 auto 20px auto;
    border-radius: 10px;
    opacity: 0.8;
  }
  
  .footer-nav {
    margin-bottom: 24px;
  }
  
  .footer-nav-link {
    color: #64748b;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    margin: 0 12px;
    display: inline-block;
    padding: 4px 0;
  }
  
  .footer-nav-link:hover {
    color: #334155;
    text-decoration: none;
  }
  
  .footer-legal {
    font-size: 13px;
    color: #94a3b8;
    line-height: 1.6;
    font-weight: 400;
  }
  
  .footer-legal a {
    color: #64748b;
    text-decoration: none;
  }
  
  .footer-legal a:hover {
    color: #334155;
    text-decoration: underline;
  }
  
  /* Mobile Responsive - Optimized for All Devices */
  @media only screen and (max-width: 640px) {
    .email-container {
      margin: 0;
      border-radius: 0;
      box-shadow: none;
      width: 100% !important;
      max-width: 100% !important;
    }
    
    .header {
      padding: 16px 12px;
    }
    
    .content {
      padding: 20px 12px;
    }
    
    .info-section {
      padding: 16px 12px;
      margin: 20px 0;
    }
    
    .footer {
      padding: 20px 12px;
    }
    
    .title {
      font-size: 20px;
      line-height: 1.3;
      margin-bottom: 8px;
    }
    
    .subtitle {
      font-size: 14px;
      margin-bottom: 20px;
    }
    
    .paragraph, .greeting {
      font-size: 14px;
      margin-bottom: 16px;
    }
    
    .button-primary,
    .button-secondary {
      display: block;
      width: 100%;
      margin: 8px 0;
      padding: 12px 16px;
      font-size: 14px;
    }
    
    .metric {
      padding: 20px 12px;
      margin: 20px 0;
    }
    
    .metric-value {
      font-size: 32px;
    }
    
    .metric-label {
      font-size: 12px;
    }
    
    .info-table {
      font-size: 13px;
    }
    
    .info-label, .info-value {
      padding: 12px 0;
      font-size: 13px;
    }
    
    .info-title {
      font-size: 11px;
      margin-bottom: 12px;
    }
    
    .warning-box {
      padding: 16px;
      margin: 20px 0;
    }
    
    .warning-text {
      font-size: 13px;
    }
    
    .footer-nav {
      margin-bottom: 16px;
      line-height: 1.8;
    }
    
    .footer-nav-link {
      font-size: 12px;
      margin: 0 6px;
      display: inline-block;
      padding: 6px 0;
    }
    
    .footer-legal {
      font-size: 11px;
    }
  }
</style>
`;

// Clean Professional Header - Centered and Minimal
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

// Professional Footer - Enterprise Style
const PROFESSIONAL_FOOTER = `
<div class="footer">
  <div class="footer-nav">
    <a href="https://quizzicallabz.qzz.io/about-us" class="footer-nav-link">About Us</a>
    <a href="https://quizzicallabz.qzz.io/privacy-policy" class="footer-nav-link">Privacy</a>
    <a href="https://quizzicallabz.qzz.io/terms-of-service" class="footer-nav-link">Terms</a>
    <a href="https://quizzicallabz.qzz.io/contact" class="footer-nav-link">Support</a>
  </div>
  <div class="footer-legal">
    © 2025 <strong>Quizzicallabz<sup>AI</sup></strong>. All rights reserved.<br>
    Vehari, Punjab, Pakistan<br><br>
    This message was sent because you have an account with us.<br>
    <a href="https://quizzicallabz.qzz.io/profile">Manage email preferences</a>
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
          <h1 class="title">Quiz Results</h1>
          <p class="subtitle">Performance analysis for ${quizData.quizTitle}</p>
          
          <p class="paragraph">Your assessment has been completed and analyzed. Here are your results:</p>
          
          <div class="metric">
            <div class="metric-value">${quizData.score}%</div>
            <div class="metric-label">Overall Score</div>
          </div>
          
          <div class="info-section">
            <h3 class="info-title">Result Details</h3>
            <table class="info-table">
              <tr class="info-row">
                <td class="info-label">Quiz Title</td>
                <td class="info-value">${quizData.quizTitle || 'Custom Quiz'}</td>
              </tr>
              <tr class="info-row">
                <td class="info-label">Correct Answers</td>
                <td class="info-value" style="color: #16a34a;">${quizData.correct || '0'}</td>
              </tr>
              <tr class="info-row">
                <td class="info-label">Incorrect Answers</td>
                <td class="info-value" style="color: #dc2626;">${quizData.incorrect || '0'}</td>
              </tr>
              <tr class="info-row">
                <td class="info-label">Completion Date</td>
                <td class="info-value">${quizData.date || new Date().toLocaleDateString('en-US', { dateStyle: 'medium' })}</td>
              </tr>
            </table>
          </div>
          
          <div class="button-container">
            <a href="https://quizzicallabz.qzz.io/dashboard" class="button-primary">View Dashboard</a>
            <a href="https://quizzicallabz.qzz.io/generate-quiz" class="button-secondary">Take Another Quiz</a>
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
          <h1 class="title">Welcome to Quizzicallabzᴬᴵ</h1>
          <p class="subtitle">Your account has been successfully created</p>
          
          <p class="paragraph">Hello ${userName}, your AI-powered learning platform is ready. Start creating personalized quizzes and track your progress with advanced analytics.</p>
          
          <div class="info-section">
            <h3 class="info-title">Account Information</h3>
            <table class="info-table">
              <tr class="info-row">
                <td class="info-label">Email Address</td>
                <td class="info-value">${emailDetails.userEmail || 'Not provided'}</td>
              </tr>
              <tr class="info-row">
                <td class="info-label">Subscription Plan</td>
                <td class="info-value">${emailDetails.planName || 'Free'}</td>
              </tr>
              <tr class="info-row">
                <td class="info-label">Activation Date</td>
                <td class="info-value">${emailDetails.signupDate || new Date().toLocaleDateString('en-US', { dateStyle: 'medium' })}</td>
              </tr>
            </table>
          </div>
          
          <div class="button-container">
            <a href="https://quizzicallabz.qzz.io/dashboard" class="button-primary">Access Dashboard</a>
            <a href="https://quizzicallabz.qzz.io/generate-quiz" class="button-secondary">Create First Quiz</a>
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
          <h1 class="title">Continue Your Learning</h1>
          <p class="subtitle">Your personalized study session is ready</p>
          
          <p class="paragraph">Hello ${userName}, our AI has prepared new practice questions based on your learning patterns. Continue your progress with a focused study session.</p>
          
          <div class="info-section">
            <h3 class="info-title">Learning Snapshot</h3>
            <table class="info-table">
              <tr class="info-row">
                <td class="info-label">Last Activity</td>
                <td class="info-value">${reminderData?.lastActivity || new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { dateStyle: 'medium' })}</td>
              </tr>
              <tr class="info-row">
                <td class="info-label">Current Streak</td>
                <td class="info-value">${reminderData?.streakDays || 0} days</td>
              </tr>
              <tr class="info-row">
                <td class="info-label">Study Goal</td>
                <td class="info-value">Daily practice recommended</td>
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
            <a href="https://quizzicallabz.qzz.io/generate-quiz" class="button-secondary">Quick Practice</a>
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

export const subscriptionConfirmationEmailTemplate = (userName: string, subscriptionData: {
  planName: string;
  amount: string;
  currency: string;
  orderId: string;
  activationDate: string;
  nextBillingDate?: string;
}) => ({
  subject: `Welcome to ${subscriptionData.planName} - Subscription Confirmed`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Subscription Confirmed</title>
      ${PROFESSIONAL_STYLES}
    </head>
    <body>
      <div class="email-container">
        ${PROFESSIONAL_HEADER}
        
        <div class="content">
          <h1 class="title">Subscription Activated</h1>
          <p class="subtitle">Your ${subscriptionData.planName} subscription is now active</p>
          
          <p class="paragraph">Hello ${userName}, thank you for upgrading to ${subscriptionData.planName}. Your subscription has been successfully activated and you now have access to all premium features.</p>
          
          <div class="metric">
            <div class="metric-value">${subscriptionData.planName}</div>
            <div class="metric-label">Active Subscription</div>
          </div>
          
          <div class="info-section">
            <h3 class="info-title">Subscription Details</h3>
            <table class="info-table">
              <tr class="info-row">
                <td class="info-label">Plan</td>
                <td class="info-value">${subscriptionData.planName}</td>
              </tr>
              <tr class="info-row">
                <td class="info-label">Amount Paid</td>
                <td class="info-value">${subscriptionData.amount} ${subscriptionData.currency}</td>
              </tr>
              <tr class="info-row">
                <td class="info-label">Order ID</td>
                <td class="info-value">${subscriptionData.orderId}</td>
              </tr>
              <tr class="info-row">
                <td class="info-label">Activation Date</td>
                <td class="info-value">${subscriptionData.activationDate}</td>
              </tr>
              ${subscriptionData.nextBillingDate ? `
              <tr class="info-row">
                <td class="info-label">Next Billing</td>
                <td class="info-value">${subscriptionData.nextBillingDate}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <div class="button-container">
            <a href="https://quizzicallabz.qzz.io/dashboard" class="button-primary">Access Premium Features</a>
            <a href="https://quizzicallabz.qzz.io/profile" class="button-secondary">Manage Subscription</a>
          </div>
        </div>
        
        ${PROFESSIONAL_FOOTER}
      </div>
    </body>
    </html>
  `,
  text: `Subscription Confirmed - ${subscriptionData.planName}

Hello ${userName},

Your ${subscriptionData.planName} subscription has been successfully activated.

Subscription Details:
- Plan: ${subscriptionData.planName}
- Amount: ${subscriptionData.amount} ${subscriptionData.currency}
- Order ID: ${subscriptionData.orderId}
- Activated: ${subscriptionData.activationDate}
${subscriptionData.nextBillingDate ? `- Next Billing: ${subscriptionData.nextBillingDate}` : ''}

Access your premium features: https://quizzicallabz.qzz.io/dashboard
Manage subscription: https://quizzicallabz.qzz.io/profile

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
          <h1 class="title">Account Security Alert</h1>
          <p class="subtitle">New sign-in detected on your account</p>
          
          <p class="paragraph">Hello ${userName}, we detected a new sign-in to your Quizzicallabzᴬᴵ account. If this was you, no action is required.</p>
          
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
            <p class="warning-text"><strong>Unrecognized activity?</strong> Secure your account immediately by changing your password and reviewing security settings.</p>
          </div>
          
          <div class="button-container">
            <a href="https://quizzicallabz.qzz.io/profile" class="button-primary">Change Password</a>
            <a href="https://quizzicallabz.qzz.io/profile" class="button-secondary">Account Settings</a>
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