// Cloud Synchronization System for Quizzicallabs AI
// Enables seamless cross-device data synchronization

import React from 'react';
import { ref, set, get, update, onValue, off, serverTimestamp } from 'firebase/database';
import { db } from './firebase';
import { errorLogger } from './error-logger';

export interface SyncMetadata {
  lastSync: number;
  deviceId: string;
  version: number;
  checksum: string;
}

export interface SyncableData {
  quizResults: any[];
  bookmarks: any[];
  studyStreak: any;
  quizStates: any[];
  userPreferences: any;
  studyTime: number;
  achievements: any[];
  metadata: SyncMetadata;
}

export interface SyncConflict {
  field: string;
  localValue: any;
  remoteValue: any;
  lastModified: {
    local: number;
    remote: number;
  };
  resolution?: 'local' | 'remote' | 'merge' | 'manual';
}

class CloudSyncManager {
  private static instance: CloudSyncManager;
  private userId: string | null = null;
  private deviceId: string;
  private isOnline: boolean = true;
  private syncInProgress: boolean = false;
  private pendingChanges: Map<string, any> = new Map();
  private realtimeListeners: Map<string, () => void> = new Map();

  private constructor() {
    this.deviceId = this.generateDeviceId();
    this.setupOnlineOfflineDetection();
  }

  static getInstance(): CloudSyncManager {
    if (!CloudSyncManager.instance) {
      CloudSyncManager.instance = new CloudSyncManager();
    }
    return CloudSyncManager.instance;
  }

  private generateDeviceId(): string {
    const stored = localStorage.getItem('deviceId');
    if (stored) return stored;

    const deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('deviceId', deviceId);
    return deviceId;
  }

  private setupOnlineOfflineDetection() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.performSync();
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
      });

      this.isOnline = navigator.onLine;
    }
  }

  async initialize(userId: string) {
    this.userId = userId;
    await this.setupRealtimeSync();
    await this.performInitialSync();
  }

  private async setupRealtimeSync() {
    if (!this.userId) return;

    const userDataRef = ref(db, `users/${this.userId}`);

    // Listen for changes from other devices
    const unsubscribe = onValue(userDataRef, (snapshot) => {
      if (!this.syncInProgress) {
        this.handleRemoteChanges(snapshot.val());
      }
    });

    this.realtimeListeners.set('userData', unsubscribe);
  }

  private async handleRemoteChanges(remoteData: any) {
    if (!remoteData || !this.userId) return;

    try {
      // Compare with local data and resolve conflicts
      const conflicts = await this.detectConflicts(remoteData);
      if (conflicts.length > 0) {
        await this.resolveConflicts(conflicts, remoteData);
      } else {
        // No conflicts, update local data
        await this.updateLocalData(remoteData);
      }
    } catch (error) {
      errorLogger.logError(error as Error, {
        operation: 'handle_remote_changes',
        component: 'cloud_sync',
        severity: 'medium',
        userId: this.userId
      });
    }
  }

  private async detectConflicts(remoteData: any): Promise<SyncConflict[]> {
    const conflicts: SyncConflict[] = [];

    // Check each syncable field for conflicts
    const fields = ['quizResults', 'bookmarks', 'studyStreak', 'studyTime'];

    for (const field of fields) {
      const localData = await this.getLocalData(field);
      const remoteValue = remoteData[field];

      if (this.hasConflict(localData, remoteValue)) {
        conflicts.push({
          field,
          localValue: localData,
          remoteValue,
          lastModified: {
            local: localData?.lastModified || 0,
            remote: remoteValue?.lastModified || 0
          }
        });
      }
    }

    return conflicts;
  }

  private hasConflict(localData: any, remoteData: any): boolean {
    if (!localData && !remoteData) return false;
    if (!localData || !remoteData) return true;

    // Compare timestamps or versions
    return (localData.lastModified || 0) !== (remoteData.lastModified || 0);
  }

  private async resolveConflicts(conflicts: SyncConflict[], remoteData: any) {
    const resolutions: Record<string, any> = {};

    for (const conflict of conflicts) {
      // Auto-resolve based on timestamp (newer wins)
      if (conflict.lastModified.local > conflict.lastModified.remote) {
        resolutions[conflict.field] = conflict.localValue;
      } else if (conflict.lastModified.remote > conflict.lastModified.local) {
        resolutions[conflict.field] = conflict.remoteValue;
        await this.updateLocalData({ [conflict.field]: conflict.remoteValue });
      } else {
        // Same timestamp, merge data
        resolutions[conflict.field] = await this.mergeData(conflict.localValue, conflict.remoteValue);
      }
    }

    // Update remote with resolved data
    await this.updateRemoteData(resolutions);
  }

  private async mergeData(localData: any, remoteData: any): Promise<any> {
    // Implement intelligent merging logic
    if (Array.isArray(localData) && Array.isArray(remoteData)) {
      // Merge arrays by combining unique items
      const merged = [...localData];
      for (const item of remoteData) {
        if (!merged.find(m => m.id === item.id)) {
          merged.push(item);
        }
      }
      return merged;
    }

    // For objects, remote wins for most fields, but preserve local preferences
    return { ...remoteData, ...localData };
  }

  async performSync(): Promise<void> {
    if (!this.userId || !this.isOnline || this.syncInProgress) return;

    this.syncInProgress = true;

    try {
      // Get local data
      const localData = await this.getAllLocalData();

      // Get remote data
      const remoteData = await this.getRemoteData();

      // Detect and resolve conflicts
      const conflicts = await this.detectConflicts(remoteData);
      if (conflicts.length > 0) {
        await this.resolveConflicts(conflicts, remoteData);
      }

      // Sync pending changes
      await this.syncPendingChanges();

      // Update sync metadata
      await this.updateSyncMetadata();

      errorLogger.logPerformanceMetric('cloud_sync', Date.now(), true, {
        conflictsResolved: conflicts.length,
        dataSynced: Object.keys(localData).length
      });

    } catch (error) {
      errorLogger.logError(error as Error, {
        operation: 'perform_sync',
        component: 'cloud_sync',
        severity: 'high',
        userId: this.userId
      });
    } finally {
      this.syncInProgress = false;
    }
  }

  private async performInitialSync() {
    if (!this.userId) return;

    try {
      const remoteData = await this.getRemoteData();
      if (remoteData) {
        await this.updateLocalData(remoteData);
      } else {
        // First time user, upload local data to cloud
        const localData = await this.getAllLocalData();
        await this.updateRemoteData(localData);
      }
    } catch (error) {
      console.error('Initial sync failed:', error);
    }
  }

  async syncData(dataType: string, data: any, immediate: boolean = false) {
    if (!this.userId) return;

    if (immediate && this.isOnline) {
      await this.updateRemoteData({ [dataType]: data });
    } else {
      this.pendingChanges.set(dataType, data);
      if (this.isOnline) {
        await this.syncPendingChanges();
      }
    }
  }

  private async syncPendingChanges() {
    if (this.pendingChanges.size === 0) return;

    const changes = Object.fromEntries(this.pendingChanges);
    await this.updateRemoteData(changes);
    this.pendingChanges.clear();
  }

  private async getAllLocalData(): Promise<Partial<SyncableData>> {
    const data: Partial<SyncableData> = {};

    // Import and get data from IndexedDB stores
    try {
      const { getQuizResults } = await import('./indexed-db');
      data.quizResults = await getQuizResults(this.userId!);
    } catch (error) {
      console.error('Failed to get quiz results:', error);
    }

    try {
      const { getBookmarks } = await import('./indexed-db');
      data.bookmarks = await getBookmarks(this.userId!);
    } catch (error) {
      console.error('Failed to get bookmarks:', error);
    }

    // Add other data types...

    return data;
  }

  private async getLocalData(field: string): Promise<any> {
    try {
      switch (field) {
        case 'quizResults':
          const { getQuizResults } = await import('./indexed-db');
          return await getQuizResults(this.userId!);
        case 'bookmarks':
          const { getBookmarks } = await import('./indexed-db');
          return await getBookmarks(this.userId!);
        // Add other fields...
        default:
          return null;
      }
    } catch (error) {
      console.error(`Failed to get local ${field}:`, error);
      return null;
    }
  }

  private async updateLocalData(data: Partial<SyncableData>) {
    try {
      // Update IndexedDB with remote data
      if (data.quizResults) {
        const { saveQuizResult } = await import('./indexed-db');
        for (const result of data.quizResults) {
          await saveQuizResult(result);
        }
      }

      if (data.bookmarks) {
        const { saveBookmark } = await import('./indexed-db');
        for (const bookmark of data.bookmarks) {
          await saveBookmark(bookmark, 'Free'); // Default plan
        }
      }

      // Dispatch custom event to notify components of data updates
      window.dispatchEvent(new CustomEvent('cloudSyncUpdate', { detail: data }));

    } catch (error) {
      errorLogger.logError(error as Error, {
        operation: 'update_local_data',
        component: 'cloud_sync',
        severity: 'high',
        userId: this.userId
      });
    }
  }

  private async getRemoteData(): Promise<SyncableData | null> {
    if (!this.userId) return null;

    try {
      const userRef = ref(db, `users/${this.userId}`);
      const snapshot = await get(userRef);
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error('Failed to get remote data:', error);
      return null;
    }
  }

  private async updateRemoteData(data: Partial<SyncableData>) {
    if (!this.userId) return;

    try {
      const userRef = ref(db, `users/${this.userId}`);
      const updateData = {
        ...data,
        metadata: {
          lastSync: Date.now(),
          deviceId: this.deviceId,
          version: Date.now(),
          checksum: this.generateChecksum(data)
        },
        lastModified: serverTimestamp()
      };

      await update(userRef, updateData);
    } catch (error) {
      errorLogger.logError(error as Error, {
        operation: 'update_remote_data',
        component: 'cloud_sync',
        severity: 'high',
        userId: this.userId
      });
    }
  }

  private generateChecksum(data: any): string {
    // Simple checksum for data integrity
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  private async updateSyncMetadata() {
    if (!this.userId) return;

    const metadata: SyncMetadata = {
      lastSync: Date.now(),
      deviceId: this.deviceId,
      version: Date.now(),
      checksum: ''
    };

    await this.updateRemoteData({ metadata });
  }

  // Public API methods
  async forceSync(): Promise<void> {
    await this.performSync();
  }

  getSyncStatus() {
    return {
      isOnline: this.isOnline,
      syncInProgress: this.syncInProgress,
      pendingChanges: this.pendingChanges.size,
      lastSync: localStorage.getItem('lastSync')
    };
  }

  async disconnect() {
    // Clean up listeners
    this.realtimeListeners.forEach(unsubscribe => unsubscribe());
    this.realtimeListeners.clear();
    this.userId = null;
  }
}

// Export singleton instance
export const cloudSync = CloudSyncManager.getInstance();

// React hook for using cloud sync
export function useCloudSync() {
  const [syncStatus, setSyncStatus] = React.useState(cloudSync.getSyncStatus());

  React.useEffect(() => {
    const updateStatus = () => setSyncStatus(cloudSync.getSyncStatus());

    // Listen for sync status changes
    const interval = setInterval(updateStatus, 5000);
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  return {
    syncStatus,
    forceSync: () => cloudSync.forceSync(),
    syncData: (type: string, data: any, immediate?: boolean) =>
      cloudSync.syncData(type, data, immediate)
  };
}

// Utility functions for components
export async function syncUserData(userId: string) {
  await cloudSync.initialize(userId);
}

export function onCloudSyncUpdate(callback: (data: Partial<SyncableData>) => void) {
  const handler = (event: CustomEvent) => callback(event.detail);
  window.addEventListener('cloudSyncUpdate', handler as EventListener);
  return () => window.removeEventListener('cloudSyncUpdate', handler as EventListener);
}
