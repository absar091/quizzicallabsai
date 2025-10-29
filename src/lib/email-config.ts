import nodemailer from 'nodemailer';

// SMTP Configuration for Verification Emails (ahmadraoabsar@gmail.com)
export const verificationTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.NODE_ENV === 'production',
  auth: {
    user: process.env.SMTP_USER, // ahmadraoabsar@gmail.com
    pass: process.env.SMTP_PASS, // uzpk gcix ebfh sfrg
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
});

// SMTP Configuration for Welcome/Marketing Emails (quizzicallabs.ai@gmail.com)
export const marketingTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.NODE_ENV === 'production',
  auth: {
    user: process.env.WELCOME_SMTP_USER, // quizzicallabs.ai@gmail.com
    pass: process.env.WELCOME_SMTP_PASS, // ynhf aesm bnzu rjme
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
});

// Email service types
export type EmailService = 'verification' | 'marketing';

// Get appropriate transporter based on email type
export function getTransporter(service: EmailService) {
  switch (service) {
    case 'verification':
      return verificationTransporter;
    case 'marketing':
      return marketingTransporter;
    default:
      return verificationTransporter;
  }
}

// Get appropriate FROM address based on email type
export function getFromAddress(service: EmailService): string {
  switch (service) {
    case 'verification':
      return process.env.EMAIL_FROM || `"Quizzicallabzᴬᴵ" <${process.env.SMTP_USER}>`;
    case 'marketing':
      return process.env.WELCOME_EMAIL_FROM || `"Quizzicallabzᴬᴵ" <${process.env.WELCOME_SMTP_USER}>`;
    default:
      return process.env.EMAIL_FROM || `"Quizzicallabzᴬᴵ" <${process.env.SMTP_USER}>`;
  }
}