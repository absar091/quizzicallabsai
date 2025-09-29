
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from 'next/link';
import { notFound } from "next/navigation";
import { ntsSyllabus } from "@/lib/nts-syllabus";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export default async function NtsCategoryPage({ params }: CategoryPageProps) {
  const { category: categoryKey } = await params;
  const category = ntsSyllabus[categoryKey];

  if (!category) {
    notFound();
  }
  
  const generateTestLink = (subject: string, chapter: string) => {
     return `/nts/test?category=${category.id}&subject=${encodeURIComponent(subject)}&chapter=${encodeURIComponent(chapter)}`;
  }

  return (
    <div>
      <PageHeader
        title={category.name}
        description={`Prepare for the subject portion of the ${category.name} test.`}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {category.subjects.map((subject) => {
          const Icon = subject.icon;
          return (
            <Card key={subject.id} className="shadow-sm">
                <CardHeader className="flex-row items-center gap-4">
                  {Icon && 
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                    </div>
                  }
                  <div>
                    <CardTitle className="text-lg font-semibold">{subject.name}</CardTitle>
                    <CardDescription>Select a chapter to start a practice test.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="px-2 pb-2">
                     <Accordion type="single" collapsible className="w-full">
                        {subject.chapters.map((chapter, index) => (
                             <AccordionItem value={`item-${index}`} key={chapter.id} className="border-b-0">
                                <AccordionTrigger className="text-left px-4 py-3 hover:no-underline font-medium hover:bg-secondary rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span>{chapter.name}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-4 bg-muted/50 text-right">
                                    <Button asChild variant="outline" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 border-0">
                                        <Link href={generateTestLink(subject.name, chapter.name)}>
                                            Test this Chapter <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </AccordionContent>
                             </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  );
}
