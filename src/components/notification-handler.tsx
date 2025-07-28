
"use client";

import { useEffect } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { auth, db, app } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

export default function NotificationHandler() {
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const messaging = getMessaging(app);

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

            const fcmToken = await getToken(messaging, { vapidKey: vapidKey });
            if (fcmToken) {
              console.log('FCM Token:', fcmToken);
              // Save the token to your database (e.g., Firestore) associated with the user
              const currentUser = auth.currentUser;
              if (currentUser) {
                  const firestore = getFirestore(app);
                  await setDoc(doc(firestore, "fcmTokens", currentUser.uid), { token: fcmToken, timestamp: new Date() });
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

      onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);
        toast({
          title: payload.notification?.title,
          description: payload.notification?.body,
        });
      });
    }
  }, [toast]);

  return null; // This component does not render anything
}
