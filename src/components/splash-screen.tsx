
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";
import "/src/styles/splash.css";

type SplashScreenProps = {
    onAnimationComplete: () => void;
};

export function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window !== 'undefined') {
      const splashShown = sessionStorage.getItem('splashShown');

      if (!splashShown) {
        setIsVisible(true);

        // Update loading text
        const messages = [
          "Loading...",
          "Initializing...",
          "Almost ready...",
          "Starting up..."
        ];

        let messageIndex = 0;
        const messageInterval = setInterval(() => {
          messageIndex = (messageIndex + 1) % messages.length;
          setLoadingText(messages[messageIndex]);
        }, 800);

        const timer = setTimeout(() => {
          onAnimationComplete();
        }, 2500); // Shorter duration for better UX

        return () => {
          clearTimeout(timer);
          clearInterval(messageInterval);
        };
      } else {
        onAnimationComplete();
      }
    } else {
      // On server side, skip splash
      onAnimationComplete();
    }
  }, [onAnimationComplete]);

  return (
    <AnimatePresence>
        {isVisible && (
            <motion.div
              className="splash-screen"
              exit={{ opacity: 0, transition: { duration: 0.3, ease: "easeOut" } }}
            >
               <motion.div
                    className="logo"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 0.6,
                        delay: 0.1,
                        ease: [0, 0.71, 0.2, 1.01]
                    }}
                >
                    <BrainCircuit className="logo-icon" />
               </motion.div>
                <motion.h1
                    className="logo-text"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    Quizzicallabs <sup className="logo-sup">AI</sup>
                </motion.h1>

                {/* Loading text */}
                <motion.p
                  className="loading-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {loadingText}
                </motion.p>

                {/* Loading dots animation */}
                <motion.div
                  className="loading-dots"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                >
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
  );
}
