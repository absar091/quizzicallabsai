'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
      className={cn(
        "backdrop-blur-md bg-white/10 dark:bg-gray-800/10",
        "border border-white/20 dark:border-gray-700/20",
        "rounded-2xl shadow-xl",
        "hover:shadow-2xl hover:bg-white/20 dark:hover:bg-gray-800/20",
        "transition-all duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function FeatureCard({ icon: Icon, title, description, gradient }: {
  icon: any;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <GlassCard className="p-6 text-center group">
      <div className={cn("w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center", gradient)}>
        <Icon className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
        {description}
      </p>
    </GlassCard>
  );
}