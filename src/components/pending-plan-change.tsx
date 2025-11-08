'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, ArrowRight, X, Clock, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PendingChange {
  requested_plan: string;
  current_plan: string;
  change_type: 'upgrade' | 'downgrade' | 'switch';
  requested_at: string;
  effective_date: string;
  status: string;
}

export function PendingPlanChange() {
  const [pendingChange, setPendingChange] = useState<PendingChange | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPendingChange();
  }, []);

  const loadPendingChange = async () => {
    try {
      const { getAuth } = await import('firebase/auth');
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) return;

      const token = await currentUser.getIdToken();

      const response = await fetch('/api/subscription/change-plan', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && data.hasPending) {
        setPendingChange(data.change);
      }
    } catch (error) {
      console.error('Failed to load pending change:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this plan change?')) {
      return;
    }

    setCancelling(true);
    try {
      const { getAuth } = await import('firebase/auth');
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) return;

      const token = await currentUser.getIdToken();

      const response = await fetch('/api/subscription/change-plan', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Plan Change Cancelled",
          description: data.message,
        });
        setPendingChange(null);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Cancellation Failed",
        description: error.message || "Failed to cancel plan change. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!pendingChange) return null;

  const effectiveDate = new Date(pendingChange.effective_date);
  const daysUntil = Math.ceil((effectiveDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'upgrade': return 'bg-green-100 text-green-800 border-green-200';
      case 'downgrade': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case 'upgrade': return '⬆️';
      case 'downgrade': return '⬇️';
      default: return '🔄';
    }
  };

  return (
    <Alert className={`border-2 ${getChangeTypeColor(pendingChange.change_type)}`}>
      <Info className="h-4 w-4" />
      <AlertDescription>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{getChangeTypeIcon(pendingChange.change_type)}</span>
              <h4 className="font-semibold capitalize">
                {pendingChange.change_type} Scheduled
              </h4>
              <Badge variant="outline" className="capitalize">
                {pendingChange.status}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium capitalize">{pendingChange.current_plan}</span>
                <ArrowRight className="h-4 w-4" />
                <span className="font-medium capitalize">{pendingChange.requested_plan}</span>
              </div>

              {pendingChange.change_type === 'downgrade' && (
                <>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Effective on {effectiveDate.toLocaleDateString()}
                      {daysUntil > 0 && ` (in ${daysUntil} days)`}
                    </span>
                  </div>

                  <p className="text-muted-foreground">
                    You'll continue to enjoy your current plan benefits until the end of your billing cycle.
                  </p>
                </>
              )}

              {pendingChange.change_type === 'upgrade' && pendingChange.status === 'pending_payment' && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Waiting for payment completion</span>
                </div>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={cancelling}
            className="flex-shrink-0"
          >
            {cancelling ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Cancelling...
              </>
            ) : (
              <>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </>
            )}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
