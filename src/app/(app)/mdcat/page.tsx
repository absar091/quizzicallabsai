
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from "lucide-react";

const subjects = [
    { name: 'Biology', href: '/mdcat/biology' },
    { name: 'Chemistry', href: '/mdcat/chemistry' },
    { name: 'Physics', href: '/mdcat/physics' },
    { name: 'English', href: '/mdcat/english' },
    { name: 'Logical Reasoning', href: '/mdcat/logical-reasoning' },
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
            <Card key={subject.name} className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>{subject.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href={subject.href}>Start Test <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </CardContent>
            </Card>
        ))}
        <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-primary text-primary-foreground">
            <CardHeader>
                <CardTitle>Full-Length Mock Test</CardTitle>
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
