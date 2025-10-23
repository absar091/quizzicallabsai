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
import { Share2, Copy, Heart, Users, Eye, CheckCircle, MessageCircle, Facebook, Twitter } from 'lucide-react';
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

  const appUrl = 'https://quizzicallabz.qzz.io';
  const shareableLink = shareCode ? `${appUrl}/shared-quiz?code=${shareCode}` : '';

  const copyShareCode = () => {
    navigator.clipboard.writeText(shareCode);
    toast({
      title: 'Copied!',
      description: 'Share code copied to clipboard'
    });
  };

  const copyShareableLink = () => {
    navigator.clipboard.writeText(shareableLink);
    toast({
      title: 'Link Copied!',
      description: 'Shareable link copied to clipboard'
    });
  };

  const shareViaWhatsApp = () => {
    const message = `🎯 Take this quiz: "${shareData.title}" by ${user?.displayName || 'Anonymous'}\n\nQuestions: ${quiz.length}\nDifficulty: ${shareData.difficulty}\n\n${shareableLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareViaFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableLink)}&quote=${encodeURIComponent(`Take this quiz: "${shareData.title}" by ${user?.displayName || 'Anonymous'}`)}`;
    window.open(url, '_blank');
  };

  const shareViaTwitter = () => {
    const tweetText = `🎯 Take this quiz: "${shareData.title}" by ${user?.displayName || 'Anonymous'} #Quizzicallabzᴬᴵ ${shareableLink}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank');
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
                Share this quiz using your preferred method:
              </p>
            </div>

            {/* Share Code */}
            <div className="bg-muted p-3 rounded-lg">
              <div className="text-lg font-mono font-bold mb-2">Code: {shareCode}</div>
              <Button variant="ghost" size="sm" onClick={copyShareCode}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Code
              </Button>
            </div>

            {/* Shareable Link */}
            <div className="bg-muted p-3 rounded-lg">
              <div className="text-sm font-semibold mb-1">Direct Link:</div>
              <div className="text-xs text-muted-foreground mb-2 break-all">{shareableLink}</div>
              <Button variant="ghost" size="sm" onClick={copyShareableLink}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </Button>
            </div>

            {/* Social Media Sharing */}
            <div className="border-t pt-4">
              <div className="text-sm font-semibold mb-3">Share via:</div>
              <div className="flex justify-center gap-3">
                <Button variant="outline" size="sm" onClick={shareViaWhatsApp} className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
                <Button variant="outline" size="sm" onClick={shareViaFacebook} className="flex items-center gap-2">
                  <Facebook className="h-4 w-4" />
                  Facebook
                </Button>
                <Button variant="outline" size="sm" onClick={shareViaTwitter} className="flex items-center gap-2">
                  <Twitter className="h-4 w-4" />
                  Twitter
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Others can access your quiz using either the code or the direct link!
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
  
  const startSharedQuiz = async () => {
    // Redirect to the shared-quiz page which will handle authentication
    window.location.href = `/shared-quiz?code=${shareCode}`;
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
                
                <Button className="w-full mt-4" onClick={startSharedQuiz}>
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
