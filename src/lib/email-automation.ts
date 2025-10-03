import { checkEmailPreferences, logEmailAttempt, type EmailType } from './email-preferences';
import { sendEmailWithPreferences } from './email';

/**
 * Automated email sending with built-in preference checking
 * Use this for all automated/scheduled emails
 */
export class EmailAutomation {
  
  /**
   * Send an automated email with preference checking and logging
   */
  static async sendAutomatedEmail(
    to: string,
    emailType: EmailType,
    emailContent: {
      subject: string;
      html: string;
      text?: string;
    },
    options?: {
      skipPreferenceCheck?: boolean; // For critical emails like verification
      logAttempt?: boolean;
    }
  ) {
    const { skipPreferenceCheck = false, logAttempt = true } = options || {};

    try {
      // Skip preference check for critical emails
      if (!skipPreferenceCheck) {
        const { canSend, reason } = await checkEmailPreferences(to, emailType);
        
        if (!canSend) {
          if (logAttempt) {
            await logEmailAttempt(to, emailType, false, reason);
          }
          return {
            success: false,
            blocked: true,
            reason: reason || 'User has opted out of this email type'
          };
        }
      }

      // Send the email
      const result = await sendEmailWithPreferences({
        to,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      }, emailType);

      if (logAttempt) {
        await logEmailAttempt(to, emailType, true);
      }

      return result;

    } catch (error: any) {
      if (logAttempt) {
        await logEmailAttempt(to, emailType, false, error.message);
      }
      throw error;
    }
  }

  /**
   * Batch send emails with preference checking
   */
  static async sendBatchEmails(
    recipients: Array<{
      email: string;
      data: any; // Template data
    }>,
    emailType: EmailType,
    templateFunction: (data: any) => { subject: string; html: string; text?: string },
    options?: {
      batchSize?: number;
      delayBetweenBatches?: number;
    }
  ) {
    const { batchSize = 10, delayBetweenBatches = 1000 } = options || {};
    const results: Array<{ email: string; success: boolean; reason?: string }> = [];

    // Process in batches to avoid overwhelming the email service
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async ({ email, data }) => {
        try {
          const template = templateFunction(data);
          const result = await this.sendAutomatedEmail(email, emailType, template);
          
          return {
            email,
            success: result.success,
            reason: 'blocked' in result ? result.reason : undefined
          };
        } catch (error: any) {
          return {
            email,
            success: false,
            reason: error.message
          };
        }
      });

      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          results.push({
            email: batch[index].email,
            success: false,
            reason: result.reason?.message || 'Unknown error'
          });
        }
      });

      // Delay between batches
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
      }
    }

    return {
      total: recipients.length,
      sent: results.filter(r => r.success).length,
      blocked: results.filter(r => !r.success && r.reason?.includes('opted out')).length,
      failed: results.filter(r => !r.success && !r.reason?.includes('opted out')).length,
      results
    };
  }

  /**
   * Check if a user can receive a specific email type
   */
  static async canUserReceiveEmail(email: string, emailType: EmailType): Promise<boolean> {
    const { canSend } = await checkEmailPreferences(email, emailType);
    return canSend;
  }

  /**
   * Get users who can receive a specific email type from a list
   */
  static async filterEligibleRecipients(
    emails: string[],
    emailType: EmailType
  ): Promise<{ eligible: string[]; blocked: string[] }> {
    const eligible: string[] = [];
    const blocked: string[] = [];

    const checks = await Promise.allSettled(
      emails.map(email => this.canUserReceiveEmail(email, emailType))
    );

    checks.forEach((result, index) => {
      const email = emails[index];
      if (result.status === 'fulfilled' && result.value) {
        eligible.push(email);
      } else {
        blocked.push(email);
      }
    });

    return { eligible, blocked };
  }
}

/**
 * Convenience functions for common automated emails
 */

export async function sendAutomatedQuizResult(
  userEmail: string,
  userName: string,
  quizData: {
    topic: string;
    score: number;
    total?: number;
    percentage?: number;
    date?: string;
  }
) {
  const { quizResultEmailTemplate } = await import('./email-templates-professional');
  
  const template = quizResultEmailTemplate(userName, {
    quizTitle: quizData.topic,
    score: quizData.percentage || Math.round((quizData.score / (quizData.total || 10)) * 100),
    correct: quizData.score.toString(),
    incorrect: ((quizData.total || 10) - quizData.score).toString(),
    date: quizData.date || new Date().toLocaleDateString()
  });

  return EmailAutomation.sendAutomatedEmail(userEmail, 'quizResults', template);
}

export async function sendAutomatedStudyReminder(
  userEmail: string,
  userName: string,
  reminderData?: {
    lastActivity?: string;
    weakAreas?: string[];
    streakDays?: number;
  }
) {
  const { studyReminderEmailTemplate } = await import('./email-templates-professional');
  const template = studyReminderEmailTemplate(userName, reminderData);

  return EmailAutomation.sendAutomatedEmail(userEmail, 'studyReminders', template);
}

export async function sendAutomatedWelcomeEmail(
  userEmail: string,
  userName: string,
  accountDetails: {
    planName?: string;
    signupDate?: string;
  }
) {
  const { welcomeEmailTemplate } = await import('./email-templates-professional');
  
  const template = welcomeEmailTemplate(userName, {
    userEmail,
    planName: accountDetails.planName || 'Free',
    signupDate: accountDetails.signupDate || new Date().toLocaleDateString()
  });

  return EmailAutomation.sendAutomatedEmail(userEmail, 'promotions', template);
}

export async function sendAutomatedLoginAlert(
  userEmail: string,
  userName: string,
  loginData: {
    device: string;
    location: string;
    ipAddress: string;
    time: string;
  }
) {
  const { loginNotificationEmailTemplate } = await import('./email-templates-professional');
  const template = loginNotificationEmailTemplate(userName, loginData);

  return EmailAutomation.sendAutomatedEmail(userEmail, 'loginAlerts', template);
}