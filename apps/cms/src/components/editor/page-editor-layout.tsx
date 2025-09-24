'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
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
  Search,
  Image as ImageIcon,
  FileText,
  Settings
} from 'lucide-react'
import { PageEditorForm } from './page-editor-form'
import { type PageUpsertInput, type ActionResult } from '@/lib/validation'
import { cmsToasts } from '@/lib/toast'
import { PreviewButton } from './preview-button'
import { PreviewIndicator } from './preview-indicator'

interface PageEditorLayoutProps {
  initialData?: Partial<PageUpsertInput> & { id?: string }
  mode?: 'create' | 'edit'
  onBack?: () => void
}

export function PageEditorLayout({ 
  initialData, 
  mode = 'create',
  onBack 
}: PageEditorLayoutProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('content')
  const [showPreview, setShowPreview] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [pageData, setPageData] = useState(initialData)

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.push('/pages')
    }
  }

  const handleSuccess = (result: ActionResult<{ id: string }>) => {
    if (result.ok && result.data) {
      setPageData(prev => ({ ...prev, id: result.data!.id }))
      setLastSaved(new Date())
      
      // If this was a create operation, redirect to edit mode
      if (mode === 'create') {
        router.push(`/pages/${result.data.id}/edit`)
      }
    }
  }

  const handlePublish = (result: ActionResult) => {
    if (result.ok) {
      setPageData(prev => ({ ...prev, status: 'PUBLISHED' }))
    }
  }

  const handleUnpublish = (result: ActionResult) => {
    if (result.ok) {
      setPageData(prev => ({ ...prev, status: 'DRAFT' }))
    }
  }

  const handleDelete = (result: ActionResult) => {
    if (result.ok) {
      router.push('/pages')
    }
  }

  const handleDuplicate = (result: ActionResult<{ id: string }>) => {
    if (result.ok && result.data) {
      router.push(`/pages/${result.data.id}/edit`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
    }
  }

  const formatLastSaved = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return `${Math.floor(seconds / 3600)}h ago`
  }

  const currentStatus = pageData?.status || 'DRAFT'
  const isPublished = currentStatus === 'PUBLISHED'

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
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="sm" onClick={handleBack} className="hover:bg-brand-accent/10">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </motion.div>
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h1 className="text-lg font-semibold text-brand">
                    {mode === 'create' ? 'Create New Page' : 'Edit Page'}
                  </h1>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge className={`${getStatusColor(currentStatus)} border`}>
                    <Sparkles className="h-3 w-3 mr-1" />
                    {currentStatus}
                  </Badge>
                </motion.div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Preview Indicator */}
              <PreviewIndicator />
              
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
                {/* Preview Button */}
                {pageData?.id && (
                  <PreviewButton
                    target="page"
                    id={pageData.id}
                    slug={pageData.slug}
                  />
                )}
                
                {/* Local Preview Toggle */}
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
                    {showPreview ? 'Hide' : 'Local Preview'}
                  </Button>
                </motion.div>
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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="grid w-full grid-cols-1 h-auto bg-transparent p-0">
                <TabsTrigger 
                  value="content" 
                  className="justify-start h-12 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm border-r border-border/50"
                >
                  <Type className="h-4 w-4 mr-2" />
                  Content
                </TabsTrigger>
                <TabsTrigger 
                  value="seo" 
                  className="justify-start h-12 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm border-r border-border/50"
                >
                  <Search className="h-4 w-4 mr-2" />
                  SEO
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
                    <PageEditorForm
                      initialData={pageData}
                      mode={mode}
                      onSuccess={handleSuccess}
                      onPublish={handlePublish}
                      onUnpublish={handleUnpublish}
                      onDelete={handleDelete}
                      onDuplicate={handleDuplicate}
                    />
                  )}
                  {activeTab === 'seo' && (
                    <div className="space-y-4">
                      <Card className="border-border/50 bg-background/50 backdrop-blur">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-brand">
                            <Search className="h-5 w-5 text-brand-accent" />
                            SEO Settings
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">
                            SEO settings are included in the main form. Switch to the Content tab to edit them.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  {activeTab === 'settings' && (
                    <div className="space-y-4">
                      <Card className="border-border/50 bg-background/50 backdrop-blur">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-brand">
                            <Settings className="h-5 w-5 text-brand-accent" />
                            Page Settings
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">
                            Page settings are included in the main form. Switch to the Content tab to edit them.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
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
            <div className="h-full overflow-auto p-6">
              <div className="prose max-w-none">
                <h1>{pageData?.title || 'Untitled Page'}</h1>
                <div className="text-muted-foreground">
                  {typeof pageData?.body === 'string' 
                    ? pageData.body 
                    : JSON.stringify(pageData?.body, null, 2)
                  }
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
