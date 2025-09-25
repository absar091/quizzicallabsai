// 🔥 Firebase Cloud Functions - Custom Email Templates with Firebase Security
// This replaces Firebase's basic email template with your beautiful branded templates

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// 📧 Email Configuration (using your existing Gmail SMTP)
const gmailEmail = 'services@quizzicallabz.qzz.io';
const gmailPassword = 'ynhf aesm bnzu rjme'; // Your app password

const mailTransport = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// 🎨 Your Beautiful Email Templates (matching your app's design)
const emailVerificationTemplate = (userName, verificationLink, continueUrl) => {
  const fullVerificationLink = continueUrl
    ? `${verificationLink}${verificationLink.includes('?') ? '&' : '?'}continueUrl=${encodeURIComponent(continueUrl)}`
    : verificationLink;

  return {
    subject: `Verify Your Email - Complete Your Quizzicallabzᴬᴵ Registration`,
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
            .verification-section,
            .continue-section {
              padding: 20px !important;
              margin: 20px 0 !important;
            }
            .verify-button,
            .continue-button {
              width: 100% !important;
              box-sizing: border-box !important;
              padding: 16px 20px !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
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
              <div class="verification-title">Activate Your Account</div>
              <p style="margin: 0 0 20px 0; color: #5a6c7d;">Click the button below to verify your email and unlock all features</p>
              <a href="${fullVerificationLink}" class="verify-button">
                Verify My Email Address
              </a>
              <p style="margin: 20px 0 0 0; font-size: 12px; color: #5a6c7d;">
                This link will expire in 24 hours for security reasons
              </p>
            </div>

            ${continueUrl ? `
            <div class="continue-section">
              <div class="continue-title">After Verification</div>
              <p style="margin: 0 0 16px 0; color: #065f46; font-size: 14px;">
                Once verified, you'll be automatically redirected to continue your learning journey!
              </p>
              <a href="${continueUrl}" class="continue-button">
                Continue to Dashboard
              </a>
            </div>
            ` : ''}

            <div class="security-note">
              <h4>Security Notice</h4>
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
    `
  };
};

// 🚀 Firebase Cloud Function - Send Custom Verification Email
exports.sendCustomVerificationEmail = functions.auth.user().onCreate(async (user) => {
  try {
    console.log('Sending custom verification email for:', user.email);

    // Generate the verification link with Firebase's secure code
    const verificationLink = await admin.auth().generateEmailVerificationLink(user.email, {
      url: `${functions.config().app.url}/auth/action?mode=verifyEmail`,
      handleCodeInApp: true
    });

    // Create beautiful email using your template
    const userName = user.displayName || user.email.split('@')[0];
    const continueUrl = `${functions.config().app.url}/dashboard`;

    const emailTemplate = emailVerificationTemplate(userName, verificationLink, continueUrl);

    // Send the email using your Gmail SMTP
    const mailOptions = {
      from: `Quizzicallabzᴬᴵ <${gmailEmail}>`,
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    };

    await mailTransport.sendMail(mailOptions);

    console.log('Custom verification email sent successfully to:', user.email);

    return {
      success: true,
      message: 'Custom verification email sent',
      email: user.email
    };

  } catch (error) {
    console.error('Error sending custom verification email:', error);

    // Don't throw error - let Firebase handle its own email as backup
    return {
      success: false,
      error: error.message,
      email: user.email
    };
  }
});

// Password Reset Email Function
exports.sendCustomPasswordResetEmail = functions.auth.user().beforePasswordReset(async (user) => {
  try {
    console.log('Sending custom password reset email for:', user.email);

    // Generate password reset link
    const resetLink = await admin.auth().generatePasswordResetLink(user.email, {
      url: `${functions.config().app.url}/auth/action?mode=resetPassword`
    });

    const userName = user.displayName || user.email.split('@')[0];

    // Use your existing password reset template
    const passwordResetTemplate = (userName, resetLink) => ({
      subject: `Reset Your Quizzicallabzᴬᴵ Password - Secure Access Restoration`,
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
              .reset-section {
                padding: 20px !important;
                margin: 20px 0 !important;
              }
              .reset-button {
                width: 100% !important;
                box-sizing: border-box !important;
                padding: 16px 20px !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
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
                <div class="reset-title">Reset Your Password</div>
                <p style="margin: 0 0 20px 0; color: #5a6c7d;">Click the button below to set a new password</p>
                <a href="${resetLink}" class="reset-button">
                  Reset Password
                </a>
                <p style="margin: 20px 0 0 0; font-size: 12px; color: #5a6c7d;">
                  This link will expire in 1 hour for security reasons
                </p>
              </div>

              <div class="security-warning">
                <h4>Security Notice</h4>
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
      `
    });

    const emailTemplate = passwordResetTemplate(userName, resetLink);

    const mailOptions = {
      from: `Quizzicallabzᴬᴵ <${gmailEmail}>`,
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    };

    await mailTransport.sendMail(mailOptions);

    console.log('Custom password reset email sent successfully to:', user.email);

    return {
      success: true,
      message: 'Custom password reset email sent',
      email: user.email
    };

  } catch (error) {
    console.error('Error sending custom password reset email:', error);
    return {
      success: false,
      error: error.message,
      email: user.email
    };
  }
});

// 📧 Utility function to send emails
async function sendEmail(to, subject, html) {
  const mailOptions = {
    from: `Quizzicallabzᴬᴵ <${gmailEmail}>`,
    to: to,
    subject: subject,
    html: html,
  };

  return mailTransport.sendMail(mailOptions);
}

// 🚀 Export functions for deployment
module.exports = {
  sendCustomVerificationEmail: exports.sendCustomVerificationEmail,
  sendCustomPasswordResetEmail: exports.sendCustomPasswordResetEmail
};
