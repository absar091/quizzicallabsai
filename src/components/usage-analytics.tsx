'use client';

import { useEffect, useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  FileText, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { PLAN_LIMITS } from '@/lib/whop';

interface UsageAnalyticsProps {
  userId?: string;
  showUpgradePrompt?: boolean;
  compact?: boolean;
}

interface DailyUsage {
  date: string;
  tokens: number;
  quizzes: number;
}

interface UsageStats {
  totalTokens: number;
  totalQuizzes: number;
  averageTokensPerDay: number;
  averageQuizzesPerDay: number;
  peakUsageDay: string;
  projectedUsage: {
    tokens: number;
    quizzes: number;
    willExceed: boolean;
  };
}

export function UsageAnalytics({ userId, showUpgradePrompt = true, compact = false }: UsageAnalyticsProps) {
  const { usage, loading, error } = useSubscription();
  const [dailyUsage, setDailyUsage] = useState<DailyUsage[]>([]);
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (usage && userId) {
      loadUsageHistory();
    }
  }, [usage, userId]);

  const loadUsageHistory = async () => {
    try {
      setLoadingHistory(true);
      
      // Load usage history from Firebase
      const { db } = await import('@/lib/firebase');
      const { ref, get, query, orderByChild } = await import('firebase/database');
      
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      // Get daily usage data
      const usageRef = ref(db, `usage/${userId}`);
      const snapshot = await get(usageRef);
      
      if (snapshot.exists()) {
        const usageData = snapshot.val();
        const dailyData: DailyUsage[] = [];
        
        // Process usage data by year/month
        Object.entries(usageData).forEach(([year, months]: [string, any]) => {
          Object.entries(months).forEach(([month, data]: [string, any]) => {
            const date = new Date(parseInt(year), parseInt(month) - 1);
            if (date >= thirtyDaysAgo) {
              dailyData.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                tokens: data.tokens_used || 0,
                quizzes: data.quizzes_created || 0,
              });
            }
          });
        });
        
        setDailyUsage(dailyData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        
        // Calculate statistics
        calculateStats(dailyData);
      }
    } catch (error) {
      console.error('Failed to load usage history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const calculateStats = (data: DailyUsage[]) => {
    if (data.length === 0) return;

    const totalTokens = data.reduce((sum, day) => sum + day.tokens, 0);
    const totalQuizzes = data.reduce((sum, day) => sum + day.quizzes, 0);
    const daysWithData = data.length;

    const averageTokensPerDay = totalTokens / daysWithData;
    const averageQuizzesPerDay = totalQuizzes / daysWithData;

    // Find peak usage day
    const peakDay = data.reduce((max, day) => 
      day.tokens > max.tokens ? day : max
    , data[0]);

    // Project usage for the rest of the month
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysRemaining = daysInMonth - now.getDate();
    
    const projectedTokens = (usage?.tokens_used || 0) + (averageTokensPerDay * daysRemaining);
    const projectedQuizzes = (usage?.quizzes_used || 0) + (averageQuizzesPerDay * daysRemaining);

    setStats({
      totalTokens,
      totalQuizzes,
      averageTokensPerDay,
      averageQuizzesPerDay,
      peakUsageDay: peakDay.date,
      projectedUsage: {
        tokens: Math.round(projectedTokens),
        quizzes: Math.round(projectedQuizzes),
        willExceed: projectedTokens > (usage?.tokens_limit || 0) || projectedQuizzes > (usage?.quizzes_limit || 0),
      },
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getUsageStatus = (percentage: number) => {
    if (percentage >= 90) return { icon: AlertTriangle, text: 'Critical', color: 'text-red-500' };
    if (percentage >= 70) return { icon: AlertTriangle, text: 'Warning', color: 'text-yellow-500' };
    return { icon: CheckCircle, text: 'Healthy', color: 'text-green-500' };
  };

  if (loading || loadingHistory) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !usage) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            {error || 'Unable to load usage analytics'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const tokenPercentage = (usage.tokens_used / usage.tokens_limit) * 100;
  const quizPercentage = (usage.quizzes_used / usage.quizzes_limit) * 100;
  const tokenStatus = getUsageStatus(tokenPercentage);
  const quizStatus = getUsageStatus(quizPercentage);

  const currentPlan = PLAN_LIMITS[usage.plan as keyof typeof PLAN_LIMITS];

  // Chart colors
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

  // Prepare data for charts
  const usageBreakdown = [
    { name: 'Tokens Used', value: usage.tokens_used, color: '#8884d8' },
    { name: 'Tokens Remaining', value: usage.tokens_remaining, color: '#82ca9d' },
  ];

  const quizBreakdown = [
    { name: 'Quizzes Used', value: usage.quizzes_used, color: '#ffc658' },
    { name: 'Quizzes Remaining', value: usage.quizzes_remaining, color: '#ff8042' },
  ];

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Usage Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Token Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Tokens</span>
                <Badge variant={tokenPercentage >= 90 ? 'destructive' : 'secondary'} className="text-xs">
                  {tokenPercentage.toFixed(0)}%
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatNumber(usage.tokens_used)} / {formatNumber(usage.tokens_limit)}
              </span>
            </div>
            <Progress value={tokenPercentage} className="h-2" />
          </div>

          {/* Quiz Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Quizzes</span>
                <Badge variant={quizPercentage >= 90 ? 'destructive' : 'secondary'} className="text-xs">
                  {quizPercentage.toFixed(0)}%
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                {usage.quizzes_used} / {usage.quizzes_limit}
              </span>
            </div>
            <Progress value={quizPercentage} className="h-2" />
          </div>

          {/* Projected Usage Warning */}
          {stats?.projectedUsage.willExceed && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                ⚠️ You may exceed your limits this month. Consider upgrading.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Token Usage</CardTitle>
            <Zap className={`h-4 w-4 ${tokenStatus.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(usage.tokens_used)}
            </div>
            <p className="text-xs text-muted-foreground">
              of {formatNumber(usage.tokens_limit)} ({tokenPercentage.toFixed(1)}%)
            </p>
            <div className="mt-2">
              <Badge variant={tokenPercentage >= 90 ? 'destructive' : 'secondary'} className="text-xs">
                <tokenStatus.icon className="h-3 w-3 mr-1" />
                {tokenStatus.text}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quiz Usage</CardTitle>
            <FileText className={`h-4 w-4 ${quizStatus.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usage.quizzes_used}</div>
            <p className="text-xs text-muted-foreground">
              of {usage.quizzes_limit} ({quizPercentage.toFixed(1)}%)
            </p>
            <div className="mt-2">
              <Badge variant={quizPercentage >= 90 ? 'destructive' : 'secondary'} className="text-xs">
                <quizStatus.icon className="h-3 w-3 mr-1" />
                {quizStatus.text}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Daily Usage</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? formatNumber(Math.round(stats.averageTokensPerDay)) : '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              tokens per day
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats ? Math.round(stats.averageQuizzesPerDay) : 0} quizzes/day
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cycle Ends</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usage.billing_cycle_end ? 
                Math.ceil((new Date(usage.billing_cycle_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) :
                'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">days remaining</p>
            <p className="text-xs text-muted-foreground mt-1">
              {usage.billing_cycle_end ? 
                new Date(usage.billing_cycle_end).toLocaleDateString() :
                'No cycle'
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Usage Trends</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                30-Day Usage Trend
              </CardTitle>
              <CardDescription>Track your token and quiz usage over time</CardDescription>
            </CardHeader>
            <CardContent>
              {dailyUsage.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dailyUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="tokens" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6}
                      name="Tokens"
                    />
                    <Area 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="quizzes" 
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      fillOpacity={0.6}
                      name="Quizzes"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No usage data available yet. Start creating quizzes to see your trends!
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Token Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={usageBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {usageBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Used</span>
                    <span className="font-medium">{formatNumber(usage.tokens_used)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Remaining</span>
                    <span className="font-medium">{formatNumber(usage.tokens_remaining)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quiz Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={quizBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {quizBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Created</span>
                    <span className="font-medium">{usage.quizzes_used}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Remaining</span>
                    <span className="font-medium">{usage.quizzes_remaining}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Usage Projections
              </CardTitle>
              <CardDescription>
                Estimated usage by end of billing cycle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {stats ? (
                <>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Projected Token Usage</span>
                        <span className="text-sm text-muted-foreground">
                          {formatNumber(stats.projectedUsage.tokens)} / {formatNumber(usage.tokens_limit)}
                        </span>
                      </div>
                      <Progress 
                        value={(stats.projectedUsage.tokens / usage.tokens_limit) * 100} 
                        className="h-2"
                      />
                      {stats.projectedUsage.tokens > usage.tokens_limit && (
                        <p className="text-xs text-red-500 mt-1">
                          ⚠️ Projected to exceed limit by {formatNumber(stats.projectedUsage.tokens - usage.tokens_limit)} tokens
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Projected Quiz Usage</span>
                        <span className="text-sm text-muted-foreground">
                          {stats.projectedUsage.quizzes} / {usage.quizzes_limit}
                        </span>
                      </div>
                      <Progress 
                        value={(stats.projectedUsage.quizzes / usage.quizzes_limit) * 100} 
                        className="h-2"
                      />
                      {stats.projectedUsage.quizzes > usage.quizzes_limit && (
                        <p className="text-xs text-red-500 mt-1">
                          ⚠️ Projected to exceed limit by {stats.projectedUsage.quizzes - usage.quizzes_limit} quizzes
                        </p>
                      )}
                    </div>
                  </div>

                  {stats.projectedUsage.willExceed && showUpgradePrompt && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-yellow-900 mb-1">
                            You may exceed your limits
                          </h4>
                          <p className="text-sm text-yellow-800 mb-3">
                            Based on your current usage pattern, you're likely to exceed your plan limits before the end of this billing cycle.
                          </p>
                          <Button size="sm" asChild>
                            <Link href="/pricing">Upgrade Plan</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t space-y-2">
                    <h4 className="font-medium text-sm">Usage Statistics</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Avg Tokens/Day</p>
                        <p className="font-medium">{formatNumber(Math.round(stats.averageTokensPerDay))}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Quizzes/Day</p>
                        <p className="font-medium">{Math.round(stats.averageQuizzesPerDay)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Peak Usage Day</p>
                        <p className="font-medium">{stats.peakUsageDay}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Current Plan</p>
                        <p className="font-medium capitalize">{usage.plan}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Not enough data to generate projections. Keep using the platform!
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upgrade Prompt */}
      {usage.plan === 'free' && showUpgradePrompt && (
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/20 rounded-full">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Unlock More with Premium Plans</h3>
                <p className="text-muted-foreground mb-4">
                  Get up to 1M tokens and 180 quizzes per month with our Premium plan. 
                  Plus advanced AI models, priority support, and more!
                </p>
                <div className="flex gap-2">
                  <Button asChild>
                    <Link href="/pricing">View Plans</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/pricing#comparison">Compare Features</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}