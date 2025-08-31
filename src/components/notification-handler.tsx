
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
      const messaging = getMessaging(app);

      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        }).catch((err) => {
          console.error('Service worker registration failed:', err);
        });

      const requestPermission = async () => {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            console.log('Notification permission granted.');
            const vapidKey = process.env.NEXT_PUBLIC_FCM_VAPID_KEY;
            if (!vapidKey) {
                console.error("VAPID key not found in environment variables.");
                return;
            }

            const fcmToken = await getToken(messaging, { vapidKey: vapidKey, serviceWorkerRegistration: await navigator.serviceWorker.ready });
            if (fcmToken) {
              console.log('FCM Token:', fcmToken);
              const currentUser = auth.currentUser;
              if (currentUser) {
                  const tokenRef = ref(db, `fcmTokens/${currentUser.uid}`);
                  await set(tokenRef, { token: fcmToken, timestamp: new Date().toISOString() });
              }
            } else {
              console.log('No registration token available. Request permission to generate one.');
            }
          } else {
            console.log('Unable to get permission to notify.');
          }
        } catch (error) {
          console.error('An error occurred while retrieving token. ', error);
        }
      };

      requestPermission();

      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);
        toast({
          title: payload.notification?.title,
          description: payload.notification?.body,
        });
      });
      
      return () => {
          unsubscribe();
      }
    }
  }, [toast]);

  return null;
}
