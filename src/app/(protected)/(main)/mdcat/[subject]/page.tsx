
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from 'next/link';
import { notFound } from "next/navigation";
import { mdcatSyllabus } from "@/lib/mdcat-syllabus";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { SidebarAd } from "@/components/ads/ad-banner";

type SubjectPageProps = {
  params: {
    subject: string;
  };
};

export default async function MdcatSubjectPage({ params }: SubjectPageProps) {
  const { subject: subjectKey } = await params;
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
        description={`Prepare for the ${subject.name} section of the MDCAT. Select a chapter to start a practice test.`}
      />

      <div className="max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {subject.chapters.map((chapter, index) => (
            <AccordionItem value={`item-${index}`} key={chapter.id} className="border-b-0">
              <Card className="shadow-sm">
                <AccordionTrigger className="text-left p-6 hover:no-underline data-[state=open]:border-b">
                   <div className="flex items-center gap-4 w-full">
                     <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
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
                <AccordionContent className="p-6">
                    <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 w-full md:w-auto">
                        <Link href={generateTestLink(chapter.name, 55)}>
                            Test Entire Chapter <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>

                    <Separator className="my-6"/>
                    
                    <h4 className="text-base font-semibold mb-4 text-muted-foreground">Subtopics</h4>
                    <div className="space-y-3">
                       {chapter.subtopics.map((subtopic) => (
                         <Link href={generateTestLink(`${chapter.name} - ${subtopic.name}: ${subtopic.learningObjectives.map(lo => lo.text).join(', ')}`, 55)} key={subtopic.id}>
                           <div className="flex items-center justify-between p-4 rounded-xl border bg-background hover:bg-secondary cursor-pointer transition-colors">
                                <span className="font-medium text-foreground">{subtopic.name}</span>
                                <ArrowRight className="h-5 w-5 text-muted-foreground"/>
                           </div>
                         </Link>
                       ))}
                    </div>

                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-8">
          <SidebarAd />
        </div>
      </div>
    </div>
  );
}
