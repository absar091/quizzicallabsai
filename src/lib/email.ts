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
      // Optimize for performance
      pool: true, // Use connection pooling
      maxConnections: 5,
      maxMessages: 100,
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
  const template = welcomeEmailTemplate(userName, emailDetails);
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
    topic: quizData.topic,
    score: quizData.score,
    total: quizData.total || 10,
    percentage: quizData.percentage || Math.round((quizData.score / (quizData.total || 10)) * 100),
    timeTaken: quizData.timeTaken,
    date: quizData.date
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
  const { emailVerificationTemplate } = await import('./email-templates');
  const template = emailVerificationTemplate(userName, verificationLink);
  return sendEmail({ 
    to, 
    subject: template.subject, 
    html: template.html, 
    text: template.text 
  });
}

export async function sendPasswordResetEmail(to: string, userName: string, resetLink: string) {
  const { passwordResetEmailTemplate } = await import('./email-templates');
  const template = passwordResetEmailTemplate(userName, resetLink);
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
  const template = loginNotificationEmailTemplate(userName, loginData);
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
    text: template.text
  });
}
