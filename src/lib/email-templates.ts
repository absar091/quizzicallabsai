// Complete Email Templates with Mobile-Optimized Footer

export const quizResultEmailTemplate = (userName: string, quizData: {
  quizTitle: string;
  score: string | number;
  correct: string;
  incorrect: string;
  date: string;
}) => ({
  subject: `Your Quiz Results Are Ready - ${userName}`,
  html: `
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Quiz Results</title>
      <!--[if mso]>
      <style type="text/css">
        table {border-collapse: collapse;}
      </style>
      <![endif]-->
      <style>
        @media only screen and (max-width: 600px) {
          .mobile-padding { padding: 15px !important; }
          .mobile-button { display: block !important; width: 90% !important; margin: 10px auto !important; text-align: center !important; box-sizing: border-box !important; }
          .mobile-text { font-size: 14px !important; }
          .logo { width: 80px !important; }
          .button-container { text-align: center !important; }
          .score-badge { font-size: 32px !important; }
        }
        .icon { display: inline-block; width: 16px; height: 16px; vertical-align: middle; margin-right: 6px; }
      </style>
    </head>
    <body style="margin:0;padding:0;background:#f9fafb;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;margin:0 auto;background:#f9fafb;">
        <!-- HEADER START -->
        <tr>
          <td style="padding:20px 30px;background:#ffffff;border-bottom:1px solid #e5e7eb;" class="mobile-padding">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <!-- Logo -->
                <td align="left">
                  <a href="https://quizzicallabz.qzz.io?utm_source=email&utm_medium=quiz_results&utm_campaign=engagement" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">
                    <img src="https://iili.io/K1oSsrx.png" alt="Quizzicallabz AI Logo" width="120" style="display:block;max-width:120px;height:auto;" class="logo">
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
          <td style="padding:30px;color:#333;font-size:15px;line-height:1.7;" class="mobile-padding">
            <h2 style="margin-top:0;margin-bottom:15px;font-size:20px;color:#111;font-weight:600;">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
              </svg>
              Your Quiz Results Are Ready
            </h2>
            <p style="margin:0 0 20px;">Hello <strong>${userName}</strong>,</p>
            <p style="margin:0 0 20px;">
              Here are the results of your recent quiz attempt:
            </p>

            <!-- Score Badge -->
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:20px;">
              <tr>
                <td align="center" style="padding:20px;">
                  <div style="display:inline-block;width:100px;height:100px;border-radius:50%;background:${Number(quizData.score) >= 80 ? '#10b981' : Number(quizData.score) >= 60 ? '#f59e0b' : '#ef4444'};color:#fff;line-height:100px;font-size:36px;font-weight:bold;" class="score-badge">
                    ${quizData.score}%
                  </div>
                  ${Number(quizData.score) >= 80 ? '<p style="margin:10px 0 0;color:#10b981;font-weight:600;">🎉 Excellent Performance!</p>' : Number(quizData.score) >= 60 ? '<p style="margin:10px 0 0;color:#f59e0b;font-weight:600;">👍 Good Job!</p>' : '<p style="margin:10px 0 0;color:#ef4444;font-weight:600;">💪 Keep Practicing!</p>'}
                </td>
              </tr>
            </table>

            <!-- Info Card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;border-radius:6px;margin-bottom:20px;">
              <tr><td style="padding:15px;">
                <p style="margin:0 0 8px;font-size:14px;">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  <strong>Quiz Title:</strong> ${quizData.quizTitle}
                </p>
                <p style="margin:0 0 8px;font-size:14px;">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <strong>Correct:</strong> ${quizData.correct}
                </p>
                <p style="margin:0 0 8px;font-size:14px;">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  <strong>Incorrect:</strong> ${quizData.incorrect}
                </p>
                <p style="margin:0;font-size:14px;">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <strong>Date:</strong> ${quizData.date}
                </p>
              </td></tr>
            </table>

            <!-- Buttons -->
            <div class="button-container" style="text-align:left;">
              <a href="https://quizzicallabz.qzz.io/review?utm_source=email&utm_medium=quiz_results&utm_campaign=engagement" target="_blank" rel="noopener noreferrer" style="background:#4f46e5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;margin-right:10px;margin-bottom:10px;" class="mobile-button">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Review Answers
              </a>
              <a href="https://quizzicallabz.qzz.io/practice?utm_source=email&utm_medium=quiz_results&utm_campaign=engagement" target="_blank" rel="noopener noreferrer" style="border:1px solid #4f46e5;color:#4f46e5;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;" class="mobile-button">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Practice Weak Areas
              </a>
            </div>
          </td>
        </tr>

        <!-- FOOTER START -->
        <tr>
          <td style="padding:20px 15px;background:#f9fafb;color:#6b7280;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.4;text-align:center;border-top:1px solid #e5e7eb;">

            <!-- System Generated Notice -->
            <p style="margin:0 0 12px;font-size:10px;color:#9ca3af;">
              ⚙️ This is a system-generated email. Please do not reply to this message.
            </p>

            <!-- Legal & Branding -->
            <p style="margin:0 0 8px;font-size:11px;">
              © 2025 <strong>Quizzicallabzᴬᴵ</strong>. All rights reserved.<br>
              <em style="font-size:10px;">Quizzicallabzᴬᴵ and its logo are trademarks of Quizzicallabz™.</em>
            </p>

            <!-- Links -->
            <p style="margin:0 0 8px;font-size:11px;">
              <a href="https://quizzicallabz.qzz.io/privacy-policy" style="color:#4f46e5;text-decoration:none;" rel="noopener noreferrer" target="_blank">Privacy Policy</a> ·
              <a href="https://quizzicallabz.qzz.io/terms-of-use" style="color:#4f46e5;text-decoration:none;" rel="noopener noreferrer" target="_blank">Terms of Use</a> ·
              <a href="https://quizzicallabz.qzz.io/disclaimer" style="color:#4f46e5;text-decoration:none;" rel="noopener noreferrer" target="_blank">Disclaimer</a>
            </p>

            <!-- Contact Info -->
            <p style="margin:0 0 8px;font-size:10px;">
              Vehari, Punjab, Pakistan<br>
              <a href="mailto:support@quizzicallabz.qzz.io" style="color:#4f46e5;text-decoration:none;">support@quizzicallabz.qzz.io</a> ·
              <a href="mailto:info@quizzicallabz.qzz.io" style="color:#4f46e5;text-decoration:none;">info@quizzicallabz.qzz.io</a>
            </p>

            <!-- Unsubscribe Link -->
            <p style="margin:0;font-size:10px;">
              <a href="https://quizzicallabz.qzz.io/unsubscribe" style="color:#9ca3af;text-decoration:underline;" rel="noopener noreferrer" target="_blank">Unsubscribe from these emails</a>
            </p>
          </td>
        </tr>
        <!-- FOOTER END -->
      </table>
    </body>
    </html>
  `,
  text: `Your Quiz Results Are Ready

Hello ${userName},

Here are the results of your recent quiz attempt:

Quiz Title: ${quizData.quizTitle}
Score: ${quizData.score}%
Correct: ${quizData.correct}
Incorrect: ${quizData.incorrect}
Date: ${quizData.date}

Review Answers: https://quizzicallabz.qzz.io/review
Practice Weak Areas: https://quizzicallabz.qzz.io/practice

© 2025 Quizzicallabzᴬᴵ. All rights reserved.`
});

export const welcomeEmailTemplate = (userName: string, emailDetails: {
  userEmail: string;
  planName: string;
  signupDate: string;
}) => ({
  subject: `Welcome to Quizzicallabzᴬᴵ - ${userName}`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome</title>
      <style>
        @media only screen and (max-width: 600px) {
          .mobile-padding { padding: 15px !important; }
          .mobile-button { display: block !important; width: 90% !important; margin: 10px auto !important; text-align: center !important; box-sizing: border-box !important; }
          .mobile-text { font-size: 14px !important; }
          .logo { width: 100px !important; }
          .button-container { text-align: center !important; }
        }
      </style>
    </head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f9fafb;">
        <!-- HEADER START -->
        <tr>
          <td style="padding:20px 30px;background:#ffffff;border-bottom:1px solid #e5e7eb;" class="mobile-padding">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <!-- Logo -->
                <td align="left">
                  <a href="https://quizzicallabz.qzz.io" target="_blank" style="text-decoration:none;">
                    <img src="https://iili.io/K1oSsrx.png" alt="Quizzicallabzᴬᴵ" width="120" style="display:block;max-width:120px;height:auto;" class="logo">
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
          <td style="padding:30px;color:#333;font-size:15px;line-height:1.7;" class="mobile-padding">
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
            <div class="button-container" style="text-align:left;">
              <a href="https://quizzicallabz.qzz.io/dashboard" style="background:#4f46e5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;margin-right:10px;margin-bottom:10px;" class="mobile-button">View Dashboard</a>
              <a href="https://quizzicallabz.qzz.io/generate-quiz" style="border:1px solid #4f46e5;color:#4f46e5;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;margin-right:10px;margin-bottom:10px;" class="mobile-button">Access Gen Lab</a>
              <a href="https://quizzicallabz.qzz.io/exam-prep" style="border:1px solid #4f46e5;color:#4f46e5;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;" class="mobile-button">Start Exam Prep</a>
            </div>
          </td>
        </tr>

        <!-- FOOTER START -->
        <tr>
          <td style="padding:20px 15px;background:#f9fafb;color:#6b7280;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.4;text-align:center;border-top:1px solid #e5e7eb;">
            
            <!-- Legal & Branding -->
            <p style="margin:0 0 8px;font-size:11px;">
              © 2025 <strong>Quizzicallabzᴬᴵ</strong>. All rights reserved.<br>
              <em style="font-size:10px;">Quizzicallabzᴬᴵ and its logo are products of Quizzicallabz™.</em>
            </p>
            
            <!-- Links -->
            <p style="margin:0 0 8px;font-size:11px;">
              <a href="https://quizzicallabz.qzz.io/privacy-policy" style="color:#4f46e5;text-decoration:none;">Privacy Policy</a><br>
              <a href="https://quizzicallabz.qzz.io/terms-of-use" style="color:#4f46e5;text-decoration:none;">Terms of Use</a><br>
              <a href="https://quizzicallabz.qzz.io/disclaimer" style="color:#4f46e5;text-decoration:none;">Disclaimer</a>
            </p>

            <!-- Contact Info -->
            <p style="margin:0;font-size:10px;">
              Vehari, Punjab, Pakistan<br>
              <a href="mailto:support@quizzicallabz.qzz.io" style="color:#4f46e5;text-decoration:none;">support@quizzicallabz.qzz.io</a><br>
              <a href="mailto:info@quizzicallabz.qzz.io" style="color:#4f46e5;text-decoration:none;">info@quizzicallabz.qzz.io</a>
            </p>
          </td>
        </tr>
        <!-- FOOTER END -->
      </table>
    </body>
    </html>
  `,
  text: `Welcome to Quizzicallabzᴬᴵ

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

© 2025 Quizzicallabzᴬᴵ. All rights reserved.`
});

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
        @media only screen and (max-width: 600px) {
          .mobile-padding { padding: 15px !important; }
          .mobile-button { display: block !important; width: 90% !important; margin: 10px auto !important; text-align: center !important; box-sizing: border-box !important; }
          .mobile-text { font-size: 14px !important; }
          .logo { width: 100px !important; }
          .button-container { text-align: center !important; }
        }
      </style>
    </head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f9fafb;">
        <!-- HEADER START -->
        <tr>
          <td style="padding:20px 30px;background:#ffffff;border-bottom:1px solid #e5e7eb;" class="mobile-padding">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <!-- Logo -->
                <td align="left">
                  <a href="https://quizzicallabz.qzz.io" target="_blank" style="text-decoration:none;">
                    <img src="https://iili.io/K1oSsrx.png" alt="Quizzicallabzᴬᴵ" width="120" style="display:block;max-width:120px;height:auto;" class="logo">
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
          <td style="padding:30px;color:#333;font-size:15px;line-height:1.7;" class="mobile-padding">
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
            <div class="button-container" style="text-align:left;">
              <a href="https://quizzicallabz.qzz.io/reset-password" style="background:#4f46e5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;margin-right:10px;margin-bottom:10px;" class="mobile-button">Change Password</a>
              <a href="https://quizzicallabz.qzz.io/profile" style="border:1px solid #4f46e5;color:#4f46e5;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;" class="mobile-button">Review Activity</a>
            </div>
          </td>
        </tr>

        <!-- FOOTER START -->
        <tr>
          <td style="padding:20px 15px;background:#f9fafb;color:#6b7280;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.4;text-align:center;border-top:1px solid #e5e7eb;">
            
            <!-- Legal & Branding -->
            <p style="margin:0 0 8px;font-size:11px;">
              © 2025 <strong>Quizzicallabzᴬᴵ</strong>. All rights reserved.<br>
              <em style="font-size:10px;">Quizzicallabzᴬᴵ and its logo are products of Quizzicallabz™.</em>
            </p>
            
            <!-- Links -->
            <p style="margin:0 0 8px;font-size:11px;">
              <a href="https://quizzicallabz.qzz.io/privacy-policy" style="color:#4f46e5;text-decoration:none;">Privacy Policy</a><br>
              <a href="https://quizzicallabz.qzz.io/terms-of-use" style="color:#4f46e5;text-decoration:none;">Terms of Use</a><br>
              <a href="https://quizzicallabz.qzz.io/disclaimer" style="color:#4f46e5;text-decoration:none;">Disclaimer</a>
            </p>

            <!-- Contact Info -->
            <p style="margin:0;font-size:10px;">
              Vehari, Punjab, Pakistan<br>
              <a href="mailto:support@quizzicallabz.qzz.io" style="color:#4f46e5;text-decoration:none;">support@quizzicallabz.qzz.io</a><br>
              <a href="mailto:info@quizzicallabz.qzz.io" style="color:#4f46e5;text-decoration:none;">info@quizzicallabz.qzz.io</a>
            </p>
          </td>
        </tr>
        <!-- FOOTER END -->
      </table>
    </body>
    </html>
  `,
  text: `Security Alert: New Login Detected

Hello ${userName},

A new login was detected on your Quizzicallabzᴬᴵ account. If this was you, no action is required.
If not, please take immediate steps to protect your account.

Device: ${loginData.device}
Location: ${loginData.location}
IP Address: ${loginData.ipAddress}
Time: ${loginData.time}

Change Password: https://quizzicallabz.qzz.io/reset-password
Review Activity: https://quizzicallabz.qzz.io/profile

© 2025 Quizzicallabzᴬᴵ. All rights reserved.`
});

export const studyReminderEmailTemplate = (userName: string, reminderData?: {
  topic?: string;
  weakAreas?: string;
  lastActivityDate?: string;
}) => ({
  subject: `Reminder: Stay on Track with Your Learning - ${userName}`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Study Reminder</title>
      <style>
        @media only screen and (max-width: 600px) {
          .mobile-padding { padding: 15px !important; }
          .mobile-button { display: block !important; width: 90% !important; margin: 10px auto !important; text-align: center !important; box-sizing: border-box !important; }
          .mobile-text { font-size: 14px !important; }
          .logo { width: 100px !important; }
          .button-container { text-align: center !important; }
        }
      </style>
    </head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f9fafb;">
        <!-- HEADER START -->
        <tr>
          <td style="padding:20px 30px;background:#ffffff;border-bottom:1px solid #e5e7eb;" class="mobile-padding">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <!-- Logo -->
                <td align="left">
                  <a href="https://quizzicallabz.qzz.io" target="_blank" style="text-decoration:none;">
                    <img src="https://iili.io/K1oSsrx.png" alt="Quizzicallabzᴬᴵ" width="120" style="display:block;max-width:120px;height:auto;" class="logo">
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
          <td style="padding:30px;color:#333;font-size:15px;line-height:1.7;" class="mobile-padding">
            <h2 style="margin-top:0;margin-bottom:15px;font-size:20px;color:#111;font-weight:600;">
              Reminder: Stay on Track with Your Learning
            </h2>
            <p style="margin:0 0 20px;">Hello <strong>${userName}</strong>,</p>
            <p style="margin:0 0 20px;">
              This is a reminder that you have pending activities in your account.  
              Here are some insights about your performance:
            </p>

            <!-- Info Card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;border-radius:6px;margin-bottom:20px;">
              <tr><td style="padding:15px;">
                <p style="margin:0;font-size:14px;"><strong>Topic:</strong> ${reminderData?.topic || 'General Study'}</p>
                <p style="margin:0;font-size:14px;"><strong>Weak Areas:</strong> ${reminderData?.weakAreas || 'Review recommended'}</p>
                <p style="margin:0;font-size:14px;"><strong>Last Activity:</strong> ${reminderData?.lastActivityDate || 'Recently'}</p>
              </td></tr>
            </table>

            <!-- Motivational Quote -->
            <blockquote style="border-left:4px solid #4f46e5;margin:10px 0;padding:10px;color:#444;font-style:italic;">
              "Success is the sum of small efforts, repeated day in and day out."
            </blockquote>

            <!-- Buttons -->
            <div class="button-container" style="text-align:left;">
              <a href="https://quizzicallabz.qzz.io/generate-quiz" style="background:#4f46e5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;margin-right:10px;margin-bottom:10px;" class="mobile-button">Take Quiz</a>
              <a href="https://quizzicallabz.qzz.io/practice" style="border:1px solid #4f46e5;color:#4f46e5;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;" class="mobile-button">Review Weak Areas</a>
            </div>
          </td>
        </tr>

        <!-- FOOTER START -->
        <tr>
          <td style="padding:20px 15px;background:#f9fafb;color:#6b7280;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.4;text-align:center;border-top:1px solid #e5e7eb;">
            
            <!-- Legal & Branding -->
            <p style="margin:0 0 8px;font-size:11px;">
              © 2025 <strong>Quizzicallabzᴬᴵ</strong>. All rights reserved.<br>
              <em style="font-size:10px;">Quizzicallabzᴬᴵ and its logo are products of Quizzicallabz™.</em>
            </p>
            
            <!-- Links -->
            <p style="margin:0 0 8px;font-size:11px;">
              <a href="https://quizzicallabz.qzz.io/privacy-policy" style="color:#4f46e5;text-decoration:none;">Privacy Policy</a><br>
              <a href="https://quizzicallabz.qzz.io/terms-of-use" style="color:#4f46e5;text-decoration:none;">Terms of Use</a><br>
              <a href="https://quizzicallabz.qzz.io/disclaimer" style="color:#4f46e5;text-decoration:none;">Disclaimer</a>
            </p>

            <!-- Contact Info -->
            <p style="margin:0;font-size:10px;">
              Vehari, Punjab, Pakistan<br>
              <a href="mailto:support@quizzicallabz.qzz.io" style="color:#4f46e5;text-decoration:none;">support@quizzicallabz.qzz.io</a><br>
              <a href="mailto:info@quizzicallabz.qzz.io" style="color:#4f46e5;text-decoration:none;">info@quizzicallabz.qzz.io</a>
            </p>
          </td>
        </tr>
        <!-- FOOTER END -->
      </table>
    </body>
    </html>
  `,
  text: `Reminder: Stay on Track with Your Learning

Hello ${userName},

This is a reminder that you have pending activities in your account.

Topic: ${reminderData?.topic || 'General Study'}
Weak Areas: ${reminderData?.weakAreas || 'Review recommended'}
Last Activity: ${reminderData?.lastActivityDate || 'Recently'}

"Success is the sum of small efforts, repeated day in and day out."

Take Quiz: https://quizzicallabz.qzz.io/generate-quiz
Review Weak Areas: https://quizzicallabz.qzz.io/practice

© 2025 Quizzicallabzᴬᴵ. All rights reserved.`
});