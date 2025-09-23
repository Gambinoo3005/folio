'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Type, 
  Image as ImageIcon, 
  Link, 
  List, 
  Quote
} from 'lucide-react';

export function MainContent() {
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
            Main Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-brand-muted">Rich Text Editor</Label>
            <div className="border border-border/50 rounded-lg bg-background/50">
              {/* Toolbar */}
              <div className="border-b border-border/50 p-2 flex items-center gap-1 bg-brand-section/30">
                <Button variant="ghost" size="sm" className="hover:bg-brand-accent/10">
                  <Type className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="hover:bg-brand-accent/10">
                  <List className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="hover:bg-brand-accent/10">
                  <Quote className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="hover:bg-brand-accent/10">
                  <Link className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button variant="ghost" size="sm" className="hover:bg-brand-accent/10">
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Editor Area */}
              <div className="p-4 min-h-[200px]">
                <Textarea 
                  placeholder="Start writing your content here..."
                  className="border-none shadow-none resize-none min-h-[150px] focus-visible:ring-0 bg-transparent"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
