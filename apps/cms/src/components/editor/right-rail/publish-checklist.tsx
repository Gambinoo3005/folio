'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@portfolio-building-service/ui';
import { Button } from '@portfolio-building-service/ui';
import { Badge } from '@portfolio-building-service/ui';
import { Progress } from '@portfolio-building-service/ui';
import { 
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Zap,
  Eye,
  Image as ImageIcon,
  Type,
  Link as LinkIcon,
  Search
} from 'lucide-react';
import { Alert, AlertDescription } from '@portfolio-building-service/ui';

interface ChecklistItem {
  id: string;
  title: string;
  status: 'pending' | 'warning' | 'complete';
  critical: boolean;
  category: 'content' | 'media' | 'seo' | 'quality';
  description: string;
}

interface PublishChecklistProps {
  // Add props as needed
}

export function PublishChecklist({}: PublishChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Mock checklist data - in a real app, this would come from props or context
    const mockItems: ChecklistItem[] = [
      {
        id: 'title',
        title: 'Title is set',
        status: 'complete',
        critical: true,
        category: 'content',
        description: 'Page has a descriptive title'
      },
      {
        id: 'content',
        title: 'Content is written',
        status: 'complete',
        critical: true,
        category: 'content',
        description: 'Main content area has content'
      },
      {
        id: 'cover-image',
        title: 'Cover image with alt text',
        status: 'complete',
        critical: true,
        category: 'media',
        description: 'Cover image has descriptive alt text'
      },
      {
        id: 'og-image',
        title: 'Open Graph image',
        status: 'warning',
        critical: false,
        category: 'media',
        description: 'OG image recommended for social sharing'
      },
      {
        id: 'seo-title',
        title: 'SEO title',
        status: 'complete',
        critical: false,
        category: 'seo',
        description: 'SEO title is optimized'
      },
      {
        id: 'seo-description',
        title: 'Meta description',
        status: 'complete',
        critical: false,
        category: 'seo',
        description: 'Meta description is set'
      },
      {
        id: 'heading-structure',
        title: 'Proper heading structure',
        status: 'complete',
        critical: true,
        category: 'quality',
        description: 'Content uses proper H2-H4 hierarchy'
      },
      {
        id: 'alt-text',
        title: 'All images have alt text',
        status: 'complete',
        critical: true,
        category: 'quality',
        description: 'All images are accessible'
      },
      {
        id: 'link-check',
        title: 'Links are valid',
        status: 'warning',
        critical: false,
        category: 'quality',
        description: 'Some links need checking'
      },
      {
        id: 'slug',
        title: 'URL slug is set',
        status: 'complete',
        critical: true,
        category: 'content',
        description: 'Page has a URL slug'
      }
    ];

    setItems(mockItems);
  }, []);

  const getStatusIcon = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'pending':
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: ChecklistItem['category']) => {
    switch (category) {
      case 'content':
        return <Type className="h-4 w-4" />;
      case 'media':
        return <ImageIcon className="h-4 w-4" />;
      case 'seo':
        return <Search className="h-4 w-4" />;
      case 'quality':
        return <Eye className="h-4 w-4" />;
    }
  };

  const completedItems = items.filter(item => item.status === 'complete').length;
  const totalItems = items.length;
  const criticalItems = items.filter(item => item.critical);
  const criticalCompleted = criticalItems.filter(item => item.status === 'complete').length;
  const canPublish = criticalCompleted === criticalItems.length;

  const progressPercentage = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="text-center">
        <div className="text-2xl font-bold text-primary mb-2">
          {progressPercentage}%
        </div>
        <Progress value={progressPercentage} className="w-full mb-2" />
        <p className="text-sm text-muted-foreground">
          {completedItems} of {totalItems} items complete
        </p>
      </div>

      {/* Publish Status */}
      {canPublish ? (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Ready to publish!</strong> All critical requirements are met.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Not ready to publish.</strong> {criticalItems.length - criticalCompleted} critical items need attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Checklist Items */}
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-shrink-0 mt-0.5">
              {getStatusIcon(item.status)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-sm">{item.title}</p>
                <div className="flex items-center gap-1">
                  {getCategoryIcon(item.category)}
                  {item.critical && (
                    <Badge variant="destructive" className="text-xs">
                      Critical
                    </Badge>
                  )}
                  <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                    {item.status}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <Button 
          className="w-full" 
          disabled={!canPublish}
          size="sm"
        >
          <Zap className="h-4 w-4 mr-2" />
          Publish Now
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full" 
          size="sm"
        >
          <Clock className="h-4 w-4 mr-2" />
          Schedule Publish
        </Button>
      </div>

      {/* Live Updates Indicator */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500' : 'bg-gray-400'}`} />
        <span>{isLive ? 'Live updates' : 'Updates paused'}</span>
      </div>
    </div>
  );
}
