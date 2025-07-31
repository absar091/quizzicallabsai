
"use client";

import { motion } from "framer-motion";
import { Logo } from "./logo";

export function SplashScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background flex-col gap-4">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
        >
            <Logo className="h-16 w-16 text-primary" />
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
