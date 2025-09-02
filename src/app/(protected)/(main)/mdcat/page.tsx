
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from "lucide-react";
import { mdcatSyllabus } from "@/lib/mdcat-syllabus";
import { SidebarAd } from "@/components/ads/ad-banner";

const subjects = Object.values(mdcatSyllabus);

export default function MdcatPage() {
  return (
    <div>
      <PageHeader
        title="MDCAT Preparation"
        description="Specialized subject-wise and mock tests for medical entry exams."
      />

      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
       >
        {subjects.map(subject => {
          const Icon = subject.icon;
          return (
            <div key={subject.name}>
                <Card className="flex flex-col group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <CardHeader className="flex-row items-center gap-4">
                        {Icon && <Icon className="h-8 w-8 text-primary shrink-0" />}
                        <div>
                            <CardTitle>{subject.name}</CardTitle>
                            <CardDescription className="mt-1">{subject.description}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="mt-auto">
                        <Button asChild>
                            <Link href={`/mdcat/${subject.slug}`}>Start Test <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
          )
        })}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <Card className="bg-primary text-primary-foreground flex flex-col md:flex-row items-center justify-between p-6">
                <div className="mb-4 md:mb-0">
                    <CardTitle className="text-2xl">Full-Length Mock Test</CardTitle>
                    <CardDescription className="text-primary-foreground/80 mt-2">Simulate the real exam experience with our full-length mock test.</CardDescription>
                </div>
                <Button asChild variant="secondary" size="lg">
                    <Link href="/mdcat/mock-test">Start Mock Test <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </Card>
        </div>
      </div>
      <div className="mt-8">
        <SidebarAd />
      </div>
    </div>
  );
}
