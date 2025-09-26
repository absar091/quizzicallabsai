// New Email Templates - Exactly as requested

export const loginNotificationEmailTemplate = (userName: string, loginData: {
  device: string;
  location: string;
  ipAddress: string;
  time: string;
}) => ({
  subject: `Security Alert: New Login Detected`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Security Alert</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; background-color: #f9fafb; }
        .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; }
        @media only screen and (max-width: 600px) {
          .email-container { width: 100% !important; margin: 0 !important; }
          .header-table td { padding: 10px !important; }
          .content { padding: 20px !important; }
          .footer-table td { padding: 15px !important; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <!-- HEADER START -->
        <tr>
          <td style="padding:20px 30px;background:#ffffff;border-bottom:1px solid #e5e7eb;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <!-- Logo -->
                <td align="left">
                  <a href="https://quizzicallabz.qzz.io" target="_blank" style="text-decoration:none;">
                    <img src="https://iili.io/KlQOQSe.png" alt="Quizzicallabzᴬᴵ" width="160" style="display:block;">
                  </a>
                </td>
                <!-- App Name + Tagline -->
                <td align="right" style="font-family:Arial,Helvetica,sans-serif;color:#111;font-size:14px;">
                  <strong style="font-size:16px;color:#4f46e5;">Quizzicallabzᴬᴵ</strong><br>
                  <span style="color:#6b7280;">Your ultimate AI-powered study partner</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- HEADER END -->

        <tr>
          <td style="padding:30px;color:#333;font-size:15px;line-height:1.7;">
            <h2 style="margin-top:0;margin-bottom:15px;font-size:20px;color:#111;font-weight:600;">
              Security Alert: New Login Detected
            </h2>
            <p style="margin:0 0 20px;">Hello <strong>${userName}</strong>,</p>
            <p style="margin:0 0 20px;">
              A new login was detected on your Quizzicallabzᴬᴵ account. If this was you, no action is required.
              If not, please take immediate steps to protect your account.
            </p>

            <!-- Info Card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;border-radius:6px;margin-bottom:20px;">
              <tr><td style="padding:15px;">
                <p style="margin:0;font-size:14px;"><strong>Device:</strong> ${loginData.device}</p>
                <p style="margin:0;font-size:14px;"><strong>Location:</strong> ${loginData.location}</p>
                <p style="margin:0;font-size:14px;"><strong>IP Address:</strong> ${loginData.ipAddress}</p>
                <p style="margin:0;font-size:14px;"><strong>Time:</strong> ${loginData.time}</p>
              </td></tr>
            </table>

            <!-- Buttons -->
            <a href="https://quizzicallabz.qzz.io/reset-password" style="background:#4f46e5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;margin-right:10px;">Change Password</a>
            <a href="https://quizzicallabz.qzz.io/profile" style="border:1px solid #4f46e5;color:#4f46e5;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;">Review Activity</a>
          </td>
        </tr>

        <!-- FOOTER START -->
        <tr>
          <td style="padding:30px;background:#f9fafb;color:#6b7280;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;text-align:center;border-top:1px solid #e5e7eb;">

            <!-- Legal & Branding -->
            <p style="margin:0 0 10px;">
              © 2025 <strong>Quizzicallabzᴬᴵ</strong>. All rights reserved.<br>
              <em>Quizzicallabzᴬᴵ and its logo are products of Quizzicallabz™.</em>
            </p>

            <!-- Links -->
            <p style="margin:0 0 10px;">
              <a href="https://quizzicallabz.qzz.io/privacy" style="color:#4f46e5;text-decoration:none;">Privacy Policy</a> ·
              <a href="https://quizzicallabz.qzz.io/terms" style="color:#4f46e5;text-decoration:none;">Terms of Use</a> ·
              <a href="https://quizzicallabz.qzz.io/disclaimer" style="color:#4f46e5;text-decoration:none;">Disclaimer</a>
            </p>

            <!-- Contact Info -->
            <p style="margin:0;">
              Vehari, Punjab, Pakistan<br>
              <a href="mailto:support@quizzicallabz.qzz.io" style="color:#4f46e5;text-decoration:none;">support@quizzicallabz.qzz.io</a> ·
              <a href="mailto:info@quizzicallabz.qzz.io" style="color:#4f46e5;text-decoration:none;">info@quizzicallabz.qzz.io</a>
            </p>
          </td>
        </tr>
        <!-- FOOTER END -->
      </div>
    </body>
    </html>
  `,
  text: `
Security Alert: New Login Detected

Hello ${userName},

A new login was detected on your Quizzicallabzᴬᴵ account. If this was you, no action is required.
If not, please take immediate steps to protect your account.

Device: ${loginData.device}
Location: ${loginData.location}
IP Address: ${loginData.ipAddress}
Time: ${loginData.time}

Change Password: https://quizzicallabz.qzz.io/reset-password
Review Activity: https://quizzicallabz.qzz.io/profile

© 2025 Quizzicallabz AI. All rights reserved.
  `
});

export const welcomeEmailTemplate = (userName: string, emailDetails: {
  userEmail: string;
  planName: string;
  signupDate: string;
}) => ({
  subject: `Welcome to Quizzicallabzᴬᴵ, ${userName}`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Quizzicallabz AI</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; background-color: #f9fafb; }
        .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; }
        @media only screen and (max-width: 600px) {
          .email-container { width: 100% !important; margin: 0 !important; }
          .header-table td { padding: 10px !important; }
          .content { padding: 20px !important; }
          .footer-table td { padding: 15px !important; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <!-- HEADER START -->
        <tr>
          <td style="padding:20px 30px;background:#ffffff;border-bottom:1px solid #e5e7eb;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <!-- Logo -->
                <td align="left">
                  <a href="https://quizzicallabz.qzz.io" target="_blank" style="text-decoration:none;">
                    <img src="https://iili.io/KlQOQSe.png" alt="Quizzicallabzᴬᴵ" width="160" style="display:block;">
                  </a>
                </td>
                <!-- App Name + Tagline -->
                <td align="right" style="font-family:Arial,Helvetica,sans-serif;color:#111;font-size:14px;">
                  <strong style="font-size:16px;color:#4f46e5;">Quizzicallabzᴬᴵ</strong><br>
                  <span style="color:#6b7280;">Your ultimate AI-powered study partner</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- HEADER END -->

        <tr>
          <td style="padding:30px;color:#333;font-size:15px;line-height:1.7;">
            <h2 style="margin-top:0;margin-bottom:15px;font-size:20px;color:#111;font-weight:600;">
              Welcome to Quizzicallabzᴬᴵ
            </h2>
            <p style="margin:0 0 20px;">Hello <strong>${userName}</strong>,</p>
            <p style="margin:0 0 20px;">
              Your account has been successfully created with the <strong>${emailDetails.planName}</strong> plan.
              Below are your account details:
            </p>

            <!-- Info Card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;border-radius:6px;margin-bottom:20px;">
              <tr><td style="padding:15px;">
                <p style="margin:0;font-size:14px;"><strong>Username:</strong> ${userName}</p>
                <p style="margin:0;font-size:14px;"><strong>Email:</strong> ${emailDetails.userEmail}</p>
                <p style="margin:0;font-size:14px;"><strong>Plan:</strong> ${emailDetails.planName}</p>
                <p style="margin:0;font-size:14px;"><strong>Signup Date:</strong> ${emailDetails.signupDate}</p>
              </td></tr>
            </table>

            <!-- Buttons -->
            <a href="https://quizzicallabz.qzz.io/dashboard" style="background:#4f46e5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;margin-right:10px;">View Dashboard</a>
            <a href="https://quizzicallabz.qzz.io/generate-quiz" style="border:1px solid #4f46e5;color:#4f46e5;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;margin-right:10px;">Access Gen Lab</a>
            <a href="https://quizzicallabz.qzz.io/exam-prep" style="border:1px solid #4f46e5;color:#4f46e5;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;">Start Exam Prep</a>
          </td>
        </tr>

        <!-- FOOTER START -->
        <tr>
          <td style="padding:30px;background:#f9fafb;color:#6b7280;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;text-align:center;border-top:1px solid #e5e7eb;">

            <!-- Legal & Branding -->
            <p style="margin:0 0 10px;">
              © 2025 <strong>Quizzicallabzᴬᴵ</strong>. All rights reserved.<br>
              <em>Quizzicallabzᴬᴵ and its logo are products of Quizzicallabz™.</em>
            </p>

            <!-- Links -->
            <p style="margin:0 0 10px;">
              <a href="https://quizzicallabz.qzz.io/privacy" style="color:#4f46e5;text-decoration:none;">Privacy Policy</a> ·
              <a href="https://quizzicallabz.qzz.io/terms" style="color:#4f46e5;text-decoration:none;">Terms of Use</a> ·
              <a href="https://quizzicallabz.qzz.io/disclaimer" style="color:#4f46e5;text-decoration:none;">Disclaimer</a>
            </p>

            <!-- Contact Info -->
            <p style="margin:0;">
              Vehari, Punjab, Pakistan<br>
              <a href="mailto:support@quizzicallabz.qzz.io" style="color:#4f46e5;text-decoration:none;">support@quizzicallabz.qzz.io</a> ·
              <a href="mailto:info@quizzicallabz.qzz.io" style="color:#4f46e5;text-decoration:none;">info@quizzicallabz.qzz.io</a>
            </p>
          </td>
        </tr>
        <!-- FOOTER END -->
      </div>
    </body>
    </html>
  `,
  text: `
Welcome to Quizzicallabz AI

Hello ${userName},

Your account has been successfully created with the ${emailDetails.planName} plan.

Account Details:
• Username: ${userName}
• Email: ${emailDetails.userEmail}
• Plan: ${emailDetails.planName}
• Signup Date: ${emailDetails.signupDate}

Get started:
• View Dashboard: https://quizzicallabz.qzz.io/dashboard
• Access Gen Lab: https://quizzicallabz.qzz.io/generate-quiz
• Start Exam Prep: https://quizzicallabz.qzz.io/exam-prep

© 2025 Quizzicallabz AI. All rights reserved.
  `
});



export const quizResultEmailTemplate = (userName: string, quizData: {
  topic: string;
  score: number;
  total: number;
  percentage: number;
  timeTaken?: number;
  date?: string;
}) => ({
  subject: ` ${userName}, Your ${quizData.topic} Results Are Ready - ${quizData.percentage}% Score`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Quiz Results</title>
      <style>
        body {
          font-family: "Amazon Ember", "Helvetica Neue", Roboto, Arial, sans-serif;
          line-height: 1.6;
          color: #232f3e;
          margin: 0;
          padding: 0;
          background-color: #f7f8fa;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
        }
        .header {
          background: ${quizData.percentage >= 80 ? '#1A237E' : quizData.percentage >= 60 ? '#f6a23b' : '#d13212'};
          padding: 32px 40px;
          text-align: center;
          color: white;
        }
        .score-display {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .header-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .header-subtitle {
          font-size: 16px;
          opacity: 0.9;
        }
        @media only screen and (max-width: 600px) {
          .email-container {
            width: 100% !important;
            margin: 0 !important;
          }
          .header {
            padding: 20px !important;
          }
          .content {
            padding: 20px !important;
          }
          .results-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .result-card {
            padding: 16px !important;
          }
          .action-section {
            padding: 20px !important;
          }
          .action-buttons {
            flex-direction: column !important;
          }
          .cta-button {
            width: 100% !important;
            box-sizing: border-box !important;
            margin-bottom: 8px !important;
          }
          .study-tip {
            padding: 16px !important;
            margin: 20px 0 !important;
          }
          .ai-insights {
            padding: 16px !important;
            margin: 16px 0 !important;
          }
        }
        .content {
          padding: 40px;
        }
        .congratulations {
          text-align: center;
          margin-bottom: 32px;
        }
        .congrats-title {
          font-size: 24px;
          font-weight: 700;
          color: #232f3e;
          margin-bottom: 8px;
        }
        .performance-badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          ${quizData.percentage >= 90 ? 'background: #f0f3fb; color: #1A237E;' :
            quizData.percentage >= 80 ? 'background: #f0f3fb; color: #1A237E;' :
            quizData.percentage >= 70 ? 'background: #fff3e0; color: #f6a23b;' :
            quizData.percentage >= 60 ? 'background: #fff3e0; color: #f6a23b;' :
            'background: #f8d7da; color: #721c24;'}
        }
        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          margin: 32px 0;
        }
        .result-card {
          background: #f7f8fa;
          padding: 24px;
          text-align: center;
          border-radius: 4px;
        }
        .result-number {
          font-size: 32px;
          font-weight: 700;
          color: #232f3e;
          display: block;
        }
        .result-label {
          font-size: 14px;
          color: #5a6c7d;
          margin-top: 4px;
        }
        .action-section {
          background: #f7f8fa;
          padding: 32px;
          text-align: center;
          margin: 32px 0;
          border-radius: 4px;
        }
        .action-title {
          font-size: 18px;
          font-weight: 600;
          color: #232f3e;
          margin-bottom: 16px;
        }
        .action-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .cta-button {
          background: #f6a23b;
          color: #ffffff;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 600;
          font-size: 14px;
          display: inline-block;
        }
        .cta-button.secondary {
          background: #1A237E;
        }
        .study-tip {
          background: ${quizData.percentage < 80 ? '#fff3e0' : '#f0f3fb'};
          border-left: 4px solid ${quizData.percentage < 80 ? '#f6a23b' : '#1A237E'};
          padding: 20px;
          margin: 32px 0;
          border-radius: 4px;
        }
        .study-tip h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          color: ${quizData.percentage < 80 ? '#f6a23b' : '#1A237E'};
        }
        .study-tip p {
          margin: 0;
          font-size: 14px;
          color: ${quizData.percentage < 80 ? '#f6a23b' : '#1A237E'};
        }
        .ai-insights {
          background: linear-gradient(135deg, #f0f3fb 0%, #ffffff 100%);
          border: 2px solid #1A237E;
          border-radius: 12px;
          padding: 24px;
          margin: 24px 0;
          text-align: left;
        }
        .ai-insights h3 {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1A237E;
        }
        .insight-text {
          font-size: 15px;
          line-height: 1.6;
          color: #232f3e;
          background: rgba(26, 35, 126, 0.05);
          padding: 16px;
          border-radius: 8px;
          border-left: 4px solid #f6a23b;
        }
        .footer {
          background: #232f3e;
          color: #aab7b8;
          padding: 32px 40px;
          text-align: center;
          font-size: 14px;
        }
        .footer a {
          color: #f6a23b;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="score-display">${quizData.percentage}%</div>
          <div class="header-title">Quiz Complete!</div>
          <div class="header-subtitle">${quizData.topic} • ${new Date().toLocaleDateString()}</div>
        </div>
        
        <div class="content">
          <div class="congratulations">
            <h2 class="congrats-title">Hello ${userName}, here's your detailed performance analysis!</h2>
            <div class="performance-badge">
              ${quizData.percentage >= 90 ? 'Outstanding! You\'re in the top 10%' :
                quizData.percentage >= 80 ? 'Excellent work! Above average performance' :
                quizData.percentage >= 70 ? 'Good job! Solid understanding shown' :
                quizData.percentage >= 60 ? 'Making progress! Keep building momentum' :
                'Learning opportunity! Every expert was once a beginner'}
            </div>
            
            <div class="ai-insights">
              <h3>AI Performance Insights</h3>
              <div class="insight-text">
                ${quizData.percentage >= 90 ?
                  `Exceptional performance, ${userName}! Your mastery of ${quizData.topic} is impressive. Consider exploring advanced topics or helping others learn.` :
                  quizData.percentage >= 80 ?
                  `Strong performance! You've demonstrated good understanding of ${quizData.topic}. Focus on the areas you missed to reach mastery level.` :
                  quizData.percentage >= 70 ?
                  `You're on the right track! Your ${quizData.percentage}% score shows solid foundation in ${quizData.topic}. Review incorrect answers and practice similar questions.` :
                  quizData.percentage >= 60 ?
                  `Good effort! You've grasped the basics of ${quizData.topic}. Spend more time on fundamentals and try active recall techniques.` :
                  `Don't worry, ${userName}! Learning is a journey. Focus on understanding concepts rather than memorizing. Break down ${quizData.topic} into smaller topics and practice regularly.`}
              </div>
            </div>
          </div>
          
          <div class="results-grid">
            <div class="result-card">
              <span class="result-number">${quizData.score}/${quizData.total}</span>
              <div class="result-label">Correct Answers</div>
            </div>
            <div class="result-card">
              <span class="result-number">${quizData.percentage}%</span>
              <div class="result-label">Final Score</div>
            </div>
            ${quizData.timeTaken ? `
            <div class="result-card">
              <span class="result-number">${Math.floor(quizData.timeTaken / 60)}:${String(quizData.timeTaken % 60).padStart(2, '0')}</span>
              <div class="result-label">Time Taken</div>
            </div>
            ` : ''}
          </div>
          
          <div class="action-section">
            <div class="action-title">Continue Your Learning Journey</div>
            <p style="margin: 0 0 20px 0; color: #5a6c7d;">Choose your next step to accelerate your progress</p>
            <div class="action-buttons">
              <a href="https://quizzicallabz.qzz.io/dashboard" class="cta-button"> View Analytics</a>
              <a href="https://quizzicallabz.qzz.io/generate-quiz" class="cta-button secondary"> New Quiz</a>
              <a href="https://quizzicallabz.qzz.io/generate-study-guide" class="cta-button"> Study Guide</a>
              <a href="https://quizzicallabz.qzz.io/quiz-arena" class="cta-button secondary"> Quiz Arena</a>
            </div>
          </div>
          
          <div class="study-tip">
            <h4>${quizData.percentage >= 80 ? 'Keep the momentum going! Study Recommendation' : 'Study Recommendation'}</h4>
            <p>${quizData.percentage >= 80 ? 
              'Excellent performance! Consider challenging yourself with more advanced topics.' : 
              'Focus on reviewing the questions you missed. Try generating flashcards for better retention.'}</p>
          </div>
        </div>
        
        <div class="footer">
          <div style="margin-bottom: 20px;">
            <a href="https://quizzicallabz.qzz.io/dashboard" style="color: #f6a23b; text-decoration: none; margin: 0 15px;">📊 Dashboard</a>
            <a href="https://quizzicallabz.qzz.io/review" style="color: #f6a23b; text-decoration: none; margin: 0 15px;">📝 Review Answers</a>
            <a href="https://quizzicallabz.qzz.io/generate-flashcards" style="color: #f6a23b; text-decoration: none; margin: 0 15px;">🃏 Flashcards</a>
            <a href="https://quizzicallabz.qzz.io/bookmarks" style="color: #f6a23b; text-decoration: none; margin: 0 15px;">🔖 Bookmarks</a>
          </div>
          <p style="margin: 10px 0;">Keep learning with Quizzicallabzᴬᴵ • <a href="https://quizzicallabz.qzz.io/how-to-use">Need Help?</a></p>
          <p style="margin: 10px 0; font-size: 12px; color: #aab7b8;">
            AI-Powered Learning • Personalized for You • Built for Success
          </p>
          <p style="margin: 10px 0; font-size: 12px;">© ${new Date().getFullYear()} Quizzicallabzᴬᴵ. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,  text: `

Quiz Results: ${quizData.topic}

Great work, ${userName}!

Performance: ${quizData.percentage >= 90 ? 'Excellent' :
              quizData.percentage >= 80 ? 'Great' :
              quizData.percentage >= 70 ? 'Good' :
              quizData.percentage >= 60 ? 'Fair' : 'Needs Improvement'}

Results:
• Score: ${quizData.score}/${quizData.total} (${quizData.percentage}%)
${quizData.timeTaken ? `• Time: ${Math.floor(quizData.timeTaken / 60)}:${String(quizData.timeTaken % 60).padStart(2, '0')}` : ''}
• Date: ${quizData.date || new Date().toLocaleDateString()}

${quizData.percentage >= 80 ? 
  'Excellent performance! Consider challenging yourself with more advanced topics.' : 
  'Focus on reviewing the questions you missed. Try generating flashcards for better retention.'}

View Dashboard: https://quizzicallabz.qzz.io/dashboard
Take Another Quiz: https://quizzicallabz.qzz.io/generate-quiz

© ${new Date().getFullYear()} Quizzicallabs AI. All rights reserved.
  `
});

export const emailVerificationTemplate = (userName: string, verificationLink: string, continueUrl?: string) => {
  // Ensure the verification link includes continueUrl parameter
  const fullVerificationLink = continueUrl
    ? `${verificationLink}${verificationLink.includes('?') ? '&' : '?'}continueUrl=${encodeURIComponent(continueUrl)}`
    : verificationLink;

  return {
    subject: ` Verify Your Email - Complete Your Quizzicallabzᴬᴵ Registration`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body {
            font-family: "Amazon Ember", "Helvetica Neue", Roboto, Arial, sans-serif;
            line-height: 1.6;
            color: #232f3e;
            margin: 0;
            padding: 0;
            background-color: #f7f8fa;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
          }
        .header {
          background: #1A237E;
          padding: 32px 40px;
          text-align: center;
          color: white;
        }
        .header-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .header-subtitle {
          font-size: 16px;
          opacity: 0.9;
        }
        @media only screen and (max-width: 600px) {
          .email-container {
            width: 100% !important;
            margin: 0 !important;
          }
          .header {
            padding: 20px !important;
          }
          .content {
            padding: 20px !important;
          }
          .results-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .result-card {
            padding: 16px !important;
          }
          .action-section {
            padding: 20px !important;
          }
          .action-buttons {
            flex-direction: column !important;
          }
          .cta-button {
            width: 100% !important;
            box-sizing: border-box !important;
            margin-bottom: 8px !important;
          }
          .study-tip {
            padding: 16px !important;
            margin: 20px 0 !important;
          }
          .ai-insights {
            padding: 16px !important;
            margin: 16px 0 !important;
          }
        }
          .header-subtitle {
            font-size: 16px;
            opacity: 0.9;
          }
          .content {
            padding: 40px;
          }
          .greeting {
            font-size: 20px;
            font-weight: 600;
            color: #232f3e;
            margin-bottom: 16px;
          }
          .main-message {
            font-size: 16px;
            color: #5a6c7d;
            margin-bottom: 32px;
            line-height: 1.6;
          }
          .verification-section {
            background: linear-gradient(135deg, #f0f3fb 0%, #ffffff 100%);
            border: 2px solid #1A237E;
            border-radius: 12px;
            padding: 32px;
            text-align: center;
            margin: 32px 0;
          }
          .verification-title {
            font-size: 18px;
            font-weight: 600;
            color: #1A237E;
            margin-bottom: 16px;
          }
          .verify-button {
            background: #1A237E;
            color: #ffffff;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            display: inline-block;
            margin: 16px 0;
            transition: background 0.3s ease;
          }
          .verify-button:hover {
            background: #0d1b69;
          }
          .continue-section {
            background: linear-gradient(135deg, #d1fae5 0%, #ffffff 100%);
            border: 2px solid #10b981;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            margin: 32px 0;
          }
          .continue-title {
            font-size: 16px;
            font-weight: 600;
            color: #065f46;
            margin-bottom: 12px;
          }
          .continue-button {
            background: #10b981;
            color: #ffffff;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 15px;
            display: inline-block;
            margin: 12px 0;
            transition: background 0.3s ease;
          }
          .continue-button:hover {
            background: #059669;
          }
          .security-note {
            background: #fff3e0;
            border-left: 4px solid #f6a23b;
            padding: 20px;
            margin: 32px 0;
            border-radius: 4px;
          }
          .security-note h4 {
            margin: 0 0 8px 0;
            font-size: 16px;
            font-weight: 600;
            color: #f6a23b;
          }
          .security-note p {
            margin: 0;
            font-size: 14px;
            color: #232f3e;
          }
          .footer {
            background: #232f3e;
            color: #aab7b8;
            padding: 32px 40px;
            text-align: center;
            font-size: 14px;
          }
          .footer a {
            color: #f6a23b;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="header-icon"></div>
            <div class="header-title">Verify Your Email</div>
            <div class="header-subtitle">One more step to unlock your AI learning journey</div>
          </div>

          <div class="content">
            <div class="greeting">Hello ${userName}!</div>
            <div class="main-message">
              Welcome to Quizzicallabzᴬᴵ! To complete your registration and start your AI-powered learning journey,
              please verify your email address by clicking the button below.
            </div>

            <div class="verification-section">
              <div class="verification-title"> Activate Your Account</div>
              <p style="margin: 0 0 20px 0; color: #5a6c7d;">Click the button below to verify your email and unlock all features</p>
              <a href="${fullVerificationLink}" class="verify-button">
                ✅ Verify My Email Address
              </a>
              <p style="margin: 20px 0 0 0; font-size: 12px; color: #5a6c7d;">
                This link will expire in 24 hours for security reasons
              </p>
            </div>

            ${continueUrl ? `
            <div class="continue-section">
              <div class="continue-title"> After Verification</div>
              <p style="margin: 0 0 16px 0; color: #065f46; font-size: 14px;">
                Once verified, you'll be automatically redirected to continue your learning journey!
              </p>
              <a href="${continueUrl}" class="continue-button">
                 Continue to Dashboard
              </a>
            </div>
            ` : ''}

            <div class="security-note">
              <h4> Security Notice</h4>
              <p>
                If you didn't create an account with Quizzicallabzᴬᴵ, please ignore this email.
                Your email address will not be added to our system without verification.
              </p>
            </div>

            <div style="margin: 32px 0; padding: 20px; background: #f7f8fa; border-radius: 8px;">
              <h4 style="margin: 0 0 12px 0; color: #232f3e;">Having trouble with the button?</h4>
              <p style="margin: 0; font-size: 14px; color: #5a6c7d;">
                Copy and paste this link into your browser:<br>
                <a href="${fullVerificationLink}" style="color: #1A237E; word-break: break-all;">${fullVerificationLink}</a>
              </p>
            </div>
          </div>

          <div class="footer">
            <p style="margin: 10px 0;">Need help? Contact us at <a href="mailto:support@quizzicallabz.qzz.io">support@quizzicallabz.qzz.io</a></p>
            <p style="margin: 10px 0; font-size: 12px;">
              Quizzicallabzᴬᴵ - Intelligent Learning Platform<br>
              Secure • Trusted • AI-Powered
            </p>
            <p style="margin: 10px 0; font-size: 12px;">© ${new Date().getFullYear()} Quizzicallabzᴬᴵ. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Verify Your Email - Quizzicallabzᴬᴵ

Hello ${userName}!

Welcome to Quizzicallabzᴬᴵ! To complete your registration and start your AI-powered learning journey, please verify your email address.

Verification Link: ${fullVerificationLink}

${continueUrl ? `After verification, you'll be redirected to: ${continueUrl}` : ''}

This link will expire in 24 hours for security reasons.

If you didn't create an account with Quizzicallabzᴬᴵ, please ignore this email.

Having trouble? Contact us at support@quizzicallabz.qzz.io

© ${new Date().getFullYear()} Quizzicallabzᴬᴵ. All rights reserved.
    `
  };
};

export const passwordResetEmailTemplate = (userName: string, resetLink: string) => ({
  subject: ` Reset Your Quizzicallabzᴬᴵ Password - Secure Access Restoration`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: "Amazon Ember", "Helvetica Neue", Roboto, Arial, sans-serif;
          line-height: 1.6;
          color: #232f3e;
          margin: 0;
          padding: 0;
          background-color: #f7f8fa;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
        }
        .header {
          background: #d13212;
          padding: 32px 40px;
          text-align: center;
          color: white;
        }
        .header-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        .header-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .header-subtitle {
          font-size: 16px;
          opacity: 0.9;
        }
        .content {
          padding: 40px;
        }
        .greeting {
          font-size: 20px;
          font-weight: 600;
          color: #232f3e;
          margin-bottom: 16px;
        }
        .main-message {
          font-size: 16px;
          color: #5a6c7d;
          margin-bottom: 32px;
          line-height: 1.6;
        }
        .reset-section {
          background: linear-gradient(135deg, #fff3e0 0%, #ffffff 100%);
          border: 2px solid #d13212;
          border-radius: 12px;
          padding: 32px;
          text-align: center;
          margin: 32px 0;
        }
        .reset-title {
          font-size: 18px;
          font-weight: 600;
          color: #d13212;
          margin-bottom: 16px;
        }
        .reset-button {
          background: #d13212;
          color: #ffffff;
          padding: 16px 32px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          display: inline-block;
          margin: 16px 0;
          transition: background 0.3s ease;
        }
        .reset-button:hover {
          background: #b12a0c;
        }
        .security-warning {
          background: #fff3cd;
          border-left: 4px solid #f6a23b;
          padding: 20px;
          margin: 32px 0;
          border-radius: 4px;
        }
        .security-warning h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          color: #f6a23b;
        }
        .security-warning p {
          margin: 0;
          font-size: 14px;
          color: #232f3e;
        }
        .footer {
          background: #232f3e;
          color: #aab7b8;
          padding: 32px 40px;
          text-align: center;
          font-size: 14px;
        }
        .footer a {
          color: #f6a23b;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="header-icon"></div>
          <div class="header-title">Password Reset Request</div>
          <div class="header-subtitle">Secure your Quizzicallabzᴬᴵ account</div>
        </div>
        
        <div class="content">
          <div class="greeting">Hello ${userName}!</div>
          <div class="main-message">
            We received a request to reset your password for your Quizzicallabzᴬᴵ account. 
            If you made this request, click the button below to create a new password.
          </div>
          
          <div class="reset-section">
            <div class="reset-title"> Reset Your Password</div>
            <p style="margin: 0 0 20px 0; color: #5a6c7d;">Click the button below to set a new password</p>
            <a href="${resetLink}" class="reset-button">
               Reset Password
            </a>
            <p style="margin: 20px 0 0 0; font-size: 12px; color: #5a6c7d;">
              This link will expire in 1 hour for security reasons
            </p>
          </div>
          
          <div class="security-warning">
            <h4> Security Notice</h4>
            <p>
              If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
              For security, consider changing your password if you suspect unauthorized access.
            </p>
          </div>
          
          <div style="margin: 32px 0; padding: 20px; background: #f7f8fa; border-radius: 8px;">
            <h4 style="margin: 0 0 12px 0; color: #232f3e;">Can't click the button?</h4>
            <p style="margin: 0; font-size: 14px; color: #5a6c7d;">
              Copy and paste this link into your browser:<br>
              <a href="${resetLink}" style="color: #d13212; word-break: break-all;">${resetLink}</a>
            </p>
          </div>
        </div>
        
        <div class="footer">
          <p style="margin: 10px 0;">Need help? Contact us at <a href="mailto:support@quizzicallabz.qzz.io">support@quizzicallabz.qzz.io</a></p>
          <p style="margin: 10px 0; font-size: 12px;">
            Quizzicallabzᴬᴵ Security Team<br>
            This is an automated security email
          </p>
          <p style="margin: 10px 0; font-size: 12px;">© ${new Date().getFullYear()} Quizzicallabzᴬᴵ. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `
Password Reset Request - Quizzicallabzᴬᴵ

Hello ${userName}!

We received a request to reset your password for your Quizzicallabzᴬᴵ account.

Reset Link: ${resetLink}

This link will expire in 1 hour for security reasons.

If you didn't request a password reset, please ignore this email.

Need help? Contact us at support@quizzicallabz.qzz.io

© ${new Date().getFullYear()} Quizzicallabzᴬᴵ. All rights reserved.
  `
});



export const studyReminderEmailTemplate = (userName: string) => ({
  subject: ` ${userName}, your AI learning session awaits - Let's boost your knowledge!`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Study Reminder</title>
      <style>
        body {
          font-family: "Amazon Ember", "Helvetica Neue", Roboto, Arial, sans-serif;
          line-height: 1.6;
          color: #232f3e;
          margin: 0;
          padding: 0;
          background-color: #f7f8fa;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
        }
        .header {
          background: #8b5cf6;
          padding: 32px 40px;
          text-align: center;
          color: white;
        }
        .header-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        .header-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .header-subtitle {
          font-size: 16px;
          opacity: 0.9;
        }
        .content {
          padding: 40px;
        }
        .greeting {
          font-size: 18px;
          font-weight: 600;
          color: #232f3e;
          margin-bottom: 16px;
        }
        .main-message {
          font-size: 16px;
          color: #5a6c7d;
          margin-bottom: 32px;
        }
        .quote-section {
          background: #f0f9ff;
          border-left: 4px solid #0ea5e9;
          padding: 20px;
          margin: 32px 0;
          border-radius: 4px;
        }
        .quote-text {
          font-style: italic;
          color: #0c4a6e;
          font-size: 16px;
          margin-bottom: 8px;
        }
        .quote-author {
          color: #0369a1;
          font-size: 14px;
          font-weight: 600;
        }
        .activities-section {
          margin: 32px 0;
        }
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #232f3e;
          margin-bottom: 20px;
        }
        .activity-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
        }
        .activity-card {
          background: #f7f8fa;
          padding: 24px;
          text-align: center;
          border-radius: 4px;
          border: 1px solid #e9ecef;
        }
        .activity-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }
        .activity-title {
          font-size: 16px;
          font-weight: 600;
          color: #232f3e;
          margin-bottom: 8px;
        }
        .activity-description {
          font-size: 14px;
          color: #5a6c7d;
        }
        .cta-section {
          background: #8b5cf6;
          padding: 32px;
          text-align: center;
          margin: 32px 0;
          border-radius: 4px;
          color: white;
        }
        .cta-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 16px;
        }
        .action-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .cta-button {
          background: #ffffff;
          color: #8b5cf6;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 600;
          font-size: 14px;
          display: inline-block;
        }
        .cta-button.secondary {
          background: transparent;
          color: #ffffff;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }
        .tips-section {
          background: #d1fae5;
          border-left: 4px solid #10b981;
          padding: 24px;
          margin: 32px 0;
          border-radius: 4px;
        }
        .tips-title {
          font-size: 16px;
          font-weight: 600;
          color: #065f46;
          margin-bottom: 12px;
        }
        .tips-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .tips-list li {
          color: #065f46;
          margin-bottom: 8px;
          padding-left: 20px;
          position: relative;
          font-size: 14px;
        }
        .tips-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: bold;
        }
        .ai-recommendation {
          background: linear-gradient(135deg, #f0f3fb 0%, #ffffff 100%);
          border: 2px solid #8b5cf6;
          border-radius: 12px;
          padding: 20px;
          margin: 24px 0;
        }
        .ai-recommendation h3 {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 600;
          color: #8b5cf6;
        }
        .ai-recommendation p {
          margin: 0;
          font-size: 14px;
          color: #232f3e;
          line-height: 1.5;
        }
        .footer {
          background: #232f3e;
          color: #aab7b8;
          padding: 32px 40px;
          text-align: center;
          font-size: 14px;
        }
        .footer a {
          color: #f6a23b;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="header-icon"></div>
          <div class="header-title">Hello ${userName}!</div>
          <div class="header-subtitle">Your personalized AI learning session is ready</div>
        </div>
        
        <div class="content">
          <div class="greeting">Ready to level up your knowledge, ${userName}?</div>
          <div class="main-message">
            Your AI-powered learning session is ready! Our research shows that students who maintain consistent study habits with Quizzicallabzᴬᴵ improve their performance by 40% faster than traditional methods.
          </div>
          
          <div class="ai-recommendation">
            <h3>AI Recommendation for You</h3>
            <p>Based on your learning patterns, we suggest a 15-20 minute focused session today. This optimal duration maximizes retention while preventing cognitive overload.</p>
          </div>
          
          <div class="quote-section">
            <div class="quote-text">"Success is the sum of small efforts repeated day in and day out."</div>
            <div class="quote-author">— Robert Collier</div>
          </div>
          
          <div class="activities-section">
            <div class="section-title">Choose your learning activity</div>
            <div class="activity-grid">
              <div class="activity-card">
                <div class="activity-icon"></div>
                <div class="activity-title">Take a Quiz</div>
                <div class="activity-description">Test your knowledge on any topic</div>
              </div>
              <div class="activity-card">
                <div class="activity-icon"></div>
                <div class="activity-title">Review Flashcards</div>
                <div class="activity-description">Reinforce key concepts</div>
              </div>
              <div class="activity-card">
                <div class="activity-icon"></div>
                <div class="activity-title">Check Progress</div>
                <div class="activity-description">See your learning analytics</div>
              </div>
            </div>
          </div>
          
          <div class="cta-section">
            <div class="cta-title">Choose Your Learning Path</div>
            <div class="action-buttons">
              <a href="https://quizzicallabz.qzz.io/generate-quiz" class="cta-button"> Quick Quiz</a>
              <a href="https://quizzicallabz.qzz.io/dashboard" class="cta-button secondary"> Dashboard</a>
              <a href="https://quizzicallabz.qzz.io/quiz-arena" class="cta-button"> Challenge Friends</a>
              <a href="https://quizzicallabz.qzz.io/review" class="cta-button secondary"> Review Mode</a>
            </div>
          </div>
          
          <div class="tips-section">
            <div class="tips-title"> Study Streak Tips</div>
            <ul class="tips-list">
              <li>Set a consistent time each day for studying</li>
              <li>Start with 15-20 minute focused sessions</li>
              <li>Focus on one subject at a time</li>
              <li>Use active recall techniques like quizzing</li>
              <li>Celebrate your daily learning wins</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <div style="margin-bottom: 20px;">
            <a href="https://quizzicallabz.qzz.io/generate-quiz" style="color: #f6a23b; text-decoration: none; margin: 0 15px;">Start Quiz</a>
            <a href="https://quizzicallabz.qzz.io/dashboard" style="color: #f6a23b; text-decoration: none; margin: 0 15px;">Progress</a>
            <a href="https://quizzicallabz.qzz.io/profile" style="color: #f6a23b; text-decoration: none; margin: 0 15px;">Settings</a>
            <a href="https://quizzicallabz.qzz.io/how-to-use" style="color: #f6a23b; text-decoration: none; margin: 0 15px;">❓ Help</a>
          </div>
          <p style="margin: 10px 0;">Your success is our mission • <a href="mailto:support@quizzicallabz.qzz.io">Contact Support</a></p>
          <p style="margin: 10px 0; font-size: 12px; color: #aab7b8;">
            Quizzicallabzᴬᴵ • Smart Learning • Proven Results
          </p>
          <p style="margin: 10px 0; font-size: 12px;">© ${new Date().getFullYear()} Quizzicallabzᴬᴵ. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `
Study Time, ${userName}

Hello ${userName}!

It's time for your daily learning session. Research shows that consistent, focused study sessions lead to better retention and academic success.

"Success is the sum of small efforts repeated day in and day out." — Robert Collier

Choose your learning activity:
• Take a Quiz - Test your knowledge on any topic
• Review Flashcards - Reinforce key concepts  
• Check Progress - See your learning analytics

Ready to learn?
Start Studying: https://quizzicallabz.qzz.io/generate-quiz
View Dashboard: https://quizzicallabz.qzz.io/dashboard

Study Streak Tips:
✓ Set a consistent time each day for studying
✓ Start with 15-20 minute focused sessions
✓ Focus on one subject at a time
✓ Use active recall techniques like quizzing
✓ Celebrate your daily learning wins

Keep learning, keep growing.

© ${new Date().getFullYear()} Quizzicallabs AI. All rights reserved.
  `
});
