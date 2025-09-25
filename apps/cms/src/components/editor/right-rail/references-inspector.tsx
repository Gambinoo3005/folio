'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@portfolio-building-service/ui';
import { Button } from '@portfolio-building-service/ui';
import { Badge } from '@portfolio-building-service/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@portfolio-building-service/ui';
import { 
  Link as LinkIcon,
  ArrowUpRight,
  ArrowDownLeft,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Alert, AlertDescription } from '@portfolio-building-service/ui';

interface Reference {
  id: string;
  type: 'page' | 'item' | 'media' | 'external';
  title: string;
  url: string;
  status: 'valid' | 'broken' | 'draft' | 'checking';
  lastChecked?: Date;
}

interface ReferencesInspectorProps {
  // Add props as needed
}

export function ReferencesInspector({}: ReferencesInspectorProps) {
  const [outgoingRefs, setOutgoingRefs] = useState<Reference[]>([]);
  const [incomingRefs, setIncomingRefs] = useState<Reference[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Mock data - in a real app, this would come from props or context
    const mockOutgoing: Reference[] = [
      {
        id: '1',
        type: 'page',
        title: 'About Us',
        url: '/about',
        status: 'valid',
        lastChecked: new Date()
      },
      {
        id: '2',
        type: 'item',
        title: 'Featured Project',
        url: '/projects/featured-project',
        status: 'valid',
        lastChecked: new Date()
      },
      {
        id: '3',
        type: 'external',
        title: 'External Documentation',
        url: 'https://example.com/docs',
        status: 'checking',
        lastChecked: new Date()
      },
      {
        id: '4',
        type: 'media',
        title: 'Hero Image',
        url: '/media/hero-image.jpg',
        status: 'valid',
        lastChecked: new Date()
      }
    ];

    const mockIncoming: Reference[] = [
      {
        id: '5',
        type: 'page',
        title: 'Home Page',
        url: '/',
        status: 'valid',
        lastChecked: new Date()
      },
      {
        id: '6',
        type: 'item',
        title: 'Blog Post',
        url: '/blog/related-post',
        status: 'draft',
        lastChecked: new Date()
      }
    ];

    setOutgoingRefs(mockOutgoing);
    setIncomingRefs(mockIncoming);
  }, []);

  const getTypeIcon = (type: Reference['type']) => {
    switch (type) {
      case 'page':
        return <FileText className="h-4 w-4" />;
      case 'item':
        return <FileText className="h-4 w-4" />;
      case 'media':
        return <ImageIcon className="h-4 w-4" />;
      case 'external':
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: Reference['status']) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'broken':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'draft':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'checking':
        return <Clock className="h-4 w-4 animate-spin text-blue-500" />;
    }
  };

  const getStatusColor = (status: Reference['status']) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'broken':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'draft':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'checking':
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const checkAllReferences = async () => {
    setIsChecking(true);
    
    // Simulate checking delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update statuses
    setOutgoingRefs(prev => prev.map(ref => ({
      ...ref,
      status: ref.type === 'external' ? 'valid' : ref.status,
      lastChecked: new Date()
    })));
    
    setIsChecking(false);
  };

  const brokenRefs = [...outgoingRefs, ...incomingRefs].filter(ref => ref.status === 'broken');
  const draftRefs = [...outgoingRefs, ...incomingRefs].filter(ref => ref.status === 'draft');

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">References</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={checkAllReferences}
          disabled={isChecking}
        >
          <LinkIcon className="h-4 w-4 mr-2" />
          {isChecking ? 'Checking...' : 'Check All'}
        </Button>
      </div>

      {/* Warnings */}
      {brokenRefs.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{brokenRefs.length} broken reference{brokenRefs.length > 1 ? 's' : ''}</strong>
            <p className="text-sm mt-1">Fix broken links before publishing</p>
          </AlertDescription>
        </Alert>
      )}

      {draftRefs.length > 0 && (
        <Alert className="border-amber-200 bg-amber-50">
          <Clock className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>{draftRefs.length} draft reference{draftRefs.length > 1 ? 's' : ''}</strong>
            <p className="text-sm mt-1">Some referenced content is not yet published</p>
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs defaultValue="outgoing" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="outgoing" className="text-xs">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            Uses ({outgoingRefs.length})
          </TabsTrigger>
          <TabsTrigger value="incoming" className="text-xs">
            <ArrowDownLeft className="h-3 w-3 mr-1" />
            Used by ({incomingRefs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="outgoing" className="mt-4">
          <div className="space-y-2">
            {outgoingRefs.length > 0 ? (
              outgoingRefs.map((ref) => (
                <div
                  key={ref.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {getTypeIcon(ref.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">{ref.title}</p>
                      <Badge className={`text-xs ${getStatusColor(ref.status)}`}>
                        {ref.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {ref.url}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {getStatusIcon(ref.status)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <LinkIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No outgoing references</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="incoming" className="mt-4">
          <div className="space-y-2">
            {incomingRefs.length > 0 ? (
              incomingRefs.map((ref) => (
                <div
                  key={ref.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {getTypeIcon(ref.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">{ref.title}</p>
                      <Badge className={`text-xs ${getStatusColor(ref.status)}`}>
                        {ref.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {ref.url}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {getStatusIcon(ref.status)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <LinkIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No incoming references</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Summary */}
      <div className="pt-4 border-t">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{outgoingRefs.length}</p>
            <p className="text-xs text-muted-foreground">Outgoing</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">{incomingRefs.length}</p>
            <p className="text-xs text-muted-foreground">Incoming</p>
          </div>
        </div>
      </div>
    </div>
  );
}
