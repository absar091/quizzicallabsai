
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { mdcatSyllabus } from '@/lib/mdcat-syllabus';
import { ecatSyllabus } from '@/lib/ecat-syllabus';
import { ntsSyllabus } from '@/lib/nts-syllabus';

const tests = [
  {
    name: 'MDCAT',
    description: 'Medical & Dental College Admission Test preparation.',
    href: '/mdcat',
    syllabus: mdcatSyllabus,
  },
  {
    name: 'ECAT',
    description: 'Engineering College Admission Test preparation.',
    href: '/ecat',
    syllabus: ecatSyllabus,
  },
  {
    name: 'NTS',
    description: 'National Testing Service (NAT) preparation.',
    href: '/nts',
    syllabus: ntsSyllabus,
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

const cardHover = {
  hover: { y: -5, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
};

export default function ExamPrepPage() {
  return (
    <div>
      <PageHeader
        title="Exam Preparation"
        description="Specialized, syllabus-based tests for Pakistan's major university entrance exams."
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {tests.map((test) => (
          <motion.div key={test.name} variants={itemVariants} whileHover="hover" whileTap="tap">
            <Card className="flex flex-col group h-full transition-all duration-300 hover:shadow-md">
              <CardHeader className="flex-row items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <GraduationCap className="h-6 w-6 text-primary shrink-0" />
                </div>
                <div>
                  <CardTitle>{test.name}</CardTitle>
                  <CardDescription className="mt-1">{test.description}</CardDescription>
                </div>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Button asChild variant="secondary" className="w-full">
                  <Link href={test.href}>
                    View Prep Material{' '}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
