
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getQuizResults, QuizResult } from "@/lib/indexed-db";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, LineChart as RechartsLineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BrainCircuit, Sparkles, Trophy, BookOpen, Clock, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  averageScore: {
    label: "Average Score",
    color: "hsl(var(--primary))",
  },
  score: {
    label: "Score",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function MyStatsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);

  useEffect(() => {
    async function loadStats() {
      if (!user) return;
      setLoading(true);
      const results = await getQuizResults(user.uid);
      setQuizHistory(results);
      setLoading(false);
    }
    loadStats();
  }, [user]);

  const processData = () => {
    if (quizHistory.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        topicPerformance: [],
        scoreTrend: [],
      };
    }

    const totalQuizzes = quizHistory.length;
    const averageScore = quizHistory.reduce((acc, curr) => acc + curr.percentage, 0) / totalQuizzes;

    const topicMap: { [key: string]: { totalScore: number; count: number } } = {};
    quizHistory.forEach(result => {
      if (!topicMap[result.topic]) {
        topicMap[result.topic] = { totalScore: 0, count: 0 };
      }
      topicMap[result.topic].totalScore += result.percentage;
      topicMap[result.topic].count++;
    });

    const topicPerformance = Object.entries(topicMap).map(([topic, data]) => ({
      name: topic,
      averageScore: data.totalScore / data.count,
    }));

    const scoreTrend = quizHistory.slice(0, 20).reverse().map((result, index) => ({
      name: `Quiz ${quizHistory.length - 19 + index}`,
      score: result.percentage,
    }));

    return { totalQuizzes, averageScore, topicPerformance, scoreTrend };
  };

  const { totalQuizzes, averageScore, topicPerformance, scoreTrend } = processData();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60svh] text-center p-4">
         <div className="relative">
            <BrainCircuit className="h-20 w-20 text-primary" />
            <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
                <Sparkles className="h-8 w-8 text-accent animate-pulse" />
            </motion.div>
        </div>
        <h2 className="text-2xl font-semibold mb-2 mt-6">Loading Your Stats...</h2>
        <p className="text-muted-foreground max-w-sm mb-6">Crunching the numbers on your performance.</p>
      </div>
    );
  }

  return (
    <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
    >
      <PageHeader title="My Performance" description="A detailed look at your quiz history and progress over time." />
      
      {quizHistory.length === 0 ? (
        <Card className="text-center py-16">
          <CardHeader>
            <CardTitle>No Stats Yet!</CardTitle>
            <CardDescription>Complete a quiz to start tracking your performance.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalQuizzes}</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Best Topic</CardTitle>
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold truncate">
                    {topicPerformance.length > 0 ? [...topicPerformance].sort((a,b) => b.averageScore - a.averageScore)[0].name : 'N/A'}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Topic Performance</CardTitle>
                <CardDescription>Your average score in different topics.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                  <BarChart data={topicPerformance} margin={{ top: 5, right: 20, left: -5, bottom: 50 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={100} />
                    <YAxis unit="%" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="averageScore" fill="var(--color-averageScore)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Score Trend</CardTitle>
                <CardDescription>Your performance over the last 20 quizzes.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                  <RechartsLineChart data={scoreTrend} margin={{ top: 5, right: 20, left: -5, bottom: 5 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis unit="%" domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="score" stroke="var(--color-score)" strokeWidth={2} dot={true} />
                  </RechartsLineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
