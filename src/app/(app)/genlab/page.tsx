
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, BotMessageSquare, BookOpen, FileUp, FileText, ClipboardSignature, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

const tools = [
  {
    icon: BotMessageSquare,
    title: 'Custom Quiz',
    description: 'Create personalized tests. Enter any topic, set difficulty, and choose question styles.',
    href: '/generate-quiz',
  },
  {
    icon: BookOpen,
    title: 'Practice Questions',
    description: 'Generate topic-specific questions with answers and detailed explanations.',
    href: '/generate-questions',
  },
  {
    icon: FileUp,
    title: 'Quiz from Document',
    description: 'Upload your study materials (PDF, DOCX) to generate a quiz from them.',
    href: '/generate-from-document',
  },
  {
    icon: FileText,
    title: 'AI Study Guide',
    description: 'Get comprehensive study guides on any topic with summaries and key concepts.',
    href: '/generate-study-guide',
  },
  {
    icon: ClipboardSignature,
    title: 'Exam Paper Generator',
    description: 'A tool for educators to create and format professional exam papers with answer keys.',
    href: '/generate-paper',
  },
  {
    icon: Camera,
    title: 'Explain Image',
    description: 'Upload a diagram or image and get a detailed AI explanation of what it shows.',
    href: '/image-to-explanation',
  },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

export default function GenLabPage() {
  return (
    <div>
      <PageHeader
        title="Generation Laboratory"
        description="Your suite of AI-powered tools for creating custom learning materials."
      />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {tools.map((tool) => (
          <motion.div key={tool.title} variants={itemVariants}>
            <Link href={tool.href} className="flex h-full">
              <Card className="flex flex-col w-full hover:border-primary transition-all duration-200 hover:shadow-lg group">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-3">
                    <tool.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{tool.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>{tool.description}</CardDescription>
                </CardContent>
                <CardContent className="mt-auto">
                  <div className="flex items-center text-primary font-semibold text-sm">
                    Use Tool <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
