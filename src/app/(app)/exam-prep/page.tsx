
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

const tests = [
  {
    name: 'MDCAT',
    description: 'Medical & Dental College Admission Test preparation.',
    href: '/mdcat',
  },
  {
    name: 'ECAT',
    description: 'Engineering College Admission Test preparation.',
    href: '/ecat',
  },
  {
    name: 'NTS',
    description: 'National Testing Service (NAT) preparation.',
    href: '/nts',
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

export default function ExamPrepPage() {
  return (
    <div>
      <PageHeader
        title="Exam Preparation"
        description="Structured paths for Pakistan's major university entrance exams."
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {tests.map((test) => (
          <motion.div key={test.name} variants={itemVariants}>
            <Card className="flex flex-col h-full shadow-sm hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-semibold">{test.name}</CardTitle>
                        <CardDescription>{test.description}</CardDescription>
                    </div>
                </div>
                 <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2"/>
                 </div>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href={test.href}>
                    Continue Studying
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
