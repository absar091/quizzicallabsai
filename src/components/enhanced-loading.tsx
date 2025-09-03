// Enhanced loading states with skeleton screens
import { motion } from 'framer-motion';
import { Loader2, Brain, Sparkles } from 'lucide-react';

interface LoadingProps {
  type?: 'quiz' | 'questions' | 'results' | 'default';
  message?: string;
  progress?: number;
}

export function EnhancedLoading({ type = 'default', message, progress }: LoadingProps) {
  const getLoadingContent = () => {
    switch (type) {
      case 'quiz':
        return {
          icon: <Brain className="h-12 w-12 text-primary" />,
          title: 'Generating Quiz',
          subtitle: 'Creating personalized questions for you...',
          tips: [
            'Questions are tailored to your learning level',
            'Each quiz is unique and challenging',
            'AI ensures curriculum compliance'
          ]
        };
      case 'questions':
        return {
          icon: <Sparkles className="h-12 w-12 text-primary" />,
          title: 'Crafting Questions',
          subtitle: 'Building the perfect practice set...',
          tips: [
            'Analyzing your weak areas',
            'Selecting optimal difficulty',
            'Ensuring topic coverage'
          ]
        };
      case 'results':
        return {
          icon: <Loader2 className="h-12 w-12 text-primary animate-spin" />,
          title: 'Analyzing Results',
          subtitle: 'Calculating your performance...',
          tips: [
            'Identifying knowledge gaps',
            'Generating improvement suggestions',
            'Updating your progress'
          ]
        };
      default:
        return {
          icon: <Loader2 className="h-12 w-12 text-primary animate-spin" />,
          title: 'Loading',
          subtitle: message || 'Please wait...',
          tips: []
        };
    }
  };

  const content = getLoadingContent();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-6"
      >
        {content.icon}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-semibold mb-2"
      >
        {content.title}
      </motion.h2>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground mb-6"
      >
        {content.subtitle}
      </motion.p>

      {progress !== undefined && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          className="w-full max-w-xs mb-6"
        >
          <div className="bg-secondary rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">{progress}% complete</p>
        </motion.div>
      )}

      {content.tips.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          {content.tips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center text-sm text-muted-foreground"
            >
              <div className="w-1 h-1 bg-primary rounded-full mr-3" />
              {tip}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// Skeleton components for different content types
export function QuizSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-secondary rounded w-3/4" />
      <div className="space-y-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-secondary rounded" />
            <div className="h-4 bg-secondary rounded flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-secondary rounded-lg p-6">
          <div className="h-4 bg-muted rounded w-1/2 mb-4" />
          <div className="h-8 bg-muted rounded w-3/4" />
        </div>
      ))}
    </div>
  );
}