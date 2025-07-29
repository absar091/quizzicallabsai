
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, ChevronsRight, Target, NotebookText } from "lucide-react";
import Link from 'next/link';
import { notFound } from "next/navigation";
import { ntsSyllabus } from "@/lib/nts-syllabus";
import { use } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export default function NtsCategoryPage({ params }: CategoryPageProps) {
  const { category: categoryKey } = use(params);
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
        {category.subjects.map((subject) => (
            <Card key={subject.id}>
                <CardHeader>
                    <CardTitle>{subject.name}</CardTitle>
                    <CardDescription>Select a chapter to start a practice test.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Accordion type="single" collapsible className="w-full">
                        {subject.chapters.map((chapter, index) => (
                             <AccordionItem value={`item-${index}`} key={chapter.id} className="border-b">
                                <AccordionTrigger className="text-left py-4 hover:no-underline font-semibold">
                                    <div className="flex items-center gap-3">
                                        <ChevronsRight className="h-4 w-4 text-primary/80" />
                                        {chapter.name}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-4 bg-muted/50 text-right">
                                    <Button asChild variant="outline" size="sm">
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
        ))}
      </div>
    </div>
  );
}
