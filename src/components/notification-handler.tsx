
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
              }
            };
            console.log('Message received:', sanitizedPayload);
            toast({
              title: payload.notification?.title,
              description: payload.notification?.body,
            });
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
