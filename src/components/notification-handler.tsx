
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
      // const messaging = getMessaging(app); // Disabled

      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        }).catch((err) => {
          console.error('Service worker registration failed:', err);
        });

      // Disable FCM for now to prevent blocking
      console.log('FCM disabled to prevent app blocking');

      // FCM messaging disabled
      return () => {};
    }
  }, [toast]);

  return null;
}
