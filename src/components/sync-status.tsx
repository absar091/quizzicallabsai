"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertTriangle, Cloud, CloudOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCloudSync } from "@/lib/cloud-sync";
import { useToast } from "@/hooks/use-toast";

interface SyncStatusProps {
  showDetails?: boolean;
  compact?: boolean;
  autoHide?: boolean;
}

export function SyncStatus({ showDetails = false, compact = false, autoHide = true }: SyncStatusProps) {
  const { syncStatus, forceSync } = useCloudSync();
  const [showExpanded, setShowExpanded] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (syncStatus.lastSync) {
      setLastSyncTime(new Date(syncStatus.lastSync).toLocaleTimeString());
    }
  }, [syncStatus.lastSync]);

  const handleForceSync = async () => {
    try {
      await forceSync();
      toast({
        title: "Sync Complete",
        description: "Your data has been synchronized across all devices.",
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Unable to sync data. Please check your connection.",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = () => {
    if (!syncStatus.isOnline) {
      return <WifiOff className="w-4 h-4 text-destructive" />;
    }
    if (syncStatus.syncInProgress) {
      return <RefreshCw className="w-4 h-4 text-primary animate-spin" />;
    }
    if (syncStatus.pendingChanges > 0) {
      return <Cloud className="w-4 h-4 text-yellow-500" />;
    }
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (!syncStatus.isOnline) {
      return "Offline";
    }
    if (syncStatus.syncInProgress) {
      return "Syncing...";
    }
    if (syncStatus.pendingChanges > 0) {
      return `${syncStatus.pendingChanges} pending`;
    }
    return "Synced";
  };

  const getStatusColor = () => {
    if (!syncStatus.isOnline) return "destructive";
    if (syncStatus.syncInProgress) return "default";
    if (syncStatus.pendingChanges > 0) return "secondary";
    return "default";
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2"
      >
        {getStatusIcon()}
        <Badge variant={getStatusColor() as any} className="text-xs">
          {getStatusText()}
        </Badge>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-sm"
      >
        <Card className="border-muted">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={syncStatus.syncInProgress ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: syncStatus.syncInProgress ? Infinity : 0, ease: "linear" }}
                >
                  {getStatusIcon()}
                </motion.div>
                <div>
                  <p className="text-sm font-medium">Cloud Sync</p>
                  <p className="text-xs text-muted-foreground">{getStatusText()}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {syncStatus.pendingChanges > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleForceSync}
                    disabled={syncStatus.syncInProgress || !syncStatus.isOnline}
                  >
                    <RefreshCw className={`w-3 h-3 mr-1 ${syncStatus.syncInProgress ? 'animate-spin' : ''}`} />
                    Sync
                  </Button>
                )}

                {showDetails && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowExpanded(!showExpanded)}
                  >
                    {showExpanded ? 'Less' : 'More'}
                  </Button>
                )}
              </div>
            </div>

            <AnimatePresence>
              {showExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-2"
                >
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <div className="flex items-center gap-1 mt-1">
                        {syncStatus.isOnline ? (
                          <>
                            <Wifi className="w-3 h-3 text-green-500" />
                            <span className="text-green-600">Online</span>
                          </>
                        ) : (
                          <>
                            <WifiOff className="w-3 h-3 text-destructive" />
                            <span className="text-destructive">Offline</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-muted-foreground">Last Sync:</span>
                      <div className="mt-1">
                        {lastSyncTime ? (
                          <span className="text-foreground">{lastSyncTime}</span>
                        ) : (
                          <span className="text-muted-foreground">Never</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {syncStatus.pendingChanges > 0 && (
                    <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm text-yellow-800 dark:text-yellow-200">
                          {syncStatus.pendingChanges} changes waiting to sync
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Your quiz results, bookmarks, and progress are automatically synced across all your devices.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

// Floating sync indicator for the app header
export function FloatingSyncIndicator() {
  const { syncStatus } = useCloudSync();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show indicator when syncing or when there are pending changes
    const shouldShow = syncStatus.syncInProgress || syncStatus.pendingChanges > 0;
    setVisible(shouldShow);

    // Auto-hide after 3 seconds if not actively syncing
    if (shouldShow && !syncStatus.syncInProgress) {
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [syncStatus]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed top-4 right-4 z-50"
    >
      <Card className="shadow-lg border-primary/20">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            {syncStatus.syncInProgress ? (
              <RefreshCw className="w-4 h-4 text-primary animate-spin" />
            ) : (
              <Cloud className="w-4 h-4 text-yellow-500" />
            )}
            <span className="text-sm font-medium">
              {syncStatus.syncInProgress ? 'Syncing...' : `${syncStatus.pendingChanges} pending`}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Sync status toast notification
export function SyncStatusToast() {
  const { syncStatus } = useCloudSync();
  const { toast } = useToast();
  const [lastSyncStatus, setLastSyncStatus] = useState(syncStatus);

  useEffect(() => {
    // Show toast when sync completes
    if (lastSyncStatus.syncInProgress && !syncStatus.syncInProgress && syncStatus.isOnline) {
      toast({
        title: "Sync Complete",
        description: "Your data is now synchronized across all devices.",
        duration: 3000,
      });
    }

    // Show toast when going offline
    if (lastSyncStatus.isOnline && !syncStatus.isOnline) {
      toast({
        title: "Offline Mode",
        description: "Changes will sync when you're back online.",
        variant: "secondary",
        duration: 5000,
      });
    }

    // Show toast when coming back online
    if (!lastSyncStatus.isOnline && syncStatus.isOnline) {
      toast({
        title: "Back Online",
        description: "Synchronizing your data...",
        duration: 3000,
      });
    }

    setLastSyncStatus(syncStatus);
  }, [syncStatus, lastSyncStatus, toast]);

  return null; // This component doesn't render anything
}

// Comprehensive sync dashboard
export function SyncDashboard() {
  const { syncStatus, forceSync } = useCloudSync();
  const [syncHistory, setSyncHistory] = useState<any[]>([]);

  useEffect(() => {
    // Load sync history from localStorage
    const history = JSON.parse(localStorage.getItem('syncHistory') || '[]');
    setSyncHistory(history.slice(-10)); // Last 10 syncs
  }, []);

  const handleForceSync = async () => {
    const startTime = Date.now();
    await forceSync();
    const duration = Date.now() - startTime;

    // Record sync in history
    const newHistory = [{
      timestamp: new Date().toISOString(),
      duration,
      success: true,
      changes: syncStatus.pendingChanges
    }, ...syncHistory.slice(0, 9)];

    setSyncHistory(newHistory);
    localStorage.setItem('syncHistory', JSON.stringify(newHistory));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Cloud Synchronization</h3>
            <Badge variant={syncStatus.isOnline ? "default" : "destructive"}>
              {syncStatus.isOnline ? "Online" : "Offline"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {syncStatus.pendingChanges}
              </div>
              <div className="text-sm text-muted-foreground">Pending Changes</div>
            </div>

            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {syncHistory.filter(h => h.success).length}
              </div>
              <div className="text-sm text-muted-foreground">Successful Syncs</div>
            </div>

            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {syncHistory.length > 0
                  ? Math.round(syncHistory.reduce((sum, h) => sum + h.duration, 0) / syncHistory.length)
                  : 0
                }ms
              </div>
              <div className="text-sm text-muted-foreground">Avg Sync Time</div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleForceSync}
              disabled={syncStatus.syncInProgress || !syncStatus.isOnline}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${syncStatus.syncInProgress ? 'animate-spin' : ''}`} />
              {syncStatus.syncInProgress ? 'Syncing...' : 'Force Sync'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {syncHistory.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h4 className="text-md font-semibold mb-4">Recent Sync History</h4>
            <div className="space-y-2">
              {syncHistory.map((sync, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <div>
                      <div className="text-sm font-medium">
                        {new Date(sync.timestamp).toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {sync.changes} changes • {sync.duration}ms
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
