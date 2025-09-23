'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  Eye, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  X,
  ArrowLeft,
  Sparkles,
  Zap,
  Type,
  Image as ImageIcon,
  FileText,
  List
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ContentTab } from './content-tab';
import { MediaTab } from './media-tab';
import { SeoTab } from './seo-tab';
import { SettingsTab } from './settings-tab';
import { ChecklistButton } from './checklist-button';
import { ChecklistDialog } from './checklist-dialog';
import { PreviewPanel } from './preview-panel';

interface EditorLayoutProps {
  title?: string;
  status?: 'draft' | 'published' | 'scheduled';
  onSave?: () => void;
  onPublish?: () => void;
  onPreview?: () => void;
  onBack?: () => void;
}

export function EditorLayout({
  title = 'Untitled',
  status = 'draft',
  onSave,
  onPublish,
  onPreview,
  onBack
}: EditorLayoutProps) {
  const [activeTab, setActiveTab] = useState('content');
  const [activeContentSubcategory, setActiveContentSubcategory] = useState('basic');
  const [showPreview, setShowPreview] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave?.();
      setLastSaved(new Date());
    } finally {
      setIsSaving(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset to basic content when switching away from content tab
    if (value !== 'content') {
      setActiveContentSubcategory('basic');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
    }
  };

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="flex h-screen bg-brand overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(5, 150, 105, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(5, 150, 105, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Main Editor Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 relative z-10 ${showPreview ? 'w-1/2' : 'w-full'}`}>
        {/* Editor Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              {onBack && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-brand-accent/10">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Input
                    value={title}
                    className="text-lg font-semibold border-none shadow-none px-0 focus-visible:ring-0 bg-transparent text-brand"
                    placeholder="Enter title..."
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge className={`${getStatusColor(status)} border`}>
                    <Sparkles className="h-3 w-3 mr-1" />
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                </motion.div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Autosave Indicator */}
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 text-sm text-brand-muted"
              >
                {isSaving ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin text-brand-accent" />
                    <span className="text-brand-accent">Saving...</span>
                  </>
                ) : lastSaved ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Saved {formatLastSaved(lastSaved)}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span>Unsaved changes</span>
                  </>
                )}
              </motion.div>

              <Separator orientation="vertical" className="h-6" />

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSave}
                    className="border-border/50 hover:bg-brand-accent/10 hover:border-brand-accent/50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowPreview(!showPreview)}
                    className="border-border/50 hover:bg-brand-accent/10 hover:border-brand-accent/50"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {showPreview ? 'Hide' : 'Preview'}
                  </Button>
                </motion.div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          size="sm" 
                          disabled
                          className="opacity-50 bg-brand-accent hover:bg-brand-accent/90 text-white"
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Publish
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Not yet connected to database</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Editor Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Tabs */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-64 border-r border-border/50 bg-brand-section/50"
          >
            <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full">
              <TabsList className="grid w-full grid-cols-1 h-auto bg-transparent p-0">
                <div>
                  <TabsTrigger 
                    value="content" 
                    className="justify-start h-12 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm border-r border-border/50"
                  >
                    Content
                  </TabsTrigger>
                  {/* Content Subcategories */}
                  {activeTab === 'content' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-r border-border/50"
                    >
                      <div className="space-y-1 py-2">
                        <Button
                          variant={activeContentSubcategory === 'basic' ? 'secondary' : 'ghost'}
                          size="sm"
                          className="w-full justify-start h-8 px-8 text-sm font-normal"
                          onClick={() => setActiveContentSubcategory('basic')}
                        >
                          <Type className="h-3 w-3 mr-2" />
                          Basic Content
                        </Button>
                        <Button
                          variant={activeContentSubcategory === 'hero' ? 'secondary' : 'ghost'}
                          size="sm"
                          className="w-full justify-start h-8 px-8 text-sm font-normal"
                          onClick={() => setActiveContentSubcategory('hero')}
                        >
                          <ImageIcon className="h-3 w-3 mr-2" />
                          Hero Section
                        </Button>
                        <Button
                          variant={activeContentSubcategory === 'main' ? 'secondary' : 'ghost'}
                          size="sm"
                          className="w-full justify-start h-8 px-8 text-sm font-normal"
                          onClick={() => setActiveContentSubcategory('main')}
                        >
                          <FileText className="h-3 w-3 mr-2" />
                          Main Content
                        </Button>
                        <Button
                          variant={activeContentSubcategory === 'tags' ? 'secondary' : 'ghost'}
                          size="sm"
                          className="w-full justify-start h-8 px-8 text-sm font-normal"
                          onClick={() => setActiveContentSubcategory('tags')}
                        >
                          <List className="h-3 w-3 mr-2" />
                          Tags & Categories
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
                <TabsTrigger 
                  value="media" 
                  className="justify-start h-12 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm border-r border-border/50"
                >
                  Media
                </TabsTrigger>
                <TabsTrigger 
                  value="seo" 
                  className="justify-start h-12 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm border-r border-border/50"
                >
                  SEO & Metadata
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="justify-start h-12 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  Settings
                </TabsTrigger>
              </TabsList>

            </Tabs>
          </motion.div>

          {/* Main Content Area - Shows Active Tab Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1 overflow-auto bg-background/50"
          >
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'content' && (
                    <ContentTab activeSubcategory={activeContentSubcategory} />
                  )}
                  {activeTab === 'media' && <MediaTab />}
                  {activeTab === 'seo' && <SeoTab />}
                  {activeTab === 'settings' && <SettingsTab />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Preview Panel */}
      <AnimatePresence>
        {showPreview && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-1/2 border-l border-border/50 bg-background relative z-10"
          >
            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-brand-section/50">
              <h3 className="font-semibold text-brand">Preview</h3>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowPreview(false)}
                  className="hover:bg-brand-accent/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
            <div className="h-full overflow-auto">
              <PreviewPanel />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checklist Button */}
      <ChecklistButton
        completedItems={8}
        totalItems={10}
        hasErrors={true}
        hasWarnings={true}
        onClick={() => setShowChecklist(true)}
      />

      {/* Checklist Dialog */}
      <ChecklistDialog
        isOpen={showChecklist}
        onClose={() => setShowChecklist(false)}
      />
    </div>
  );
}