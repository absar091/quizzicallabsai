
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, ChevronsRight, Target, NotebookText } from "lucide-react";
import Link from 'next/link';
import { notFound } from "next/navigation";
import { mdcatSyllabus } from "@/lib/mdcat-syllabus";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

type SubjectPageProps = {
  params: {
    subject: string;
  };
};

export default function MdcatSubjectPage({ params }: SubjectPageProps) {
  const { subject: subjectKey } = params;
  const subject = mdcatSyllabus[subjectKey];

  if (!subject) {
    notFound();
  }
  
  const generateTestLink = (topic: string, numberOfQuestions: number) => {
     return `/mdcat/test?subject=${subject.slug}&topic=${encodeURIComponent(topic)}&numQuestions=${numberOfQuestions}`;
  }

  return (
    <div>
      <PageHeader
        title={`MDCAT ${subject.name}`}
        description={`Prepare for the ${subject.name} section of the MDCAT. Select a chapter or a specific subtopic to start a practice test.`}
      />

      <div className="max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {subject.chapters.map((chapter, index) => (
            <AccordionItem value={`item-${index}`} key={chapter.id} className="border-b-0">
              <Card>
                <AccordionTrigger className="text-left p-6 hover:no-underline data-[state=open]:border-b">
                   <div className="flex items-center gap-4 w-full">
                     <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                        <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold">{chapter.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {chapter.subtopics.map(st => st.name).join(' • ')}
                        </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-0">
                    <div className="p-6">
                        <h4 className="text-md font-semibold mb-4 flex items-center gap-2 text-muted-foreground"><Target className="h-4 w-4" /> Test Options</h4>
                         <Button asChild>
                            <Link href={generateTestLink(chapter.name, 55)}>
                                Test Entire Chapter <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                    
                    <Accordion type="single" collapsible className="w-full">
                       {chapter.subtopics.map((subtopic, subIndex) => (
                         <AccordionItem value={`sub-item-${subIndex}`} key={subtopic.id} className="border-t">
                            <AccordionTrigger className="text-left px-6 py-4 hover:no-underline text-base font-medium">
                                <div className="flex items-center gap-3">
                                    <ChevronsRight className="h-4 w-4 text-primary/80" />
                                    {subtopic.name}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6 bg-muted/50">
                                <div className="pl-6 border-l-2 border-primary/50 space-y-4 pt-4">
                                     <div>
                                        <h5 className="font-semibold mb-2 flex items-center gap-2"><NotebookText className="h-4 w-4" /> Learning Objectives:</h5>
                                        <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                                            {subtopic.learningObjectives.map(lo => <li key={lo.id}>{lo.text}</li>)}
                                        </ul>
                                     </div>
                                      <Button asChild variant="outline" size="sm">
                                        <Link href={generateTestLink(`${chapter.name} - ${subtopic.name}: ${subtopic.learningObjectives.map(lo => lo.text).join(', ')}`, 45)}>
                                            Test this Subtopic <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </AccordionContent>
                         </AccordionItem>
                       ))}
                    </Accordion>

                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
