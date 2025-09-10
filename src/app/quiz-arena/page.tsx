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
  Hexagon,
  Layers,
  Rocket,
  Radar
} from 'lucide-react';
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Enhanced quiz templates with gaming aesthetic
  const quizTemplates = [
    {
      id: 'mdcpharmacology',
      title: 'MDCAT Pharmacology',
      description: 'Master drug mechanisms & clinical applications',
      topic: 'Pharmacology',
      difficulty: 'Medium',
      questions: 15,
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-950/20 to-pink-950/20',
      category: 'MEDICAL'
    },
    {
      id: 'organicreactions',
      title: 'Organic Chemistry',
      description: 'Master reaction mechanisms & synthesis',
      topic: 'Organic Chemistry',
      difficulty: 'Hard',
      questions: 20,
      icon: Flame,
      color: 'from-red-500 to-orange-500',
      bgColor: 'from-red-950/20 to-orange-950/20',
      category: 'SCIENCE'
    },
    {
      id: 'physicsmechanics',
      title: 'Physics Mechanics',
      description: 'Forces, energy, and motion mastery',
      topic: 'Physics',
      difficulty: 'Medium',
      questions: 18,
      icon: Zap,
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'from-cyan-950/20 to-blue-950/20',
      category: 'PHYSICS'
    }
  ];

  const handleQuizTemplateSelect = async (templateId: string) => {
    if (!user) return;

    const template = quizTemplates.find(t => t.id === templateId);
    if (template) {
      setQuizSetup(prev => ({
        ...prev,
        title: template.title,
        description: template.description,
        topic: template.topic,
        difficulty: template.difficulty
      }));
      setCurrentQuizId(templateId);
      await handleCreateRoom();
    }
  };

  const handleCreateRoom = async () => {
    if (!user || !quizSetup.title.trim()) return;

    setIsCreatingRoom(true);

    try {
      console.log('🎯 Starting room creation process...');

      // Step 1: Generate actual quiz content first
      let quizContent;
      if (currentQuizId) {
        const template = quizTemplates.find(t => t.id === currentQuizId);
        if (!template) throw new Error('Template not found');

        console.log('📚 Generating quiz from template:', template.title);

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

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-400 border-green-400';
      case 'medium':
        return 'text-yellow-400 border-yellow-400';
      case 'hard':
        return 'text-red-400 border-red-400';
      default:
        return 'text-cyan-400 border-cyan-400';
    }
  };

  if (setupMode === 'select') {
    return (
      // Background with particles effect
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">

        {/* Animated Background Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-20 animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Moving gradient orb */}
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full opacity-30 blur-3xl animate-pulse"
          style={{
            left: mousePosition.x / 10,
            top: mousePosition.y / 10,
          }}
        />

        <div className="relative z-10 container mx-auto px-4 py-8">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/20 border border-cyan-900/50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                BACK TO DASHBOARD
              </Button>
            </div>

            <div className="relative mb-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-lg blur opacity-20"></div>
              <div className="relative bg-slate-900 border border-slate-700 rounded-lg p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <Hexagon className="w-20 h-20 text-cyan-400" />
                    <Gamepad2 className="absolute inset-0 w-6 h-6 text-purple-400 m-auto" />
                  </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  QUIZ ARENA
                </h1>
                <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-6">
                  Enter the next generation of competitive learning.
                  Battle globally, climb leaderboards, and prove your knowledge mastery.
                </p>

                {/* Live Stats */}
                <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
                  <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
                    <div className="text-2xl font-bold text-cyan-400">247</div>
                    <div className="text-xs text-slate-400 uppercase">Active Players</div>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-400">142</div>
                    <div className="text-xs text-slate-400 uppercase">Battles Today</div>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
                    <div className="text-2xl font-bold text-pink-400">89</div>
                    <div className="text-xs text-slate-400 uppercase">Winners Today</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="group">
              <div className="bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-900/50 rounded-xl p-6 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer">
                <Rocket className="w-8 h-8 text-cyan-400 mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">QUICK PLAY</h3>
                <p className="text-slate-400 text-sm">Jump into instant matchmaking battles</p>
              </div>
            </div>

            <div className="group cursor-pointer" onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}>
              <div className="bg-gradient-to-br from-purple-950/30 to-pink-950/30 border border-purple-900/50 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-300">
                <Trophy className="w-8 h-8 text-purple-400 mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">CREATE BATTLE</h3>
                <p className="text-slate-400 text-sm">Host your own quiz tournament</p>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-green-950/30 to-emerald-950/30 border border-green-900/50 rounded-xl p-6 hover:border-green-400/50 transition-all duration-300">
                <Radar className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">JOIN ROOM</h3>
                <p className="text-slate-400 text-sm">Enter room code to join</p>
              </div>
            </div>
          </div>

          {/* Featured Templates - Hexagonal Gaming Style */}
          <div id="templates" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">SELECT YOUR BATTLE</h2>
              <p className="text-slate-400">Choose from legendary templates or create your custom arena</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {quizTemplates.map((template, index) => {
                const IconComponent = template.icon;
                return (
                  <div key={template.id} className="group">
                    <div className={`relative p-8 rounded-xl bg-gradient-to-br ${template.bgColor} border border-slate-700 hover:border-slate-400 transition-all duration-300 cursor-pointer overflow-hidden`}>

                      {/* Animated background effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Hexagonal corner decorations */}
                      <div className="absolute -top-1 -left-1 w-8 h-8 text-cyan-400/30">
                        <Hexagon className="w-full h-full fill-current" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 text-purple-400/30">
                        <Hexagon className="w-full h-full fill-current" />
                      </div>

                      {/* Badge */}
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <Badge className={`bg-gradient-to-r ${template.color} text-white border-0 text-xs font-bold uppercase`}>
                          {template.category}
                        </Badge>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded border text-xs ${getDifficultyColor(template.difficulty)}`}>
                          {getDifficultyIcon(template.difficulty)}
                          <span className="uppercase font-semibold">{template.difficulty}</span>
                        </div>
                      </div>

                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center mb-4 relative z-10`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>

                      {/* Content */}
                      <div className="space-y-3 relative z-10">
                        <h3 className="text-xl font-bold text-white">{template.title}</h3>
                        <p className="text-slate-400 text-sm">{template.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <Layers className="w-3 h-3" />
                            {template.questions} Questions
                          </div>
                          <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <Clock className="w-3 h-3" />
                            30s per Q
                          </div>
                        </div>
                      </div>

                      {/* Hover glow effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>

                      {/* Create Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <Button
                          onClick={() => handleQuizTemplateSelect(template.id)}
                          disabled={isCreatingRoom}
                          className={`bg-gradient-to-r ${template.color} hover:opacity-90 text-white font-bold px-6 py-3 rounded-lg border-0 shadow-lg transform scale-95 hover:scale-100 transition-transform`}
                        >
                          <Play className="mr-2 h-5 w-5" />
                          {isCreatingRoom ? 'CREATING BATTLE...' : 'START BATTLE'}
                        </Button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Creation Card */}
            <div className="flex justify-center mt-12">
              <div className="group cursor-pointer" onClick={() => setSetupMode('create')}>
                <div className="relative p-8 bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-dashed border-slate-600 rounded-xl hover:border-cyan-400 transition-all duration-300">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Create Custom Arena</h3>
                      <p className="text-slate-400">Design your own battle with unlimited possibilities</p>
                    </div>
                    <Sword className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-40 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={() => setSetupMode('select')}
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              BACK TO ARENAS
            </Button>

            <div className="flex items-center gap-2">
              <Sword className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400 font-semibold">CUSTOM BATTLE SETUP</span>
            </div>
          </div>

          {/* Custom Form with Gaming Style */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Forge Your Arena</h2>
              <p className="text-slate-400">Customize every aspect of your battleground</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-cyan-400 font-semibold uppercase text-sm">ARENA TITLE</Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter epic arena name..."
                      value={quizSetup.title}
                      onChange={(e) => setQuizSetup(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-400"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-cyan-400 font-semibold uppercase text-sm">DOMAIN</Label>
                  <Select value={quizSetup.difficulty} onValueChange={(value) => setQuizSetup(prev => ({ ...prev, difficulty: value }))}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white focus:border-cyan-400">
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

                <div className="space-y-2">
                  <Label className="text-cyan-400 font-semibold uppercase text-sm">BATTLE SIZE</Label>
                  <div className="bg-slate-800 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-300 text-sm">MAX CONTENDERS</span>
                      <span className="text-cyan-400 font-bold">{quizSetup.maxPlayers}</span>
                    </div>
                    <Slider
                      value={[quizSetup.maxPlayers]}
                      onValueChange={(value) => setQuizSetup(prev => ({ ...prev, maxPlayers: value[0] }))}
                      max={50}
                      min={2}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-cyan-400 font-semibold uppercase text-sm">SUBJECT</Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter subject matter..."
                      value={quizSetup.topic}
                      onChange={(e) => setQuizSetup(prev => ({ ...prev, topic: e.target.value }))}
                      className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-400"
                    />
                    <Target className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-cyan-400 font-semibold uppercase text-sm">TIMING (PER QUESTION)</Label>
                  <div className="bg-slate-800 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-300 text-sm">SECONDS</span>
                      <span className="text-cyan-400 font-bold">{quizSetup.timePerQuestion}s</span>
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
                </div>

                <div className="space-y-2">
                  <Label className="text-cyan-400 font-semibold uppercase text-sm">ARENA MODE</Label>
                  <div className="flex gap-4">
                    <div className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${quizSetup.isPublic ? 'border-purple-400 bg-purple-950/20' : 'border-slate-600 bg-slate-800'}`}
                         onClick={() => setQuizSetup(prev => ({ ...prev, isPublic: true }))}>
                      <Globe className={`w-4 h-4 ${quizSetup.isPublic ? 'text-purple-400' : 'text-slate-400'}`} />
                      <span className={`text-sm ${quizSetup.isPublic ? 'text-purple-400' : 'text-slate-400'}`}>PUBLIC</span>
                    </div>
                    <div className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${!quizSetup.isPublic ? 'border-green-400 bg-green-950/20' : 'border-slate-600 bg-slate-800'}`}
                         onClick={() => setQuizSetup(prev => ({ ...prev, isPublic: false }))}>
                      <Lock className={`w-4 h-4 ${!quizSetup.isPublic ? 'text-green-400' : 'text-slate-400'}`} />
                      <span className={`text-sm ${!quizSetup.isPublic ? 'text-green-400' : 'text-slate-400'}`}>PRIVATE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Create Battle Button */}
            <div className="flex justify-center mt-8">
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

  // Loading Screen with Gaming Aesthetics
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationName: 'pulse',
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 2}s`,
              animationIterationCount: 'infinite'
            }}
          />
        ))}
      </div>

      {/* Central Loading Card */}
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

          {isCreatingRoom && (
            <div className="space-y-4 mb-8">
              {/* Loading Steps */}
              <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">🔧 Constructing Questions...</span>
                  <span className="text-cyan-400 text-sm">100%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">⚔️ Preparing Battle System...</span>
                  <span className="text-cyan-400 text-sm">85%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">🏆 Setting Up Leaderboards...</span>
                  <span className="text-cyan-400 text-sm">70%</span>
                </div>
              </div>
            </div>
          )}

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

      <Dialog open={showRoomDialog} onOpenChange={setShowRoomDialog}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Crown className="w-6 h-6 text-yellow-400" />
              ARENA CREATED!
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              Your battleground is ready. Share this code to invite champions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-3xl font-mono font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent p-4 rounded-lg border border-slate-600">
                {roomCode}
              </div>
              <p className="text-xs text-slate-400 mt-2">Battle Code</p>
            </div>
            <Button
              onClick={() => setShowRoomDialog(false)}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-3 rounded-lg"
            >
              <Sword className="mr-2 h-5 w-5" />
              BEGIN THE BATTLE
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
