'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  User,
  Tag,
  ExternalLink,
  Github,
  Eye,
  ArrowLeft,
  Sparkles,
  Zap
} from 'lucide-react';

export function PreviewPanel() {
  return (
    <div className="p-6 space-y-6">
      {/* Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="ghost" 
            size="sm"
            className="hover:bg-brand-accent/10 text-brand-muted hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Editor
          </Button>
        </motion.div>
        <div className="text-sm text-brand-muted flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Preview Mode
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="aspect-video bg-gradient-to-br from-brand-accent to-brand-accent/80 rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
              `,
                backgroundSize: "20px 20px",
              }}
            />
          </div>
          <div className="text-center text-white relative z-10">
            <h1 className="text-4xl font-bold mb-2">Sample Project Title</h1>
            <p className="text-xl opacity-90">A compelling project subtitle</p>
          </div>
        </div>
      </motion.div>

      {/* Project Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-border/50 bg-background/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-brand-muted">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Published March 15, 2024</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>Your Name</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge className="bg-brand-accent/10 text-brand-accent border-brand-accent/20">
                  Web Development
                </Badge>
                <Badge className="bg-brand-accent/10 text-brand-accent border-brand-accent/20">
                  React
                </Badge>
                <Badge className="bg-brand-accent/10 text-brand-accent border-brand-accent/20">
                  TypeScript
                </Badge>
                <Badge className="bg-brand-accent/10 text-brand-accent border-brand-accent/20">
                  Next.js
                </Badge>
              </div>

              <div className="flex gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-brand-accent/50 text-brand-accent hover:bg-brand-accent/10"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-brand-accent/50 text-brand-accent hover:bg-brand-accent/10"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    View Code
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="prose prose-gray max-w-none"
      >
        <h2 className="text-brand">Project Overview</h2>
        <p className="text-brand-muted">
          This is a sample project that demonstrates the capabilities of our portfolio CMS. 
          The content here would be dynamically generated from the editor form fields.
        </p>
        
        <h3 className="text-brand">Key Features</h3>
        <ul className="text-brand-muted">
          <li>Responsive design that works on all devices</li>
          <li>Modern React architecture with TypeScript</li>
          <li>Optimized performance and SEO</li>
          <li>Accessible user interface</li>
        </ul>

        <h3 className="text-brand">Technical Stack</h3>
        <p className="text-brand-muted">
          Built with Next.js, React, TypeScript, and Tailwind CSS. The project 
          demonstrates modern web development practices and clean code architecture.
        </p>

        <blockquote className="border-l-4 border-brand-accent bg-brand-section/30 p-4 rounded-r-lg">
          <p className="text-brand-muted italic">
            "This project showcases the power of modern web technologies and 
            demonstrates best practices in frontend development."
          </p>
        </blockquote>

        <h3 className="text-brand">Results</h3>
        <p className="text-brand-muted">
          The project achieved significant improvements in performance, user experience, 
          and maintainability. It serves as a great example of what's possible with 
          the right tools and approach.
        </p>
      </motion.div>

      {/* Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-border/50 bg-background/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-brand">Project Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <motion.div 
                  key={item}
                  whileHover={{ scale: 1.02 }}
                  className="aspect-video bg-brand-section/50 rounded-lg flex items-center justify-center border border-border/50"
                >
                  <Eye className="h-8 w-8 text-brand-muted" />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Related Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-border/50 bg-background/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-brand">Related Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {[
                { title: "Another Project", description: "Brief description of another related project..." },
                { title: "Third Project", description: "Another project that showcases similar skills..." }
              ].map((project, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="flex gap-4 p-4 border border-border/50 rounded-lg hover:bg-brand-section/30 transition-colors"
                >
                  <div className="w-20 h-20 bg-brand-section/50 rounded-lg flex items-center justify-center border border-border/50">
                    <Eye className="h-6 w-6 text-brand-muted" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-brand">{project.title}</h4>
                    <p className="text-sm text-brand-muted">
                      {project.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="pt-6 border-t border-border/50 text-center text-sm text-brand-muted"
      >
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-accent" />
          <p>This is a preview of how your content will appear on the live site.</p>
        </div>
      </motion.div>
    </div>
  );
}