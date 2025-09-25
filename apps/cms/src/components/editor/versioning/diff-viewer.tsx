'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@portfolio-building-service/ui';
import { Button } from '@portfolio-building-service/ui';
import { Badge } from '@portfolio-building-service/ui';
import { 
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Eye,
  EyeOff,
  FileText,
  Image as ImageIcon,
  Code
} from 'lucide-react';
import { Separator } from '@portfolio-building-service/ui';

interface DiffViewerProps {
  version1: any;
  version2: any;
  onRestore?: (version: any) => void;
  onClose?: () => void;
}

interface DiffChange {
  type: 'added' | 'removed' | 'modified' | 'unchanged';
  field: string;
  oldValue?: any;
  newValue?: any;
  description: string;
}

export function DiffViewer({ version1, version2, onRestore, onClose }: DiffViewerProps) {
  const [showUnchanged, setShowUnchanged] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  // Mock diff data - in a real app, this would be calculated
  const changes: DiffChange[] = [
    {
      type: 'modified',
      field: 'title',
      oldValue: 'Old Page Title',
      newValue: 'New Page Title',
      description: 'Page title was updated'
    },
    {
      type: 'added',
      field: 'coverImage',
      oldValue: null,
      newValue: 'hero-image.jpg',
      description: 'Cover image was added'
    },
    {
      type: 'modified',
      field: 'content',
      oldValue: 'Old content here...',
      newValue: 'New content with more details...',
      description: 'Main content was expanded'
    },
    {
      type: 'removed',
      field: 'oldSection',
      oldValue: 'This section was removed',
      newValue: null,
      description: 'Old section was removed'
    },
    {
      type: 'unchanged',
      field: 'seoDescription',
      oldValue: 'SEO description',
      newValue: 'SEO description',
      description: 'SEO description unchanged'
    }
  ];

  const getChangeIcon = (type: DiffChange['type']) => {
    switch (type) {
      case 'added':
        return <ArrowRight className="h-4 w-4 text-green-500" />;
      case 'removed':
        return <ArrowLeft className="h-4 w-4 text-red-500" />;
      case 'modified':
        return <RotateCcw className="h-4 w-4 text-blue-500" />;
      case 'unchanged':
        return <Eye className="h-4 w-4 text-gray-400" />;
    }
  };

  const getChangeColor = (type: DiffChange['type']) => {
    switch (type) {
      case 'added':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'removed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'modified':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'unchanged':
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFieldIcon = (field: string) => {
    switch (field) {
      case 'title':
      case 'content':
        return <FileText className="h-4 w-4" />;
      case 'coverImage':
      case 'ogImage':
        return <ImageIcon className="h-4 w-4" />;
      default:
        return <Code className="h-4 w-4" />;
    }
  };

  const visibleChanges = showUnchanged ? changes : changes.filter(c => c.type !== 'unchanged');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold">Version Comparison</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline">v{version1.version}</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge variant="outline">v{version2.version}</Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUnchanged(!showUnchanged)}
          >
            {showUnchanged ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showUnchanged ? 'Hide' : 'Show'} Unchanged
          </Button>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-green-600">
                {changes.filter(c => c.type === 'added').length}
              </p>
              <p className="text-xs text-muted-foreground">Added</p>
            </div>
            <div>
              <p className="text-lg font-bold text-red-600">
                {changes.filter(c => c.type === 'removed').length}
              </p>
              <p className="text-xs text-muted-foreground">Removed</p>
            </div>
            <div>
              <p className="text-lg font-bold text-blue-600">
                {changes.filter(c => c.type === 'modified').length}
              </p>
              <p className="text-xs text-muted-foreground">Modified</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-600">
                {changes.filter(c => c.type === 'unchanged').length}
              </p>
              <p className="text-xs text-muted-foreground">Unchanged</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Changes List */}
      <div className="space-y-2">
        {visibleChanges.map((change, index) => (
          <Card
            key={index}
            className={`cursor-pointer transition-colors ${
              selectedField === change.field ? 'border-primary bg-primary/5' : ''
            }`}
            onClick={() => setSelectedField(selectedField === change.field ? null : change.field)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getChangeIcon(change.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {getFieldIcon(change.field)}
                      <span className="font-medium">{change.field}</span>
                    </div>
                    <Badge className={`text-xs ${getChangeColor(change.type)}`}>
                      {change.type}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {change.description}
                  </p>
                  
                  {selectedField === change.field && (
                    <div className="space-y-2 mt-3 p-3 bg-muted/50 rounded-lg">
                      {change.oldValue && (
                        <div>
                          <p className="text-xs font-medium text-red-600 mb-1">Before:</p>
                          <div className="text-sm bg-red-50 border border-red-200 rounded p-2">
                            {typeof change.oldValue === 'string' 
                              ? change.oldValue 
                              : JSON.stringify(change.oldValue, null, 2)
                            }
                          </div>
                        </div>
                      )}
                      
                      {change.newValue && (
                        <div>
                          <p className="text-xs font-medium text-green-600 mb-1">After:</p>
                          <div className="text-sm bg-green-50 border border-green-200 rounded p-2">
                            {typeof change.newValue === 'string' 
                              ? change.newValue 
                              : JSON.stringify(change.newValue, null, 2)
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRestore?.(version1)}
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Restore Version {version1.version}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRestore?.(version2)}
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Restore Version {version2.version}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
