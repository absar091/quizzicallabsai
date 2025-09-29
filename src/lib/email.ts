import { welcomeEmailTemplate, quizResultEmailTemplate, studyReminderEmailTemplate } from './email-templates';

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
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text,
    });

    console.log('✅ Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error: any) {
    console.error('❌ Email sending failed:', error.message);
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
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
    text: template.text
  });
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

  return sendEmail({ 
    to, 
    subject: template.subject, 
    html: template.html, 
    text: template.text 
  });
}

export async function sendStudyReminderEmail(to: string, userName: string) {
  const template = studyReminderEmailTemplate(userName);
  return sendEmail({ 
    to, 
    subject: template.subject, 
    html: template.html, 
    text: template.text 
  });
}

export async function sendEmailVerificationEmail(to: string, userName: string, verificationLink: string) {
  // Use a simple verification email template since it's not in the templates file
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
                Verify Your Email Address
              </h2>
              <p style="margin:0 0 20px;">Hello <strong>${userName}</strong>,</p>
              <p style="margin:0 0 20px;">
                Please click the button below to verify your email address and complete your registration.
              </p>
              <a href="${verificationLink}" style="background:#4f46e5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;">Verify Email</a>
            </td>
          </tr>

          <!-- FOOTER START -->
          <tr>
            <td style="padding:30px;background:#f9fafb;color:#6b7280;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 10px;">
                © 2025 <strong>Quizzicallabzᴬᴵ</strong>. All rights reserved.<br>
                <em>Quizzicallabzᴬᴵ and its logo are products of Quizzicallabz™.</em>
              </p>
              <p style="margin:0 0 10px;">
                <a href="https://quizzicallabz.qzz.io/privacy" style="color:#4f46e5;text-decoration:none;">Privacy Policy</a> ·
                <a href="https://quizzicallabz.qzz.io/terms" style="color:#4f46e5;text-decoration:none;">Terms of Use</a> ·
                <a href="https://quizzicallabz.qzz.io/disclaimer" style="color:#4f46e5;text-decoration:none;">Disclaimer</a>
              </p>
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
    text: `Verify Your Email - Quizzicallabzᴬᴵ\n\nHello ${userName},\n\nPlease verify your email by clicking this link: ${verificationLink}\n\n© 2025 Quizzicallabzᴬᴵ. All rights reserved.`
  };
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
    text: template.text
  });
}

export async function sendPasswordResetEmail(to: string, userName: string, resetLink: string) {
  // Use a simple password reset email template since it's not in the templates file
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
                Reset Your Password
              </h2>
              <p style="margin:0 0 20px;">Hello <strong>${userName}</strong>,</p>
              <p style="margin:0 0 20px;">
                We received a request to reset your password. Click the button below to create a new password.
              </p>
              <a href="${resetLink}" style="background:#4f46e5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;">Reset Password</a>
            </td>
          </tr>

          <!-- FOOTER START -->
          <tr>
            <td style="padding:30px;background:#f9fafb;color:#6b7280;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 10px;">
                © 2025 <strong>Quizzicallabzᴬᴵ</strong>. All rights reserved.<br>
                <em>Quizzicallabzᴬᴵ and its logo are products of Quizzicallabz™.</em>
              </p>
              <p style="margin:0 0 10px;">
                <a href="https://quizzicallabz.qzz.io/privacy" style="color:#4f46e5;text-decoration:none;">Privacy Policy</a> ·
                <a href="https://quizzicallabz.qzz.io/terms" style="color:#4f46e5;text-decoration:none;">Terms of Use</a> ·
                <a href="https://quizzicallabz.qzz.io/disclaimer" style="color:#4f46e5;text-decoration:none;">Disclaimer</a>
              </p>
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
    text: `Reset Your Password - Quizzicallabzᴬᴵ\n\nHello ${userName},\n\nReset your password by clicking this link: ${resetLink}\n\n© 2025 Quizzicallabzᴬᴵ. All rights reserved.`
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
  const { loginNotificationEmailTemplate } = await import('./email-templates');
  const template = loginNotificationEmailTemplate(userName, {
    device: loginData.device,
    location: loginData.location,
    ipAddress: loginData.ipAddress,
    time: loginData.timestamp
  });
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
    text: template.text
  });
}
