
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadCloud, MoreVertical, PlusSquare, Share, X } from "lucide-react";

export default function InstallPwaPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const installPromptShown = localStorage.getItem("install_prompt_shown");
    
    const userAgent = window.navigator.userAgent;
    setIsIOS(/iPhone|iPad|iPod/.test(userAgent));
    
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        return;
    }

    if (!installPromptShown) {
       const timer = setTimeout(() => {
         setShowPrompt(true);
       }, 7000); // Show after 7 seconds
      
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
     if (showPrompt) {
        const timer = setTimeout(() => {
            closePrompt();
        }, 15000); // Auto-dismiss after 15 seconds
        return () => clearTimeout(timer);
     }
  }, [showPrompt]);


  const closePrompt = () => {
    localStorage.setItem("install_prompt_shown", "true");
    setShowPrompt(false);
  };
  
  const getInstructions = () => {
    if (isIOS) {
      return <>Tap the <Share className="inline-block h-4 w-4 mx-1" /> button, then scroll down and tap 'Add to Home Screen' <PlusSquare className="inline-block h-4 w-4 mx-1" />.</>;
    } else { // Android/Desktop
      return <>Click the <MoreVertical className="inline-block h-4 w-4 mx-1" /> (or similar) menu button in your browser and select 'Install App' or 'Add to Home Screen'.</>;
    }
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="fixed bottom-16 md:bottom-4 left-1/2 -translate-x-1/2 z-[200] w-[calc(100%-2rem)] max-w-md"
        >
          <Card className="bg-background/90 backdrop-blur-sm border-2 shadow-2xl">
            <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-7 w-7" onClick={closePrompt}>
              <X className="h-4 w-4"/>
              <span className="sr-only">Close install prompt</span>
            </Button>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DownloadCloud className="h-6 w-6 text-primary"/>
                Install Quizzicallabs
              </CardTitle>
              <CardDescription>Get a better, full-screen experience by adding the app to your home screen.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    {getInstructions()}
                </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
