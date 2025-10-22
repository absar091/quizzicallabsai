import { 
  welcomeEmailTemplate, 
  quizResultEmailTemplate, 
  studyReminderEmailTemplate,
  loginNotificationEmailTemplate 
} from './email-templates-professional';
import { checkEmailPreferences, logEmailAttempt, type EmailType } from './email-preferences';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Create a reusable transporter for better performance
let transporter: any = null;

async function getTransporter() {
  if (!transporter) {
    // Validate environment variables
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('Missing email configuration. Please check SMTP environment variables.');
    }

    console.log('📧 Creating optimized email transporter...');
    
    // Dynamic import to ensure proper loading
    const nodemailer = await import('nodemailer');
    console.log('📧 Nodemailer loaded:', typeof nodemailer.default, typeof nodemailer.default?.createTransport);
    
    // Use default export if available, otherwise use named export
    const mailer = nodemailer.default || nodemailer;
    
    if (typeof mailer.createTransport !== 'function') {
      console.error('❌ createTransport is not a function:', mailer);
      throw new Error('Nodemailer import error: createTransport is not available');
    }
    
    transporter = mailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Optimize for speed
      pool: true,
      maxConnections: 10,
      maxMessages: 1000,
      connectionTimeout: 3000,
      greetingTimeout: 2000,
      socketTimeout: 5000,
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  return transporter;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const emailTransporter = await getTransporter();
    console.log('📧 Sending email to:', to.substring(0, 20) + '...');

    const result = await emailTransporter.sendMail({
      from: `"QuizzicallabzAI" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text,
      headers: {
        'X-Mailer': 'QuizzicallabzAI Learning Platform',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal'
      }
    });

    console.log('✅ Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error: any) {
    console.error('❌ Email sending failed:', error.message);
    throw error;
  }
}

// Enhanced email sending with preference checking
export async function sendEmailWithPreferences(
  { to, subject, html, text }: EmailOptions, 
  emailType: EmailType
) {
  try {
    // Check user preferences first
    const { canSend, reason } = await checkEmailPreferences(to, emailType);
    
    if (!canSend) {
      await logEmailAttempt(to, emailType, false, reason);
      return { 
        success: false, 
        blocked: true, 
        reason: reason || 'User has opted out of this email type' 
      };
    }

    // Send the email
    const result = await sendEmail({ to, subject, html, text });
    await logEmailAttempt(to, emailType, true);
    
    return result;
  } catch (error: any) {
    await logEmailAttempt(to, emailType, false, error.message);
    throw error;
  }
}

export async function sendWelcomeEmail(to: string, userName: string, emailDetails: {
  userEmail: string;
  accountType?: string;
  signUpDate?: string;
  preferredLanguage?: string;
}) {
  const template = welcomeEmailTemplate(userName, {
    userEmail: emailDetails.userEmail,
    planName: emailDetails.accountType || 'Free',
    signupDate: emailDetails.signUpDate || new Date().toLocaleDateString()
  });
  
  return sendEmailWithPreferences({
    to,
    subject: template.subject,
    html: template.html,
    text: template.text
  }, 'promotions'); // Welcome emails are promotional
}

export async function sendQuizResultEmail(to: string, quizData: {
  userName: string;
  topic: string;
  score: number;
  total?: number;
  percentage?: number;
  timeTaken?: number;
  date?: string;
}) {
  const template = quizResultEmailTemplate(quizData.userName, {
    quizTitle: quizData.topic,
    score: quizData.percentage || Math.round((quizData.score / (quizData.total || 10)) * 100),
    correct: quizData.score.toString(),
    incorrect: ((quizData.total || 10) - quizData.score).toString(),
    date: quizData.date || new Date().toLocaleDateString()
  });

  return sendEmailWithPreferences({ 
    to, 
    subject: template.subject, 
    html: template.html, 
    text: template.text 
  }, 'quizResults');
}

export async function sendStudyReminderEmail(to: string, userName: string) {
  const template = studyReminderEmailTemplate(userName);
  return sendEmailWithPreferences({ 
    to, 
    subject: template.subject, 
    html: template.html, 
    text: template.text 
  }, 'studyReminders');
}

export async function sendEmailVerificationEmail(to: string, userName: string, verificationLink: string) {
  // Verification emails bypass preferences (critical emails)
  const template = {
    subject: `Verify Your Email - Complete Your Quizzicallabzᴬᴵ Registration`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; background-color: #f9fafb; }
          .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; }
          @media only screen and (max-width: 600px) {
            .email-container { width: 100% !important; margin: 0 !important; }
          }
        </style>
      </head>
      <body>
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;">
          <tr>
            <td style="padding:20px 30px;background:#ffffff;border-bottom:1px solid #e5e7eb;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left">
                    <strong style="font-size:18px;color:#4f46e5;">Quizzicallabz<sup style="font-size:12px;">AI</sup></strong>
                  </td>
                  <td align="right" style="font-family:Arial,sans-serif;color:#6b7280;font-size:12px;">
                    AI-powered study partner
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:30px;color:#333;font-size:15px;line-height:1.7;">
              <h2 style="margin-top:0;margin-bottom:15px;font-size:20px;color:#111;font-weight:600;">
                Verify Your Email Address
              </h2>
              <p style="margin:0 0 20px;">Hello <strong>${userName}</strong>,</p>
              <p style="margin:0 0 20px;">
                Please click the button below to verify your email address and complete your registration.
              </p>
              <a href="${verificationLink}" style="background:#4f46e5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;">Verify Email</a>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 30px;background:#f9fafb;color:#6b7280;font-size:12px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;">
                © 2025 Quizzicallabzᴬᴵ. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `Verify Your Email - Quizzicallabzᴬᴵ\\n\\nHello ${userName},\\n\\nPlease verify your email by clicking this link: ${verificationLink}\\n\\n© 2025 Quizzicallabzᴬᴵ. All rights reserved.`
  };
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
    text: template.text
  });
}

export async function sendPasswordResetEmail(to: string, userName: string, resetLink: string) {
  // Password reset emails bypass preferences (critical emails)
  const template = {
    subject: `Reset Your Quizzicallabzᴬᴵ Password`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; background-color: #f9fafb; }
          .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; }
          @media only screen and (max-width: 600px) {
            .email-container { width: 100% !important; margin: 0 !important; }
          }
        </style>
      </head>
      <body>
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;">
          <tr>
            <td style="padding:20px 30px;background:#ffffff;border-bottom:1px solid #e5e7eb;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left">
                    <strong style="font-size:18px;color:#4f46e5;">Quizzicallabz<sup style="font-size:12px;">AI</sup></strong>
                  </td>
                  <td align="right" style="font-family:Arial,sans-serif;color:#6b7280;font-size:12px;">
                    AI-powered study partner
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:30px;color:#333;font-size:15px;line-height:1.7;">
              <h2 style="margin-top:0;margin-bottom:15px;font-size:20px;color:#111;font-weight:600;">
                Reset Your Password
              </h2>
              <p style="margin:0 0 20px;">Hello <strong>${userName}</strong>,</p>
              <p style="margin:0 0 20px;">
                We received a request to reset your password. Click the button below to create a new password.
              </p>
              <a href="${resetLink}" style="background:#4f46e5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;">Reset Password</a>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 30px;background:#f9fafb;color:#6b7280;font-size:12px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;">
                © 2025 Quizzicallabzᴬᴵ. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `Reset Your Password - Quizzicallabzᴬᴵ\\n\\nHello ${userName},\\n\\nReset your password by clicking this link: ${resetLink}\\n\\n© 2025 Quizzicallabzᴬᴵ. All rights reserved.`
  };
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
    text: template.text
  });
}

export async function sendLoginNotificationEmail(to: string, userName: string, loginData: {
  timestamp: string;
  browser: string;
  device: string;
  location: string;
  ipAddress: string;
  userAgent: string;
}) {
  const template = loginNotificationEmailTemplate(userName, {
    device: loginData.device,
    location: loginData.location,
    ipAddress: loginData.ipAddress,
    time: loginData.timestamp
  });
  return sendEmailWithPreferences({
    to,
    subject: template.subject,
    html: template.html,
    text: template.text
  }, 'loginAlerts');
}