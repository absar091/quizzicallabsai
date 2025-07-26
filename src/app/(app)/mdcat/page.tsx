
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "MDCAT Preparation",
    description: "Prepare for the MDCAT with specialized subject-wise tests in Biology, Chemistry, Physics, English, and Logical Reasoning, plus full-length mock tests.",
};

const subjects = [
    { name: 'Biology', description: "Comprehensive tests covering all biology topics.", href: '/mdcat/biology' },
    { name: 'Chemistry', description: "Test your knowledge in organic and inorganic chemistry.", href: '/mdcat/chemistry' },
    { name: 'Physics', description: "Practice problems from mechanics to modern physics.", href: '/mdcat/physics' },
    { name: 'English', description: "Improve your grammar, vocabulary, and comprehension skills.", href: '/mdcat/english' },
    { name: 'Logical Reasoning', description: "Sharpen your critical thinking and problem-solving abilities.", href: '/mdcat/logical-reasoning' },
]

export default function MdcatPage() {
  return (
    <div>
      <PageHeader
        title="MDCAT Preparation"
        description="Specialized subject-wise and mock tests for medical entry exams."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map(subject => (
            <Card key={subject.name} className="flex flex-col">
                <CardHeader>
                    <CardTitle>{subject.name}</CardTitle>
                    <CardDescription>{subject.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                    <Button asChild>
                        <Link href={subject.href}>Start Test <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </CardContent>
            </Card>
        ))}
        <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-primary text-primary-foreground">
            <CardHeader>
                <CardTitle>Full-Length Mock Test</CardTitle>
                <CardDescription className="text-primary-foreground/80">Simulate the real exam experience with our full-length mock test.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Button asChild variant="secondary">
                    <Link href="/mdcat/mock-test">Start Mock Test <ArrowRight className="ml-2 h-4 w-4" /></Link>
                 </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
