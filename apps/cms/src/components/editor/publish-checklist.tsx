'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  FileText,
  Image,
  Search,
  Link,
  Eye,
  Calendar,
  Tag,
  Sparkles,
  Zap
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
  status: 'complete' | 'warning' | 'error';
  icon: React.ReactNode;
}

export function PublishChecklist() {
  const checklistItems: ChecklistItem[] = [
    {
      id: 'title',
      label: 'Title is set',
      status: 'complete',
      icon: <FileText className="h-4 w-4" />
    },
    {
      id: 'content',
      label: 'Content has been written',
      status: 'complete',
      icon: <FileText className="h-4 w-4" />
    },
    {
      id: 'hero-image',
      label: 'Hero image uploaded',
      status: 'complete',
      icon: <Image className="h-4 w-4" />
    },
    {
      id: 'alt-text',
      label: 'Alt text provided for images',
      status: 'warning',
      icon: <Image className="h-4 w-4" />
    },
    {
      id: 'meta-title',
      label: 'SEO title optimized',
      status: 'complete',
      icon: <Search className="h-4 w-4" />
    },
    {
      id: 'meta-description',
      label: 'SEO description optimized',
      status: 'complete',
      icon: <Search className="h-4 w-4" />
    },
    {
      id: 'social-image',
      label: 'Social sharing image set',
      status: 'error',
      icon: <Image className="h-4 w-4" />
    },
    {
      id: 'url-slug',
      label: 'URL slug is SEO-friendly',
      status: 'complete',
      icon: <Link className="h-4 w-4" />
    },
    {
      id: 'tags',
      label: 'Tags and categories added',
      status: 'complete',
      icon: <Tag className="h-4 w-4" />
    },
    {
      id: 'publish-date',
      label: 'Publish date set',
      status: 'complete',
      icon: <Calendar className="h-4 w-4" />
    }
  ];

  const completedItems = checklistItems.filter(item => item.status === 'complete').length;
  const totalItems = checklistItems.length;
  const completionPercentage = (completedItems / totalItems) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'text-green-500';
      case 'warning':
        return 'text-amber-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-border/50 bg-background/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-brand">
              <Eye className="h-5 w-5 text-brand-accent" />
              Publish Checklist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-muted">Ready to publish</span>
                <span className="font-medium text-brand">{completedItems}/{totalItems}</span>
              </div>
              <Progress 
                value={completionPercentage} 
                className="h-2 bg-brand-section/50" 
              />
              <p className="text-xs text-brand-muted">
                {completionPercentage === 100 
                  ? 'All checks passed! Ready to publish.' 
                  : `${totalItems - completedItems} items need attention.`
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border-border/50 bg-background/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base text-brand">Content Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {checklistItems.map((item, index) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + (index * 0.05) }}
                className="flex items-center gap-3"
              >
                {getStatusIcon(item.status)}
                <div className="flex items-center gap-2 flex-1">
                  {item.icon}
                  <span className={`text-sm ${getStatusColor(item.status)}`}>
                    {item.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="border-border/50 bg-background/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base text-brand">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-brand-muted">Missing Items</h4>
              <div className="space-y-1">
                {checklistItems
                  .filter(item => item.status !== 'complete')
                  .map((item) => (
                    <div key={item.id} className="flex items-center gap-2 text-sm text-brand-muted">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="border-border/50 bg-background/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base text-brand flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-accent" />
              Publishing Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-brand-muted">Use descriptive titles that clearly explain your content</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-brand-muted">Add alt text to all images for accessibility</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-brand-muted">Include relevant tags to help with discoverability</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-brand-muted">Preview your content before publishing</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}