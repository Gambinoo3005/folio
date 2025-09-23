'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getPublishingStatus, type PublishingStatus } from '@/lib/adapters/dashboard-adapters';
import { Clock, CheckCircle, FileText, Activity, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const getTypeIcon = (type: NonNullable<PublishingStatus['lastPublish']>['type']) => {
  switch (type) {
    case 'page':
      return <FileText className="h-4 w-4" />;
    case 'project':
      return <FileText className="h-4 w-4" />;
    case 'post':
      return <FileText className="h-4 w-4" />;
    case 'gallery':
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
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
};

export function PublishingStatusSection() {
  const [publishingStatus, setPublishingStatus] = useState<PublishingStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPublishingStatus = async () => {
      try {
        const status = await getPublishingStatus();
        setPublishingStatus(status);
      } catch (error) {
        console.error('Failed to load publishing status:', error);
        setPublishingStatus(null);
      } finally {
        setLoading(false);
      }
    };

    loadPublishingStatus();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Publishing Status</CardTitle>
          <CardDescription>Your latest publishing activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-8 bg-gray-300 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!publishingStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Publishing Status</CardTitle>
          <CardDescription>Your latest publishing activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Unable to load publishing status</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
                {publishingStatus.pendingScheduled > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {publishingStatus.pendingScheduled} scheduled
                  </Badge>
                )}
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
