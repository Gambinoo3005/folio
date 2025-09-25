'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@portfolio-building-service/ui';
import { Button } from '@portfolio-building-service/ui';
import { Badge } from '@portfolio-building-service/ui';
import { Progress } from '@portfolio-building-service/ui';
import { 
  Shield, 
  CheckCircle,
  AlertCircle,
  XCircle,
  ExternalLink,
  Image as ImageIcon,
  Type,
  Link as LinkIcon,
  RefreshCw,
  Eye,
  Zap
} from 'lucide-react';
import { Alert, AlertDescription } from '@portfolio-building-service/ui';
import { Separator } from '@portfolio-building-service/ui';

interface QualityTabProps {
  // Add props as needed
}

interface QualityCheck {
  id: string;
  type: 'accessibility' | 'seo' | 'performance' | 'content';
  title: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  fix?: string;
  critical?: boolean;
}

interface LinkCheck {
  url: string;
  status: 'checking' | 'valid' | 'broken' | 'timeout';
  statusCode?: number;
  message: string;
}

export function QualityTab({}: QualityTabProps) {
  const [checks, setChecks] = useState<QualityCheck[]>([]);
  const [linkChecks, setLinkChecks] = useState<LinkCheck[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallScore, setOverallScore] = useState(0);

  // Mock content for analysis
  const [content] = useState(`
    <h2>Introduction</h2>
    <p>This is a sample content with proper heading structure.</p>
    <img src="https://example.com/image.jpg" alt="Sample image" />
    <h3>Subsection</h3>
    <p>More content here with <a href="/internal-link">internal links</a> and <a href="https://external.com" target="_blank">external links</a>.</p>
    <p>Here's a <a href="https://broken-link.com">broken link</a> and a <a href="">empty link</a>.</p>
  `);

  const runQualityChecks = async () => {
    setIsRunning(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newChecks: QualityCheck[] = [
      {
        id: 'alt-text',
        type: 'accessibility',
        title: 'Image Alt Text',
        status: 'pass',
        message: 'All images have descriptive alt text',
        critical: true
      },
      {
        id: 'heading-hierarchy',
        type: 'accessibility',
        title: 'Heading Hierarchy',
        status: 'pass',
        message: 'Proper heading structure (H2 → H3)',
        critical: true
      },
      {
        id: 'link-text',
        type: 'accessibility',
        title: 'Link Text Clarity',
        status: 'warning',
        message: 'Some links could be more descriptive',
        fix: 'Avoid generic text like "click here"',
        critical: false
      },
      {
        id: 'color-contrast',
        type: 'accessibility',
        title: 'Color Contrast',
        status: 'pass',
        message: 'Text meets WCAG contrast requirements',
        critical: true
      },
      {
        id: 'empty-links',
        type: 'accessibility',
        title: 'Empty Links',
        status: 'fail',
        message: 'Found 1 empty link',
        fix: 'Add descriptive text to all links',
        critical: true
      },
      {
        id: 'external-links',
        type: 'accessibility',
        title: 'External Link Security',
        status: 'warning',
        message: 'External links should use rel="noopener"',
        fix: 'Add rel="noopener" to external links',
        critical: false
      }
    ];
    
    setChecks(newChecks);
    
    // Calculate overall score
    const totalChecks = newChecks.length;
    const passedChecks = newChecks.filter(check => check.status === 'pass').length;
    const score = Math.round((passedChecks / totalChecks) * 100);
    setOverallScore(score);
    
    setIsRunning(false);
  };

  const checkLinks = async () => {
    const links = content.match(/href="([^"]*)"/g) || [];
    const linkUrls = links.map(link => link.replace('href="', '').replace('"', ''));
    
    const newLinkChecks: LinkCheck[] = linkUrls.map(url => ({
      url,
      status: 'checking',
      message: 'Checking...'
    }));
    
    setLinkChecks(newLinkChecks);
    
    // Simulate link checking
    for (let i = 0; i < newLinkChecks.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedChecks = [...newLinkChecks];
      const link = updatedChecks[i];
      
      // Mock link checking results
      if (link.url === 'https://broken-link.com') {
        link.status = 'broken';
        link.message = 'Link is broken (404)';
        link.statusCode = 404;
      } else if (link.url === '') {
        link.status = 'broken';
        link.message = 'Empty link';
      } else if (link.url.startsWith('/')) {
        link.status = 'valid';
        link.message = 'Internal link is valid';
        link.statusCode = 200;
      } else {
        link.status = 'valid';
        link.message = 'External link is accessible';
        link.statusCode = 200;
      }
      
      setLinkChecks([...updatedChecks]);
    }
  };

  // Auto-run checks on mount
  useEffect(() => {
    runQualityChecks();
  }, []);

  const getStatusIcon = (status: 'pass' | 'warning' | 'fail') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: 'pass' | 'warning' | 'fail') => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'fail':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getLinkStatusIcon = (status: LinkCheck['status']) => {
    switch (status) {
      case 'checking':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'broken':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'timeout':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
    }
  };

  const criticalIssues = checks.filter(check => check.critical && check.status !== 'pass');
  const canPublish = criticalIssues.length === 0;

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Quality Score
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {overallScore}%
            </div>
            <Progress value={overallScore} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              {canPublish ? 'Ready to publish' : `${criticalIssues.length} critical issues need fixing`}
            </p>
          </div>
          
          {!canPublish && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Cannot publish:</strong> {criticalIssues.length} critical accessibility issues must be resolved first.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Accessibility Checks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Accessibility Checks
            {isRunning && (
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {checks.filter(check => check.type === 'accessibility').map((check) => (
            <div key={check.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(check.status)}
                <div>
                  <p className="font-medium">{check.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {check.message}
                  </p>
                  {check.fix && (
                    <p className="text-sm text-blue-600 mt-1">
                      💡 {check.fix}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {check.critical && (
                  <Badge variant="destructive" className="text-xs">
                    Critical
                  </Badge>
                )}
                <Badge className={getStatusColor(check.status)}>
                  {check.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Link Checker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-primary" />
            Link Checker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Check all links for accessibility and validity
            </p>
            <Button onClick={checkLinks} size="sm" disabled={isRunning}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Links
            </Button>
          </div>
          
          {linkChecks.length > 0 && (
            <div className="space-y-2">
              {linkChecks.map((link, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getLinkStatusIcon(link.status)}
                    <div>
                      <p className="font-medium text-sm">
                        {link.url || '(empty link)'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {link.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {link.statusCode && (
                      <Badge variant="outline" className="text-xs">
                        {link.statusCode}
                      </Badge>
                    )}
                    {link.url.startsWith('http') && (
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Quality */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5 text-primary" />
            Content Quality
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {checks.filter(check => check.type === 'content').map((check) => (
            <div key={check.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(check.status)}
                <div>
                  <p className="font-medium">{check.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {check.message}
                  </p>
                  {check.fix && (
                    <p className="text-sm text-blue-600 mt-1">
                      💡 {check.fix}
                    </p>
                  )}
                </div>
              </div>
              <Badge className={getStatusColor(check.status)}>
                {check.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={runQualityChecks} 
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Running Checks...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Re-run All Checks
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={checkLinks}
            disabled={isRunning}
            className="w-full"
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            Check Links Only
          </Button>
        </CardContent>
      </Card>

      {/* Accessibility Guidelines */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Accessibility Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 text-sm space-y-2">
          <p>• All images must have descriptive alt text</p>
          <p>• Use proper heading hierarchy (H2 → H3 → H4)</p>
          <p>• Links should have descriptive text, not "click here"</p>
          <p>• Ensure sufficient color contrast (4.5:1 for normal text)</p>
          <p>• External links should use rel="noopener" for security</p>
          <p>• Avoid empty links or buttons</p>
        </CardContent>
      </Card>
    </div>
  );
}
