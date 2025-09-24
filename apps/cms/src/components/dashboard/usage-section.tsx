'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { type UsageStats } from '@/lib/adapters/dashboard-adapters';
import { HardDrive, Calendar, History } from 'lucide-react';

interface UsageSectionProps {
  usageStats: UsageStats;
}

export function UsageSection({ usageStats }: UsageSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage</CardTitle>
        <CardDescription>Your current usage and limits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Storage Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Storage</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {(usageStats.media.totalSize / 1024 / 1024).toFixed(1)} MB
              </span>
            </div>
            <Progress value={Math.min((usageStats.media.totalSize / 1024 / 1024 / 1024) * 10, 100)} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {usageStats.media.total} files • 10 GB limit
            </p>
          </div>

          {/* Content Counts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Content</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Pages</p>
                <p className="font-medium">{usageStats.pages.total}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Items</p>
                <p className="font-medium">{usageStats.items.total}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Collections</p>
                <p className="font-medium">{usageStats.collections.total}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Media</p>
                <p className="font-medium">{usageStats.media.total}</p>
              </div>
            </div>
          </div>

          {/* Drafts vs Published */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Status</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Published</p>
                <p className="font-medium text-green-600">
                  {usageStats.pages.published + usageStats.items.published}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Drafts</p>
                <p className="font-medium text-orange-600">
                  {usageStats.pages.drafts + usageStats.items.drafts}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}