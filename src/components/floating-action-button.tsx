'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { BookOpen } from 'lucide-react';
import { FileText } from 'lucide-react';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: Sparkles, label: 'Generate Quiz', href: '/generate-quiz', color: 'bg-blue-500' },
    { icon: BookOpen, label: 'Study Guide', href: '/generate-study-guide', color: 'bg-green-500' },
    { icon: FileText, label: 'From File', href: '/generate-from-file', color: 'bg-purple-500' },
    { icon: Users, label: 'Shared Quiz', href: '#', color: 'bg-orange-500' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  scale: 1,
                  transition: { delay: index * 0.1 }
                }}
                exit={{ 
                  opacity: 0, 
                  x: 20, 
                  scale: 0.8,
                  transition: { delay: (actions.length - index) * 0.05 }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  size="sm"
                  className={`${action.color} hover:shadow-lg text-white rounded-full px-4 py-2 text-sm font-medium shadow-md`}
                >
                  <Link href={action.href} className="flex items-center gap-2">
                    <action.icon className="h-4 w-4" />
                    {action.label}
                  </Link>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Plus className="h-6 w-6" />
        </motion.div>
      </motion.button>
    </div>
  );
}