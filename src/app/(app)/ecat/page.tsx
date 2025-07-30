
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "ECAT Preparation",
    description: "Prepare for the ECAT with specialized subject-wise tests in Physics, Mathematics, English, Chemistry and Computer Science, plus full-length mock tests.",
};

const subjects = [
    { name: 'Physics', description: "30 MCQs from FSC Part 1 & 2.", href: '/ecat/physics' },
    { name: 'Mathematics', description: "30 MCQs from FSC Math Part 1 & 2.", href: '/ecat/mathematics' },
    { name: 'English', description: "10 MCQs covering grammar and vocabulary.", href: '/ecat/english' },
    { name: 'Chemistry', description: "Optional section with 30 MCQs.", href: '/ecat/chemistry' },
    { name: 'Computer Science', description: "Optional section with 30 MCQs.", href: '/ecat/computer-science' },
]

export default function EcatPage() {
  return (
    <div>
      <PageHeader
        title="ECAT Preparation"
        description="Specialized subject-wise and mock tests for engineering entry exams."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map(subject => (
            <Card key={subject.name} className="flex flex-col group hover:border-primary/50 transition-all duration-300">
                <CardHeader>
                    <CardTitle>{subject.name}</CardTitle>
                    <CardDescription>{subject.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                    <Button asChild>
                        <Link href={subject.href}>Start Practice <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link>
                    </Button>
                </CardContent>
            </Card>
        ))}
        <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-primary text-primary-foreground flex flex-col md:flex-row items-center justify-between p-6">
            <div className="mb-4 md:mb-0">
                <CardTitle className="text-2xl">Full-Length Mock Test</CardTitle>
                <CardDescription className="text-primary-foreground/80 mt-2">Simulate the real ECAT experience (100 MCQs) with our full-length mock test.</CardDescription>
            </div>
            <Button asChild variant="secondary" size="lg">
                <Link href="/ecat/mock-test">Start Mock Test <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
        </Card>
      </div>
    </div>
  );
}
