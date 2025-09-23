'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon } from 'lucide-react';

export function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border/50 bg-background/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand">
            <ImageIcon className="h-5 w-5 text-brand-accent" />
            Hero Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-brand-muted">Hero Image</Label>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="border-2 border-dashed border-brand-accent/30 rounded-lg p-8 text-center bg-brand-section/30 hover:bg-brand-section/50 transition-colors"
            >
              <ImageIcon className="h-12 w-12 mx-auto text-brand-accent mb-4" />
              <p className="text-sm text-brand-muted mb-2">
                Drag and drop an image here, or click to browse
              </p>
              <Button 
                variant="outline" 
                size="sm"
                className="border-brand-accent/50 text-brand-accent hover:bg-brand-accent/10"
              >
                Choose Image
              </Button>
            </motion.div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-alt" className="text-brand-muted">Alt Text</Label>
            <Input 
              id="hero-alt" 
              placeholder="Describe the image for accessibility..."
              className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-caption" className="text-brand-muted">Caption (Optional)</Label>
            <Input 
              id="hero-caption" 
              placeholder="Optional image caption..."
              className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
