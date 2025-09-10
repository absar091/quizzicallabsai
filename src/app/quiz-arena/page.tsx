'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Users,
  Clock,
  Trophy,
  Play,
  Settings,
  Plus,
  Lock,
  Globe,
  Sparkles,
  AlertTriangle,
  ArrowLeft,
  Gamepad2,
  Zap,
  Target,
  Crown,
  Sword,
  Star,
  Flame,
  Layers,
  Rocket,
  Radar,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Custom scrollbar styles
const globalStyles = `
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #0f172a;
  }
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #0891b2, #0ea5e9);
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #0c7494, #0284c7);
  }
`;

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
  const [setupMode, setSetupMode] = useState<'select' | 'create' | 'join' | 'room'>('select');

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

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = globalStyles;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const quizTemplates = [
    {
      id: 'mdcpharmacology',
      title: 'MDCAT Pharmacology',
      description: 'Master drug mechanisms & clinical applications',
      topic: 'Pharmacology',
      difficulty: 'Medium',
      questions: 15,
      icon: Target,
      color: 'from-cyan-500 to-teal-500',
      accentColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      hoverColor: 'hover:border-cyan-400'
    },
    {
      id: 'organicreactions',
      title: 'Organic Chemistry',
      description: 'Master reaction mechanisms & synthesis',
      topic: 'Organic Chemistry',
      difficulty: 'Hard',
      questions: 20,
      icon: Flame,
      color: 'from-emerald-500 to-green-500',
      accentColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      hoverColor: 'hover:border-emerald-400'
    },
    {
      id: 'physicsmechanics',
      title: 'Physics Mechanics',
      description: 'Forces, energy, and motion mastery',
      topic: 'Physics',
      difficulty: 'Medium',
      questions: 18,
      icon: Zap,
      color: 'from-orange-500 to-amber-500',
      accentColor: 'text-orange-400',
      borderColor: 'border-orange-500/30',
      hoverColor: 'hover:border-orange-400'
    }
  ];

  const handleQuizTemplateSelect = async (templateId: string) => {
    if (!user) return;

    const template = quizTemplates.find(t => t.id === templateId);
    if (!template) return;

    setQuizSetup(prev => ({
      ...prev,
      title: template.title,
      description: template.description,
      topic: template.topic,
      difficulty: template.difficulty
    }));

    await handleCreateRoom();
  };

  const handleCreateRoom = async () => {
    if (!user || !quizSetup.title.trim()) return;

    setIsCreatingRoom(true);

    try {
      console.log('🎯 Starting room creation process...');

      let quizContent;
      const template = quizTemplates.find(t => t.id === 'mdcpharmacology');

      if (template) {
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
      }

      if (!quizContent || quizContent.length === 0) {
        throw new Error('No quiz content generated. Please try again.');
      }

      console.log('✅ Quiz generated successfully:', quizContent.length, 'questions');

      const roomCode = generateRoomCode();
      console.log('🔖 Room code generated:', roomCode);

      const quizArenaData = quizContent.map((q: any) => ({
        question: q.question,
        options: q.answers || [],
        correctIndex: q.answers?.indexOf(q.correctAnswer) || 0,
        type: "multiple-choice"
      }));

      console.log('🔄 Transformed quiz data for QuizArena');

      const { QuizArena } = await import('@/lib/quiz-arena');

      toast?.({
        title: '🏗️ Finalizing Arena...',
        description: 'Almost done! Setting up your battle...',
      });

      await QuizArena.Host.createRoom(roomCode, user.uid, user.displayName || 'Anonymous', quizArenaData);

      console.log('🚀 Arena created successfully:', roomCode);

      window.location.href = `/quiz-arena/host/${roomCode}`;
      return;

    } catch (error: any) {
      console.error('❌ Error creating arena:', error);
      let errorMessage = 'Failed to create quiz arena. Please try again.';

      if (error.message?.includes('Failed to generate quiz content')) {
        errorMessage = 'Failed to generate quiz questions. Please check your topic and try again.';
      } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
        errorMessage = 'AI service is busy. Please wait a moment and try again.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Connection issue. Please check your internet and try again.';
      }

      toast?.({
        title: 'Arena Creation Failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  if (setupMode === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">

        {/* Clean Particle Background */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">

          {/* Clean Header */}
          <div className="text-center mb-16">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="text-cyan-400 hover:text-cyan-300 mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              BACK TO DASHBOARD
            </Button>

            <div className="mb-8">
              <div className="inline-flex items-center gap-3 bg-slate-800/50 border border-slate-700 rounded-2xl p-4 mb-6 backdrop-blur-sm">
                <Gamepad2 className="w-8 h-8 text-cyan-400" />
                <span className="text-cyan-400 text-sm font-medium">LIVE ARENA PLATFORM</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  QUIZ ARENA
                </span>
              </h1>

              <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed mb-12">
                Master subjects through competitive gameplay. Join live battles, climb rankings,
                and compete with learners worldwide in real-time.
              </p>

              {/* Simplified Stats */}
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700">
                  <div className="text-xl font-bold text-cyan-400">247</div>
                  <div className="text-xs text-slate-400">Online Now</div>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700">
                  <div className="text-xl font-bold text-teal-400">142</div>
                  <div className="text-xs text-slate-400">Battles Today</div>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700">
                  <div className="text-xl font-bold text-emerald-400">89</div>
                  <div className="text-xs text-slate-400">Champions</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 hover:border-cyan-400/50 transition-all duration-300">
              <Rocket className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="text-xl font-semibold text-white mb-2">QUICK PLAY</h3>
              <p className="text-slate-400 text-sm">Instant matchmaking battles</p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 hover:border-teal-400/50 transition-all duration-300 cursor-pointer" onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}>
              <Trophy className="w-8 h-8 text-teal-400 mb-3" />
              <h3 className="text-xl font-semibold text-white mb-2">HOST ARENA</h3>
              <p className="text-slate-400 text-sm">Create custom competitions</p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 hover:border-emerald-400/50 transition-all duration-300 cursor-pointer" onClick={() => setSetupMode('join')}>
              <Radar className="w-8 h-8 text-emerald-400 mb-3" />
              <h3 className="text-xl font-semibold text-white mb-2">JOIN BATTLE</h3>
              <p className="text-slate-400 text-sm">Enter arena code</p>
            </div>
          </div>

          {/* Templates Section */}
          <div id="templates" className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">CHOOSE YOUR BATTLEGROUND</h2>
              <p className="text-slate-400 text-lg">Select from expert-crafted arenas or forge your own</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {quizTemplates.map((template, index) => {
                const IconComponent = template.icon;
                return (
                  <div key={template.id} className="group">
                    <Card className={`relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border ${template.borderColor} ${template.hoverColor} transition-all duration-300 cursor-pointer`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <Badge className="bg-slate-700 text-slate-300 border-slate-600 text-xs font-medium">
                            PROFESSIONAL
                          </Badge>
                          <div className="text-right">
                            <div className="text-xs text-slate-400">{template.questions} Questions</div>
                            <div className="text-xs text-slate-400">{template.difficulty}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center shadow-lg`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{template.title}</h3>
                            <p className="text-slate-400 text-sm">AI-curated content</p>
                          </div>
                        </div>

                        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                          {template.description}
                        </p>

                        <Button
                          onClick={() => handleQuizTemplateSelect(template.id)}
                          disabled={isCreatingRoom}
                          className="w-full bg-gradient-to-r from-slate-700 to-slate-800 border border-slate-600 hover:border-slate-500 transition-all duration-200"
                        >
                          {isCreatingRoom ? (
                            <div className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin mr-2" />
                          ) : (
                            <Play className="mr-2 h-4 w-4" />
                          )}
                          START BATTLE
                        </Button>
                      </CardContent>

                      {/* Subtle hover effect */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${template.color} opacity-[0.05]`} />
                    </Card>
                  </div>
                );
              })}
            </div>

            {/* Custom Creation */}
            <div className="flex justify-center mt-12">
              <div className="group cursor-pointer" onClick={() => setSetupMode('create')}>
                <div className="bg-slate-800/30 border border-slate-700 border-dashed rounded-xl p-8 hover:border-cyan-400 transition-all duration-300 text-center">
                  <div className="w-16 h-16 bg-slate-700/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-cyan-500/10 transition-colors">
                    <Plus className="w-8 h-8 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Custom Arena</h3>
                  <p className="text-slate-400">Design your own battleground</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  if (setupMode === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">

        <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={() => setSetupMode('select')}
              className="text-cyan-400 hover:text-cyan-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              BACK TO ARENAS
            </Button>

            <div className="flex items-center gap-2">
              <Sword className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400 font-semibold">CUSTOM BATTLE SETUP</span>
            </div>
          </div>

          {/* Custom Form */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Forge Your Arena</h2>
              <p className="text-slate-400">Customize every aspect of your battleground</p>
            </div>

            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <div>
                  <Label className="text-cyan-400 font-semibold uppercase text-sm">ARENA TITLE</Label>
                  <Input
                    placeholder="Enter epic arena name..."
                    value={quizSetup.title}
                    onChange={(e) => setQuizSetup(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-400 mt-2"
                  />
                </div>
                <div>
                  <Label className="text-cyan-400 font-semibold uppercase text-sm">DOMAIN</Label>
                  <Select value={quizSetup.difficulty} onValueChange={(value) => setQuizSetup(prev => ({ ...prev, difficulty: value }))}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white focus:border-cyan-400 mt-2">
                      <SelectValue placeholder="Select difficulty level" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="easy" className="text-green-400 hover:bg-slate-700">
                        🌱 RECRUIT - Basic Knowledge
                      </SelectItem>
                      <SelectItem value="medium" className="text-yellow-400 hover:bg-slate-700">
                        💪 VETERAN - Moderate Challenge
                      </SelectItem>
                      <SelectItem value="hard" className="text-red-400 hover:bg-slate-700">
                        🔥 CHAMPION - Expert Mastery
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-cyan-400 font-semibold uppercase text-sm">SUBJECT</Label>
                  <Input
                    placeholder="Enter subject matter..."
                    value={quizSetup.topic}
                    onChange={(e) => setQuizSetup(prev => ({ ...prev, topic: e.target.value }))}
                    className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-400 mt-2"
                  />
                </div>
                <div>
                  <Label className="text-cyan-400 font-semibold uppercase text-sm">TIMING (PER QUESTION)</Label>
                  <div className="bg-slate-800 rounded-lg p-4 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 text-sm">SECONDS</span>
                      <span className="text-cyan-400 font-bold">{quizSetup.timePerQuestion}s</span>
                    </div>
                    <Slider
                      value={[quizSetup.timePerQuestion]}
                      onValueChange={(value) => setQuizSetup(prev => ({ ...prev, timePerQuestion: value[0] }))}
                      max={120}
                      min={10}
                      step={5}
                      className="mt-3"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Create Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleCreateRoom}
                disabled={!quizSetup.title.trim() || !quizSetup.topic.trim() || isCreatingRoom}
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                {isCreatingRoom ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                    FORGING YOUR ARENA...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-3 h-6 w-6" />
                    CREATE EPIC BATTLE
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleJoinArena = () => {
    if (!roomCode.trim() || !user) return;

    // Redirect to the join URL
    window.location.href = `/quiz-arena/join/${roomCode.toUpperCase().trim()}`;
  };

  if (setupMode === 'join') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">

        <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={() => setSetupMode('select')}
              className="text-cyan-400 hover:text-cyan-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              BACK TO ARENAS
            </Button>

            <div className="flex items-center gap-2">
              <Radar className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">JOIN BATTLE</span>
            </div>
          </div>

          {/* Join Form */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Radar className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Enter Battle Code</h2>
              <p className="text-slate-400">Get your arena code from a friend to join their live battle</p>
            </div>

            {/* Room Code Input */}
            <div className="max-w-md mx-auto mb-8">
              <div className="space-y-4">
                <div>
                  <Label className="text-emerald-400 font-semibold uppercase text-sm mb-4 block text-center">
                    ARENA CODE (6 CHARACTERS)
                  </Label>
                  <Input
                    placeholder="e.g. ABC123"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase().slice(0, 6))}
                    className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-400 text-center text-2xl font-mono tracking-wider uppercase h-16 text-lg"
                    maxLength={6}
                  />
                </div>

                <div className="text-center text-xs text-slate-400">
                  Ask your host for the 6-character arena code to join their battle
                </div>
              </div>
            </div>


            {/* Join Button */}
            <div className="flex justify-center mb-8">
              <Button
                onClick={handleJoinArena}
                disabled={!roomCode.trim() || roomCode.length !== 6}
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Radar className="mr-3 h-6 w-6" />
                JOIN THE BATTLE
              </Button>
            </div>

            {/* Help Section */}
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-4">
                <strong>How to join:</strong>
              </p>
              <div className="bg-slate-800/30 rounded-lg p-4 text-left">
                <div className="space-y-2 text-sm text-slate-300">
                  <p><span className="text-emerald-400">•</span> Get the arena code from your host (usually 6 capital letters like "ABC123")</p>
                  <p><span className="text-emerald-400">•</span> Enter the code above and click "JOIN THE BATTLE"</p>
                  <p><span className="text-emerald-400">•</span> You'll join as a participant and start competing instantly</p>
                  <p><span className="text-emerald-400">•</span> Have fun and see if you can top the leaderboard!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Background Particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <Card className="max-w-md mx-4 border-slate-700 bg-slate-900/80 backdrop-blur-lg">
        <CardContent className="p-8 text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-lg opacity-30"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              {isCreatingRoom ? (
                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Gamepad2 className="w-10 h-10 text-white" />
              )}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">
            {isCreatingRoom ? 'FORGING YOUR ARENA...' : 'ARENA LOADING...'}
          </h2>

          <p className="text-slate-400 mb-8">
            {isCreatingRoom
              ? `Deploying ${quizSetup.title} for ${quizSetup.maxPlayers} contenders...`
              : 'Preparing the battleground...'
            }
          </p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setSetupMode('select')}
              className="flex-1 border-cyan-400 text-cyan-400 hover:bg-cyan-950/20"
            >
              BACK TO MENU
            </Button>
            <Button asChild className="flex-1">
              <Link href="/">RETURN HOME</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
