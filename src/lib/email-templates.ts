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
          .score-badge { font-size: 28px !important; width: 80px !important; height: 80px !important; line-height: 80px !important; }
          .welcome-badge, .alert-badge, .reminder-badge { width: 60px !important; height: 60px !important; line-height: 60px !important; font-size: 30px !important; }
          .progress-bar { width: 100% !important; }
        }
        @media (prefers-color-scheme: dark) {
          .dark-bg { background: #1f2937 !important; }
          .dark-text { color: #f9fafb !important; }
          .dark-border { border-color: #374151 !important; }
        }
        .icon { display: inline-block; width: 16px; height: 16px; vertical-align: middle; margin-right: 6px; }
        .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
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

            <!-- Score Badge with Progress Ring -->
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:20px;">
              <tr>
                <td align="center" style="padding:20px;">
                  <div style="position:relative;display:inline-block;">
                    <svg width="120" height="120" style="transform:rotate(-90deg);">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" stroke-width="8"/>
                      <circle cx="60" cy="60" r="50" fill="none" stroke="${Number(quizData.score) >= 80 ? '#10b981' : Number(quizData.score) >= 60 ? '#f59e0b' : '#ef4444'}" stroke-width="8" stroke-dasharray="${Math.PI * 100}" stroke-dashoffset="${Math.PI * 100 * (1 - Number(quizData.score) / 100)}" stroke-linecap="round"/>
                    </svg>
                    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:100px;height:100px;border-radius:50%;background:${Number(quizData.score) >= 80 ? '#10b981' : Number(quizData.score) >= 60 ? '#f59e0b' : '#ef4444'};color:#fff;line-height:100px;font-size:36px;font-weight:bold;text-align:center;box-sizing:border-box;" class="score-badge">
                      ${quizData.score}%
                    </div>
                  </div>
                  ${Number(quizData.score) >= 80 ? '<p style="margin:15px 0 0;color:#10b981;font-weight:600;font-size:16px;">🎉 Excellent Performance!</p>' : Number(quizData.score) >= 60 ? '<p style="margin:15px 0 0;color:#f59e0b;font-weight:600;font-size:16px;">👍 Good Job!</p>' : '<p style="margin:15px 0 0;color:#ef4444;font-weight:600;font-size:16px;">💪 Keep Practicing!</p>'}
                  <div style="margin-top:10px;padding:8px 16px;background:#f3f4f6;border-radius:20px;display:inline-block;font-size:12px;color:#6b7280;">Score: ${quizData.correct}/${Number(quizData.correct) + Number(quizData.incorrect)} questions</div>
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

            <!-- QR Code Section -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:20px;">
              <tr><td style="padding:15px;text-align:center;">
                <p style="margin:0 0 10px;font-size:14px;font-weight:600;color:#475569;">📱 Quick Mobile Access</p>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://quizzicallabz.qzz.io/dashboard?utm_source=email_qr" alt="QR Code" style="width:80px;height:80px;border:2px solid #e2e8f0;border-radius:8px;">
                <p style="margin:10px 0 0;font-size:12px;color:#64748b;">Scan to open on mobile</p>
              </td></tr>
            </table>

            <!-- Calendar Integration -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef3c7;border-left:4px solid #f59e0b;border-radius:6px;margin-bottom:20px;">
              <tr><td style="padding:15px;">
                <p style="margin:0 0 10px;font-size:14px;font-weight:600;color:#92400e;">📅 Schedule Your Next Study Session</p>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                  <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Study+Session+-+${encodeURIComponent(quizData.quizTitle)}&dates=20250115T180000Z/20250115T190000Z&details=Continue+improving+on+${encodeURIComponent(quizData.quizTitle)}+%7C+Current+score:+${quizData.score}%25&location=Quizzicallabz.qzz.io" target="_blank" style="background:#4285f4;color:#fff;text-decoration:none;padding:8px 12px;border-radius:4px;font-size:12px;display:inline-block;">+ Google Calendar</a>
                  <a href="https://outlook.live.com/calendar/0/deeplink/compose?subject=Study+Session+-+${encodeURIComponent(quizData.quizTitle)}&startdt=2025-01-15T18:00:00&enddt=2025-01-15T19:00:00&body=Continue+improving+on+${encodeURIComponent(quizData.quizTitle)}" target="_blank" style="background:#0078d4;color:#fff;text-decoration:none;padding:8px 12px;border-radius:4px;font-size:12px;display:inline-block;">+ Outlook</a>
                </div>
              </td></tr>
            </table>

            <!-- Social Sharing -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9ff;border-left:4px solid #0ea5e9;border-radius:6px;margin-bottom:20px;">
              <tr><td style="padding:15px;">
                <p style="margin:0 0 10px;font-size:14px;font-weight:600;color:#0c4a6e;">🎉 Share Your Achievement</p>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                  <a href="https://twitter.com/intent/tweet?text=Just+scored+${quizData.score}%25+on+${encodeURIComponent(quizData.quizTitle)}+quiz+with+@QuizzicallabzAI!+%F0%9F%8E%AF%0A%0AReady+to+test+your+knowledge?+Try+it+here:&url=https://quizzicallabz.qzz.io" target="_blank" style="background:#1da1f2;color:#fff;text-decoration:none;padding:8px 12px;border-radius:4px;font-size:12px;display:inline-block;">📱 Twitter</a>
                  <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://quizzicallabz.qzz.io&summary=I+just+scored+${quizData.score}%25+on+a+${encodeURIComponent(quizData.quizTitle)}+quiz+using+QuizzicallabzAI!+This+AI-powered+platform+makes+learning+so+much+more+effective." target="_blank" style="background:#0077b5;color:#fff;text-decoration:none;padding:8px 12px;border-radius:4px;font-size:12px;display:inline-block;">💼 LinkedIn</a>
                  <a href="https://wa.me/?text=I+just+scored+${quizData.score}%25+on+a+${encodeURIComponent(quizData.quizTitle)}+quiz!+%F0%9F%8E%AF%0A%0ACheck+out+this+amazing+AI+study+platform:+https://quizzicallabz.qzz.io" target="_blank" style="background:#25d366;color:#fff;text-decoration:none;padding:8px 12px;border-radius:4px;font-size:12px;display:inline-block;">💬 WhatsApp</a>
                </div>
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
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Welcome</title>
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
                  <a href="https://quizzicallabz.qzz.io?utm_source=email&utm_medium=welcome&utm_campaign=onboarding" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">
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
            <!-- Welcome Badge -->
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:20px;">
              <tr>
                <td align="center" style="padding:20px;">
                  <div style="display:inline-block;width:80px;height:80px;border-radius:50%;background:#10b981;color:#fff;line-height:80px;font-size:40px;text-align:center;box-sizing:border-box;" class="welcome-badge">
                    ✓
                  </div>
                  <h2 style="margin:15px 0 5px;font-size:24px;color:#111;font-weight:600;">
                    Welcome to Quizzicallabzᴬᴵ!
                  </h2>
                  <p style="margin:0;color:#6b7280;">Your learning journey starts here</p>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 20px;">Hello <strong>${userName}</strong>,</p>
            <p style="margin:0 0 20px;">
              Your account has been successfully created with the <strong>${emailDetails.planName}</strong> plan.
              Below are your account details:
            </p>

            <!-- Info Card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;border-radius:6px;margin-bottom:20px;">
              <tr><td style="padding:15px;">
                <p style="margin:0 0 8px;font-size:14px;">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <strong>Username:</strong> ${userName}
                </p>
                <p style="margin:0 0 8px;font-size:14px;">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <strong>Email:</strong> ${emailDetails.userEmail}
                </p>
                <p style="margin:0 0 8px;font-size:14px;">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                  </svg>
                  <strong>Plan:</strong> ${emailDetails.planName}
                </p>
                <p style="margin:0;font-size:14px;">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <strong>Signup Date:</strong> ${emailDetails.signupDate}
                </p>
              </td></tr>
            </table>

            <!-- Quick Start Guide -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-left:4px solid #4f46e5;border-radius:6px;margin-bottom:20px;">
              <tr><td style="padding:15px;">
                <p style="margin:0 0 10px;font-size:14px;font-weight:600;color:#4f46e5;">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  Quick Start Guide
                </p>
                <p style="margin:0;font-size:13px;color:#1e40af;line-height:1.6;">
                  1. Explore the dashboard to see your progress<br>
                  2. Generate your first AI quiz from any topic<br>
                  3. Take practice tests to improve your skills
                </p>
              </td></tr>
            </table>

            <!-- Buttons -->
            <div class="button-container" style="text-align:left;">
              <a href="https://quizzicallabz.qzz.io/dashboard?utm_source=email&utm_medium=welcome&utm_campaign=onboarding" target="_blank" rel="noopener noreferrer" style="background:#4f46e5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;margin-right:10px;margin-bottom:10px;" class="mobile-button">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                View Dashboard
              </a>
              <a href="https://quizzicallabz.qzz.io/generate-quiz?utm_source=email&utm_medium=welcome&utm_campaign=onboarding" target="_blank" rel="noopener noreferrer" style="border:1px solid #4f46e5;color:#4f46e5;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;margin-right:10px;margin-bottom:10px;" class="mobile-button">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
                Access Gen Lab
              </a>
              <a href="https://quizzicallabz.qzz.io/exam-prep?utm_source=email&utm_medium=welcome&utm_campaign=onboarding" target="_blank" rel="noopener noreferrer" style="border:1px solid #4f46e5;color:#4f46e5;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;" class="mobile-button">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                Start Exam Prep
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
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Security Alert</title>
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
                  <a href="https://quizzicallabz.qzz.io?utm_source=email&utm_medium=security_alert&utm_campaign=account_security" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">
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
            <!-- Security Alert Badge -->
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:20px;">
              <tr>
                <td align="center" style="padding:20px;">
                  <div style="display:inline-block;width:80px;height:80px;border-radius:50%;background:#f59e0b;color:#fff;line-height:80px;font-size:40px;text-align:center;box-sizing:border-box;" class="alert-badge">
                    ⚠
                  </div>
                  <h2 style="margin:15px 0 5px;font-size:22px;color:#dc2626;font-weight:600;">
                    Security Alert: New Login Detected
                  </h2>
                  <p style="margin:0;color:#6b7280;">Account activity notification</p>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 20px;">Hello <strong>${userName}</strong>,</p>
            <p style="margin:0 0 20px;">
              A new login was detected on your Quizzicallabzᴬᴵ account. If this was you, no action is required.
              If not, please take immediate steps to protect your account.
            </p>

            <!-- Info Card with Icons -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef3c7;border-left:4px solid #f59e0b;border-radius:6px;margin-bottom:20px;">
              <tr><td style="padding:15px;">
                <p style="margin:0 0 8px;font-size:14px;">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                    <line x1="12" y1="18" x2="12.01" y2="18"></line>
                  </svg>
                  <strong>Device:</strong> ${loginData.device}
                </p>
                <p style="margin:0 0 8px;font-size:14px;">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <strong>Location:</strong> ${loginData.location}
                </p>
                <p style="margin:0 0 8px;font-size:14px;">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                  </svg>
                  <strong>IP Address:</strong> ${loginData.ipAddress}
                </p>
                <p style="margin:0;font-size:14px;">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <strong>Time:</strong> ${loginData.time}
                </p>
              </td></tr>
            </table>

            <!-- Security Tips -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-left:4px solid #3b82f6;border-radius:6px;margin-bottom:20px;">
              <tr><td style="padding:15px;">
                <p style="margin:0 0 10px;font-size:14px;font-weight:600;color:#1e40af;">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  Security Tips
                </p>
                <p style="margin:0;font-size:13px;color:#1e40af;line-height:1.6;">
                  • If this wasn't you, change your password immediately<br>
                  • Enable two-factor authentication for extra security<br>
                  • Review recent account activity regularly
                </p>
              </td></tr>
            </table>

            <!-- Buttons -->
            <div class="button-container" style="text-align:left;">
              <a href="https://quizzicallabz.qzz.io/reset-password?utm_source=email&utm_medium=security_alert&utm_campaign=account_security" target="_blank" rel="noopener noreferrer" style="background:#dc2626;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;margin-right:10px;margin-bottom:10px;" class="mobile-button">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Change Password
              </a>
              <a href="https://quizzicallabz.qzz.io/profile?utm_source=email&utm_medium=security_alert&utm_campaign=account_security" target="_blank" rel="noopener noreferrer" style="border:1px solid #4f46e5;color:#4f46e5;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;" class="mobile-button">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                Review Activity
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
              <a href="https://quizzicallabz.qzz.io/unsubscribe" style="color:#9ca3af;text-decoration:underline;" rel="noopener noreferrer" target="_blank">Manage email preferences</a>
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
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Study Reminder</title>
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
                  <a href="https://quizzicallabz.qzz.io?utm_source=email&utm_medium=reminder&utm_campaign=engagement" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">
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
            <!-- Reminder Badge -->
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:20px;">
              <tr>
                <td align="center" style="padding:20px;">
                  <div style="display:inline-block;width:80px;height:80px;border-radius:50%;background:#8b5cf6;color:#fff;line-height:80px;font-size:40px;text-align:center;box-sizing:border-box;" class="reminder-badge">
                    📚
                  </div>
                  <h2 style="margin:15px 0 5px;font-size:22px;color:#111;font-weight:600;">
                    Keep Up the Great Work!
                  </h2>
                  <p style="margin:0;color:#6b7280;">Time to level up your skills</p>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 20px;">Hello <strong>${userName}</strong>,</p>
            <p style="margin:0 0 20px;">
              We noticed you have some pending learning activities. Consistency is key to mastering any subject!
              Here's a quick overview of your progress:
            </p>

            <!-- Info Card with Icons -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;border-radius:6px;margin-bottom:20px;">
              <tr><td style="padding:15px;">
                <p style="margin:0 0 8px;font-size:14px;">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                  <strong>Topic:</strong> ${reminderData?.topic || 'General Study'}
                </p>
                <p style="margin:0 0 8px;font-size:14px;">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  <strong>Weak Areas:</strong> ${reminderData?.weakAreas || 'Review recommended'}
                </p>
                <p style="margin:0;font-size:14px;">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <strong>Last Activity:</strong> ${reminderData?.lastActivityDate || 'Recently'}
                </p>
              </td></tr>
            </table>

            <!-- Motivational Quote -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef3c7;border-left:4px solid #f59e0b;border-radius:6px;margin-bottom:20px;">
              <tr><td style="padding:15px;">
                <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#92400e;">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Daily Motivation
                </p>
                <p style="margin:0;font-size:13px;color:#78350f;font-style:italic;line-height:1.6;">
                  "Success is the sum of small efforts, repeated day in and day out."
                </p>
              </td></tr>
            </table>

            <!-- Study Stats (if available) -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-left:4px solid #3b82f6;border-radius:6px;margin-bottom:20px;">
              <tr><td style="padding:15px;">
                <p style="margin:0 0 10px;font-size:14px;font-weight:600;color:#1e40af;">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                  Quick Tips
                </p>
                <p style="margin:0;font-size:13px;color:#1e40af;line-height:1.6;">
                  • Review your weak areas first for maximum impact<br>
                  • Take short practice quizzes to stay sharp<br>
                  • Set aside 15 minutes daily for consistent progress
                </p>
              </td></tr>
            </table>

            <!-- Calendar Reminder -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border-left:4px solid #22c55e;border-radius:6px;margin-bottom:20px;">
              <tr><td style="padding:15px;">
                <p style="margin:0 0 10px;font-size:14px;font-weight:600;color:#15803d;">📅 Set Study Reminder</p>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                  <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Daily+Study+Session&dates=20250116T180000Z/20250116T183000Z&details=Time+to+practice+${encodeURIComponent(reminderData?.topic || 'your+studies')}+on+Quizzicallabz&recur=RRULE:FREQ=DAILY" target="_blank" style="background:#4285f4;color:#fff;text-decoration:none;padding:8px 12px;border-radius:4px;font-size:12px;display:inline-block;">+ Daily Reminder</a>
                  <a href="https://outlook.live.com/calendar/0/deeplink/compose?subject=Study+Session&startdt=2025-01-16T18:00:00&enddt=2025-01-16T18:30:00&body=Practice+${encodeURIComponent(reminderData?.topic || 'studies')}+on+Quizzicallabz" target="_blank" style="background:#0078d4;color:#fff;text-decoration:none;padding:8px 12px;border-radius:4px;font-size:12px;display:inline-block;">+ Outlook</a>
                </div>
              </td></tr>
            </table>

            <!-- QR Code -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:20px;">
              <tr><td style="padding:15px;text-align:center;">
                <p style="margin:0 0 10px;font-size:14px;font-weight:600;color:#475569;">📱 Quick Access</p>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://quizzicallabz.qzz.io/generate-quiz?utm_source=email_qr" alt="QR Code" style="width:80px;height:80px;border:2px solid #e2e8f0;border-radius:8px;">
                <p style="margin:10px 0 0;font-size:12px;color:#64748b;">Scan to start studying</p>
              </td></tr>
            </table>

            <!-- Buttons -->
            <div class="button-container" style="text-align:left;">
              <a href="https://quizzicallabz.qzz.io/generate-quiz?utm_source=email&utm_medium=reminder&utm_campaign=engagement" target="_blank" rel="noopener noreferrer" style="background:#8b5cf6;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;margin-right:10px;margin-bottom:10px;" class="mobile-button">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
                Take a Quiz
              </a>
              <a href="https://quizzicallabz.qzz.io/practice?utm_source=email&utm_medium=reminder&utm_campaign=engagement" target="_blank" rel="noopener noreferrer" style="border:1px solid #8b5cf6;color:#8b5cf6;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;" class="mobile-button">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2">
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
              <a href="https://quizzicallabz.qzz.io/unsubscribe" style="color:#9ca3af;text-decoration:underline;" rel="noopener noreferrer" target="_blank">Unsubscribe from reminder emails</a>
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

We noticed you have some pending learning activities. Consistency is key to mastering any subject!

Topic: ${reminderData?.topic || 'General Study'}
Weak Areas: ${reminderData?.weakAreas || 'Review recommended'}
Last Activity: ${reminderData?.lastActivityDate || 'Recently'}

"Success is the sum of small efforts, repeated day in and day out."

Quick Tips:
• Review your weak areas first for maximum impact
• Take short practice quizzes to stay sharp
• Set aside 15 minutes daily for consistent progress

Take a Quiz: https://quizzicallabz.qzz.io/generate-quiz
Practice Weak Areas: https://quizzicallabz.qzz.io/practice

© 2025 Quizzicallabzᴬᴵ. All rights reserved.

Unsubscribe: https://quizzicallabz.qzz.io/unsubscribe`
});
