
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

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window !== 'undefined') {
      const splashShown = sessionStorage.getItem('splashShown');

      if (!splashShown) {
        setIsVisible(true);
        const timer = setTimeout(() => {
          onAnimationComplete();
        }, 3000); // Animation duration

        return () => clearTimeout(timer);
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
              exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeOut" } }}
            >
               <motion.div
                    className="logo"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 0.8,
                        delay: 0.2,
                        ease: [0, 0.71, 0.2, 1.01]
                    }}
                >
                    <BrainCircuit className="logo-icon" />
               </motion.div>
                <motion.h1
                    className="logo-text"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    Quizzicallabs <sup className="logo-sup">AI</sup>
                </motion.h1>
            </motion.div>
        )}
    </AnimatePresence>
  );
}
