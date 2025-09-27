// Complete Email Templates with Updated Header/Footer

export const quizResultEmailTemplate = (userName: string, quizData: {
  quizTitle: string;
  score: string;
  correct: string;
  incorrect: string;
  date: string;
}) => ({
  subject: `Your Quiz Results Are Ready - ${userName}`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Quiz Results</title>
    </head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f9fafb;">
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
              Your Quiz Results Are Ready
            </h2>
            <p style="margin:0 0 20px;">Hello <strong>${userName}</strong>,</p>
            <p style="margin:0 0 20px;">
              Here are the results of your recent quiz attempt:
            </p>

            <!-- Info Card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;border-radius:6px;margin-bottom:20px;">
              <tr><td style="padding:15px;">
                <p style="margin:0;font-size:14px;"><strong>Quiz Title:</strong> ${quizData.quizTitle}</p>
                <p style="margin:0;font-size:14px;"><strong>Score:</strong> ${quizData.score}%</p>
                <p style="margin:0;font-size:14px;"><strong>Correct:</strong> ${quizData.correct}</p>
                <p style="margin:0;font-size:14px;"><strong>Incorrect:</strong> ${quizData.incorrect}</p>
                <p style="margin:0;font-size:14px;"><strong>Date:</strong> ${quizData.date}</p>
              </td></tr>
            </table>

            <!-- Buttons -->
            <a href="https://quizzicallabz.qzz.io/review" style="background:#4f46e5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;margin-right:10px;">Review Answers</a>
            <a href="https://quizzicallabz.qzz.io/practice" style="border:1px solid #4f46e5;color:#4f46e5;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;">Practice Weak Areas</a>
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
    </head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f9fafb;">
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
    </head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f9fafb;">
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

export const studyReminderEmailTemplate = (userName: string, reminderData: {
  topic: string;
  weakAreas: string;
  lastActivityDate: string;
}) => ({
  subject: `Reminder: Stay on Track with Your Learning - ${userName}`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Study Reminder</title>
    </head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f9fafb;">
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
                <p style="margin:0;font-size:14px;"><strong>Topic:</strong> ${reminderData.topic}</p>
                <p style="margin:0;font-size:14px;"><strong>Weak Areas:</strong> ${reminderData.weakAreas}</p>
                <p style="margin:0;font-size:14px;"><strong>Last Activity:</strong> ${reminderData.lastActivityDate}</p>
              </td></tr>
            </table>

            <!-- Motivational Quote -->
            <blockquote style="border-left:4px solid #4f46e5;margin:10px 0;padding:10px;color:#444;font-style:italic;">
              "Success is the sum of small efforts, repeated day in and day out."
            </blockquote>

            <!-- Buttons -->
            <a href="https://quizzicallabz.qzz.io/generate-quiz" style="background:#4f46e5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;margin-right:10px;">Take Quiz</a>
            <a href="https://quizzicallabz.qzz.io/practice" style="border:1px solid #4f46e5;color:#4f46e5;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;">Review Weak Areas</a>
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
      </table>
    </body>
    </html>
  `,
  text: `Reminder: Stay on Track with Your Learning

Hello ${userName},

This is a reminder that you have pending activities in your account.

Topic: ${reminderData.topic}
Weak Areas: ${reminderData.weakAreas}
Last Activity: ${reminderData.lastActivityDate}

"Success is the sum of small efforts, repeated day in and day out."

Take Quiz: https://quizzicallabz.qzz.io/generate-quiz
Review Weak Areas: https://quizzicallabz.qzz.io/practice

© 2025 Quizzicallabzᴬᴵ. All rights reserved.`
});


