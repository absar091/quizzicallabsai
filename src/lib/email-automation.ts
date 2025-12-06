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

export async function sendAutomatedPaymentConfirmation(
  userEmail: string,
  userName: string,
  paymentData: {
    amount: number;
    planName: string;
    transactionId: string;
    date: string;
  }
) {
  const template = {
    subject: `Payment Confirmation - ${paymentData.planName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">Quizzicallabzᴬᴵ</h1>
          <p style="color: #6b7280; margin: 5px 0;">Payment Confirmation</p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1f2937; margin-top: 0;">Hi ${userName},</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Thank you for your payment! Your subscription has been successfully activated.
          </p>
        </div>

        <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #1f2937; margin-top: 0;">Payment Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Plan:</td>
              <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${paymentData.planName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Amount:</td>
              <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">PKR ${paymentData.amount}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Transaction ID:</td>
              <td style="padding: 8px 0; color: #1f2937; font-family: monospace;">${paymentData.transactionId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Date:</td>
              <td style="padding: 8px 0; color: #1f2937;">${paymentData.date}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Go to Dashboard
          </a>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    `,
    text: `
Payment Confirmation - ${paymentData.planName}

Hi ${userName},

Thank you for your payment! Your subscription has been successfully activated.

Payment Details:
- Plan: ${paymentData.planName}
- Amount: PKR ${paymentData.amount}
- Transaction ID: ${paymentData.transactionId}
- Date: ${paymentData.date}

Visit your dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard

If you have any questions, please contact our support team.

Best regards,
Quizzicallabzᴬᴵ Team
    `
  };

  return EmailAutomation.sendAutomatedEmail(userEmail, 'promotions', template, {
    skipPreferenceCheck: true // Payment confirmations are critical emails
  });
}

export async function sendAutomatedLimitReached(
  userEmail: string,
  userName: string,
  limitData: {
    limitType: 'tokens' | 'quizzes';
    currentPlan: string;
    usedAmount: number;
    limitAmount: number;
    resetDate?: string;
  }
) {
  const isTokenLimit = limitData.limitType === 'tokens';
  const limitName = isTokenLimit ? 'AI Token' : 'Quiz Generation';
  const limitIcon = isTokenLimit ? '🪙' : '📝';

  const template = {
    subject: `${limitIcon} ${limitName} Limit Reached - Upgrade to Continue`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">Quizzicallabzᴬᴵ</h1>
          <p style="color: #6b7280; margin: 5px 0;">Usage Limit Notification</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); padding: 30px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 10px;">${limitIcon}</div>
          <h2 style="color: white; margin: 0 0 10px 0;">${limitName} Limit Reached</h2>
          <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 16px;">
            You've used ${limitData.usedAmount.toLocaleString()} of ${limitData.limitAmount.toLocaleString()} ${isTokenLimit ? 'tokens' : 'quizzes'}
          </p>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #1f2937; margin-top: 0;">Hi ${userName},</h3>
          <p style="color: #4b5563; line-height: 1.6;">
            You've reached your monthly ${limitName.toLowerCase()} limit on the <strong>${limitData.currentPlan}</strong> plan. 
            To continue using our AI-powered features, you have two options:
          </p>
        </div>

        <div style="background: white; border: 2px solid #2563eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #1f2937; margin-top: 0;">📈 Option 1: Upgrade Your Plan</h3>
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 15px;">
            Get instant access to more ${isTokenLimit ? 'tokens' : 'quizzes'} and premium features:
          </p>
          <ul style="color: #4b5563; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li><strong>Pro Plan:</strong> 100,000 tokens/month + Gemini 2.5 Pro AI</li>
            <li><strong>Premium Plan:</strong> 500,000 tokens/month + Priority Support</li>
            <li><strong>Ultimate Plan:</strong> 2,000,000 tokens/month + All Features</li>
          </ul>
          <div style="text-align: center; margin-top: 20px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing" 
               style="background: #2563eb; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600;">
              View Pricing & Upgrade
            </a>
          </div>
        </div>

        <div style="background: white; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #1f2937; margin-top: 0;">⏰ Option 2: Wait for Reset</h3>
          <p style="color: #4b5563; line-height: 1.6; margin: 0;">
            Your ${limitName.toLowerCase()} limit will automatically reset on <strong>${limitData.resetDate || 'the 1st of next month'}</strong>. 
            You can continue using the platform then at no additional cost.
          </p>
        </div>

        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
          <p style="color: #92400e; margin: 0; font-size: 14px;">
            <strong>💡 Need Help?</strong> If you'd like to discuss custom plans or have questions about upgrading, 
            our support team is here to help at <a href="mailto:support@quizzicallabs.com" style="color: #2563eb;">support@quizzicallabs.com</a>
          </p>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
            <strong>Current Plan:</strong> ${limitData.currentPlan}
          </p>
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
            <strong>Usage:</strong> ${limitData.usedAmount.toLocaleString()} / ${limitData.limitAmount.toLocaleString()} ${isTokenLimit ? 'tokens' : 'quizzes'}
          </p>
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            Questions? Contact us at <a href="mailto:support@quizzicallabs.com" style="color: #2563eb;">support@quizzicallabs.com</a>
          </p>
        </div>
      </div>
    `,
    text: `
${limitIcon} ${limitName} Limit Reached

Hi ${userName},

You've reached your monthly ${limitName.toLowerCase()} limit on the ${limitData.currentPlan} plan.
Usage: ${limitData.usedAmount.toLocaleString()} / ${limitData.limitAmount.toLocaleString()} ${isTokenLimit ? 'tokens' : 'quizzes'}

To continue using our AI-powered features, you have two options:

📈 OPTION 1: UPGRADE YOUR PLAN
Get instant access to more ${isTokenLimit ? 'tokens' : 'quizzes'} and premium features:
- Pro Plan: 100,000 tokens/month + Gemini 2.5 Pro AI
- Premium Plan: 500,000 tokens/month + Priority Support
- Ultimate Plan: 2,000,000 tokens/month + All Features

View pricing and upgrade: ${process.env.NEXT_PUBLIC_APP_URL}/pricing

⏰ OPTION 2: WAIT FOR RESET
Your ${limitName.toLowerCase()} limit will automatically reset on ${limitData.resetDate || 'the 1st of next month'}.

💡 NEED HELP?
If you'd like to discuss custom plans or have questions about upgrading, contact our support team:
Email: support@quizzicallabs.com

Best regards,
Quizzicallabzᴬᴵ Team
    `
  };

  return EmailAutomation.sendAutomatedEmail(userEmail, 'promotions', template, {
    skipPreferenceCheck: false // Allow users to opt out of limit notifications
  });
}

export async function sendAutomatedPlanUpgrade(
  userEmail: string,
  userName: string,
  upgradeData: {
    newPlan: string;
    previousPlan?: string;
    tokensLimit: number;
    quizzesLimit: number;
    upgradeDate?: string;
    upgradeMethod?: 'promo_code' | 'payment' | 'admin';
  }
) {
  const template = {
    subject: `🎉 Welcome to ${upgradeData.newPlan} Plan!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">Quizzicallabzᴬᴵ</h1>
          <p style="color: #6b7280; margin: 5px 0;">Plan Upgrade Confirmation</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
          <h2 style="color: white; margin: 0 0 10px 0;">Congratulations!</h2>
          <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 18px;">
            You've been upgraded to the <strong>${upgradeData.newPlan}</strong> plan!
          </p>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #1f2937; margin-top: 0;">Hi ${userName},</h3>
          <p style="color: #4b5563; line-height: 1.6;">
            Great news! Your account has been successfully upgraded to the <strong>${upgradeData.newPlan}</strong> plan. 
            You now have access to enhanced features and increased limits.
          </p>
        </div>

        <div style="background: white; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #1f2937; margin-top: 0;">✨ Your New Benefits</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; color: #6b7280; border-bottom: 1px solid #e5e7eb;">
                <span style="font-size: 20px; margin-right: 8px;">🎯</span> Plan
              </td>
              <td style="padding: 12px 0; color: #1f2937; font-weight: 600; border-bottom: 1px solid #e5e7eb; text-align: right;">
                ${upgradeData.newPlan}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #6b7280; border-bottom: 1px solid #e5e7eb;">
                <span style="font-size: 20px; margin-right: 8px;">🪙</span> AI Tokens
              </td>
              <td style="padding: 12px 0; color: #1f2937; font-weight: 600; border-bottom: 1px solid #e5e7eb; text-align: right;">
                ${upgradeData.tokensLimit.toLocaleString()} / month
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #6b7280; border-bottom: 1px solid #e5e7eb;">
                <span style="font-size: 20px; margin-right: 8px;">📝</span> Quizzes
              </td>
              <td style="padding: 12px 0; color: #1f2937; font-weight: 600; border-bottom: 1px solid #e5e7eb; text-align: right;">
                ${upgradeData.quizzesLimit} / month
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #6b7280;">
                <span style="font-size: 20px; margin-right: 8px;">🤖</span> AI Model
              </td>
              <td style="padding: 12px 0; color: #1f2937; font-weight: 600; text-align: right;">
                ${upgradeData.newPlan === 'Pro' ? 'Gemini 2.5 Pro' : 'Gemini 1.5 Flash'}
              </td>
            </tr>
          </table>
        </div>

        ${upgradeData.newPlan === 'Pro' ? `
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
          <p style="color: #92400e; margin: 0; font-size: 14px;">
            <strong>💡 Pro Tip:</strong> You now have access to our most advanced AI model (Gemini 2.5 Pro) 
            for more accurate and detailed quiz generation!
          </p>
        </div>
        ` : ''}

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
             style="background: #2563eb; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600;">
            Start Using Your New Features
          </a>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h4 style="color: #1f2937; margin-top: 0;">📅 Upgrade Details</h4>
          <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
            <strong>Upgrade Date:</strong> ${upgradeData.upgradeDate || new Date().toLocaleDateString()}
          </p>
          ${upgradeData.previousPlan ? `
          <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
            <strong>Previous Plan:</strong> ${upgradeData.previousPlan}
          </p>
          ` : ''}
          <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
            <strong>Billing Cycle:</strong> Monthly (resets on the 1st of each month)
          </p>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
            Need help getting started? Check out our <a href="${process.env.NEXT_PUBLIC_APP_URL}/help" style="color: #2563eb;">Help Center</a>
          </p>
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            Questions? Contact us at <a href="mailto:support@quizzicallabs.com" style="color: #2563eb;">support@quizzicallabs.com</a>
          </p>
        </div>
      </div>
    `,
    text: `
🎉 Welcome to ${upgradeData.newPlan} Plan!

Hi ${userName},

Congratulations! Your account has been successfully upgraded to the ${upgradeData.newPlan} plan.

Your New Benefits:
- Plan: ${upgradeData.newPlan}
- AI Tokens: ${upgradeData.tokensLimit.toLocaleString()} / month
- Quizzes: ${upgradeData.quizzesLimit} / month
- AI Model: ${upgradeData.newPlan === 'Pro' ? 'Gemini 2.5 Pro' : 'Gemini 1.5 Flash'}

Upgrade Details:
- Upgrade Date: ${upgradeData.upgradeDate || new Date().toLocaleDateString()}
${upgradeData.previousPlan ? `- Previous Plan: ${upgradeData.previousPlan}` : ''}
- Billing Cycle: Monthly (resets on the 1st of each month)

Start using your new features: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard

Need help? Visit our Help Center: ${process.env.NEXT_PUBLIC_APP_URL}/help
Questions? Email us: support@quizzicallabs.com

Best regards,
Quizzicallabzᴬᴵ Team
    `
  };

  return EmailAutomation.sendAutomatedEmail(userEmail, 'promotions', template, {
    skipPreferenceCheck: true // Plan upgrades are important notifications
  });
}