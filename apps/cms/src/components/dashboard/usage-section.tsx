'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getUsageStats, type UsageStats } from '@/lib/adapters/dashboard-adapters';
import { HardDrive, Calendar, History } from 'lucide-react';
import { useEffect, useState } from 'react';

export function UsageSection() {
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsageStats = async () => {
      try {
        const stats = await getUsageStats();
        setUsageStats(stats);
      } catch (error) {
        console.error('Failed to load usage stats:', error);
        setUsageStats(null);
      } finally {
        setLoading(false);
      }
    };

    loadUsageStats();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
          <CardDescription>Your current usage and limits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
                <div className="h-2 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!usageStats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
          <CardDescription>Your current usage and limits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <HardDrive className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Unable to load usage statistics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage</CardTitle>
        <CardDescription>Your current usage and limits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Storage Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Storage</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {usageStats.storageUsed.gb} GB / {usageStats.storageUsed.limit} GB
              </span>
            </div>
            <Progress 
              value={usageStats.storageUsed.percentage} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              {usageStats.storageUsed.percentage}% of your storage limit used
            </p>
          </div>

          {/* Scheduled Posts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Scheduled Posts</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {usageStats.scheduledPosts.thisMonth} this month
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {usageStats.scheduledPosts.total} total scheduled items
            </p>
          </div>

          {/* Versions Kept */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Version History</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {usageStats.versionsKept.current} / {usageStats.versionsKept.limit}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {usageStats.versionsKept.limit - usageStats.versionsKept.current} versions remaining
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
