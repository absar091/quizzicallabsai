
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
import { ExamModuleLoading } from '@/components/professional-loading';

// Pre-calculate to avoid expensive operations on every render
const tests = [
  {
    name: 'MDCAT',
    description: 'Medical & Dental College Admission Test preparation.',
    href: '/mdcat',
    totalTopics: 85, // Pre-calculated
  },
  {
    name: 'ECAT', 
    description: 'Engineering College Admission Test preparation.',
    href: '/ecat',
    totalTopics: 45, // Pre-calculated
  },
  {
    name: 'NTS',
    description: 'National Testing Service (NAT) preparation.',
    href: '/nts',
    totalTopics: 35, // Pre-calculated
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
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function loadData() {
            if (!user) {
                setIsLoading(false);
                return;
            }
            
            setIsLoading(true);
            try {
                // Load only exam-related results for faster processing
                const history = await getQuizResults(user.uid);
                const examHistory = history.filter(result => {
                    const topic = result.topic.toLowerCase();
                    return topic.includes('mdcat') || topic.includes('ecat') || topic.includes('nts');
                }).slice(0, 50); // Limit to 50 most recent
                
                setQuizHistory(examHistory);
            } catch (error) {
                console.error('Failed to load quiz history:', error);
                setQuizHistory([]);
            } finally {
                setIsLoading(false);
            }
        }
        
        loadData();
    }, [user]);
    
    useEffect(() => {
        // Optimized progress calculation
        const calculateProgress = (testName: string, totalTopics: number) => {
            if (quizHistory.length === 0) return 0;
            
            const completedTopics = new Set<string>();
            const testNameLower = testName.toLowerCase();
            
            for (const result of quizHistory) {
                if (result.topic.toLowerCase().includes(testNameLower)) {
                    const dashIndex = result.topic.indexOf(' - ');
                    const topic = dashIndex > -1 
                        ? result.topic.substring(dashIndex + 3).trim()
                        : result.topic.trim();
                    completedTopics.add(topic);
                }
            }
            
            return totalTopics > 0 ? Math.min(Math.round((completedTopics.size / totalTopics) * 100), 100) : 0;
        };

        setProgress({
            MDCAT: calculateProgress('MDCAT', 85),
            ECAT: calculateProgress('ECAT', 45),
            NTS: calculateProgress('NTS', 35),
        });
    }, [quizHistory]);


  if (isLoading) {
    return <ExamModuleLoading />;
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
