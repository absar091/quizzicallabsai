
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getQuizResults, QuizResult } from '@/lib/indexed-db';
import { mdcatSyllabus } from '@/lib/mdcat-syllabus';
import { ecatSyllabus } from '@/lib/ecat-syllabus';
import { ntsSyllabus } from '@/lib/nts-syllabus';
import { EnhancedLoading } from '@/components/enhanced-loading';

const tests = [
  {
    name: 'MDCAT',
    description: 'Medical & Dental College Admission Test preparation.',
    href: '/mdcat',
    syllabus: mdcatSyllabus,
    totalTopics: Object.values(mdcatSyllabus).reduce((acc, subject) => acc + subject.chapters.length, 0),
  },
  {
    name: 'ECAT',
    description: 'Engineering College Admission Test preparation.',
    href: '/ecat',
    syllabus: ecatSyllabus,
    totalTopics: Object.values(ecatSyllabus).reduce((acc, subject) => acc + subject.topics.length, 0),
  },
  {
    name: 'NTS',
    description: 'National Testing Service (NAT) preparation.',
    href: '/nts',
    syllabus: ntsSyllabus,
    totalTopics: Object.values(ntsSyllabus).reduce((acc, category) => acc + category.subjects.reduce((sAcc, s) => sAcc + s.chapters.length, 0), 0),
  },
];

export default function ExamPrepPage() {
    const { user } = useAuth();
    const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);
    const [progress, setProgress] = useState<Record<string, number>>({
        MDCAT: 0,
        ECAT: 0,
        NTS: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                if (user) {
                    const history = await getQuizResults(user.uid);
                    setQuizHistory(history);
                }
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, [user]);
    
    useEffect(() => {
        if (quizHistory.length > 0) {
            const calculateProgress = (testName: string) => {
                const completedTopics = new Set<string>();
                quizHistory.forEach(result => {
                    if(result.topic.toLowerCase().includes(testName.toLowerCase())) {
                        // Extract base topic to count unique chapters/topics completed
                        const topicParts = result.topic.split(' - ');
                        if(topicParts.length > 1) {
                            completedTopics.add(topicParts[1].trim());
                        } else {
                            completedTopics.add(result.topic.trim());
                        }
                    }
                });
                
                const testData = tests.find(t => t.name === testName);
                if (testData && testData.totalTopics > 0) {
                    return Math.round((completedTopics.size / testData.totalTopics) * 100);
                }
                return 0;
            };

            setProgress({
                MDCAT: calculateProgress('MDCAT'),
                ECAT: calculateProgress('ECAT'),
                NTS: calculateProgress('NTS'),
            });
        }
    }, [quizHistory]);


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EnhancedLoading
          type="general"
          message="Loading your exam preparation data..."
          estimatedTime={15}
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Exam Preparation"
        description="Structured paths for Pakistan's major university entrance exams."
      />

      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {tests.map((test) => {
            const currentProgress = progress[test.name] || 0;
            return (
              <div key={test.name}>
                <Card className="flex flex-col h-full shadow-sm hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                            <GraduationCap className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold">{test.name}</CardTitle>
                            <CardDescription>{test.description}</CardDescription>
                        </div>
                    </div>
                     <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>{currentProgress}%</span>
                        </div>
                        <Progress value={currentProgress} className="h-2"/>
                     </div>
                  </CardHeader>
                  <CardFooter className="mt-auto">
                    <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                      <Link href={test.href}>
                        Continue Studying
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )
        })}
      </div>
    </div>
  );
}
