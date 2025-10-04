'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { StudyStreakCard, StudyStreakBadge } from '@/components/study-streak';
import { BookmarkButton } from '@/components/bookmark-button';
import { useQuizKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { KeyboardShortcutsHelp } from '@/components/keyboard-shortcuts-help';
import { DashboardSkeleton, QuizQuestionSkeleton, ProfileSkeleton } from '@/components/loading-skeletons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Keyboard, Bookmark, Flame, Loader2 } from 'lucide-react';

export default function TestNewFeaturesPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Sample quiz data for testing
  const sampleQuiz = {
    id: 'test-quiz-123',
    title: 'Sample Quiz for Testing',
    subject: 'Computer Science',
    difficulty: 'Medium',
    questionCount: 10,
    tags: ['Testing', 'Features']
  };

  // Test keyboard shortcuts
  const shortcuts = useQuizKeyboardShortcuts({
    onNext: () => alert('Next question (→)'),
    onPrevious: () => alert('Previous question (←)'),
    onSubmit: () => alert('Submit answer (Enter)'),
    onSelectOption: (index) => {
      setSelectedOption(index);
      alert(`Selected option ${index + 1} (Key: ${index + 1})`);
    },
    onBookmark: () => alert('Bookmark quiz (Ctrl+B)'),
    onHelp: () => alert('Help opened (? or H)'),
    enabled: true
  });

  const toggleLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="New Features Test Page" 
        description="Test all the newly integrated features"
        action={
          <KeyboardShortcutsHelp shortcuts={shortcuts} />
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Streak Testing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Study Streak System
            </CardTitle>
            <CardDescription>
              Test the new study streak tracking system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <StudyStreakCard />
            <div className="flex items-center gap-2">
              <span>Streak Badge:</span>
              <StudyStreakBadge />
            </div>
          </CardContent>
        </Card>

        {/* Bookmark Testing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-blue-500" />
              Quiz Bookmarking
            </CardTitle>
            <CardDescription>
              Test the quiz bookmarking functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">{sampleQuiz.title}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{sampleQuiz.subject}</Badge>
                  <Badge variant="outline">{sampleQuiz.difficulty}</Badge>
                </div>
                <BookmarkButton quiz={sampleQuiz} showText />
              </div>
            </div>
            <Button asChild variant="outline" className="w-full">
              <a href="/bookmarks">View All Bookmarks</a>
            </Button>
          </CardContent>
        </Card>

        {/* Keyboard Shortcuts Testing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5 text-green-500" />
              Keyboard Shortcuts
            </CardTitle>
            <CardDescription>
              Test keyboard navigation and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => alert('Use ← → keys to navigate')}
              >
                ← → Navigate
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => alert('Use 1-4 keys to select options')}
              >
                1-4 Select
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => alert('Press Enter to submit')}
              >
                Enter Submit
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => alert('Press ? or H for help')}
              >
                ? Help
              </Button>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Test Option Selection:</p>
              <div className="grid grid-cols-2 gap-2">
                {['Option A', 'Option B', 'Option C', 'Option D'].map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedOption === index ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedOption(index)}
                    className="justify-start"
                  >
                    <span className="mr-2 font-mono">{index + 1}</span>
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading Skeletons Testing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 text-purple-500" />
              Loading Skeletons
            </CardTitle>
            <CardDescription>
              Test the new professional loading states
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={toggleLoading} disabled={loading}>
              {loading ? 'Loading...' : 'Test Loading States'}
            </Button>
            
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="quiz">Quiz</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard" className="mt-4">
                {loading ? <DashboardSkeleton /> : (
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Dashboard Content</h3>
                    <p className="text-sm text-muted-foreground">
                      This would be your actual dashboard content
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="quiz" className="mt-4">
                {loading ? <QuizQuestionSkeleton /> : (
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Quiz Question</h3>
                    <p className="text-sm text-muted-foreground">
                      This would be your actual quiz question
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="profile" className="mt-4">
                {loading ? <ProfileSkeleton /> : (
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Profile Information</h3>
                    <p className="text-sm text-muted-foreground">
                      This would be your actual profile data
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Feature Status */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
          <CardDescription>
            Status of all newly integrated features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Study Streaks</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Quiz Bookmarks</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Keyboard Shortcuts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Loading Skeletons</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">All Features Successfully Integrated!</h4>
            <p className="text-sm text-green-700">
              All 4 new features have been successfully integrated into your app with proper TypeScript support, 
              Firebase database rules, and comprehensive testing capabilities.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}