'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@portfolio-building-service/ui';
import { Button } from '@portfolio-building-service/ui';
import { Badge } from '@portfolio-building-service/ui';
import { 
  Clock,
  User,
  Edit,
  Save,
  Send,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  RotateCcw,
  MoreHorizontal
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@portfolio-building-service/ui';

interface ActivityItem {
  id: string;
  type: 'edit' | 'save' | 'publish' | 'unpublish' | 'delete' | 'duplicate' | 'restore';
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  timestamp: Date;
  description: string;
  details?: string;
  field?: string;
}

interface ActivityFeedProps {
  // Add props as needed
}

export function ActivityFeed({}: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Mock data - in a real app, this would come from props or context
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'edit',
        user: {
          name: 'John Doe',
          initials: 'JD',
          avatar: undefined
        },
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        description: 'Edited content',
        field: 'Main content'
      },
      {
        id: '2',
        type: 'save',
        user: {
          name: 'John Doe',
          initials: 'JD',
          avatar: undefined
        },
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        description: 'Saved draft'
      },
      {
        id: '3',
        type: 'edit',
        user: {
          name: 'Jane Smith',
          initials: 'JS',
          avatar: undefined
        },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        description: 'Updated SEO settings',
        field: 'SEO title'
      },
      {
        id: '4',
        type: 'publish',
        user: {
          name: 'Jane Smith',
          initials: 'JS',
          avatar: undefined
        },
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        description: 'Published page'
      },
      {
        id: '5',
        type: 'edit',
        user: {
          name: 'John Doe',
          initials: 'JD',
          avatar: undefined
        },
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        description: 'Added cover image',
        field: 'Media'
      },
      {
        id: '6',
        type: 'duplicate',
        user: {
          name: 'Jane Smith',
          initials: 'JS',
          avatar: undefined
        },
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        description: 'Duplicated page'
      }
    ];

    setActivities(mockActivities);
  }, []);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'edit':
        return <Edit className="h-4 w-4 text-blue-500" />;
      case 'save':
        return <Save className="h-4 w-4 text-green-500" />;
      case 'publish':
        return <Send className="h-4 w-4 text-green-600" />;
      case 'unpublish':
        return <EyeOff className="h-4 w-4 text-amber-500" />;
      case 'delete':
        return <Trash2 className="h-4 w-4 text-red-500" />;
      case 'duplicate':
        return <Copy className="h-4 w-4 text-blue-500" />;
      case 'restore':
        return <RotateCcw className="h-4 w-4 text-green-500" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'edit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'save':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'publish':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'unpublish':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'delete':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'duplicate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'restore':
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const recentActivities = activities.slice(0, 10);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Recent Activity</h3>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        {recentActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-shrink-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatar} />
                <AvatarFallback className="text-xs">
                  {activity.user.initials}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-sm">{activity.user.name}</p>
                <Badge className={`text-xs ${getActivityColor(activity.type)}`}>
                  {activity.type}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(activity.timestamp)}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {activity.description}
                {activity.field && (
                  <span className="text-blue-600"> • {activity.field}</span>
                )}
              </p>
              
              {activity.details && (
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.details}
                </p>
              )}
            </div>
            
            <div className="flex-shrink-0">
              {getActivityIcon(activity.type)}
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {activities.length > 10 && (
        <Button variant="outline" size="sm" className="w-full">
          Load More Activity
        </Button>
      )}

      {/* Summary Stats */}
      <div className="pt-4 border-t">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-primary">
              {activities.filter(a => a.type === 'edit').length}
            </p>
            <p className="text-xs text-muted-foreground">Edits</p>
          </div>
          <div>
            <p className="text-lg font-bold text-primary">
              {activities.filter(a => a.type === 'publish').length}
            </p>
            <p className="text-xs text-muted-foreground">Publishes</p>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>Updated {formatTimestamp(activities[0]?.timestamp || new Date())}</span>
      </div>
    </div>
  );
}
