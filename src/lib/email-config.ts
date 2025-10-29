import nodemailer from 'nodemailer';

// SMTP Configuration for Verification Emails (ahmadraoabsar@gmail.com)
export const verificationTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
});

// SMTP Configuration for Welcome/Marketing Emails (quizzicallabs.ai@gmail.com)
export const marketingTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.WELCOME_SMTP_USER,
    pass: process.env.WELCOME_SMTP_PASS,
  }
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