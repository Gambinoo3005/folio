'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Type } from 'lucide-react';

export function BasicContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border/50 bg-background/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand">
            <Type className="h-5 w-5 text-brand-accent" />
            Basic Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-brand-muted">Title</Label>
            <Input 
              id="title" 
              placeholder="Enter a compelling title..."
              className="text-lg border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subtitle" className="text-brand-muted">Subtitle</Label>
            <Input 
              id="subtitle" 
              placeholder="Optional subtitle or tagline..."
              className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt" className="text-brand-muted">Excerpt</Label>
            <Textarea 
              id="excerpt" 
              placeholder="Brief description or summary..."
              rows={3}
              className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
