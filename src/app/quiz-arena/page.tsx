'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Clock, Trophy, Play, Settings, Plus, Lock, Globe, Sparkles, AlertTriangle, ArrowLeft, Separator } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface QuizArenaSetup {
  title: string;
  description: string;
  topic: string;
  difficulty: string;
  timePerQuestion: number;
  isPublic: boolean;
  maxPlayers: number;
  allowLateJoining: boolean;
}

export default function QuizArenaPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [setupMode, setSetupMode] = useState<'select' | 'create' | 'room'>('select');

  const [currentQuizId, setCurrentQuizId] = useState<string>('');

  const [quizSetup, setQuizSetup] = useState<QuizArenaSetup>({
    title: '',
    description: '',
    topic: '',
    difficulty: 'medium',
    timePerQuestion: 30,
    isPublic: false,
    maxPlayers: 20,
    allowLateJoining: false
  });

  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [showRoomDialog, setShowRoomDialog] = useState(false);

  // Pre-defined quiz templates
  const quizTemplates = [
    {
      id: 'mdcpharmacology',
      title: 'MDCAT Pharmacology Fundamentals',
      description: 'Master essential pharmacology concepts',
      topic: 'Pharmacology',
      difficulty: 'Medium',
      questions: 15
    },
    {
      id: 'organicreactions',
      title: 'Organic Chemistry Reactions',
      description: 'Test your organic chemistry knowledge',
      topic: 'Organic Chemistry',
      difficulty: 'Hard',
      questions: 20
    },
    {
      id: 'physicsmechanics',
      title: 'Physics Mechanics Mastery',
      description: 'Master the fundamentals of mechanics',
      topic: 'Physics',
      difficulty: 'Medium',
      questions: 18
    }
  ];

  const handleQuizTemplateSelect = async (templateId: string) => {
    if (!user) return;

    const template = quizTemplates.find(t => t.id === templateId);
    if (template) {
      // Set template configuration
      setQuizSetup(prev => ({
        ...prev,
        title: template.title,
        description: template.description,
        topic: template.topic,
        difficulty: template.difficulty
      }));
      setCurrentQuizId(templateId);

      // Directly create room with template
      await handleCreateRoom();
    }
  };

  const handleCustomQuizSetup = () => {
    setSetupMode('create');
    setCurrentQuizId('');
  };

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateRoom = async () => {
    if (!user || !quizSetup.title.trim()) return;

    setIsCreatingRoom(true);

    try {
      console.log('🎯 Starting room creation process...');

      // Step 1: Generate actual quiz content first
      let quizContent;
      if (currentQuizId) {
        // Use template settings
        const template = quizTemplates.find(t => t.id === currentQuizId);
        if (!template) throw new Error('Template not found');

        console.log('📚 Generating quiz from template:', template.title);

        // Generate quiz using AI
        const response = await fetch('/api/generate-quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            topic: template.topic,
            difficulty: template.difficulty.toLowerCase() === 'medium' ? 'medium' : template.difficulty.toLowerCase(),
            numberOfQuestions: template.questions,
            questionTypes: ["Multiple Choice"],
            questionStyles: ["Conceptual", "Numerical"],
            timeLimit: Math.min(Math.max(Math.round((quizSetup.timePerQuestion * template.questions) / 60), 5), 120),
            userClass: "MDCAT Student",
            isPro: false,
            specificInstructions: `Create ${template.questions} high-quality questions for ${template.topic} suitable for ${template.difficulty} level students.`
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate quiz content');
        }

        const result = await response.json();
        quizContent = result.quiz;

      } else {
        // Custom quiz generation
        console.log('🎨 Generating custom quiz...');

        const response = await fetch('/api/generate-quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            topic: quizSetup.topic,
            difficulty: quizSetup.difficulty,
            numberOfQuestions: Math.max(10, Math.min(quizSetup.maxPlayers * 2, 30)),
            questionTypes: ["Multiple Choice"],
            questionStyles: ["Conceptual"],
            timeLimit: Math.min(Math.max(Math.round((quizSetup.timePerQuestion * Math.max(10, Math.min(quizSetup.maxPlayers * 2, 30))) / 60), 5), 120),
            userClass: "MDCAT Student",
            isPro: false,
            specificInstructions: `Create a quiz about ${quizSetup.topic} with ${quizSetup.difficulty} difficulty level. Follow MDCAT syllabus standards.`
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate quiz content');
        }

        const result = await response.json();
        quizContent = result.quiz;
      }

      if (!quizContent || quizContent.length === 0) {
        throw new Error('No quiz content generated. Please try again.');
      }

      console.log('✅ Quiz generated successfully:', quizContent.length, 'questions');

      // Step 2: Generate unique room code
      const roomCode = generateRoomCode();
      console.log('🔖 Room code generated:', roomCode);

      // Step 3: Transform quiz data to QuizArena format
      const quizArenaData = quizContent.map((q: any) => ({
        question: q.question,
        options: q.answers || [],
        correctIndex: q.answers?.indexOf(q.correctAnswer) || 0,
        type: "multiple-choice"
      }));

      console.log('🔄 Transformed quiz data for QuizArena');

      // Step 4: Create room using QuizArena
      const { QuizArena } = await import('@/lib/quiz-arena');

      toast?.({
        title: '🏗️ Finalizing Room...',
        description: 'Almost done! Setting up your quiz session...',
      });

      await QuizArena.Host.createRoom(roomCode, user.uid, user.displayName || 'Anonymous', quizArenaData);

      console.log('🚀 Room created successfully:', roomCode);

      // Step 5: Navigate to hosting page
      console.log('🎯 Room created successfully! Navigating to hosting page...');

      // Redirect to the actual room hosting page
      window.location.href = `/quiz-arena/host/${roomCode}`;
      return;

    } catch (error: any) {
      console.error('❌ Error creating room:', error);
      let errorMessage = 'Failed to create quiz room. Please try again.';

      if (error.message?.includes('Failed to generate quiz content')) {
        errorMessage = 'Failed to generate quiz questions. Please check your topic and try again.';
      } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
        errorMessage = 'AI service is busy. Please wait a moment and try again.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Connection issue. Please check your internet and try again.';
      }

      toast?.({
        title: 'Room Creation Failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return '🌱';
      case 'medium':
        return '💪';
      case 'hard':
        return '🔥';
      default:
        return '🎯';
    }
  };

  if (setupMode === 'select') {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => window.history.back()} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Quiz Arena [BETA]</h1>
            <p className="text-muted-foreground">Create or join multiplayer quiz rooms and compete with others in real-time!</p>
          </div>
        </div>

        {/* BETA Warning Notice */}
        <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950/10 border-l-4">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-orange-800 dark:text-orange-200">⚠️ Beta Feature Notice</h3>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  This feature is in testing and may cause errors or unexpected behavior.
                  We're actively working on improvements. Your feedback would be greatly appreciated!
                </p>
                <p className="text-xs text-muted-foreground">
                  If you encounter any issues, please report them to our support team.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hero Section */}
        <Card className="bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full">
                <Users className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to Quiz Arena! 🎯</h2>
            <p className="text-muted-foreground mb-6">
              Challenge yourself and others in real-time multiplayer quiz battles.
              Select a quiz template or create your own custom quiz.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={handleCustomQuizSetup} size="lg" variant="outline">
                <Plus className="mr-2 h-5 w-5" />
                Create Custom Quiz
              </Button>
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="#templates">
                  <Trophy className="mr-2 h-5 w-5" />
                  Browse Templates
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Templates */}
        <div id="templates">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Featured Quiz Templates</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizTemplates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {getDifficultyIcon(template.difficulty)} {template.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {template.questions} Qs
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button
                    onClick={() => handleQuizTemplateSelect(template.id)}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={isCreatingRoom}
                  >
                    {isCreatingRoom ? (
                      <>
                        <div className="w-4 h-4 border-2 border-muted border-t-accent rounded-full animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Host This Quiz
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Future: Join Room Section */}
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Join a Room</h3>
            <p className="text-muted-foreground mb-4">
              Have a room code? Join an existing multiplayer quiz.
            </p>
            <p className="text-sm text-muted-foreground">
              🚧 Coming in the next update...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (setupMode === 'create') {
    return (
      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={() => setSetupMode('select')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Templates
          </Button>

          {/* BETA Warning Notice */}
          <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950/10 border-l-4">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-200 text-sm">⚠️ Beta Feature</h4>
                  <p className="text-xs text-orange-700 dark:text-orange-300">
                    This feature is in testing. Report any issues to our support team.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Create Custom Quiz</h1>
            <p className="text-muted-foreground">Set up your perfect multiplayer quiz room</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quiz Configuration</CardTitle>
              <CardDescription>
                Configure your quiz settings and room preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Quiz Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter an engaging quiz title"
                    value={quizSetup.title}
                    onChange={(e) => setQuizSetup(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select
                    value={quizSetup.difficulty}
                    onValueChange={(value) => setQuizSetup(prev => ({ ...prev, difficulty: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy {getDifficultyIcon('easy')}</SelectItem>
                      <SelectItem value="medium">Medium {getDifficultyIcon('medium')}</SelectItem>
                      <SelectItem value="hard">Hard {getDifficultyIcon('hard')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Topic *</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Biology, Physics, History"
                  value={quizSetup.topic}
                  onChange={(e) => setQuizSetup(prev => ({ ...prev, topic: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this quiz covers..."
                  value={quizSetup.description}
                  onChange={(e) => setQuizSetup(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Maximum Players</Label>
                  <Badge variant="secondary">{quizSetup.maxPlayers} players</Badge>
                </div>
                <Slider
                  value={[quizSetup.maxPlayers]}
                  onValueChange={(value) => setQuizSetup(prev => ({ ...prev, maxPlayers: value[0] }))}
                  max={50}
                  min={2}
                  step={1}
                  className="w-full"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Time per Question</Label>
                    <div className="px-3 py-2 border rounded-md bg-muted">
                      <span className="text-sm font-medium">{quizSetup.timePerQuestion} seconds</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Game Duration</Label>
                    <div className="px-3 py-2 border rounded-md bg-muted">
                      <span className="text-sm font-medium">~{Math.round(quizSetup.timePerQuestion * Math.max(10, Math.min(quizSetup.maxPlayers * 2, 30)) / 60)} minutes</span>
                    </div>
                  </div>
                </div>

                <Slider
                  value={[quizSetup.timePerQuestion]}
                  onValueChange={(value) => setQuizSetup(prev => ({ ...prev, timePerQuestion: value[0] }))}
                  max={120}
                  min={10}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublic"
                    checked={quizSetup.isPublic}
                    onCheckedChange={(checked) => setQuizSetup(prev => ({ ...prev, isPublic: checked }))}
                  />
                  <Label htmlFor="isPublic" className="flex items-center gap-2">
                    {quizSetup.isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                    Make room public (discoverable by others)
                  </Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button variant="outline" onClick={() => setSetupMode('select')} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleCreateRoom}
                disabled={!quizSetup.title.trim() || !quizSetup.topic.trim() || isCreatingRoom}
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {isCreatingRoom ? 'Creating...' : 'Create Room'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Room hosting/loading screen
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md mx-4">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            {isCreatingRoom ? (
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Sparkles className="w-12 h-12 text-primary" />
            )}
          </div>
          <h2 className="text-2xl font-semibold mb-2">
            {isCreatingRoom ? 'Creating Your Room...' : 'Quiz Arena Coming Soon!'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {isCreatingRoom
              ? `Setting up "${quizSetup.title}" for ${quizSetup.maxPlayers} players...`
              : 'The multiplayer Quiz Arena feature is under development. Stay tuned for real-time quiz battles!'
            }
          </p>

          {!isCreatingRoom && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg text-sm">
                <h3 className="font-semibold mb-2">🚀 Features Coming:</h3>
                <ul className="text-left space-y-1 text-muted-foreground">
                  <li>• Real-time multiplayer gameplay</li>
                  <li>• Live leaderboard updates</li>
                  <li>• Private and public rooms</li>
                  <li>• Custom quiz creation</li>
                  <li>• Host controls and moderation</li>
                </ul>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSetupMode('select')} className="flex-1">
                  Back to Setup
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/">Home</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Room Code Dialog - Future Implementation */}
      <Dialog open={showRoomDialog} onOpenChange={setShowRoomDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Room Created! 🎯</DialogTitle>
            <DialogDescription>
              Your quiz arena is ready. Share this code with friends.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-mono font-bold bg-muted p-4 rounded-lg">
                {roomCode}
              </div>
            </div>
            <Button onClick={() => setShowRoomDialog(false)} className="w-full">
              Got it! Start Hosting
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
