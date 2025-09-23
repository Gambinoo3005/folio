'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getRecentEdits, type RecentEdit } from '@/lib/adapters/dashboard-adapters';
import { FileText, FolderOpen, Image, Globe, Edit3 } from 'lucide-react';
import { useEffect, useState } from 'react';

const getTypeIcon = (type: RecentEdit['type']) => {
  switch (type) {
    case 'page':
      return <FileText className="h-4 w-4" />;
    case 'project':
      return <FolderOpen className="h-4 w-4" />;
    case 'post':
      return <Edit3 className="h-4 w-4" />;
    case 'gallery':
      return <Image className="h-4 w-4" />;
    case 'global':
      return <Globe className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getActionColor = (action: RecentEdit['action']) => {
  switch (action) {
    case 'created':
      return 'bg-green-500';
    case 'updated':
      return 'bg-blue-500';
    case 'published':
      return 'bg-purple-500';
    case 'scheduled':
      return 'bg-orange-500';
    default:
      return 'bg-gray-500';
  }
};

const getActionBadgeVariant = (action: RecentEdit['action']) => {
  switch (action) {
    case 'created':
      return 'default' as const;
    case 'updated':
      return 'secondary' as const;
    case 'published':
      return 'default' as const;
    case 'scheduled':
      return 'outline' as const;
    default:
      return 'outline' as const;
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
    return `${days}d ago`;
  }
};

export function RecentEditsSection() {
  const [recentEdits, setRecentEdits] = useState<RecentEdit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecentEdits = async () => {
      try {
        const edits = await getRecentEdits();
        setRecentEdits(edits);
      } catch (error) {
        console.error('Failed to load recent edits:', error);
        setRecentEdits([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecentEdits();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Edits</CardTitle>
          <CardDescription>Your latest content updates and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Edits</CardTitle>
        <CardDescription>Your latest content updates and changes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentEdits.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recent edits found</p>
            </div>
          ) : (
            recentEdits.map((edit) => (
              <div key={edit.id} className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${getActionColor(edit.action)}`}></div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(edit.type)}
                    <p className="text-sm font-medium">{edit.title}</p>
                    <Badge variant={getActionBadgeVariant(edit.action)} className="text-xs">
                      {edit.action}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatTimeAgo(edit.timestamp)} • {edit.author}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
