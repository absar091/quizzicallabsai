import * as nodemailer from 'nodemailer';
import { welcomeEmailTemplate, quizResultEmailTemplate, studyReminderEmailTemplate } from './email-templates';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    // Validate environment variables
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('Missing email configuration. Please check SMTP environment variables.');
    }

    console.log('📧 Creating email transporter...');
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Add additional options for better compatibility
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('📧 Verifying transporter connection...');
    await transporter.verify();

    console.log('📧 Sending email...');
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text,
    });

    console.log('📧 Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error: any) {
    console.error('❌ Email sending failed:', error);
    console.error('❌ Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
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