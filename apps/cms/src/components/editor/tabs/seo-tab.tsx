'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@portfolio-building-service/ui';
import { Input } from '@portfolio-building-service/ui';
import { Label } from '@portfolio-building-service/ui';
import { Textarea } from '@portfolio-building-service/ui';
import { Button } from '@portfolio-building-service/ui';
import { Badge } from '@portfolio-building-service/ui';
import { Switch } from '@portfolio-building-service/ui';
import { 
  Search, 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
  Copy,
  RefreshCw
} from 'lucide-react';
import { Alert, AlertDescription } from '@portfolio-building-service/ui';
import { Separator } from '@portfolio-building-service/ui';

interface SeoTabProps {
  // Add props as needed
}

interface SEOAnalysis {
  title: {
    length: number;
    maxLength: number;
    status: 'good' | 'warning' | 'error';
    message: string;
  };
  description: {
    length: number;
    maxLength: number;
    status: 'good' | 'warning' | 'error';
    message: string;
  };
  slug: {
    status: 'good' | 'warning' | 'error';
    message: string;
  };
  headings: {
    hasH2: boolean;
    status: 'good' | 'warning' | 'error';
    message: string;
  };
  internalLinks: {
    count: number;
    status: 'good' | 'warning' | 'error';
    message: string;
  };
}

export function SeoTab({}: SeoTabProps) {
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [noIndex, setNoIndex] = useState(false);
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock content for analysis
  const [content] = useState(`
    <h2>Introduction</h2>
    <p>This is a sample content with proper heading structure.</p>
    <h3>Subsection</h3>
    <p>More content here with <a href="/internal-link">internal links</a>.</p>
  `);

  const analyzeSEO = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAnalysis: SEOAnalysis = {
      title: {
        length: seoTitle.length,
        maxLength: 60,
        status: seoTitle.length === 0 ? 'error' : seoTitle.length > 60 ? 'warning' : 'good',
        message: seoTitle.length === 0 
          ? 'SEO title is required'
          : seoTitle.length > 60 
            ? 'SEO title is too long (over 60 characters)'
            : 'SEO title length is optimal'
      },
      description: {
        length: seoDescription.length,
        maxLength: 160,
        status: seoDescription.length === 0 ? 'error' : seoDescription.length > 160 ? 'warning' : 'good',
        message: seoDescription.length === 0 
          ? 'SEO description is required'
          : seoDescription.length > 160 
            ? 'SEO description is too long (over 160 characters)'
            : 'SEO description length is optimal'
      },
      slug: {
        status: 'good',
        message: 'Slug is SEO-friendly'
      },
      headings: {
        hasH2: content.includes('<h2>'),
        status: content.includes('<h2>') ? 'good' : 'warning',
        message: content.includes('<h2>') 
          ? 'Content has proper heading structure'
          : 'Content should have at least one H2 heading'
      },
      internalLinks: {
        count: (content.match(/href="\/[^"]*"/g) || []).length,
        status: (content.match(/href="\/[^"]*"/g) || []).length > 0 ? 'good' : 'warning',
        message: (content.match(/href="\/[^"]*"/g) || []).length > 0 
          ? `Found ${(content.match(/href="\/[^"]*"/g) || []).length} internal links`
          : 'Consider adding internal links for better SEO'
      }
    };
    
    setAnalysis(newAnalysis);
    setIsAnalyzing(false);
  };

  // Auto-analyze when content changes
  useEffect(() => {
    const timer = setTimeout(analyzeSEO, 500);
    return () => clearTimeout(timer);
  }, [seoTitle, seoDescription, content]);

  const generateDescriptionFromContent = () => {
    // Simple content extraction for description generation
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    const words = textContent.split(' ');
    const description = words.slice(0, 25).join(' ');
    setSeoDescription(description + (words.length > 25 ? '...' : ''));
  };

  const useTitleAsSeoTitle = () => {
    // This would use the actual page title
    setSeoTitle('Your Page Title Here');
  };

  const getStatusIcon = (status: 'good' | 'warning' | 'error') => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: 'good' | 'warning' | 'error') => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* SEO Fields */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            SEO Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="seo-title">SEO Title</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={useTitleAsSeoTitle}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Use Title
                </Button>
                <Badge variant="outline" className="text-xs">
                  {seoTitle.length}/60
                </Badge>
              </div>
            </div>
            <Input
              id="seo-title"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Enter SEO title (recommended: 50-60 characters)..."
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="seo-description">Meta Description</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateDescriptionFromContent}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate
                </Button>
                <Badge variant="outline" className="text-xs">
                  {seoDescription.length}/160
                </Badge>
              </div>
            </div>
            <Textarea
              id="seo-description"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Enter meta description (recommended: 150-160 characters)..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="canonical">Canonical URL</Label>
            <Input
              id="canonical"
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              placeholder="https://yoursite.com/page-url"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="noindex">No Index</Label>
              <p className="text-sm text-muted-foreground">
                Prevent search engines from indexing this page
              </p>
            </div>
            <Switch
              id="noindex"
              checked={noIndex}
              onCheckedChange={setNoIndex}
            />
          </div>
        </CardContent>
      </Card>

      {/* SEO Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            SEO Analysis
            {isAnalyzing && (
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {analysis ? (
            <div className="space-y-3">
              {/* Title Analysis */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(analysis.title.status)}
                  <div>
                    <p className="font-medium">SEO Title</p>
                    <p className="text-sm text-muted-foreground">
                      {analysis.title.message}
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(analysis.title.status)}>
                  {analysis.title.length}/{analysis.title.maxLength}
                </Badge>
              </div>

              {/* Description Analysis */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(analysis.description.status)}
                  <div>
                    <p className="font-medium">Meta Description</p>
                    <p className="text-sm text-muted-foreground">
                      {analysis.description.message}
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(analysis.description.status)}>
                  {analysis.description.length}/{analysis.description.maxLength}
                </Badge>
              </div>

              {/* Slug Analysis */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(analysis.slug.status)}
                  <div>
                    <p className="font-medium">URL Slug</p>
                    <p className="text-sm text-muted-foreground">
                      {analysis.slug.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Headings Analysis */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(analysis.headings.status)}
                  <div>
                    <p className="font-medium">Heading Structure</p>
                    <p className="text-sm text-muted-foreground">
                      {analysis.headings.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Internal Links Analysis */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(analysis.internalLinks.status)}
                  <div>
                    <p className="font-medium">Internal Links</p>
                    <p className="text-sm text-muted-foreground">
                      {analysis.internalLinks.message}
                    </p>
                  </div>
                </div>
                <Badge variant="outline">
                  {analysis.internalLinks.count}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>SEO analysis will appear here</p>
              <p className="text-sm">Start typing to see live analysis</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SEO Tips */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">SEO Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 text-sm space-y-2">
          <p>• Keep SEO titles between 50-60 characters for optimal display</p>
          <p>• Write compelling meta descriptions that encourage clicks</p>
          <p>• Use descriptive, keyword-rich URLs</p>
          <p>• Structure content with proper heading hierarchy (H2, H3, H4)</p>
          <p>• Include internal links to related content</p>
          <p>• Use alt text for all images</p>
        </CardContent>
      </Card>
    </div>
  );
}
