import { ref, set, get, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";

export interface NotificationPreferences {
  quizGenerationCompleted: boolean;
  examPrepReady: boolean;
  studyReminders: boolean;
  dailyGoals: boolean;
}

export interface BackgroundJob {
  id: string;
  userId: string;
  type: 'quiz_generation' | 'exam_prep';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  formValues: any;
  progress: number;
  result?: any;
  error?: string;
  createdAt: number;
  completedAt?: number;
  metadata?: {
    estimatedTime?: number;
    lastUpdateTime?: number;
    retryCount?: number;
  };
}

class NotificationService {
  private askForPermissionThrown = false;

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      console.log('User has blocked notifications');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast({
          title: "Notifications enabled! 🎉",
          description: "You'll receive updates when your quiz is ready.",
        });
        return true;
      } else {
        toast({
          title: "Notifications blocked",
          description: "You won't receive updates, but you can continue using the app.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async showNotification(title: string, body: string, icon?: string, badge?: string) {
    if (!this.canShowNotifications()) {
      return;
    }

    const options: NotificationOptions = {
      body,
      icon: icon || '/favicon.svg',
      badge: badge || '/favicon.svg',
      requireInteraction: true,
      silent: false,
      tag: 'quiz-app', // Prevents duplicate notifications
    };

    try {
      const notification = new Notification(title, options);

      // Auto-close after 5 seconds
      setTimeout(() => notification.close(), 5000);

      // Click handler
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Play sound if supported
      if ('Audio' in window) {
        try {
          const audio = new Audio('/notification.mp3');
          audio.volume = 0.3;
          audio.play().catch(() => {
            // Silently fail if audio can't be played
          });
        } catch (error) {
          // Silently fail
        }
      }

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  showQuizReadyNotification(job: BackgroundJob) {
    const title = job.type === 'quiz_generation'
      ? 'Your Quiz is Ready! ✅'
      : 'Exam Preparation Ready! 📚';

    const body = job.type === 'quiz_generation'
      ? `Custom quiz on "${job.formValues?.topic}" is ready to take!`
      : `Exam prep content for "${job.formValues?.topic}" is generated!`;

    return this.showNotification(title, body);
  }

  canShowNotifications(): boolean {
    return 'Notification' in window && Notification.permission === 'granted';
  }

  async savePreferences(userId: string, preferences: NotificationPreferences): Promise<void> {
    try {
      const prefsRef = ref(db, `notificationPreferences/${userId}`);
      await set(prefsRef, preferences);
    } catch (error) {
      console.error('Error saving notification preferences:', error);
    }
  }

  async getPreferences(userId: string): Promise<NotificationPreferences | null> {
    try {
      const prefsRef = ref(db, `notificationPreferences/${userId}`);
      const snapshot = await get(prefsRef);
      if (snapshot.exists()) {
        return snapshot.val();
      }
    } catch (error) {
      console.error('Error getting notification preferences:', error);
    }
    return null;
  }

  // Schedule daily reminder notifications for inactive users
  async sendDailyReminderNotifications(): Promise<{ sent: number; errors: number }> {
    try {
      console.log('📧 Starting daily reminder notifications...');
      
      const { ref, get } = await import('firebase/database');
      const { db } = await import('@/lib/firebase');
      
      let sent = 0;
      let errors = 0;
      
      // Get all users from Firebase
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);
      
      if (!snapshot.exists()) {
        console.log('📧 No users found in database');
        return { sent: 0, errors: 0 };
      }
      
      const users = snapshot.val();
      const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
      
      // Check quiz results to find inactive users
      for (const [userId, userData] of Object.entries(users as any)) {
        try {
          if (!userData.email) continue;
          
          // Check last quiz activity
          const resultsRef = ref(db, `quizResults/${userId}`);
          const resultsSnapshot = await get(resultsRef);
          
          let isInactive = true;
          if (resultsSnapshot.exists()) {
            const results = Object.values(resultsSnapshot.val() as any);
            const lastActivity = Math.max(...results.map((r: any) => r.createdAt || 0));
            isInactive = lastActivity < threeDaysAgo;
          }
          
          if (isInactive) {
            // Send reminder email
            const response = await fetch('/api/send-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'study-reminder',
                to: userData.email,
                userName: userData.displayName || userData.email.split('@')[0] || 'Student'
              })
            });
            
            if (response.ok) {
              sent++;
              console.log(`✅ Reminder sent to ${userData.email}`);
            } else {
              errors++;
              console.error(`❌ Failed to send reminder to ${userData.email}`);
            }
          }
        } catch (userError) {
          errors++;
          console.error(`❌ Error processing user ${userId}:`, userError);
        }
      }
      
      console.log(`📧 Daily reminders completed: ${sent} sent, ${errors} errors`);
      return { sent, errors };
      
    } catch (error) {
      console.error('❌ Daily reminder notifications failed:', error);
      throw error;
    }
  }

  // Send engagement notifications to keep users engaged
  async sendEngagementNotifications(): Promise<void> {
    // Implementation for engagement notifications
    console.log('Engagement notifications system - placeholder');
  }

  // Send notifications to inactive users to re-engage
  async sendInactiveUserNotifications(): Promise<void> {
    // Implementation for re-engagement notifications
    console.log('Inactive user notifications system - placeholder');
  }

  // Send welcome notifications to new users
  async sendWelcomeNotifications(): Promise<void> {
    // Implementation for welcome notifications
    console.log('Welcome notifications system - placeholder');
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Standalone functions for cron jobs and API routes
export async function sendDailyReminderNotifications(): Promise<void> {
  const service = new NotificationService();
  return service.sendDailyReminderNotifications();
}

export async function sendEngagementNotifications(): Promise<void> {
  const service = new NotificationService();
  return service.sendEngagementNotifications();
}

export async function sendInactiveUserNotifications(): Promise<void> {
  const service = new NotificationService();
  return service.sendInactiveUserNotifications();
}

export async function sendWelcomeNotifications(): Promise<void> {
  const service = new NotificationService();
  return service.sendWelcomeNotifications();
}
