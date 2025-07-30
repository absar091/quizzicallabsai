
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookUser } from "lucide-react";
import type { Metadata } from "next";
import { ntsSyllabus } from "@/lib/nts-syllabus";

export const metadata: Metadata = {
    title: "NTS/NAT Preparation",
    description: "Prepare for the NTS/NAT with specialized tests for all categories including Pre-Engineering, Pre-Medical, Computer Science, and more.",
};

const categories = Object.values(ntsSyllabus);

export default function NtsPage() {
  return (
    <div>
      <PageHeader
        title="NTS / NAT Preparation"
        description="Select your test category to begin your preparation."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
            <Card key={category.id} className="flex flex-col group hover:border-primary/50 transition-all duration-300">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BookUser className="h-5 w-5 text-primary"/> {category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                    <Button asChild>
                        <Link href={`/nts/${category.id}`}>View Syllabus <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link>
                    </Button>
                </CardContent>
            </Card>
        ))}
        <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-primary text-primary-foreground flex flex-col md:flex-row items-center justify-between p-6">
             <div className="mb-4 md:mb-0">
                <CardTitle className="text-2xl">Full-Length NAT Mock Test</CardTitle>
                <CardDescription className="text-primary-foreground/80 mt-2">Simulate the real NAT experience (80 MCQs) with our full-length mock test based on your field.</CardDescription>
             </div>
             <Button asChild variant="secondary" size="lg">
                <Link href="/nts/mock-test">Start Mock Test <ArrowRight className="ml-2 h-4 w-4" /></Link>
             </Button>
        </Card>
      </div>
    </div>
  );
}
