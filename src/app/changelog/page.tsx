import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Plus, Bug, Zap, Shield, BookOpen, GamepadIcon, Wrench } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Changelog",
    description: "Latest updates and improvements to Quizzicallabzᴬᴵ platform.",
};

export default function ChangelogPage() {
  const changelog = [
    {
      version: "2.5.0",
      date: "2025-01-30",
      type: "major",
      title: "AI Model Upgrades & Performance Improvements",
      changes: [
        { type: "feature", icon: Sparkles, title: "Enhanced AI Quiz Generation", description: "Upgraded to Gemini 2.0 Pro for better quiz quality and faster generation" },
        { type: "feature", icon: Zap, title: "Improved Response Times", description: "30% faster quiz generation and content creation" },
        { type: "feature", icon: BookOpen, title: "Advanced Study Guides", description: "New AI-powered study guide generation with mind maps" },
        { type: "bugfix", icon: Bug, title: "Bug Fixes", description: "Fixed various UI bugs and improved stability" }
      ]
    },
    {
      version: "2.4.0",
      date: "2025-01-15",
      type: "major",
      title: "Live Quiz Arena & Social Features",
      changes: [
        { type: "feature", icon: GamepadIcon, title: "Live Quiz Battles", description: "Real-time multiplayer quiz competitions with friends" },
        { type: "feature", icon: Plus, title: "Social Sharing", description: "Share quiz results and achievements on social media" },
        { type: "feature", icon: Shield, title: "Enhanced Security", description: "Improved account security and data protection" },
        { type: "improvement", icon: Wrench, title: "UI Improvements", description: "Better mobile experience and navigation" }
      ]
    },
    {
      version: "2.3.0",
      date: "2024-12-20",
      type: "major",
      title: "Document Processing & Exam Prep",
      changes: [
        { type: "feature", icon: Plus, title: "PDF Quiz Generation", description: "Upload PDF documents and generate quizzes automatically" },
        { type: "feature", icon: BookOpen, title: "MDCAT/ECAT Modules", description: "Specialized exam preparation for Pakistani entrance tests" },
        { type: "feature", icon: Zap, title: "Performance Analytics", description: "Detailed progress tracking and insights" },
        { type: "improvement", icon: Wrench, title: "Better UX", description: "Improved user interface and experience" }
      ]
    },
    {
      version: "2.2.0",
      date: "2024-12-01",
      type: "minor",
      title: "Mobile Optimization & Bug Fixes",
      changes: [
        { type: "improvement", icon: Wrench, title: "Mobile Responsiveness", description: "Better experience on mobile devices" },
        { type: "bugfix", icon: Bug, title: "Bug Fixes", description: "Fixed various issues and crashes" },
        { type: "feature", icon: Plus, title: "Offline Mode", description: "Basic offline functionality for better accessibility" }
      ]
    },
    {
      version: "2.1.0",
      date: "2024-11-15",
      type: "minor",
      title: "Enhanced AI Features",
      changes: [
        { type: "feature", icon: Sparkles, title: "Better AI Prompts", description: "Improved AI understanding and response quality" },
        { type: "feature", icon: Plus, title: "Custom Categories", description: "Create and manage custom quiz categories" },
        { type: "improvement", icon: Wrench, title: "UI Polish", description: "Visual improvements and better animations" }
      ]
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feature':
        return <Plus className="h-4 w-4 text-green-600" />;
      case 'bugfix':
        return <Bug className="h-4 w-4 text-red-600" />;
      case 'improvement':
        return <Wrench className="h-4 w-4 text-blue-600" />;
      default:
        return <Sparkles className="h-4 w-4 text-purple-600" />;
    }
  };

  const getVersionBadge = (versionType: string) => {
    const variants = {
      major: 'default',
      minor: 'secondary',
      patch: 'outline'
    } as const;

    return (
      <Badge variant={variants[versionType as keyof typeof variants] || 'secondary'}>
        v{versionType.charAt(0).toUpperCase() + versionType.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <PageHeader
        title="Changelog"
        description="Latest updates, improvements, and new features in Quizzicallabzᴬᴵ"
      />

      {/* Current Version Highlight */}
      <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                Latest Version: {changelog[0].version}
              </CardTitle>
              <p className="text-muted-foreground mt-2">{changelog[0].title}</p>
            </div>
            {getVersionBadge(changelog[0].type)}
          </div>
        </CardHeader>
      </Card>

      {/* Changelog Entries */}
      <div className="space-y-8">
        {changelog.map((entry, index) => (
          <Card key={index} className={index === 0 ? "ring-2 ring-primary/20" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <CardTitle className="text-xl">{entry.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Version {entry.version} • {new Date(entry.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                {getVersionBadge(entry.type)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {entry.changes.map((change, changeIndex) => (
                  <div key={changeIndex} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="p-2 bg-secondary rounded-full">
                      {getTypeIcon(change.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{change.title}</h4>
                      <p className="text-sm text-muted-foreground">{change.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Features */}
      <Card className="mt-8 bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-accent" />
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">🎙️ Voice AI Tutor</h4>
              <p className="text-sm text-muted-foreground">Conversational AI tutor for interactive learning sessions</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">📱 Mobile App</h4>
              <p className="text-sm text-muted-foreground">Native mobile applications for iOS and Android</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">🌐 Global Exam Prep</h4>
              <p className="text-sm text-muted-foreground">Support for international exams (SAT, GRE, IELTS, etc.)</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">🤝 Study Groups</h4>
              <p className="text-sm text-muted-foreground">Collaborative study groups and team challenges</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Beta Features */}
      <Card className="mt-8 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">🧪 Beta Features</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-800 mb-4">
            We're constantly testing new features. Beta features may be unstable and are subject to change.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-700 border-blue-300">Beta</Badge>
              <span className="text-sm text-blue-800">Advanced Analytics Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-700 border-blue-300">Beta</Badge>
              <span className="text-sm text-blue-800">Custom AI Model Training</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
