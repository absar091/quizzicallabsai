
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, ChevronsRight, Target, NotebookText } from "lucide-react";
import Link from 'next/link';
import { notFound } from "next/navigation";
import { ecatSyllabus } from "@/lib/ecat-syllabus";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

type SubjectPageProps = {
  params: {
    subject: string;
  };
};

export default function EcatSubjectPage({ params }: SubjectPageProps) {
  const { subject: subjectKey } = params;
  const subject = ecatSyllabus[subjectKey];

  if (!subject) {
    notFound();
  }
  
  const generateTestLink = (topic: string, numberOfQuestions: number) => {
     return `/ecat/test?subject=${subject.slug}&topic=${encodeURIComponent(topic)}&numQuestions=${numberOfQuestions}`;
  }

  const getNumQuestionsForTopic = () => {
    switch (subject.slug) {
        case 'physics':
        case 'mathematics':
            return 30;
        case 'english':
        case 'chemistry':
        case 'computer-science':
            return 10;
        default:
            return 20;
    }
  }

  const Icon = subject.icon;

  return (
    <div>
      <PageHeader
        title={`ECAT ${subject.name}`}
        description={`Prepare for the ${subject.name} section of the ECAT. Select a topic to start a practice test.`}
      />

      <div className="max-w-4xl mx-auto">
        <Card>
            <CardHeader className="flex flex-row items-center gap-4 border-b">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    {Icon && <Icon className="h-6 w-6 text-primary" />}
                </div>
                <div>
                     <CardTitle>{subject.name}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-4">
                  {subject.topics.map((topic, index) => (
                    <div key={topic.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                                <span className="text-primary font-bold">{index + 1}</span>
                            </div>
                             <h3 className="font-semibold">{topic.name}</h3>
                        </div>
                         <Button asChild size="sm">
                            <Link href={generateTestLink(topic.name, getNumQuestionsForTopic())}>
                                Practice <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                  ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
