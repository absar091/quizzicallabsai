import { db } from './firebase-admin';

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
    console.log(`🔍 Checking email preferences for ${email.substring(0, 10)}... (${emailType})`);
    
    // Always allow critical emails
    if (emailType === 'verification' || emailType === 'passwordReset') {
      console.log('✅ Critical email type - always allowed');
      return { canSend: true };
    }

    // Check if Firebase Admin is available
    if (!db) {
      console.warn('⚠️ Firebase Admin not available - defaulting to allow email');
      return { canSend: true };
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailKey = cleanEmail.replace(/\./g, '_');
    const preferencesRef = db.ref(`emailPreferences/${emailKey}`);
    const snapshot = await preferencesRef.once('value');

    if (!snapshot.exists()) {
      console.log('ℹ️ No preferences found - using defaults (allow all)');
      return { canSend: true };
    }

    const data = snapshot.val();
    console.log('📊 Raw database data:', data);
    
    const preferences = data.preferences || DEFAULT_PREFERENCES;
    
    console.log('📋 User preferences:', preferences);
    console.log('📋 Default preferences:', DEFAULT_PREFERENCES);

    // Check if user is completely unsubscribed
    if (preferences.all === true) {
      console.log('🚫 User completely unsubscribed');
      return { 
        canSend: false, 
        reason: 'User has unsubscribed from all emails' 
      };
    }

    // Check specific email type preference
    const specificPreference = preferences[emailType];
    const canSend = specificPreference !== false;
    
    console.log(`📧 ${emailType} preference value:`, specificPreference);
    console.log(`📧 ${emailType} can send: ${canSend ? 'ALLOWED' : 'BLOCKED'}`);
    
    return {
      canSend,
      reason: canSend ? undefined : `User has opted out of ${emailType} emails`
    };

  } catch (error) {
    console.error('❌ Error checking email preferences:', error);
    // On error, default to allowing the email (fail-safe)
    console.log('⚠️ Error occurred - defaulting to allow email');
    return { canSend: true };
  }
}

/**
 * Get user's current email preferences
 */
export async function getUserEmailPreferences(email: string): Promise<EmailPreferences> {
  try {
    console.log(`📖 Getting email preferences for ${email.substring(0, 10)}...`);
    
    // Check if Firebase Admin is available
    if (!db) {
      console.warn('⚠️ Firebase Admin not available - returning defaults');
      return DEFAULT_PREFERENCES;
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailKey = cleanEmail.replace(/\./g, '_');
    const preferencesRef = db.ref(`emailPreferences/${emailKey}`);
    const snapshot = await preferencesRef.once('value');

    if (!snapshot.exists()) {
      console.log('ℹ️ No preferences found - returning defaults');
      return DEFAULT_PREFERENCES;
    }

    const data = snapshot.val();
    const preferences = data.preferences || DEFAULT_PREFERENCES;
    
    console.log('📋 Retrieved preferences:', preferences);
    return preferences;

  } catch (error) {
    console.error('❌ Error getting email preferences:', error);
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