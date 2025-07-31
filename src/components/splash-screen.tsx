
"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Sparkles } from "lucide-react";

export function SplashScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background flex-col gap-4">
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="relative"
        >
            <BrainCircuit className="h-20 w-20 text-primary" />
             <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            >
                <Sparkles className="h-8 w-8 text-accent animate-pulse" />
            </motion.div>
        </motion.div>
        <motion.p
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
             className="text-muted-foreground"
        >
            Loading your experience...
        </motion.p>
    </div>
  );
}
