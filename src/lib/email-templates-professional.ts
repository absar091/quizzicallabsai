// Professional Email Templates - Enterprise Grade Design
// Inspired by Google, Microsoft, AWS, and other major tech companies

// Common styles for all templates
const PROFESSIONAL_STYLES = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  body { 
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #1f2937;
    background: #f8fafc;
  }
  
  .email-container {
    max-width: 600px;
    margin: 0 auto;
    background: #ffffff;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 32px 40px;
    text-align: center;
  }
  
  .logo-img {
    width: 64px;
    height: 64px;
    border-radius: 12px;
    background: #ffffff;
    padding: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    display: block;
    margin: 0 auto;
  }
  
  .company-name {
    color: #ffffff;
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .tagline {
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    font-weight: 400;
  }
  
  .content {
    padding: 40px;
  }
  
  .title {
    font-size: 28px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 16px;
    text-align: center;
  }
  
  .subtitle {
    font-size: 16px;
    color: #6b7280;
    text-align: center;
    margin-bottom: 32px;
  }
  
  .greeting {
    font-size: 16px;
    color: #374151;
    margin-bottom: 24px;
  }
  
  .card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 24px;
    margin: 24px 0;
  }
  
  .card-title {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 12px;
  }
  
  .metric {
    text-align: center;
    margin: 32px 0;
  }
  
  .metric-value {
    font-size: 48px;
    font-weight: 700;
    color: #059669;
    line-height: 1;
  }
  
  .metric-label {
    font-size: 14px;
    color: #6b7280;
    margin-top: 8px;
  }
  
  .button-primary {
    display: inline-block;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #ffffff;
    text-decoration: none;
    padding: 14px 28px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    text-align: center;
    margin: 8px 8px 8px 0;
    transition: all 0.2s;
  }
  
  .button-secondary {
    display: inline-block;
    background: #ffffff;
    color: #667eea;
    text-decoration: none;
    padding: 14px 28px;
    border: 2px solid #667eea;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    text-align: center;
    margin: 8px 8px 8px 0;
    transition: all 0.2s;
  }
  
  .qr-section {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border: 1px solid #0ea5e9;
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    margin: 24px 0;
  }
  
  .qr-code {
    width: 120px;
    height: 120px;
    background: #ffffff;
    border-radius: 8px;
    margin: 16px auto;
    padding: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .social-section {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border: 1px solid #f59e0b;
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    margin: 24px 0;
  }
  
  .social-buttons {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 16px;
    flex-wrap: wrap;
  }
  
  .social-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #667eea;
    color: #ffffff;
    text-decoration: none;
    padding: 10px 16px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 14px;
  }
  
  .footer {
    background: #f9fafb;
    border-top: 1px solid #e5e7eb;
    padding: 32px 40px;
    text-align: center;
  }
  
  .footer-content {
    font-size: 12px;
    color: #6b7280;
    line-height: 1.5;
  }
  
  .footer-links {
    margin: 16px 0;
  }
  
  .footer-link {
    color: #667eea;
    text-decoration: none;
    margin: 0 8px;
  }
  
  .unsubscribe {
    margin-top: 16px;
    font-size: 11px;
    color: #9ca3af;
  }
  
  .unsubscribe a {
    color: #9ca3af;
    text-decoration: underline;
  }
  
  @media only screen and (max-width: 600px) {
    .header { padding: 24px 20px; }
    .content { padding: 24px 20px; }
    .footer { padding: 24px 20px; }
    .title { font-size: 24px; }
    .metric-value { font-size: 36px; }
    .logo-img { width: 48px; height: 48px; }
    .button-primary, .button-secondary { 
      display: block; 
      width: 100%; 
      margin: 8px 0; 
      text-align: center; 
    }
    .social-buttons { flex-direction: column; }
    .social-button { justify-content: center; }
  }
</style>
`;

// Professional Header Component
const PROFESSIONAL_HEADER = `
<div class="header">
  <div style="text-align: center; margin-bottom: 16px;">
    <a href="https://quizzicallabz.qzz.io?utm_source=email&utm_medium=header_logo&utm_campaign=branding" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
      <img src="https://iili.io/K1oSsrx.png" alt="QuizzicallabzAI" class="logo-img" style="width: 64px; height: 64px; border-radius: 12px; background: #ffffff; padding: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: block; margin: 0 auto;">
    </a>
  </div>
  <div class="company-name">
    <a href="https://quizzicallabz.qzz.io?utm_source=email&utm_medium=header_text&utm_campaign=branding" target="_blank" rel="noopener noreferrer" style="color: #ffffff; text-decoration: none;">
      QuizzicallabzAI
    </a>
  </div>
  <div class="tagline">Advanced AI-Powered Learning Platform</div>
</div>
`;

// Professional Footer Component
const PROFESSIONAL_FOOTER = `
<div class="footer">
  <div class="footer-content">
    <div style="text-align: center; margin-bottom: 16px;">
      <a href="https://quizzicallabz.qzz.io?utm_source=email&utm_medium=footer_logo&utm_campaign=branding" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
        <img src="https://iili.io/K1oSsrx.png" alt="QuizzicallabzAI" style="width: 32px; height: 32px; border-radius: 6px; background: #ffffff; padding: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); display: inline-block; vertical-align: middle; margin-right: 8px;">
      </a>
      <strong style="color: #374151;">QuizzicallabzAI</strong> - Transforming Education Through Artificial Intelligence
    </div>
    
    <div class="footer-links">
      <a href="https://quizzicallabz.qzz.io/privacy-policy?utm_source=email&utm_medium=footer&utm_campaign=legal" class="footer-link">Privacy Policy</a>
      <a href="https://quizzicallabz.qzz.io/terms-of-service?utm_source=email&utm_medium=footer&utm_campaign=legal" class="footer-link">Terms of Service</a>
      <a href="https://quizzicallabz.qzz.io/support?utm_source=email&utm_medium=footer&utm_campaign=support" class="footer-link">Support Center</a>
      <a href="https://quizzicallabz.qzz.io/about?utm_source=email&utm_medium=footer&utm_campaign=about" class="footer-link">About Us</a>
    </div>
    
    <div style="margin: 16px 0; color: #9ca3af;">
      QuizzicallabzAI Inc. | Advanced Learning Technologies Division<br>
      Global Headquarters: Innovation District, Tech Valley
    </div>
    
    <div style="margin: 16px 0; font-size: 11px; color: #9ca3af;">
      This email was sent from a monitored address. Please do not reply directly to this message.<br>
      For support inquiries, visit our <a href="https://quizzicallabz.qzz.io/support?utm_source=email&utm_medium=footer&utm_campaign=support" style="color: #667eea;">Support Center</a>.
    </div>
  </div>
  
  <div class="unsubscribe">
    <a href="https://quizzicallabz.qzz.io/unsubscribe?utm_source=email&utm_medium=footer&utm_campaign=preferences">Manage email preferences</a> | 
    <a href="https://quizzicallabz.qzz.io/unsubscribe?utm_source=email&utm_medium=footer&utm_campaign=unsubscribe">Unsubscribe</a>
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

QuizzicallabzAI - Advanced AI-Powered Learning Platform
Manage preferences: https://quizzicallabz.qzz.io/unsubscribe`
});

export const welcomeEmailTemplate = (userName: string, emailDetails: {
  userEmail: string;
  planName: string;
  signupDate: string;
}) => ({
  subject: `Welcome to QuizzicallabzAI - Your AI Learning Journey Begins`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to QuizzicallabzAI</title>
      ${PROFESSIONAL_STYLES}
    </head>
    <body>
      <div class="email-container">
        ${PROFESSIONAL_HEADER}
        
        <div class="content">
          <h1 class="title">Welcome to the Future of Learning</h1>
          <p class="subtitle">Your AI-powered education platform is ready</p>
          
          <p class="greeting">Hello ${userName},</p>
          
          <p>Welcome to QuizzicallabzAI, where artificial intelligence meets personalized education. Your account has been successfully activated and you're ready to begin your transformative learning journey.</p>
          
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
  text: `Welcome to QuizzicallabzAI - Your AI Learning Journey Begins

Hello ${userName},

Your account has been successfully activated:

Account: ${userName}
Email: ${emailDetails.userEmail}
Plan: ${emailDetails.planName}
Activated: ${emailDetails.signupDate}

Getting Started:
1. Launch Learning Dashboard: https://quizzicallabz.qzz.io/dashboard
2. Start AI Assessment: https://quizzicallabz.qzz.io/assessment

QuizzicallabzAI - Advanced AI-Powered Learning Platform
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

QuizzicallabzAI - Advanced AI-Powered Learning Platform
Manage preferences: https://quizzicallabz.qzz.io/unsubscribe`
});

export const loginNotificationEmailTemplate = (userName: string, loginData: {
  device: string;
  location: string;
  ipAddress: string;
  time: string;
}) => ({
  subject: `Security Alert: Account Access Notification`,
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
          <h1 class="title">Security Alert</h1>
          <p class="subtitle">New account access detected</p>
          
          <p class="greeting">Hello ${userName},</p>
          
          <p>We detected a new sign-in to your QuizzicallabzAI account. If this was you, no action is required. If you don't recognize this activity, please secure your account immediately.</p>
          
          <div style="background: #fef2f2; border: 1px solid #ef4444; border-radius: 12px; padding: 24px; margin: 24px 0;">
            <h3 style="color: #dc2626; margin-bottom: 16px;">Access Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #fecaca;">
                <td style="padding: 12px 0; font-weight: 600; color: #991b1b;">Device</td>
                <td style="padding: 12px 0; text-align: right; color: #991b1b;">${loginData.device}</td>
              </tr>
              <tr style="border-bottom: 1px solid #fecaca;">
                <td style="padding: 12px 0; font-weight: 600; color: #991b1b;">Location</td>
                <td style="padding: 12px 0; text-align: right; color: #991b1b;">${loginData.location}</td>
              </tr>
              <tr style="border-bottom: 1px solid #fecaca;">
                <td style="padding: 12px 0; font-weight: 600; color: #991b1b;">IP Address</td>
                <td style="padding: 12px 0; text-align: right; color: #991b1b;">${loginData.ipAddress}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; font-weight: 600; color: #991b1b;">Time</td>
                <td style="padding: 12px 0; text-align: right; color: #991b1b;">${loginData.time}</td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://quizzicallabz.qzz.io/security/review-activity" class="button-primary">
              Review Account Activity
            </a>
            <a href="https://quizzicallabz.qzz.io/security/secure-account" class="button-secondary" style="background: #dc2626; color: #ffffff; border: 2px solid #dc2626;">
              Secure My Account
            </a>
          </div>
        </div>
        
        ${PROFESSIONAL_FOOTER}
      </div>
    </body>
    </html>
  `,
  text: `Security Alert: Account Access Notification

Hello ${userName},

New sign-in detected:

Device: ${loginData.device}
Location: ${loginData.location}
IP: ${loginData.ipAddress}
Time: ${loginData.time}

If this wasn't you, secure your account: https://quizzicallabz.qzz.io/security/secure-account
Review activity: https://quizzicallabz.qzz.io/security/review-activity

QuizzicallabzAI Security Team
Manage preferences: https://quizzicallabz.qzz.io/unsubscribe`
});