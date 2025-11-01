// Secure Email Configuration for QuizzicalLabzᴬᴵ
// Addresses Nodemailer domain security vulnerability

import nodemailer from 'nodemailer';
import { z } from 'zod';

// Email validation schema to prevent domain confusion
const EmailSchema = z.object({
  to: z.string().email('Invalid email address'),
  from: z.string().email('Invalid sender email'),
  subject: z.string().min(1, 'Subject is required'),
  html: z.string().optional(),
  text: z.string().optional(),
});

// Allowed domains for security (whitelist approach)
const ALLOWED_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'protonmail.com',
  'icloud.com',
  'edu.pk',
  'gov.pk',
  // Add more trusted domains as needed
];

// Domain validation function
function validateEmailDomain(email: string): boolean {
  try {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;
    
    // Check if domain is in whitelist or is a subdomain of allowed domains
    return ALLOWED_DOMAINS.some(allowedDomain => 
      domain === allowedDomain || domain.endsWith(`.${allowedDomain}`)
    );
  } catch (error) {
    console.error('Domain validation error:', error);
    return false;
  }
}

// Secure email address sanitization
function sanitizeEmailAddress(email: string): string {
  // Remove any potential injection characters
  const sanitized = email
    .trim()
    .toLowerCase()
    .replace(/[<>'"]/g, '') // Remove potential injection characters
    .replace(/\s+/g, ''); // Remove whitespace
    
  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(sanitized)) {
    throw new Error('Invalid email format after sanitization');
  }
  
  return sanitized;
}

// Secure transporter configuration
function createSecureTransporter() {
  const config = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Security enhancements
    tls: {
      rejectUnauthorized: true,
      minVersion: 'TLSv1.2',
    },
    // Prevent connection pooling for security
    pool: false,
    // Set connection timeout
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  };

  // Validate required environment variables
  if (!config.host || !config.auth.user || !config.auth.pass) {
    throw new Error('Missing required SMTP configuration');
  }

  return nodemailer.createTransporter(config);
}

// Secure email sending function
export async function sendSecureEmail(emailData: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Sanitize and validate input
    const sanitizedTo = sanitizeEmailAddress(emailData.to);
    const sanitizedFrom = sanitizeEmailAddress(
      emailData.from || process.env.SMTP_FROM || process.env.SMTP_USER || ''
    );

    // Validate email data
    const validatedData = EmailSchema.parse({
      to: sanitizedTo,
      from: sanitizedFrom,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
    });

    // Additional domain validation for security
    if (!validateEmailDomain(validatedData.to)) {
      console.warn(`Email domain not in whitelist: ${validatedData.to}`);
      // In production, you might want to allow but log this
      // For maximum security, uncomment the line below:
      // throw new Error('Email domain not allowed');
    }

    // Create secure transporter
    const transporter = createSecureTransporter();

    // Verify transporter configuration
    await transporter.verify();

    // Send email with security headers
    const mailOptions = {
      from: {
        name: 'QuizzicalLabzᴬᴵ',
        address: validatedData.from,
      },
      to: validatedData.to,
      subject: validatedData.subject,
      html: validatedData.html,
      text: validatedData.text,
      // Security headers
      headers: {
        'X-Mailer': 'QuizzicalLabzAI-SecureMailer',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
      },
      // Prevent email tracking
      disableUrlAccess: true,
      disableFileAccess: true,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Secure email sent successfully:', {
      messageId: info.messageId,
      to: validatedData.to,
      subject: validatedData.subject,
    });

    return {
      success: true,
      messageId: info.messageId,
    };

  } catch (error: any) {
    console.error('❌ Secure email sending failed:', {
      error: error.message,
      to: emailData.to,
      subject: emailData.subject,
    });

    return {
      success: false,
      error: error.message,
    };
  }
}

// Bulk email sending with rate limiting
export async function sendBulkSecureEmails(
  emails: Array<{
    to: string;
    subject: string;
    html?: string;
    text?: string;
  }>,
  options: {
    batchSize?: number;
    delayBetweenBatches?: number;
  } = {}
): Promise<{
  success: number;
  failed: number;
  errors: Array<{ email: string; error: string }>;
}> {
  const { batchSize = 10, delayBetweenBatches = 1000 } = options;
  const results = { success: 0, failed: 0, errors: [] as Array<{ email: string; error: string }> };

  // Process emails in batches to prevent overwhelming the SMTP server
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (email) => {
      const result = await sendSecureEmail(email);
      if (result.success) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push({
          email: email.to,
          error: result.error || 'Unknown error',
        });
      }
    });

    await Promise.all(batchPromises);

    // Delay between batches to prevent rate limiting
    if (i + batchSize < emails.length) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
    }
  }

  return results;
}

// Email template validation
export function validateEmailTemplate(template: string, variables: Record<string, string>): string {
  let validatedTemplate = template;
  
  // Replace variables safely
  Object.entries(variables).forEach(([key, value]) => {
    // Sanitize variable values to prevent injection
    const sanitizedValue = value
      .replace(/[<>'"]/g, '') // Remove potential HTML injection
      .substring(0, 1000); // Limit length
      
    validatedTemplate = validatedTemplate.replace(
      new RegExp(`{{${key}}}`, 'g'),
      sanitizedValue
    );
  });
  
  return validatedTemplate;
}

// Export configuration for testing
export const emailConfig = {
  allowedDomains: ALLOWED_DOMAINS,
  validateEmailDomain,
  sanitizeEmailAddress,
};