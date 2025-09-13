import { ref, set, get, onValue, off, push, update, remove } from "firebase/database";
import { db } from "@/lib/firebase";
import { BackgroundJob, notificationService } from "./notification-service";
import { toast } from "@/hooks/use-toast";

interface JobSubscriber {
  jobId: string;
  callback: (job: BackgroundJob) => void;
  unsubscribe: () => void;
}

class BackgroundJobService {
  private subscribers: Map<string, JobSubscriber> = new Map();
  private jobTimers: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Create a new background job
   */
  async createJob(
    userId: string,
    type: 'quiz_generation' | 'exam_prep',
    formValues: any,
    estimatedTime: number = 30000 // 30 seconds default
  ): Promise<string> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const job: Omit<BackgroundJob, 'result' | 'error'> = {
      id: jobId,
      userId,
      type,
      status: 'pending',
      formValues,
      progress: 0,
      createdAt: Date.now(),
      metadata: {
        estimatedTime,
        lastUpdateTime: Date.now(),
        retryCount: 0,
      }
    };

    try {
      const jobRef = ref(db, `backgroundJobs/${userId}/${jobId}`);
      await set(jobRef, job);

      console.log(`🎯 Background job created: ${jobId} (${type})`);
      return jobId;
    } catch (error) {
      console.error('Error creating background job:', error);
      throw new Error('Failed to create background job');
    }
  }

  /**
   * Start processing a job (called by backend)
   */
  async startJob(jobId: string, userId: string): Promise<void> {
    try {
      const jobRef = ref(db, `backgroundJobs/${userId}/${jobId}`);
      await update(jobRef, {
        status: 'processing',
        'metadata.lastUpdateTime': Date.now(),
      });

      // Start progress simulation
      this.simulateProgress(jobId, userId, 95);

      console.log(`🚀 Started processing job: ${jobId}`);
    } catch (error) {
      console.error('Error starting job:', error);
      throw error;
    }
  }

  /**
   * Complete a job with results
   */
  async completeJob(
    jobId: string,
    userId: string,
    result: any,
    finalProgress: number = 100
  ): Promise<void> {
    try {
      const jobRef = ref(db, `backgroundJobs/${userId}/${jobId}`);
      await update(jobRef, {
        status: 'completed',
        progress: finalProgress,
        result,
        completedAt: Date.now(),
        'metadata.lastUpdateTime': Date.now(),
      });

      // Clear progress timer
      if (this.jobTimers.has(jobId)) {
        clearInterval(this.jobTimers.get(jobId)!);
        this.jobTimers.delete(jobId);
      }

      // Show notification
      const job = await this.getJob(jobId, userId);
      if (job) {
        notificationService.showQuizReadyNotification(job);
      }

      console.log(`✅ Job completed: ${jobId}`);
      toast({
        title: "🎉 Your content is ready!",
        description: "Click here to view your generated quiz.",
      });
    } catch (error) {
      console.error('Error completing job:', error);
      throw error;
    }
  }

  /**
   * Mark job as failed
   */
  async failJob(jobId: string, userId: string, error: string): Promise<void> {
    try {
      const jobRef = ref(db, `backgroundJobs/${userId}/${jobId}`);
      await update(jobRef, {
        status: 'failed',
        error,
        'metadata.lastUpdateTime': Date.now(),
        'metadata.retryCount': (await this.getJob(jobId, userId))?.metadata?.retryCount || 0,
      });

      // Clear progress timer
      if (this.jobTimers.has(jobId)) {
        clearInterval(this.jobTimers.get(jobId)!);
        this.jobTimers.delete(jobId);
      }

      console.error(`❌ Job failed: ${jobId} - ${error}`);
      toast({
        title: "⚠️ Generation failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } catch (err) {
      console.error('Error failing job:', err);
    }
  }

  /**
   * Get a job by ID
   */
  async getJob(jobId: string, userId: string): Promise<BackgroundJob | null> {
    try {
      const jobRef = ref(db, `backgroundJobs/${userId}/${jobId}`);
      const snapshot = await get(jobRef);
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error('Error getting job:', error);
      return null;
    }
  }

  /**
   * Get all jobs for a user
   */
  async getUserJobs(userId: string): Promise<BackgroundJob[]> {
    try {
      const jobsRef = ref(db, `backgroundJobs/${userId}`);
      const snapshot = await get(jobsRef);

      if (!snapshot.exists()) return [];

      const jobs: BackgroundJob[] = [];
      snapshot.forEach((child) => {
        jobs.push(child.val());
      });

      return jobs.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      console.error('Error getting user jobs:', error);
      return [];
    }
  }

  /**
   * Subscribe to job updates
   */
  subscribeToJob(jobId: string, userId: string, callback: (job: BackgroundJob) => void): () => void {
    const jobRef = ref(db, `backgroundJobs/${userId}/${jobId}`);

    const listener = (snapshot: any) => {
      if (snapshot.exists()) {
        const job = snapshot.val();
        callback(job);
      }
    };

    onValue(jobRef, listener);

    const subscriber: JobSubscriber = {
      jobId,
      callback,
      unsubscribe: () => {
        off(jobRef, 'value', listener);
        console.log(`🔇 Unsubscribed from job: ${jobId}`);
      }
    };

    this.subscribers.set(jobId, subscriber);
    console.log(`📡 Subscribed to job: ${jobId}`);

    return subscriber.unsubscribe;
  }

  /**
   * Clean up old completed jobs (keep only last 10 per user)
   */
  async cleanupOldJobs(userId: string): Promise<void> {
    try {
      const jobs = await this.getUserJobs(userId);
      const completedJobs = jobs.filter(job => job.status === 'completed' || job.status === 'failed');

      if (completedJobs.length > 10) {
        const jobsToDelete = completedJobs.slice(10);
        for (const job of jobsToDelete) {
          const jobRef = ref(db, `backgroundJobs/${userId}/${job.id}`);
          await remove(jobRef);
        }

        console.log(`🧹 Cleaned up ${jobsToDelete.length} old jobs for user: ${userId}`);
      }
    } catch (error) {
      console.error('Error cleaning up old jobs:', error);
    }
  }

  /**
   * Simulate progress updates for better UX
   */
  private simulateProgress(jobId: string, userId: string, targetProgress: number = 95): void {
    let currentProgress = 0;
    const jobRef = ref(db, `backgroundJobs/${userId}/${jobId}`);

    const updateProgress = () => {
      if (currentProgress >= targetProgress) {
        if (this.jobTimers.has(jobId)) {
          clearInterval(this.jobTimers.get(jobId)!);
          this.jobTimers.delete(jobId);
        }
        return;
      }

      currentProgress += Math.random() * 15 + 5; // Random progress increment
      currentProgress = Math.min(currentProgress, targetProgress);

      update(jobRef, {
        progress: Math.round(currentProgress),
        'metadata.lastUpdateTime': Date.now(),
      });
    };

    const timer = setInterval(updateProgress, 1000); // Update every second
    this.jobTimers.set(jobId, timer);

    // Auto-cleanup after 10 minutes
    setTimeout(() => {
      if (this.jobTimers.has(jobId)) {
        clearInterval(this.jobTimers.get(jobId)!);
        this.jobTimers.delete(jobId);
      }
    }, 10 * 60 * 1000); // 10 minutes
  }

  /**
   * Delete a job
   */
  async deleteJob(jobId: string, userId: string): Promise<void> {
    try {
      const jobRef = ref(db, `backgroundJobs/${userId}/${jobId}`);
      await remove(jobRef);

      // Clean up timer if exists
      if (this.jobTimers.has(jobId)) {
        clearInterval(this.jobTimers.get(jobId)!);
        this.jobTimers.delete(jobId);
      }

      // Unsubscribe if exists
      if (this.subscribers.has(jobId)) {
        this.subscribers.get(jobId)?.unsubscribe();
        this.subscribers.delete(jobId);
      }

      console.log(`🗑️ Deleted job: ${jobId}`);
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  }
}

// Export singleton instance
export const backgroundJobService = new BackgroundJobService();

// Export types
export type { BackgroundJob } from './notification-service';
