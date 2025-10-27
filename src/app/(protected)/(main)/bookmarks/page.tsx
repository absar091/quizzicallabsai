'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuizBookmarks } from '@/lib/quiz-bookmarks';
import { BookmarksList } from '@/components/bookmark-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookMarked, Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { DashboardSkeleton } from '@/components/loading-skeletons';
import { useGlobalKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { KeyboardShortcutsHelp } from '@/components/keyboard-shortcuts-help';

export default function BookmarksPage() {
  const { user } = useAuth();
  const { bookmarks, loading, error } = useQuizBookmarks(user?.uid || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'subject'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Bookmarks" 
          description="Loading your bookmarked quizzes..."
        />
        <DashboardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Bookmarks" 
          description="Error loading bookmarks"
        />
        <Card>
          <CardContent className="text-center py-12 text-red-600">
            Error loading bookmarks: {error}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get unique subjects
  const subjects = Array.from(new Set(bookmarks.map(b => b.subject)));

  // Filter and sort bookmarks
  const filteredBookmarks = bookmarks
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

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Bookmarks" 
        description={`${bookmarks.length} saved quizzes`}
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

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredBookmarks.length === bookmarks.length 
              ? `All Bookmarks (${bookmarks.length})`
              : `Filtered Results (${filteredBookmarks.length} of ${bookmarks.length})`
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBookmarks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookMarked className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                {searchQuery || selectedSubject !== 'all' 
                  ? 'No matching bookmarks' 
                  : 'No bookmarks yet'
                }
              </h3>
              <p>
                {searchQuery || selectedSubject !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start bookmarking quizzes to access them quickly later'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookmarks.map((bookmark) => (
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
                        Bookmarked {bookmark.bookmarkedAt ? new Date(bookmark.bookmarkedAt).toLocaleDateString() : 'Unknown date'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}