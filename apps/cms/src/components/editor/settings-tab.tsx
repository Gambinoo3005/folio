'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Settings, 
  Calendar as CalendarIcon,
  Clock,
  User,
  Star,
  Link,
  Tag,
  Eye,
  EyeOff,
  Globe,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';

export function SettingsTab() {
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
              <Settings className="h-5 w-5 text-brand-accent" />
              Publishing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-brand-muted">URL Slug</Label>
              <Input 
                id="slug" 
                placeholder="url-friendly-slug"
                className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
              />
              <p className="text-xs text-brand-muted">
                This will be the URL for this content. Leave empty to auto-generate from title.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-brand-muted">Publish Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left font-normal border-border/50 hover:bg-brand-accent/10 hover:border-brand-accent/50"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(new Date(), "PPP")}
                    </Button>
                  </motion.div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background border-border/50">
                  <Calendar
                    mode="single"
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-brand-muted">Publish Time</Label>
              <Input 
                type="time" 
                defaultValue="12:00" 
                className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="featured" className="text-brand-muted">Featured</Label>
                <p className="text-xs text-brand-muted">
                  Highlight this content on the homepage
                </p>
              </div>
              <Switch id="featured" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="public" className="text-brand-muted">Public</Label>
                <p className="text-xs text-brand-muted">
                  Make this content visible to visitors
                </p>
              </div>
              <Switch id="public" defaultChecked />
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
              <User className="h-5 w-5 text-brand-accent" />
              Author & Attribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="author" className="text-brand-muted">Author</Label>
              <Input 
                id="author" 
                placeholder="Content author name"
                defaultValue="Your Name"
                className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author-bio" className="text-brand-muted">Author Bio</Label>
              <Textarea 
                id="author-bio" 
                placeholder="Brief author biography..."
                rows={3}
                className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author-email" className="text-brand-muted">Author Email</Label>
              <Input 
                id="author-email" 
                type="email"
                placeholder="author@example.com"
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
              <Link className="h-5 w-5 text-brand-accent" />
              External Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="external-url" className="text-brand-muted">External URL</Label>
              <Input 
                id="external-url" 
                placeholder="https://example.com"
                className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
              />
              <p className="text-xs text-brand-muted">
                Link to live project, GitHub repository, or related content
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="github-url" className="text-brand-muted">GitHub URL</Label>
              <Input 
                id="github-url" 
                placeholder="https://github.com/username/repo"
                className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="demo-url" className="text-brand-muted">Demo URL</Label>
              <Input 
                id="demo-url" 
                placeholder="https://demo.example.com"
                className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
              />
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
              <Tag className="h-5 w-5 text-brand-accent" />
              Organization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-brand-muted">Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge className="flex items-center gap-1 bg-brand-accent/10 text-brand-accent border-brand-accent/20">
                  web-development
                  <span className="ml-1 cursor-pointer hover:text-destructive">×</span>
                </Badge>
                <Badge className="flex items-center gap-1 bg-brand-accent/10 text-brand-accent border-brand-accent/20">
                  react
                  <span className="ml-1 cursor-pointer hover:text-destructive">×</span>
                </Badge>
                <Badge className="flex items-center gap-1 bg-brand-accent/10 text-brand-accent border-brand-accent/20">
                  typescript
                  <span className="ml-1 cursor-pointer hover:text-destructive">×</span>
                </Badge>
              </div>
              <div className="flex gap-2">
                <Input 
                  placeholder="Add a tag..." 
                  className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-brand-accent/50 text-brand-accent hover:bg-brand-accent/10"
                  >
                    Add
                  </Button>
                </motion.div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-brand-muted">Category</Label>
              <Input 
                id="category" 
                placeholder="Select or enter a category..."
                className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-type" className="text-brand-muted">Project Type</Label>
              <Input 
                id="project-type" 
                placeholder="e.g., Web App, Mobile App, Design"
                className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client" className="text-brand-muted">Client</Label>
              <Input 
                id="client" 
                placeholder="Client or company name"
                className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="border-border/50 bg-background/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-brand">
              <Eye className="h-5 w-5 text-brand-accent" />
              Visibility & Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="password-protected" className="text-brand-muted">Password Protected</Label>
                <p className="text-xs text-brand-muted">
                  Require a password to view this content
                </p>
              </div>
              <Switch id="password-protected" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="view-password" className="text-brand-muted">View Password</Label>
              <Input 
                id="view-password" 
                type="password"
                placeholder="Enter password for viewing"
                disabled
                className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-in-sitemap" className="text-brand-muted">Show in Sitemap</Label>
                <p className="text-xs text-brand-muted">
                  Include this content in the site's XML sitemap
                </p>
              </div>
              <Switch id="show-in-sitemap" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allow-comments" className="text-brand-muted">Allow Comments</Label>
                <p className="text-xs text-brand-muted">
                  Enable comments on this content
                </p>
              </div>
              <Switch id="allow-comments" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}