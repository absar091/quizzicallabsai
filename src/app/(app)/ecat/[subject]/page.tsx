
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from 'next/link';
import { notFound } from "next/navigation";
import { ecatSyllabus, Topic } from "@/lib/ecat-syllabus";

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
  
  const generateTestLink = (topic: Topic, numberOfQuestions: number) => {
     let link = `/ecat/test?subject=${subject.slug}&topic=${encodeURIComponent(topic.name)}&numQuestions=${numberOfQuestions}`;
     if (topic.questionStyle) {
        link += `&questionStyles=${encodeURIComponent(topic.questionStyle)}`;
     }
      if (topic.specificInstructions) {
        link += `&specificInstructions=${encodeURIComponent(topic.specificInstructions)}`;
     }
     return link;
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
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center gap-4 border-b">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                    {Icon && <Icon className="h-6 w-6 text-primary" />}
                </div>
                <div>
                     <CardTitle className="text-lg font-semibold">{subject.name}</CardTitle>
                     <CardDescription>{subject.description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-3">
                  {subject.topics.map((topic) => (
                    <Link href={generateTestLink(topic, getNumQuestionsForTopic())} key={topic.id}>
                        <div className="flex items-center justify-between p-4 rounded-xl border bg-background hover:bg-secondary cursor-pointer transition-colors">
                            <span className="font-medium text-foreground">{topic.name}</span>
                            <ArrowRight className="h-5 w-5 text-muted-foreground"/>
                        </div>
                    </Link>
                  ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
