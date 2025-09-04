"use client";

import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Question, FileText, Shield, Moon, Sun, SignOut, Bell, User, Student, Cake, ArrowRight, Phone, Envelope, ChatCircle, HelpCircle, BookOpen, Star, Trophy, ChartLineUp } from "@phosphor-icons/react";
import { Sparkles, ExternalLink, Users, MessageSquare, FileQuestion, Headphones, Share2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";
import Link from 'next/link';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { usePlan } from "@/hooks/usePlan";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { getQuizResults } from "@/lib/indexed-db";
import ShareAppPopup from "@/components/share-app-popup";

const supportLinks = [
    { href: "/how-to-use", label: "How to Use Guide", icon: Question, description: "Learn how to use all features" },
    { href: "/how-to-use/contact-support", label: "Contact Support", icon: Headphones, description: "Get help from our team" },
    { href: "mailto:support@quizzicallabs.com", label: "Email Us", icon: Envelope, description: "support@quizzicallabs.com", external: true },
    { href: "https://wa.me/923001234567", label: "WhatsApp Support", icon: ChatCircle, description: "Quick chat support", external: true },
];

const legalLinks = [
    { href: "/terms-of-use", label: "Terms of Use", icon: Shield },
    { href: "/privacy-policy", label: "Privacy Policy", icon: Shield },
    { href: "/disclaimer", label: "Disclaimer", icon: FileText },
    { href: "/about-us", label: "About Us", icon: Users },
];

const quickActions = [
    { href: "/generate-quiz", label: "Create Quiz", icon: Question, color: "bg-blue-500/10 text-blue-600" },
    { href: "/exam-prep", label: "Exam Prep", icon: BookOpen, color: "bg-green-500/10 text-green-600" },
    { href: "/generate-study-guide", label: "Study Guide", icon: FileText, color: "bg-purple-500/10 text-purple-600" },
    { href: "/bookmarks", label: "Bookmarks", icon: Star, color: "bg-orange-500/10 text-orange-600" },
];

export default function ProfilePage() {
  const { user, loading, logout, updateUserPlan } = useAuth();
  const { theme, setTheme } = useTheme();
  const { plan } = usePlan();
  const { toast } = useToast();
  const [redeemCode, setRedeemCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [stats, setStats] = useState({ totalQuizzes: 0, averageScore: 0, streak: 0 });
  const [showSharePopup, setShowSharePopup] = useState(false);

  useEffect(() => {
    async function loadStats() {
      if (!user) return;
      const results = await getQuizResults(user.uid);
      const totalQuizzes = results.length;
      const averageScore = results.length > 0 ? results.reduce((sum, r) => sum + r.percentage, 0) / results.length : 0;
      
      // Calculate streak
      const uniqueDays = new Set(results.map(r => new Date(r.date).toDateString()));
      const sortedDays = Array.from(uniqueDays).map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());
      let streak = 0;
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (sortedDays.some(d => d.toDateString() === today.toDateString()) || 
          sortedDays.some(d => d.toDateString() === yesterday.toDateString())) {
        streak = 1;
        let lastDate = sortedDays.some(d => d.toDateString() === today.toDateString()) ? today : yesterday;
        for (let i = 1; i < sortedDays.length; i++) {
          const currentDate = sortedDays[i];
          const expectedPreviousDay = new Date(lastDate);
          expectedPreviousDay.setDate(lastDate.getDate() - 1);
          if (currentDate.toDateString() === expectedPreviousDay.toDateString()) {
            streak++;
            lastDate = currentDate;
          } else {
            break;
          }
        }
      }
      
      setStats({ totalQuizzes, averageScore: Math.round(averageScore), streak });
    }
    loadStats();
  }, [user]);

  const handleRedeemCode = async () => {
    if (!redeemCode.trim()) {
        toast({ title: "Please enter a code.", variant: "destructive"});
        return;
    }
    
    setIsRedeeming(true);
    
    try {
      const proCodes = process.env.NEXT_PUBLIC_PRO_ACCESS_CODES?.split(',') || [];
      
      // Debug: Log available codes (remove this after testing)
      console.log('Available codes:', proCodes);
      console.log('Entered code:', redeemCode.trim().toUpperCase());
      
      if (proCodes.includes(redeemCode.trim().toUpperCase())) {
        // Update user plan in Firebase and local state
        await updateUserPlan('Pro');
        
        toast({ 
          title: "Success! 🎉", 
          description: "You've been upgraded to the Pro plan. Enjoy unlimited access!",
          duration: 5000
        });
        
        // Clear the input
        setRedeemCode('');
      } else {
        toast({ 
          title: "Invalid Code", 
          description: "The code you entered is not valid. Please check and try again.", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Error redeeming code:', error);
      toast({ 
        title: "Error", 
        description: "Failed to redeem code. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsRedeeming(false);
    }
  }

  const DetailRow = ({ label, value, icon: Icon }: { label: string; value: string | number | null | undefined; icon: React.ElementType }) => (
    <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon className="h-5 w-5" />
          <p>{label}</p>
        </div>
        <p className="font-medium">{value || 'N/A'}</p>
    </div>
  );

  return (
    <div>
      <PageHeader title="Profile & Settings"/>

      <div className="space-y-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg border-0 bg-gradient-to-br from-primary/5 via-background to-accent/5">
            <CardHeader className="text-center pb-8">
              <div className="relative mx-auto mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground">
                  {loading ? (
                    <Skeleton className="w-20 h-20 rounded-full" />
                  ) : (
                    user?.displayName?.charAt(0)?.toUpperCase() || 'U'
                  )}
                </div>
                {plan === 'Pro' && (
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-accent-foreground" />
                  </div>
                )}
              </div>
              {loading ? (
                <div className="space-y-2 flex flex-col items-center">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ) : (
                <>
                  <CardTitle className="text-2xl font-bold">{user?.displayName}</CardTitle>
                  <CardDescription className="text-base">{user?.email}</CardDescription>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Badge variant={plan === 'Pro' ? 'default' : 'secondary'} className="px-3 py-1">
                      {plan === 'Pro' && <Sparkles className="h-3 w-3 mr-1" />}
                      {plan} Plan
                    </Badge>
                  </div>
                </>
              )}
            </CardHeader>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-3 gap-4"
        >
          <Card className="text-center p-4">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-500/10 rounded-full mx-auto mb-2">
              <ChartLineUp className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold">{stats.totalQuizzes}</p>
            <p className="text-sm text-muted-foreground">Quizzes Taken</p>
          </Card>
          <Card className="text-center p-4">
            <div className="flex items-center justify-center w-10 h-10 bg-green-500/10 rounded-full mx-auto mb-2">
              <Trophy className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold">{stats.averageScore}%</p>
            <p className="text-sm text-muted-foreground">Avg Score</p>
          </Card>
          <Card className="text-center p-4">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-500/10 rounded-full mx-auto mb-2">
              <Star className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold">{stats.streak}</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground px-4">QUICK ACTIONS</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <Button asChild variant="outline" className="w-full h-16 flex-col gap-2">
                  <Link href={action.href}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${action.color}`}>
                      <action.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm">{action.label}</span>
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Subscription */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground px-4">SUBSCRIPTION</h3>
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Plan</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    {plan === 'Pro' && <Sparkles className="text-accent h-4 w-4"/>}
                    You are on the <span className="font-bold text-primary">{plan} Plan</span>
                  </CardDescription>
                </div>
                <Button asChild variant="outline">
                  <Link href="/billing">Manage <ArrowRight className="ml-2 h-4 w-4"/></Link>
                </Button>
              </div>
            </CardHeader>
            {plan === 'Free' && (
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="redeem-code">Redeem Access Code</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="redeem-code" 
                      placeholder="Enter code..." 
                      value={redeemCode} 
                      onChange={(e) => setRedeemCode(e.target.value)} 
                    />
                    <Button onClick={handleRedeemCode} disabled={isRedeeming}>
                      {isRedeeming ? 'Redeeming...' : 'Redeem'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Account Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground px-4">ACCOUNT</h3>
          <Card className="shadow-sm">
            <CardContent className="divide-y p-0">
              <DetailRow label="Father's Name" value={user?.fatherName} icon={User} />
              <DetailRow label="Class / Level" value={user?.className} icon={Student} />
              <DetailRow label="Age" value={user?.age} icon={Cake}/>
            </CardContent>
          </Card>
        </div>

        {/* App Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground px-4">APP SETTINGS</h3>
          <Card className="shadow-sm">
            <CardContent className="divide-y p-0">
              <div className="flex items-center justify-between p-4">
                <Label htmlFor="theme-toggle" className="text-muted-foreground flex items-center gap-2">
                  {theme === 'dark' ? <Moon className="h-5 w-5"/> : <Sun className="h-5 w-5"/>}
                  <span>Dark Mode</span>
                </Label>
                <Switch
                  id="theme-toggle"
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
              </div>
              <div className="flex items-center justify-between p-4">
                <Label htmlFor="notifications-toggle" className="text-muted-foreground flex items-center gap-2">
                  <Bell className="h-5 w-5"/>
                  <span>Push Notifications</span>
                </Label>
                <Switch id="notifications-toggle" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support & Contact */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground px-4">SUPPORT & CONTACT</h3>
          <Card className="shadow-sm">
            <CardContent className="divide-y p-0">
              {supportLinks.map(link => (
                <Link 
                  href={link.href} 
                  key={link.href} 
                  className="flex items-center justify-between p-4 text-muted-foreground hover:bg-secondary transition-colors"
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <link.icon className="h-4 w-4 text-primary"/>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{link.label}</p>
                      <p className="text-xs text-muted-foreground">{link.description}</p>
                    </div>
                  </div>
                  {link.external && <ExternalLink className="h-4 w-4" />}
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Legal */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground px-4">LEGAL & POLICIES</h3>
          <Card className="shadow-sm">
            <CardContent className="divide-y p-0">
              {legalLinks.map(link => (
                <Link 
                  href={link.href} 
                  key={link.href} 
                  className="flex items-center justify-between p-4 text-muted-foreground hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <link.icon className="h-5 w-5"/>
                    <span>{link.label}</span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
        
        {/* Share App */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground px-4">SHARE WITH FRIENDS</h3>
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setShowSharePopup(true)}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Quizzicallabs AI
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Help your friends discover the ultimate AI study partner!
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Logout */}
        <div className="pt-4">
          <Button 
            variant="outline" 
            className="w-full border-destructive text-destructive hover:bg-destructive/10" 
            onClick={logout}
          >
            <SignOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
      
      <ShareAppPopup 
        isOpen={showSharePopup} 
        onClose={() => setShowSharePopup(false)} 
      />
    </div>
  );
}