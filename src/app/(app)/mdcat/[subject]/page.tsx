
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from 'next/link';
import { notFound } from "next/navigation";
import { mdcatSyllabus } from "@/lib/mdcat-syllabus";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { use } from "react";

type SubjectPageProps = {
  params: {
    subject: string;
  };
};

export default function MdcatSubjectPage({ params }: SubjectPageProps) {
  const subjectKey = params.subject;
  const subject = mdcatSyllabus[subjectKey];

  if (!subject) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        title={`MDCAT ${subject.name}`}
        description={`Prepare for the ${subject.name} section of the MDCAT. Select a chapter to start a practice test.`}
      />

      <div className="max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {subject.chapters.map((chapter, index) => (
            <AccordionItem value={`item-${index}`} key={chapter.id}>
              <Card>
                <AccordionTrigger className="text-left p-6 hover:no-underline">
                  <div className="flex items-center gap-4">
                     <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold flex-1">{chapter.name}</h3>
                        <p className="text-sm text-muted-foreground">{chapter.subtopics.join(', ')}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                    <p className="text-muted-foreground mb-4">Ready to test your knowledge on this chapter?</p>
                     <Button asChild>
                        <Link href={`/mdcat/test?subject=${subject.slug}&chapter=${encodeURIComponent(chapter.name)}`}>
                            Generate Test <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
