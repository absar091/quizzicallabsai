
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

export function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // This timer can be adjusted based on the total animation duration
    const timer = setTimeout(() => {
      setShow(false);
    }, (primaryText.length + secondaryText.length) * letterStaggerDelay * 1000 + 1000); // Wait a bit longer

    return () => clearTimeout(timer);
  }, []);

  const secondaryAnimationStartTime = (primaryText.length) * letterStaggerDelay;

  return (
    <AnimatePresence>
        {show && (
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
                                {createSpans(secondaryText, secondaryAnimationStartTime)}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
  );
}
