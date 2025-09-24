'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type PublishingStatus } from '@/lib/adapters/dashboard-adapters';
import { Clock, CheckCircle, FileText, Activity, Calendar } from 'lucide-react';
import Link from 'next/link';

const getTypeIcon = (type: NonNullable<PublishingStatus['lastPublish']>['type']) => {
  switch (type) {
    case 'page':
      return <FileText className="h-4 w-4" />;
    case 'item':
      return <FileText className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const formatTimeAgo = (timestamp: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
};

interface PublishingStatusSectionProps {
  publishingStatus: PublishingStatus;
}

export function PublishingStatusSection({ publishingStatus }: PublishingStatusSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Publishing Status</CardTitle>
        <CardDescription>Your latest publishing activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Last Publish */}
          {publishingStatus.lastPublish ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(publishingStatus.lastPublish.type)}
                  <p className="text-sm font-medium">{publishingStatus.lastPublish.item}</p>
                  <Badge variant="default" className="text-xs">Published</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatTimeAgo(publishingStatus.lastPublish.timestamp)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full">
                <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">No recent publications</p>
              </div>
            </div>
          )}

          {/* Pending Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Pending</span>
              </div>
              <div className="flex space-x-2">
                {publishingStatus.draftCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {publishingStatus.draftCount} drafts
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* View Activity Button */}
          <Button variant="outline" className="w-full" asChild>
            <Link href="/analytics">
              <Activity className="mr-2 h-4 w-4" />
              View Recent Activity
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}