'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuizBookmarks } from '@/lib/quiz-bookmarks';
import { BookmarksList } from '@/components/bookmark-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookMarked, Search, Filter, SortAsc, SortDesc, HelpCircle, Star } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { DashboardSkeleton } from '@/components/loading-skeletons';
import { useGlobalKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { KeyboardShortcutsHelp } from '@/components/keyboard-shortcuts-help';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';

interface QuestionBookmark {
  userId: string;
  question: string;
  correctAnswer: string;
  topic: string;
  bookmarkedAt?: number;
}

export default function BookmarksPage() {
  const { user } = useAuth();
  const { bookmarks: quizBookmarks, loading: quizLoading, error: quizError } = useQuizBookmarks(user?.uid || null);
  const [questionBookmarks, setQuestionBookmarks] = useState<QuestionBookmark[]>([]);
  const [questionLoading, setQuestionLoading] = useState(true);
  const [questionError, setQuestionError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'subject'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState('questions');

  // Load question bookmarks
  useEffect(() => {
    async function loadQuestionBookmarks() {
      if (!user?.uid) {
        setQuestionLoading(false);
        return;
      }

      try {
        setQuestionLoading(true);
        const bookmarksRef = ref(db, `question-bookmarks/${user.uid}`);
        const snapshot = await get(bookmarksRef);
        
        if (snapshot.exists()) {
          const bookmarksData = snapshot.val();
          const bookmarksList = Object.entries(bookmarksData).map(([id, data]: [string, any]) => ({
            id,
            ...data
          })) as QuestionBookmark[];
          setQuestionBookmarks(bookmarksList);
        } else {
          setQuestionBookmarks([]);
        }
        setQuestionError(null);
      } catch (error: any) {
        console.error('Error loading question bookmarks:', error);
        setQuestionError(error.message);
        setQuestionBookmarks([]);
      } finally {
        setQuestionLoading(false);
      }
    }

    loadQuestionBookmarks();
  }, [user?.uid]);

  // Keyboard shortcuts
  const shortcuts = useGlobalKeyboardShortcuts({
    onSearch: () => {
      const searchInput = document.getElementById('bookmark-search') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    },
    onProfile: () => window.location.href = '/profile',
    onDashboard: () => window.location.href = '/dashboard',
    onNewQuiz: () => window.location.href = '/generate-quiz',
    enabled: true
  });

  if (!user) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Bookmarks" 
          description="Sign in to view your bookmarked quizzes"
        />
        <Card>
          <CardContent className="text-center py-12">
            <BookMarked className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Sign in required</h3>
            <p className="text-muted-foreground">Please sign in to access your bookmarked quizzes</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizLoading || questionLoading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Bookmarks" 
          description="Loading your bookmarks..."
        />
        <DashboardSkeleton />
      </div>
    );
  }

  if (quizError && questionError) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Bookmarks" 
          description="Error loading bookmarks"
        />
        <Card>
          <CardContent className="text-center py-12 text-red-600">
            Error loading bookmarks: {quizError || questionError}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get unique subjects from both quiz and question bookmarks
  const quizSubjects = Array.from(new Set(quizBookmarks.map(b => b.subject)));
  const questionSubjects = Array.from(new Set(questionBookmarks.map(b => b.topic)));
  const allSubjects = Array.from(new Set([...quizSubjects, ...questionSubjects]));

  const totalBookmarks = quizBookmarks.length + questionBookmarks.length;

  // Filter and sort quiz bookmarks
  const filteredQuizBookmarks = quizBookmarks
    .filter(bookmark => {
      const matchesSearch = searchQuery === '' || 
        bookmark.quizTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.notes?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSubject = selectedSubject === 'all' || bookmark.subject === selectedSubject;
      
      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          const dateA = a.bookmarkedAt || 0;
          const dateB = b.bookmarkedAt || 0;
          comparison = dateA - dateB;
          break;
        case 'title':
          comparison = a.quizTitle.localeCompare(b.quizTitle);
          break;
        case 'subject':
          comparison = a.subject.localeCompare(b.subject);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Filter and sort question bookmarks
  const filteredQuestionBookmarks = questionBookmarks
    .filter(bookmark => {
      const matchesSearch = searchQuery === '' || 
        bookmark.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.correctAnswer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSubject = selectedSubject === 'all' || bookmark.topic === selectedSubject;
      
      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          const dateA = a.bookmarkedAt || 0;
          const dateB = b.bookmarkedAt || 0;
          comparison = dateA - dateB;
          break;
        case 'title':
          comparison = a.question.localeCompare(b.question);
          break;
        case 'subject':
          comparison = a.topic.localeCompare(b.topic);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Bookmarks" 
        description={`${totalBookmarks} saved items (${questionBookmarks.length} questions, ${quizBookmarks.length} quizzes)`}
        action={
          <KeyboardShortcutsHelp shortcuts={shortcuts} />
        }
      />

      {/* Search and Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                id="bookmark-search"
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={selectedSubject === 'all' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedSubject('all')}
            >
              All ({bookmarks.length})
            </Badge>
            {subjects.map(subject => (
              <Badge
                key={subject}
                variant={selectedSubject === subject ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedSubject(subject)}
              >
                {subject} ({bookmarks.filter(b => b.subject === subject).length})
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant={sortBy === 'date' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('date')}
            >
              Date
            </Button>
            <Button
              variant={sortBy === 'title' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('title')}
            >
              Title
            </Button>
            <Button
              variant={sortBy === 'subject' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('subject')}
            >
              Subject
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Questions ({questionBookmarks.length})
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="flex items-center gap-2">
            <BookMarked className="h-4 w-4" />
            Quizzes ({quizBookmarks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle>
                {filteredQuestionBookmarks.length === questionBookmarks.length 
                  ? `Question Bookmarks (${questionBookmarks.length})`
                  : `Filtered Questions (${filteredQuestionBookmarks.length} of ${questionBookmarks.length})`
                }
              </CardTitle>
              <CardDescription>
                Individual questions you've bookmarked while taking quizzes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredQuestionBookmarks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    {searchQuery || selectedSubject !== 'all' 
                      ? 'No matching questions' 
                      : 'No question bookmarks yet'
                    }
                  </h3>
                  <p>
                    {searchQuery || selectedSubject !== 'all'
                      ? 'Try adjusting your search or filter criteria'
                      : 'Start bookmarking questions during quizzes to review them later'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredQuestionBookmarks.map((bookmark, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-lg mb-2">{bookmark.question}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <Badge variant="secondary">{bookmark.topic}</Badge>
                            <span>•</span>
                            <span className="text-green-600 font-medium">Answer: {bookmark.correctAnswer}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Bookmarked {
                              bookmark.bookmarkedAt && typeof bookmark.bookmarkedAt === 'number'
                                ? new Date(bookmark.bookmarkedAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })
                                : 'Recently'
                            }
                          </div>
                        </div>
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quizzes">
          <Card>
            <CardHeader>
              <CardTitle>
                {filteredQuizBookmarks.length === quizBookmarks.length 
                  ? `Quiz Bookmarks (${quizBookmarks.length})`
                  : `Filtered Quizzes (${filteredQuizBookmarks.length} of ${quizBookmarks.length})`
                }
              </CardTitle>
              <CardDescription>
                Complete quizzes you've bookmarked for later access
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredQuizBookmarks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <BookMarked className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    {searchQuery || selectedSubject !== 'all' 
                      ? 'No matching quizzes' 
                      : 'No quiz bookmarks yet'
                    }
                  </h3>
                  <p>
                    {searchQuery || selectedSubject !== 'all'
                      ? 'Try adjusting your search or filter criteria'
                      : 'Start bookmarking complete quizzes to access them quickly later'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredQuizBookmarks.map((bookmark) => (
                    <div key={bookmark.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-lg mb-1">{bookmark.quizTitle}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <Badge variant="secondary">{bookmark.subject}</Badge>
                            <span>{bookmark.difficulty}</span>
                            <span>{bookmark.questionCount} questions</span>
                          </div>
                          {bookmark.notes && (
                            <p className="text-sm text-muted-foreground italic mb-2">
                              "{bookmark.notes}"
                            </p>
                          )}
                          <div className="text-xs text-muted-foreground">
                            Bookmarked {
                              bookmark.bookmarkedAt && typeof bookmark.bookmarkedAt === 'number'
                                ? new Date(bookmark.bookmarkedAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })
                                : 'Recently'
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}