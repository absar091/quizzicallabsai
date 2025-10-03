// Professional Email Templates - Enterprise Grade Design
// Inspired by Google, Moft, AWS, and other major tech companies

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

export const professionalQuizResultEmailTemplate = (userName: string, quizData: {
  quizTitle: string;
  score: string | number;
  correct: string;
  incorrect: string;
  date: string;
}) => ({
  subject: \`Performance Report: \${quizData.quizTitle} - \${userName}\`,
  html: \`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Quiz Performance Report</title>
      \${PROFESSIONAL_STYLES}
    </head>
    <body>
      <div class="email-container">
        \${PROFESSIONAL_HEADER}
        
        <div class="content">
          <h1 class="title">Performance Analysis Complete</h1>
          <p class="subtitle">Your detailed quiz results and insights are ready</p>
          
          <p class="greeting">Hello \${userName},</p>
          
          <p>Your performance analysis for <strong>\${quizData.quizTitle}</strong> has been completed. Here's your comprehensive report:</p>
          
          <div class="metric">
            <div class="metric-value">\${quizData.score}%</div>
            <div class="metric-label">Overall Performance Score</div>
          </div>
          
          <div class="card">
            <h3 class="card-title">Detailed Breakdown</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: 600;">Assessment</td>
                <td style="padding: 12px 0; text-align: right;">\${quizData.quizTitle}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: 600;">Correct Answers</td>
                <td style="padding: 12px 0; text-align: right; color: #059669;">\${quizData.correct}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: 600;">Incorrect Answers</td>
                <td style="padding: 12px 0; text-align: right; color: #dc2626;">\${quizData.incorrect}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; font-weight: 600;">Completion Date</td>
                <td style="padding: 12px 0; text-align: right;">\${quizData.date}</td>
              </tr>
            </table>
          </div>
          
          <div class="qr-section">
            <h3 style="margin-bottom: 8px; color: #0c4a6e;">Quick Mobile Access</h3>
            <p style="margin-bottom: 16px; color: #0369a1; font-size: 14px;">Scan to view detailed analytics on your mobile device</p>
            <div class="qr-code">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&color=0c4a6e&bgcolor=ffffff&data=https://quizzicallabz.qzz.io/analytics/\${encodeURIComponent(userName)}/\${encodeURIComponent(quizData.quizTitle)}?utm_source=email_qr" 
                   alt="QR Code for Mobile Access" 
                   style="width: 100%; height: 100%; display: block;">
            </div>
            <p style="margin-top: 12px; font-size: 12px; color: #0369a1;">Secure access to your personal learning dashboard</p>
          </div>
          
          <div class="social-section">
            <h3 style="margin-bottom: 8px; color: #92400e;">Share Your Achievement</h3>
            <p style="margin-bottom: 16px; color: #b45309; font-size: 14px;">Celebrate your progress with your professional network</p>
            <div class="social-buttons">
              <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://quizzicallabz.qzz.io&summary=I+achieved+\${quizData.score}%25+on+\${encodeURIComponent(quizData.quizTitle)}+using+QuizzicallabzAI's+advanced+learning+platform.+Transforming+my+skills+with+AI-powered+education." class="social-button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
              <a href="https://twitter.com/intent/tweet?text=Just+achieved+\${quizData.score}%25+on+\${encodeURIComponent(quizData.quizTitle)}+with+@QuizzicallabzAI!+AI-powered+learning+is+transforming+education.&url=https://quizzicallabz.qzz.io" class="social-button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Twitter
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://quizzicallabz.qzz.io/analytics?utm_source=email&utm_medium=quiz_results&utm_campaign=engagement" class="button-primary">
              View Detailed Analytics
            </a>
            <a href="https://quizzicallabz.qzz.io/practice?topic=\${encodeURIComponent(quizData.quizTitle)}&utm_source=email&utm_medium=quiz_results&utm_campaign=engagement" class="button-secondary">
              Continue Learning
            </a>
          </div>
          
          <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 16px; border-radius: 0 8px 8px 0; margin: 24px 0;">
            <p style="margin: 0; font-size: 14px; color: #0c4a6e;">
              <strong>Next Steps:</strong> Based on your performance, our AI recommends focusing on advanced concepts in this subject area. 
              Personalized learning paths are available in your dashboard.
            </p>
          </div>
        </div>
        
        \${PROFESSIONAL_FOOTER}
      </div>
    </body>
    </html>
  \`,
  text: \`Performance Report: \${quizData.quizTitle}

Hello \${userName},

Your performance analysis is complete:

Assessment: \${quizData.quizTitle}
Score: \${quizData.score}%
Correct: \${quizData.correct}
Incorrect: \${quizData.incorrect}
Date: \${quizData.date}

View detailed analytics: https://quizzicallabz.qzz.io/analytics
Continue learning: https://quizzicallabz.qzz.io/practice

QuizzicallabzAI - Advanced AI-Powered Learning Platform
Manage preferences: https://quizzicallabz.qzz.io/unsubscribe\`
});

export const professionalWelcomeEmailTemplate = (userName: string, emailDetails: {
  userEmail: string;
  planName: string;
  signupDate: string;
}) => ({
  subject: \`Welcome to QuizzicallabzAI - Your AI Learning Journey Begins\`,
  html: \`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to QuizzicallabzAI</title>
      \${PROFESSIONAL_STYLES}
    </head>
    <body>
      <div class="email-container">
        \${PROFESSIONAL_HEADER}
        
        <div class="content">
          <h1 class="title">Welcome to the Future of Learning</h1>
          <p class="subtitle">Your AI-powered education platform is ready</p>
          
          <p class="greeting">Hello \${userName},</p>
          
          <p>Welcome to QuizzicallabzAI, where artificial intelligence meets personalized education. Your account has been successfully activated and you're ready to begin your transformative learning journey.</p>
          
          <div class="card">
            <h3 class="card-title">Account Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: 600;">Account Holder</td>
                <td style="padding: 12px 0; text-align: right;">\${userName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: 600;">Email Address</td>
                <td style="padding: 12px 0; text-align: right;">\${emailDetails.userEmail}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: 600;">Subscription Plan</td>
                <td style="padding: 12px 0; text-align: right; color: #059669;">\${emailDetails.planName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; font-weight: 600;">Activation Date</td>
                <td style="padding: 12px 0; text-align: right;">\${emailDetails.signupDate}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #f0fdf4; border: 1px solid #22c55e; border-radius: 12px; padding: 24px; margin: 24px 0;">
            <h3 style="color: #15803d; margin-bottom: 16px;">Getting Started with AI-Powered Learning</h3>
            <div style="color: #166534; font-size: 14px; line-height: 1.6;">
              <div style="margin-bottom: 12px;">
                <strong>1. Personalized Assessment</strong><br>
                Take our AI diagnostic test to identify your learning profile and knowledge gaps.
              </div>
              <div style="margin-bottom: 12px;">
                <strong>2. Adaptive Learning Paths</strong><br>
                Access custom-generated content tailored to your learning style and pace.
              </div>
              <div style="margin-bottom: 12px;">
                <strong>3. Real-time Analytics</strong><br>
                Monitor your progress with advanced performance tracking and insights.
              </div>
            </div>
          </div>
          
          <div class="qr-section">
            <h3 style="margin-bottom: 8px; color: #0c4a6e;">Mobile Learning Hub</h3>
            <p style="margin-bottom: 16px; color: #0369a1; font-size: 14px;">Access your personalized dashboard anywhere, anytime</p>
            <div class="qr-code">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&color=0c4a6e&bgcolor=ffffff&data=https://quizzicallabz.qzz.io/dashboard/\${encodeURIComponent(userName)}?utm_source=welcome_email&welcome=true" 
                   alt="QR Code for Mobile Dashboard" 
                   style="width: 100%; height: 100%; display: block;">
            </div>
            <p style="margin-top: 12px; font-size: 12px; color: #0369a1;">Secure access to your learning environment</p>
          </div>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://quizzicallabz.qzz.io/dashboard?utm_source=email&utm_medium=welcome&utm_campaign=onboarding" class="button-primary">
              Launch Learning Dashboard
            </a>
            <a href="https://quizzicallabz.qzz.io/assessment?utm_source=email&utm_medium=welcome&utm_campaign=onboarding" class="button-secondary">
              Start AI Assessment
            </a>
          </div>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 0 8px 8px 0; margin: 24px 0;">
            <p style="margin: 0; font-size: 14px; color: #92400e;">
              <strong>Pro Tip:</strong> Complete your learning profile within the first 48 hours to unlock advanced AI recommendations 
              and personalized study schedules optimized for your success.
            </p>
          </div>
        </div>
        
        \${PROFESSIONAL_FOOTER}
      </div>
    </body>
    </html>
  \`,
  text: \`Welcome to QuizzicallabzAI - Your AI Learning Journey Begins

Hello \${userName},

Your account has been successfully activated:

Account: \${userName}
Email: \${emailDetails.userEmail}
Plan: \${emailDetails.planName}
Activated: \${emailDetails.signupDate}

Getting Started:
1. Launch Learning Dashboard: https://quizzicallabz.qzz.io/dashboard
2. Start AI Assessment: https://quizzicallabz.qzz.io/assessment

QuizzicallabzAI - Advanced AI-Powered Learning Platform
Manage preferences: https://quizzicallabz.qzz.io/unsubscribe\`
});

export const professionalStudyReminderEmailTemplate = (userName: string, reminderData?: {
  lastActivity?: string;
  weakAreas?: string[];
  streakDays?: number;
}) => ({
  subject: \`Learning Continuity Alert - \${userName}\`,
  html: \`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Learning Continuity Alert</title>
      \${PROFESSIONAL_STYLES}
    </head>
    <body>
      <div class="email-container">
        \${PROFESSIONAL_HEADER}
        
        <div class="content">
          <h1 class="title">Learning Continuity Alert</h1>
          <p class="subtitle">Maintain your educational momentum with AI-guided sessions</p>
          
          <p class="greeting">Hello \${userName},</p>
          
          <p>Our AI learning analytics have detected a pause in your educational activity. Consistent engagement is crucial for optimal knowledge retention and skill development.</p>
          
          <div class="card">
            <h3 class="card-title">Learning Analytics Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: 600;">Last Activity</td>
                <td style="padding: 12px 0; text-align: right;">\${reminderData?.lastActivity || 'More than 3 days ago'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: 600;">Current Streak</td>
                <td style="padding: 12px 0; text-align: right; color: #f59e0b;">\${reminderData?.streakDays || 0} days</td>
              </tr>
              \${reminderData?.weakAreas && reminderData.weakAreas.length > 0 ? \`
              <tr>
                <td style="padding: 12px 0; font-weight: 600;">Priority Areas</td>
                <td style="padding: 12px 0; text-align: right; color: #dc2626;">\${reminderData.weakAreas.join(', ')}</td>
              </tr>
              \` : ''}
            </table>
          </div>
          
          <div style="background: #fef2f2; border: 1px solid #ef4444; border-radius: 12px; padding: 24px; margin: 24px 0;">
            <h3 style="color: #dc2626; margin-bottom: 16px;">Cognitive Science Insight</h3>
            <p style="color: #991b1b; font-size: 14px; line-height: 1.6; margin: 0;">
              Research shows that learning retention decreases by 50% within the first hour and up to 90% within a week without reinforcement. 
              Our AI-powered spaced repetition system is designed to optimize your memory consolidation during critical retention windows.
            </p>
          </div>
          
          <div class="qr-section">
            <h3 style="margin-bottom: 8px; color: #0c4a6e;">Quick Resume Learning</h3>
            <p style="margin-bottom: 16px; color: #0369a1; font-size: 14px;">Instant access to your personalized learning session</p>
            <div class="qr-code">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&color=0c4a6e&bgcolor=ffffff&data=https://quizzicallabz.qzz.io/resume-learning/\${encodeURIComponent(userName)}?utm_source=reminder_email&priority=high" 
                   alt="QR Code for Resume Learning" 
                   style="width: 100%; height: 100%; display: block;">
            </div>
            <p style="margin-top: 12px; font-size: 12px; color: #0369a1;">Optimized learning path based on your progress</p>
          </div>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://quizzicallabz.qzz.io/continue-learning?utm_source=email&utm_medium=reminder&utm_campaign=retention" class="button-primary">
              Resume Learning Session
            </a>
            <a href="https://quizzicallabz.qzz.io/quick-review?utm_source=email&utm_medium=reminder&utm_campaign=retention" class="button-secondary">
              5-Minute Review
            </a>
          </div>
          
          <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 16px; border-radius: 0 8px 8px 0; margin: 24px 0;">
            <p style="margin: 0; font-size: 14px; color: #0c4a6e;">
              <strong>AI Recommendation:</strong> A focused 15-minute session now will help maintain your learning momentum. 
              Our adaptive algorithm has prepared a personalized micro-learning module based on your progress patterns.
            </p>
          </div>
        </div>
        
        \${PROFESSIONAL_FOOTER}
      </div>
    </body>
    </html>
  \`,
  text: \`Learning Continuity Alert

Hello \${userName},

Our AI learning analytics have detected a pause in your educational activity.

Learning Summary:
- Last Activity: \${reminderData?.lastActivity || 'More than 3 days ago'}
- Current Streak: \${reminderData?.streakDays || 0} days
\${reminderData?.weakAreas && reminderData.weakAreas.length > 0 ? \`- Priority Areas: \${reminderData.weakAreas.join(', ')}\` : ''}

Resume Learning: https://quizzicallabz.qzz.io/continue-learning
Quick Review: https://quizzicallabz.qzz.io/quick-review

QuizzicallabzAI - Advanced AI-Powered Learning Platform
Manage preferences: https://quizzicallabz.qzz.io/unsubscribe\`
});

export const professionalLoginNotificationEmailTemplate = (userName: string, loginData: {
  device: string;
  location: string;
  ipAddress: string;
  time: string;
}) => ({
  subject: \`Security Alert: Account Access Notification\`,
  html: \`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Security Alert</title>
      \${PROFESSIONAL_STYLES}
    </head>
    <body>
      <div class="email-container">
        \${PROFESSIONAL_HEADER}
        
        <div class="content">
          <h1 class="title">Security Alert</h1>
          <p class="subtitle">New account access detected</p>
          
          <p class="greeting">Hello \${userName},</p>
          
          <p>We detected a new sign-in to your QuizzicallabzAI account. If this was you, no action is required. If you don't recognize this activity, please secure your account immediately.</p>
          
          <div style="background: #fef2f2; border: 1px solid #ef4444; border-radius: 12px; padding: 24px; margin: 24px 0;">
            <h3 style="color: #dc2626; margin-bottom: 16px;">Access Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #fecaca;">
                <td style="padding: 12px 0; font-weight: 600; color: #991b1b;">Device</td>
                <td style="padding: 12px 0; text-align: right; color: #991b1b;">\${loginData.device}</td>
              </tr>
              <tr style="border-bottom: 1px solid #fecaca;">
                <td style="padding: 12px 0; font-weight: 600; color: #991b1b;">Location</td>
                <td style="padding: 12px 0; text-align: right; color: #991b1b;">\${loginData.location}</td>
              </tr>
              <tr style="border-bottom: 1px solid #fecaca;">
                <td style="padding: 12px 0; font-weight: 600; color: #991b1b;">IP Address</td>
                <td style="padding: 12px 0; text-align: right; color: #991b1b;">\${loginData.ipAddress}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; font-weight: 600; color: #991b1b;">Time</td>
                <td style="padding: 12px 0; text-align: right; color: #991b1b;">\${loginData.time}</td>
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
          
          <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 16px; border-radius: 0 8px 8px 0; margin: 24px 0;">
            <p style="margin: 0; font-size: 14px; color: #0c4a6e;">
              <strong>Security Tip:</strong> Always use strong, unique passwords and enable two-factor authentication for enhanced account protection.
            </p>
          </div>
        </div>
        
        \${PROFESSIONAL_FOOTER}
      </div>
    </body>
    </html>
  \`,
  text: \`Security Alert: Account Access Notification

Hello \${userName},

New sign-in detected:

Device: \${loginData.device}
Location: \${loginData.location}
IP: \${loginData.ipAddress}
Time: \${loginData.time}

If this wasn't you, secure your account: https://quizzicallabz.qzz.io/security/secure-account
Review activity: https://quizzicallabz.qzz.io/security/review-activity

QuizzicallabzAI Security Team
Manage preferences: https://quizzicallabz.qzz.io/unsubscribe\`
});

// Export all templates with consistent naming
export {
  professionalQuizResultEmailTemplate as quizResultEmailTemplate,
  professionalWelcomeEmailTemplate as welcomeEmailTemplate,
  professionalStudyReminderEmailTemplate as studyReminderEmailTemplate,
  professionalLoginNotificationEmailTemplate as loginNotificationEmailTemplate
};