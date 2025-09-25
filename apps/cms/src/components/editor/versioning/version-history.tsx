'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@portfolio-building-service/ui';
import { Button } from '@portfolio-building-service/ui';
import { Badge } from '@portfolio-building-service/ui';
import { 
  History,
  RotateCcw,
  Eye,
  User,
  Clock,
  GitBranch,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@portfolio-building-service/ui';
import { Separator } from '@portfolio-building-service/ui';

interface Version {
  id: string;
  version: string;
  timestamp: Date;
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  changes: string[];
  type: 'create' | 'edit' | 'publish' | 'unpublish' | 'restore';
  field?: string;
  content?: any;
}

interface VersionHistoryProps {
  contentId: string;
  onRestore?: (version: Version) => void;
  onCompare?: (version1: Version, version2: Version) => void;
}

export function VersionHistory({ contentId, onRestore, onCompare }: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [comparing, setComparing] = useState<{ v1: Version | null; v2: Version | null }>({
    v1: null,
    v2: null
  });

  useEffect(() => {
    // Mock data - in a real app, this would fetch from API
    const mockVersions: Version[] = [
      {
        id: '1',
        version: '1.0.0',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        user: { name: 'John Doe', initials: 'JD' },
        changes: ['Updated main content', 'Added cover image'],
        type: 'edit',
        field: 'content'
      },
      {
        id: '2',
        version: '0.9.0',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        user: { name: 'Jane Smith', initials: 'JS' },
        changes: ['Published page'],
        type: 'publish'
      },
      {
        id: '3',
        version: '0.8.0',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        user: { name: 'John Doe', initials: 'JD' },
        changes: ['Updated SEO settings', 'Added meta description'],
        type: 'edit',
        field: 'seo'
      },
      {
        id: '4',
        version: '0.7.0',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        user: { name: 'Jane Smith', initials: 'JS' },
        changes: ['Created initial content'],
        type: 'create'
      }
    ];

    setVersions(mockVersions);
  }, [contentId]);

  const getVersionIcon = (type: Version['type']) => {
    switch (type) {
      case 'create':
        return <GitBranch className="h-4 w-4 text-green-500" />;
      case 'edit':
        return <History className="h-4 w-4 text-blue-500" />;
      case 'publish':
        return <Eye className="h-4 w-4 text-green-600" />;
      case 'unpublish':
        return <Eye className="h-4 w-4 text-amber-500" />;
      case 'restore':
        return <RotateCcw className="h-4 w-4 text-purple-500" />;
    }
  };

  const getVersionColor = (type: Version['type']) => {
    switch (type) {
      case 'create':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'edit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'publish':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'unpublish':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'restore':
        return 'bg-purple-100 text-purple-800 border-purple-200';
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

  const handleRestore = (version: Version) => {
    if (onRestore) {
      onRestore(version);
    }
  };

  const handleCompare = (version: Version) => {
    if (!comparing.v1) {
      setComparing({ v1: version, v2: null });
    } else if (!comparing.v2) {
      setComparing({ v1: comparing.v1, v2: version });
      if (onCompare) {
        onCompare(comparing.v1, version);
      }
    } else {
      setComparing({ v1: version, v2: null });
    }
  };

  const clearComparison = () => {
    setComparing({ v1: null, v2: null });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Version History</h3>
        <div className="flex items-center gap-2">
          {comparing.v1 && (
            <Button variant="outline" size="sm" onClick={clearComparison}>
              Clear Comparison
            </Button>
          )}
        </div>
      </div>

      {/* Comparison Status */}
      {comparing.v1 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">v{comparing.v1.version}</Badge>
                <span className="text-sm">{comparing.v1.user.name}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              {comparing.v2 ? (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">v{comparing.v2.version}</Badge>
                  <span className="text-sm">{comparing.v2.user.name}</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Select second version</span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Version List */}
      <div className="space-y-2">
        {versions.map((version) => (
          <div
            key={version.id}
            className={`flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ${
              selectedVersion?.id === version.id ? 'bg-accent' : ''
            } ${
              comparing.v1?.id === version.id || comparing.v2?.id === version.id
                ? 'border-blue-500 bg-blue-50'
                : ''
            }`}
            onClick={() => setSelectedVersion(version)}
          >
            <div className="flex-shrink-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={version.user.avatar} />
                <AvatarFallback className="text-xs">
                  {version.user.initials}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-sm">{version.user.name}</p>
                <Badge className={`text-xs ${getVersionColor(version.type)}`}>
                  {version.type}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  v{version.version}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(version.timestamp)}
                </span>
              </div>
              
              <div className="space-y-1">
                {version.changes.map((change, index) => (
                  <p key={index} className="text-sm text-muted-foreground">
                    • {change}
                  </p>
                ))}
                {version.field && (
                  <p className="text-xs text-blue-600">
                    Field: {version.field}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex-shrink-0 flex items-center gap-1">
              {getVersionIcon(version.type)}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCompare(version);
                }}
                className="h-6 w-6 p-0"
              >
                <Eye className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      {selectedVersion && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Version Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRestore(selectedVersion)}
              className="w-full"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restore This Version
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCompare(selectedVersion)}
              className="w-full"
            >
              <Eye className="h-4 w-4 mr-2" />
              Compare with Current
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <div className="pt-4 border-t">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-primary">{versions.length}</p>
            <p className="text-xs text-muted-foreground">Total Versions</p>
          </div>
          <div>
            <p className="text-lg font-bold text-primary">
              {versions.filter(v => v.type === 'edit').length}
            </p>
            <p className="text-xs text-muted-foreground">Edits</p>
          </div>
          <div>
            <p className="text-lg font-bold text-primary">
              {versions.filter(v => v.type === 'publish').length}
            </p>
            <p className="text-xs text-muted-foreground">Publishes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
