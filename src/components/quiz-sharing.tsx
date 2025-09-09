'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Share2, Copy, Heart, Users, Eye, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { QuizSharingManager, SharedQuiz } from '@/lib/quiz-sharing';

interface QuizSharingProps {
  quiz: any[];
  formValues: {
    topic: string;
    difficulty: string;
  };
}

export function QuizSharingDialog({ quiz, formValues }: QuizSharingProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);
  const [shareCode, setShareCode] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const [shareData, setShareData] = useState({
    title: `${formValues.topic} Quiz`,
    description: '',
    isPublic: false,
    tags: [formValues.difficulty, formValues.topic.split(' ')[0]],
    topic: formValues.topic, // Added
    difficulty: formValues.difficulty, // Added
  });

  const handleShare = async () => {
    if (!user || !quiz.length) return;
    
    setIsSharing(true);
    try {
      const sharedQuiz = await QuizSharingManager.createSharedQuiz(
        quiz,
        shareData,
        user.uid,
        user.displayName || 'Anonymous'
      );
      
      setShareCode(sharedQuiz.shareCode);
      toast({
        title: 'Quiz Shared!',
        description: `Share code: ${sharedQuiz.shareCode}`
      });
    } catch (error) {
      toast({
        title: 'Sharing Failed',
        description: 'Could not share quiz. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSharing(false);
    }
  };

  const copyShareCode = () => {
    navigator.clipboard.writeText(shareCode);
    toast({
      title: 'Copied!',
      description: 'Share code copied to clipboard'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share Quiz
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Quiz</DialogTitle>
        </DialogHeader>
        
        {!shareCode ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                value={shareData.title}
                onChange={(e) => setShareData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="What's this quiz about?"
                value={shareData.description}
                onChange={(e) => setShareData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="public"
                checked={shareData.isPublic}
                onCheckedChange={(checked) => setShareData(prev => ({ ...prev, isPublic: checked }))}
              />
              <Label htmlFor="public">Make public (discoverable by others)</Label>
            </div>
            
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {shareData.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
            
            <Button onClick={handleShare} disabled={isSharing} className="w-full">
              {isSharing ? 'Sharing...' : 'Share Quiz'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <div>
              <h3 className="font-semibold">Quiz Shared Successfully!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Others can access your quiz using this code:
              </p>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-2xl font-mono font-bold">{shareCode}</div>
              <Button variant="ghost" size="sm" onClick={copyShareCode} className="mt-2">
                <Copy className="mr-2 h-4 w-4" />
                Copy Code
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Share this code with friends or students so they can take your quiz!
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function QuizAccessDialog() {
  const [shareCode, setShareCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState<SharedQuiz | null>(null);
  const { toast } = useToast();
  
  const startSharedQuiz = async (sharedQuiz: SharedQuiz) => {
    try {
      // Update quiz stats
      await QuizSharingManager.updateQuizStats(sharedQuiz.id, 0);
      
      // Navigate to quiz page with shared quiz data
      const quizData = {
        quiz: sharedQuiz.questions,
        formValues: {
          topic: sharedQuiz.title,
          difficulty: sharedQuiz.difficulty as any,
          numberOfQuestions: sharedQuiz.questions.length,
          questionTypes: ['Multiple Choice'],
          questionStyles: ['Shared Quiz'],
          timeLimit: Math.max(10, sharedQuiz.questions.length),
          specificInstructions: sharedQuiz.description || ''
        }
      };
      
      // Store in sessionStorage for the quiz page
      sessionStorage.setItem('sharedQuizData', JSON.stringify(quizData));
      
      // Navigate to quiz page
      window.location.href = '/generate-quiz?shared=true';
      
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not start quiz. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleAccess = async () => {
    if (!shareCode.trim()) return;
    
    setIsLoading(true);
    try {
      const sharedQuiz = await QuizSharingManager.getQuizByShareCode(shareCode.toUpperCase());
      if (sharedQuiz) {
        setQuiz(sharedQuiz);
        toast({
          title: 'Quiz Found!',
          description: `"${sharedQuiz.title}" by ${sharedQuiz.creatorName}`
        });
      } else {
        toast({
          title: 'Quiz Not Found',
          description: 'Invalid share code. Please check and try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not access quiz. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-20 flex-col gap-2">
          <Users className="h-6 w-6" />
          <span className="text-sm">Shared Quiz</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Access Shared Quiz</DialogTitle>
        </DialogHeader>
        
        {!quiz ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="shareCode">Enter Share Code</Label>
              <Input
                id="shareCode"
                placeholder="e.g., ABC123"
                value={shareCode}
                onChange={(e) => setShareCode(e.target.value)}
                className="uppercase"
              />
            </div>
            
            <Button onClick={handleAccess} disabled={isLoading || !shareCode.trim()} className="w-full">
              {isLoading ? 'Searching...' : 'Access Quiz'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Creator:</strong> {quiz.creatorName}</p>
                  <p><strong>Topic:</strong> {quiz.topic}</p>
                  <p><strong>Difficulty:</strong> {quiz.difficulty}</p>
                  <p><strong>Questions:</strong> {quiz.questions.length}</p>
                  {quiz.description && <p><strong>Description:</strong> {quiz.description}</p>}
                  
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{quiz.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{quiz.attempts}</span>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-4" onClick={() => startSharedQuiz(quiz)}>
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}