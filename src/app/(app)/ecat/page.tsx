
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ecatSyllabus } from "@/lib/ecat-syllabus";

const subjects = Object.values(ecatSyllabus);

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
    tap: { scale: 0.98 }
}

export default function EcatPage() {
  return (
    <div>
      <PageHeader
        title="ECAT Preparation"
        description="Specialized subject-wise and mock tests for engineering entry exams."
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {subjects.map(subject => {
            const Icon = subject.icon;
            return (
                 <motion.div key={subject.name} variants={itemVariants} whileHover="hover" whileTap="tap">
                    <Card className="flex flex-col group h-full transition-all duration-300">
                        <CardHeader className="flex-row items-center gap-4">
                            {Icon && <Icon className="h-8 w-8 text-primary shrink-0" />}
                            <div>
                                <CardTitle>{subject.name}</CardTitle>
                                <CardDescription className="mt-1">{subject.description}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="mt-auto">
                            <Button asChild>
                                <Link href={`/ecat/${subject.slug}`}>Start Practice <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link>
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            )
        })}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-3">
             <Card className="bg-primary text-primary-foreground flex flex-col md:flex-row items-center justify-between p-6">
                <div className="mb-4 md:mb-0">
                    <CardTitle className="text-2xl">Full-Length Mock Test</CardTitle>
                    <CardDescription className="text-primary-foreground/80 mt-2">Simulate the real ECAT experience (100 MCQs) with our full-length mock test.</CardDescription>
                </div>
                <Button asChild variant="secondary" size="lg">
                    <Link href="/ecat/mock-test">Start Mock Test <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
