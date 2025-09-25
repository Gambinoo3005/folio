'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@portfolio-building-service/ui';
import { Input } from '@portfolio-building-service/ui';
import { Badge } from '@portfolio-building-service/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@portfolio-building-service/ui';
import { Separator } from '@portfolio-building-service/ui';
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
  Search,
  Settings,
  Shield,
  MoreVertical,
  Copy,
  Trash2,
  EyeOff,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@portfolio-building-service/ui';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@portfolio-building-service/ui';

// Import the new tab components we'll create
import { ContentTab } from './tabs/content-tab';
import { MediaTab } from './tabs/media-tab';
import { SeoTab } from './tabs/seo-tab';
import { QualityTab } from './tabs/quality-tab';
import { SettingsTab } from './tabs/settings-tab';

// Import right rail components
import { PublishChecklist } from './right-rail/publish-checklist';
import { ReferencesInspector } from './right-rail/references-inspector';
import { ActivityFeed } from './right-rail/activity-feed';

// Import preview components
import { PreviewPanel } from './preview/preview-panel';

interface OptimizedEditorLayoutProps {
  title?: string;
  status?: 'draft' | 'published' | 'scheduled';
  onSave?: () => void;
  onPublish?: () => void;
  onPreview?: () => void;
  onBack?: () => void;
  onDuplicate?: () => void;
  onUnpublish?: () => void;
  onDelete?: () => void;
  // Preview mode props
  previewTarget?: 'page' | 'item';
  previewId?: string;
  previewSlug?: string;
  // Content type
  contentType?: 'page' | 'item' | 'global';
  // User permissions
  userRole?: 'viewer' | 'editor' | 'admin' | 'owner';
}

export function OptimizedEditorLayout({
  title = 'Untitled',
  status = 'draft',
  onSave,
  onPublish,
  onPreview,
  onBack,
  onDuplicate,
  onUnpublish,
  onDelete,
  previewTarget,
  previewId,
  previewSlug,
  contentType = 'page',
  userRole = 'editor'
}: OptimizedEditorLayoutProps) {
  const [activeTab, setActiveTab] = useState('content');
  const [showPreview, setShowPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [titleValue, setTitleValue] = useState(title);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Autosave functionality
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await onSave?.();
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } finally {
      setIsSaving(false);
    }
  }, [onSave]);

  // Autosave every 5 seconds
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timer = setTimeout(handleSave, 5000);
      return () => clearTimeout(timer);
    }
  }, [hasUnsavedChanges, handleSave]);

  // Track changes
  const handleTitleChange = (value: string) => {
    setTitleValue(value);
    setHasUnsavedChanges(true);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-3 w-3" />;
      case 'scheduled':
        return <Calendar className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
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

  const canPublish = userRole === 'admin' || userRole === 'owner';
  const canEdit = userRole === 'editor' || userRole === 'admin' || userRole === 'owner';
  const isReadOnly = userRole === 'viewer';

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Main Editor Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 relative z-10 ${showPreview ? 'w-1/2' : 'w-full'}`}>
        {/* Editor Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left side: Back button, Title input, Status */}
            <div className="flex items-center gap-4">
              {onBack && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-accent">
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
                    value={titleValue}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="text-lg font-semibold border-none shadow-none px-0 focus-visible:ring-0 bg-transparent"
                    placeholder="Enter title..."
                    disabled={isReadOnly}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge className={`${getStatusColor(status)} border flex items-center gap-1`}>
                    {getStatusIcon(status)}
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                </motion.div>
              </div>
            </div>

            {/* Right side: Autosave indicator, Preview, Publish, Actions */}
            <div className="flex items-center gap-3">
              {/* Autosave Indicator */}
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                {isSaving ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-primary">Saving...</span>
                  </>
                ) : lastSaved ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Saved {formatLastSaved(lastSaved)}</span>
                  </>
                ) : hasUnsavedChanges ? (
                  <>
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span>Unsaved changes</span>
                  </>
                ) : (
                  <>
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>All changes saved</span>
                  </>
                )}
              </motion.div>

              <Separator orientation="vertical" className="h-6" />

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Preview Button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setShowPreview(!showPreview)}
                          className="border-border hover:bg-accent"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {showPreview ? 'Hide' : 'Preview'}
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Toggle split preview</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* External Preview */}
                {previewTarget && previewId && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={onPreview}
                            className="border-border hover:bg-accent"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Live Preview
                          </Button>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Open in new tab</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {/* Publish Button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          size="sm" 
                          onClick={onPublish}
                          disabled={!canPublish}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Publish
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {!canPublish ? (
                        <p>You don't have permission to publish</p>
                      ) : (
                        <p>Publish this {contentType}</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Actions Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hover:bg-accent">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onDuplicate} disabled={isReadOnly}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    {status === 'published' && (
                      <DropdownMenuItem onClick={onUnpublish} disabled={!canPublish}>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Unpublish
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={onDelete} 
                      disabled={!canPublish}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
            className="w-64 border-r border-border bg-muted/30"
          >
            <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full">
              <TabsList className="grid w-full grid-cols-1 h-auto bg-transparent p-0">
                <TabsTrigger 
                  value="content" 
                  className="justify-start h-12 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm border-r border-border"
                >
                  <Type className="h-4 w-4 mr-2" />
                  Content
                </TabsTrigger>
                <TabsTrigger 
                  value="media" 
                  className="justify-start h-12 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm border-r border-border"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Media
                </TabsTrigger>
                <TabsTrigger 
                  value="seo" 
                  className="justify-start h-12 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm border-r border-border"
                >
                  <Search className="h-4 w-4 mr-2" />
                  SEO & Metadata
                </TabsTrigger>
                <TabsTrigger 
                  value="quality" 
                  className="justify-start h-12 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm border-r border-border"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Quality
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="justify-start h-12 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          {/* Main Content Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1 overflow-auto bg-background"
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
                  {activeTab === 'content' && <ContentTab />}
                  {activeTab === 'media' && <MediaTab />}
                  {activeTab === 'seo' && <SeoTab />}
                  {activeTab === 'quality' && <QualityTab />}
                  {activeTab === 'settings' && <SettingsTab />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Rail - Publish Checklist, References, Activity */}
      <div className="w-80 border-l border-border bg-muted/30">
        <Tabs defaultValue="checklist" className="h-full">
          <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 border-b border-border">
            <TabsTrigger value="checklist" className="text-xs">
              Checklist
            </TabsTrigger>
            <TabsTrigger value="references" className="text-xs">
              References
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">
              Activity
            </TabsTrigger>
          </TabsList>
          <TabsContent value="checklist" className="h-full m-0">
            <PublishChecklist />
          </TabsContent>
          <TabsContent value="references" className="h-full m-0">
            <ReferencesInspector />
          </TabsContent>
          <TabsContent value="activity" className="h-full m-0">
            <ActivityFeed />
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Panel */}
      <AnimatePresence>
        {showPreview && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-1/2 border-l border-border bg-background relative z-10"
          >
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold">Preview</h3>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowPreview(false)}
                  className="hover:bg-accent"
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
    </div>
  );
}
