
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, FilePlus, Lightbulb, FileArrowUp, FileText, Cards, ClipboardText } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

const tools = [
  {
    icon: FilePlus,
    title: 'Custom Quiz',
    description: 'Create personalized tests on any topic, with custom difficulty and question styles.',
    href: '/generate-quiz',
  },
  {
    icon: Lightbulb,
    title: 'Practice Questions',
    description: 'Generate topic-specific questions with detailed answers and explanations.',
    href: '/generate-questions',
  },
  {
    icon: FileArrowUp,
    title: 'Smart File-to-Quiz',
    description: 'Upload a PDF or image and have the AI generate a quiz from its content automatically.',
    href: '/generate-from-file',
  },
  {
    icon: FileText,
    title: 'Study Guide Generator',
    description: 'Get a comprehensive guide on any topic with summaries and key concepts.',
    href: '/generate-study-guide',
  },
  {
    icon: Cards,
    title: 'Flashcards',
    description: 'Generate a deck of flashcards for any topic to supercharge your study sessions.',
    href: '/flashcards',
  },
  {
    icon: ClipboardText,
    title: 'Exam Paper Generator',
    description: 'A powerful tool for educators to create and format professional exam papers.',
    href: '/generate-paper',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function GenLabPage() {
  return (
    <div>
      <PageHeader
        title="Generation Laboratory"
        description="Your suite of AI-powered study tools."
      />
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {tools.map((tool) => (
          <motion.div key={tool.title} variants={itemVariants}>
            <Link href={tool.href} className="flex h-full group">
              <Card className="flex flex-row items-center w-full hover:bg-secondary transition-all duration-200 shadow-sm p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mr-4">
                    <tool.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-grow">
                    <CardTitle className="text-base font-semibold">{tool.title}</CardTitle>
                    <CardDescription className="text-sm">{tool.description}</CardDescription>
                  </div>
                   <ArrowRight className="h-5 w-5 text-muted-foreground ml-4 group-hover:translate-x-1 transition-transform" />
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
