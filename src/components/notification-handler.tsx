
"use client";

import { useEffect } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { auth, db, app } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { ref, set } from 'firebase/database';

export default function NotificationHandler() {
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Register service worker first
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        }).catch((err) => {
          console.warn('Service worker registration failed:', err);
        });

      // Initialize FCM with proper error handling
      const initializeFCM = async () => {
        try {
          const messaging = getMessaging(app);
          const permission = await Notification.requestPermission();
          
          if (permission === 'granted') {
            console.log('Notification permission granted.');
            const vapidKey = process.env.NEXT_PUBLIC_FCM_VAPID_KEY;
            
            if (vapidKey) {
              try {
                const fcmToken = await getToken(messaging, { 
                  vapidKey: vapidKey, 
                  serviceWorkerRegistration: await navigator.serviceWorker.ready 
                });
                
                if (fcmToken) {
                  console.log('FCM Token obtained successfully');
                  const currentUser = auth.currentUser;
                  if (currentUser) {
                    const tokenRef = ref(db, `fcmTokens/${currentUser.uid}`);
                    await set(tokenRef, { token: fcmToken, timestamp: new Date().toISOString() });
                  }
                }
              } catch (tokenError) {
                console.warn('FCM token generation failed, continuing without notifications:', tokenError);
              }
            }
          }

          // Set up message listener
          const unsubscribe = onMessage(messaging, (payload) => {
            // Sanitize payload for logging
            const sanitizedPayload = {
              notification: {
                title: payload.notification?.title?.replace(/[\r\n]/g, '') || 'No title',
                body: payload.notification?.body?.replace(/[\r\n]/g, '') || 'No body'
              },
              data: payload.data
            };
            console.log('Message received:', sanitizedPayload);

            // Handle different notification types
            const notificationType = payload.data?.type;
            let toastConfig: any = {
              title: payload.notification?.title,
              description: payload.notification?.body,
            };

            // Customize toast based on notification type
            switch (notificationType) {
              case 'welcome':
                toastConfig.duration = 8000; // Longer duration for welcome messages
                break;
              case 'feature_intro':
                toastConfig.duration = 6000;
                break;
              case 'daily_reminder':
                toastConfig.action = {
                  label: 'Take Quiz',
                  onClick: () => window.location.href = payload.data?.click_action || '/generate-quiz'
                };
                break;
              case 'streak_reminder':
              case 'progress_check':
              case 'new_features':
                toastConfig.action = {
                  label: 'View Dashboard',
                  onClick: () => window.location.href = payload.data?.click_action || '/dashboard'
                };
                break;
              case 'reengagement':
                toastConfig.duration = 10000; // Extra long for reengagement
                break;
            }

            toast(toastConfig);

            // Handle click actions for background notifications
            if (payload.data?.click_action && notificationType) {
              // Store the action for when user clicks the notification
              localStorage.setItem('pendingNotificationAction', JSON.stringify({
                type: notificationType,
                action: payload.data.action,
                url: payload.data.click_action
              }));
            }
          });
          
          return unsubscribe;
        } catch (error) {
          console.warn('FCM initialization failed, app will continue without notifications:', error);
          return () => {};
        }
      };

      // Initialize FCM without blocking the app
      const cleanup = initializeFCM();
      return () => {
        cleanup.then(unsubscribe => unsubscribe?.());
      };
    }
  }, [toast]);

  return null;
}
