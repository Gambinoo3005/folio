'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Image as ImageIcon, 
  Upload, 
  Search,
  Grid3X3,
  List,
  Filter,
  Plus,
  X,
  Download,
  Trash2,
  Sparkles
} from 'lucide-react';

export function MediaTab() {
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
              <ImageIcon className="h-5 w-5 text-brand-accent" />
              Media Library
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Upload Area */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="border-2 border-dashed border-brand-accent/30 rounded-lg p-8 text-center bg-brand-section/30 hover:bg-brand-section/50 transition-colors"
            >
              <Upload className="h-12 w-12 mx-auto text-brand-accent mb-4" />
              <p className="text-sm text-brand-muted mb-2">
                Drag and drop files here, or click to browse
              </p>
              <Button 
                variant="outline" 
                size="sm"
                className="border-brand-accent/50 text-brand-accent hover:bg-brand-accent/10"
              >
                Choose Files
              </Button>
              <p className="text-xs text-brand-muted mt-2">
                Supports JPG, PNG, GIF, WebP up to 10MB
              </p>
            </motion.div>

            {/* Search and Filters */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brand-muted" />
                <Input 
                  placeholder="Search media..." 
                  className="pl-10 border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
                />
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-border/50 hover:bg-brand-accent/10 hover:border-brand-accent/50"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-border/50 hover:bg-brand-accent/10 hover:border-brand-accent/50"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-border/50 hover:bg-brand-accent/10 hover:border-brand-accent/50"
                >
                  <List className="h-4 w-4" />
                </Button>
              </motion.div>
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
            <CardTitle className="text-brand">Recent Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {/* Sample Media Items */}
              {[
                { name: "hero-image.jpg", size: "2.4 MB", dimensions: "1920×1080" },
                { name: "project-screenshot.png", size: "1.8 MB", dimensions: "1440×900" }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + (index * 0.1) }}
                  whileHover={{ scale: 1.02 }}
                  className="group relative border border-border/50 rounded-lg overflow-hidden hover:border-brand-accent/50 transition-colors"
                >
                  <div className="aspect-square bg-brand-section/50 flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-brand-muted" />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate text-brand">{item.name}</p>
                    <p className="text-xs text-brand-muted">{item.size} • {item.dimensions}</p>
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button size="sm" variant="secondary">
                        <Download className="h-4 w-4" />
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button size="sm" variant="secondary">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
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
            <CardTitle className="text-brand">Gallery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-brand-muted">Gallery Images</Label>
              <div className="grid grid-cols-3 gap-2">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="aspect-square border-2 border-dashed border-brand-accent/30 rounded-lg flex items-center justify-center hover:bg-brand-section/30 transition-colors"
                >
                  <Plus className="h-6 w-6 text-brand-accent" />
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="aspect-square bg-brand-section/50 rounded-lg flex items-center justify-center border border-border/50"
                >
                  <ImageIcon className="h-6 w-6 text-brand-muted" />
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="aspect-square bg-brand-section/50 rounded-lg flex items-center justify-center border border-border/50"
                >
                  <ImageIcon className="h-6 w-6 text-brand-muted" />
                </motion.div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-brand-muted">Gallery Title</Label>
              <Input 
                placeholder="Optional gallery title..." 
                className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-brand-muted">Gallery Description</Label>
              <Input 
                placeholder="Optional gallery description..." 
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
            <CardTitle className="text-brand">Attachments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-brand-muted">File Attachments</Label>
              <div className="space-y-2">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:bg-brand-section/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-section/50 rounded flex items-center justify-center border border-border/50">
                      <Download className="h-4 w-4 text-brand-muted" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-brand">resume.pdf</p>
                      <p className="text-xs text-brand-muted">245 KB</p>
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button variant="ghost" size="sm" className="hover:bg-destructive/10">
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-brand-accent/50 text-brand-accent hover:bg-brand-accent/10"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Attachment
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}