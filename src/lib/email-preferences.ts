import { firestore } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export interface EmailPreferences {
  quizResults: boolean;
  studyReminders: boolean;
  loginAlerts: boolean;
  promotions: boolean;
  newsletters: boolean;
  all: boolean; // If true, user is completely unsubscribed
}

export const DEFAULT_PREFERENCES: EmailPreferences = {
  quizResults: true,
  studyReminders: true,
  loginAlerts: true,
  promotions: true,
  newsletters: true,
  all: false
};

export type EmailType = 
  | 'quizResults' 
  | 'studyReminders' 
  | 'loginAlerts' 
  | 'promotions' 
  | 'newsletters'
  | 'verification' // Always allowed
  | 'passwordReset'; // Always allowed

/**
 * Check if user has opted out of a specific email type
 */
export async function checkEmailPreferences(
  email: string, 
  emailType: EmailType
): Promise<{ canSend: boolean; reason?: string }> {
  try {
    // Always allow critical emails
    if (emailType === 'verification' || emailType === 'passwordReset') {
      return { canSend: true };
    }

    const cleanEmail = email.trim().toLowerCase();
    const preferencesRef = doc(firestore, 'email-preferences', cleanEmail);
    const docSnap = await getDoc(preferencesRef);

    if (!docSnap.exists()) {
      // No preferences set, use defaults (allow all)
      return { canSend: true };
    }

    const data = docSnap.data();
    const preferences = data.preferences || DEFAULT_PREFERENCES;

    // Check if user is completely unsubscribed
    if (preferences.all === true) {
      return { 
        canSend: false, 
        reason: 'User has unsubscribed from all emails' 
      };
    }

    // Check specific email type preference
    const canSend = preferences[emailType] !== false;
    
    return {
      canSend,
      reason: canSend ? undefined : `User has opted out of ${emailType} emails`
    };

  } catch (error) {
    console.error('Error checking email preferences:', error);
    // On error, default to allowing the email (fail-safe)
    return { canSend: true };
  }
}

/**
 * Get user's current email preferences
 */
export async function getUserEmailPreferences(email: string): Promise<EmailPreferences> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const preferencesRef = doc(firestore, 'email-preferences', cleanEmail);
    const docSnap = await getDoc(preferencesRef);

    if (!docSnap.exists()) {
      return DEFAULT_PREFERENCES;
    }

    const data = docSnap.data();
    return data.preferences || DEFAULT_PREFERENCES;

  } catch (error) {
    console.error('Error getting email preferences:', error);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Log email sending attempt for analytics
 */
export async function logEmailAttempt(
  email: string, 
  emailType: EmailType, 
  sent: boolean, 
  reason?: string
) {
  try {
    console.log(`📧 Email ${emailType} to ${email.substring(0, 10)}...: ${sent ? 'SENT' : 'BLOCKED'}${reason ? ` (${reason})` : ''}`);
    
    // You can extend this to log to analytics or monitoring service
    // Example: await analytics.track('email_attempt', { email, emailType, sent, reason });
    
  } catch (error) {
    console.error('Error logging email attempt:', error);
  }
}