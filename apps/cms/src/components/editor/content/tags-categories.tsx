'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { List, Plus, X } from 'lucide-react';

export function TagsCategories() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border/50 bg-background/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand">
            <List className="h-5 w-5 text-brand-accent" />
            Tags & Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-brand-muted">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="secondary" className="flex items-center gap-1 bg-brand-accent/10 text-brand-accent border-brand-accent/20">
                web-development
                <X className="h-3 w-3 cursor-pointer hover:text-destructive" />
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1 bg-brand-accent/10 text-brand-accent border-brand-accent/20">
                react
                <X className="h-3 w-3 cursor-pointer hover:text-destructive" />
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
                  <Plus className="h-4 w-4" />
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
