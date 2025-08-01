"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const primaryText = "Quizzicalabs™";
const secondaryText = "— By Absar Ahmad Rao";
const letterStaggerDelay = 0.07;

const createSpans = (text: string, baseDelay: number) => {
    return text.split('').map((char, index) => {
        const style = { animationDelay: `${baseDelay + (index * letterStaggerDelay)}s` };
        if (char === ' ') {
            return <span key={index} className="letter space" style={style}>&nbsp;</span>;
        }
        return <span key={index} className="letter" style={style}>{char}</span>;
    });
};

type SplashScreenProps = {
    onAnimationComplete: () => void;
};

export function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const splashShown = sessionStorage.getItem('splashShown');

    if (!splashShown) {
      setIsVisible(true);
      const totalAnimationTime = (primaryText.length + secondaryText.length) * letterStaggerDelay * 1000 + 1500;
      
      const timer = setTimeout(() => {
        sessionStorage.setItem('splashShown', 'true');
        onAnimationComplete();
      }, totalAnimationTime);

      return () => clearTimeout(timer);
    } else {
      // If already shown, immediately signal completion.
      onAnimationComplete();
    }
  }, [onAnimationComplete]);

  return (
    <AnimatePresence>
        {isVisible && (
            <motion.div 
              id="splashScreen"
              exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeIn" } }}
            >
                <div className="logo-container">
                    <div className="name-container">
                        <div className="text-wrapper">
                            <div className="name-group primary">
                                {createSpans(primaryText, 0)}
                            </div>
                            <div className="name-group secondary">
                                {createSpans(secondaryText, (primaryText.length) * letterStaggerDelay)}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
  );
}
