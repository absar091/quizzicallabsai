"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, Play, X, Clock, CheckCircle, XCircle } from 'lucide-react';
import { backgroundJobService, BackgroundJob } from '@/services/background-job-service';
import { notificationService } from '@/services/notification-service';
import { toast } from "@/hooks/use-toast";

interface BackgroundJobMonitorProps {
  jobId?: string;
  userId?: string;
  onJobComplete?: (job: BackgroundJob) => void;
  onClose?: () => void;
}

export function BackgroundJobMonitor({ jobId, userId, onJobComplete, onClose }: BackgroundJobMonitorProps) {
  const [job, setJob] = useState<BackgroundJob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    setNotificationsEnabled(notificationService.canShowNotifications());
  }, []);

  useEffect(() => {
    if (!jobId || !userId) return;

    // Load initial job status
    loadJobStatus();

    // Subscribe to job updates
    const unsubscribe = backgroundJobService.subscribeToJob(jobId, userId, (updatedJob) => {
      setJob(updatedJob);
      setError(null);

      // Notify completion
      if (updatedJob.status === 'completed' && onJobComplete) {
        onJobComplete(updatedJob);
      }

      // Show status updates
      if (updatedJob.status === 'completed') {
        toast({
          title: "🎉 Quiz Generated Successfully!",
          description: `Your quiz "${updatedJob.formValues?.topic}" is ready to take.`,
        });
      } else if (updatedJob.status === 'failed') {
        toast({
          title: "❌ Generation Failed",
          description: updatedJob.error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    });

    return unsubscribe;
  }, [jobId, userId, onJobComplete]);

  const loadJobStatus = async () => {
    if (!jobId || !userId) return;

    setIsLoading(true);
    try {
      const jobData = await backgroundJobService.getJob(jobId, userId);
      if (jobData) {
        setJob(jobData);
        setError(null);
      } else {
        setError("Job not found");
      }
    } catch (err) {
      setError("Failed to load job status");
      console.error("Error loading job:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const requestNotificationPermission = async () => {
    const granted = await notificationService.requestPermission();
    setNotificationsEnabled(granted);

    if (granted) {
      toast({
        title: "🔔 Notifications enabled!",
        description: "You'll be notified when your quiz is ready.",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'processing':
        return 'default';
      case 'completed':
        return 'default';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!job) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Connecting...
          </CardTitle>
          <CardDescription>
            Establishing connection to background service
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const isCompleted = job.status === 'completed';
  const hasError = job.status === 'failed';
  const estimatedTime = job.metadata?.estimatedTime ? Math.ceil(job.metadata.estimatedTime / 1000) : 0;

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {getStatusIcon(job.status)}
            Background Generation
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CardDescription>
          Quiz generation on "{job.formValues?.topic || 'your topic'}"
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <Badge
            variant={getStatusColor(job.status) as any}
            className="flex items-center gap-1"
          >
            {getStatusIcon(job.status)}
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </Badge>
          <span className="text-sm text-muted-foreground">
            ~{estimatedTime}s estimated
          </span>
        </div>

        {/* Progress Bar */}
        {job.status === 'processing' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">{job.progress}%</span>
            </div>
            <Progress value={job.progress} className="h-2" />
          </div>
        )}

        {/* Notifications */}
        {!notificationsEnabled && job.status !== 'completed' && (
          <Alert>
            <Bell className="h-4 w-4" />
            <AlertDescription>
              Enable notifications to get notified when your quiz is ready.
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 ml-2"
                onClick={requestNotificationPermission}
              >
                Enable Notifications
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {hasError && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              {job.error || "Generation failed. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {isCompleted && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              🎉 Your quiz is ready! Click "Take Quiz" to start.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {isCompleted && onJobComplete && (
            <Button
              onClick={() => onJobComplete(job)}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Play className="mr-2 h-4 w-4" />
              Take Quiz
            </Button>
          )}

          {hasError && (
            <Button variant="outline" onClick={loadJobStatus}>
              Refresh
            </Button>
          )}

          <Button variant="outline" size="sm" onClick={loadJobStatus}>
            Refresh Status
          </Button>
        </div>

        {/* Free to browse */}
        <div className="text-center text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
          💡 You can continue browsing and using other features while your quiz generates in the background.
        </div>
      </CardContent>
    </Card>
  );
}

export default BackgroundJobMonitor;
