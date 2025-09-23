'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Eye, 
  Link, 
  Image as ImageIcon,
  Globe,
  Twitter,
  Facebook,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Zap
} from 'lucide-react';

export function SeoTab() {
  const metaTitle = "Sample Project Title - Portfolio";
  const metaDescription = "A detailed look at this amazing project that showcases modern web development techniques and innovative design solutions.";
  const titleLength = metaTitle.length;
  const descriptionLength = metaDescription.length;

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
              <Search className="h-5 w-5 text-brand-accent" />
              SEO Basics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="meta-title" className="text-brand-muted">Meta Title</Label>
                <Badge variant={titleLength > 60 ? "destructive" : titleLength > 50 ? "default" : "secondary"} className="bg-brand-accent/10 text-brand-accent border-brand-accent/20">
                  {titleLength}/60
                </Badge>
              </div>
              <Input 
                id="meta-title" 
                value={metaTitle}
                placeholder="Page title for search engines..."
                className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
              />
              <p className="text-xs text-brand-muted">
                Recommended: 50-60 characters. Falls back to page title if empty.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="meta-description" className="text-brand-muted">Meta Description</Label>
                <Badge variant={descriptionLength > 160 ? "destructive" : descriptionLength > 120 ? "default" : "secondary"} className="bg-brand-accent/10 text-brand-accent border-brand-accent/20">
                  {descriptionLength}/160
                </Badge>
              </div>
              <Textarea 
                id="meta-description" 
                value={metaDescription}
                placeholder="Brief description for search results..."
                rows={3}
                className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
              />
              <p className="text-xs text-brand-muted">
                Recommended: 120-160 characters. Falls back to page excerpt if empty.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="canonical-url" className="text-brand-muted">Canonical URL</Label>
              <Input 
                id="canonical-url" 
                placeholder="https://yoursite.com/page-url"
                className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
              />
              <p className="text-xs text-brand-muted">
                Optional. Use if this content appears on multiple URLs.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="noindex" className="text-brand-muted">No Index</Label>
                <p className="text-xs text-brand-muted">
                  Prevent search engines from indexing this page
                </p>
              </div>
              <Switch id="noindex" />
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
            <CardTitle className="flex items-center gap-2 text-brand">
              <Eye className="h-5 w-5 text-brand-accent" />
              Social Media
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-brand-muted">Social Image</Label>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="border-2 border-dashed border-brand-accent/30 rounded-lg p-6 text-center bg-brand-section/30 hover:bg-brand-section/50 transition-colors"
              >
                <ImageIcon className="h-8 w-8 mx-auto text-brand-accent mb-2" />
                <p className="text-sm text-brand-muted mb-2">
                  Upload a social sharing image
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-brand-accent/50 text-brand-accent hover:bg-brand-accent/10"
                >
                  Choose Image
                </Button>
              </motion.div>
              <p className="text-xs text-brand-muted">
                Recommended: 1200×630px. Used when sharing on social media.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter-title" className="text-brand-muted">Twitter Title</Label>
              <Input 
                id="twitter-title" 
                placeholder="Custom title for Twitter (optional)"
                className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter-description" className="text-brand-muted">Twitter Description</Label>
              <Textarea 
                id="twitter-description" 
                placeholder="Custom description for Twitter (optional)"
                rows={2}
                className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
              />
            </div>
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
            <CardTitle className="flex items-center gap-2 text-brand">
              <Globe className="h-5 w-5 text-brand-accent" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Search Preview */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium text-brand-muted">Google Search</span>
              </div>
              <div className="border border-border/50 rounded-lg p-3 bg-brand-section/30">
                <div className="text-blue-600 text-sm hover:underline cursor-pointer">
                  {metaTitle}
                </div>
                <div className="text-green-600 text-xs">
                  https://yoursite.com/project-url
                </div>
                <div className="text-gray-600 text-sm mt-1">
                  {metaDescription}
                </div>
              </div>
            </div>

            {/* Twitter Preview */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                <span className="text-sm font-medium text-brand-muted">Twitter</span>
              </div>
              <div className="border border-border/50 rounded-lg p-3 bg-brand-section/30">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-brand-section/50 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-medium text-brand">Your Name</span>
                      <span className="text-brand-muted"> @username</span>
                    </div>
                    <div className="text-sm mt-1 text-brand">{metaTitle}</div>
                    <div className="text-sm text-brand-muted mt-1">{metaDescription}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Facebook Preview */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Facebook className="h-4 w-4" />
                <span className="text-sm font-medium text-brand-muted">Facebook</span>
              </div>
              <div className="border border-border/50 rounded-lg p-3 bg-brand-section/30">
                <div className="text-sm font-medium text-brand">{metaTitle}</div>
                <div className="text-xs text-brand-muted mt-1">yoursite.com</div>
                <div className="text-sm mt-2 text-brand-muted">{metaDescription}</div>
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
            <CardTitle className="flex items-center gap-2 text-brand">
              <AlertCircle className="h-5 w-5 text-brand-accent" />
              SEO Checklist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-brand-muted">Title is optimized (50-60 characters)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-brand-muted">Description is optimized (120-160 characters)</span>
            </div>
            <div className="flex items-center gap-3">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-brand-muted">Social image not set</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-brand-muted">URL is SEO-friendly</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}