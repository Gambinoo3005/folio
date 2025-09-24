'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft,
  FileText,
  Sparkles,
  Type,
  Search,
  Settings
} from 'lucide-react'
import { ItemEditorForm } from './item-editor-form'
import { type ItemUpsertInput, type ActionResult } from '@/lib/validation'

interface ItemEditorLayoutProps {
  initialData?: Partial<ItemUpsertInput> & { id?: string; collectionId?: string }
  mode?: 'create' | 'edit'
  onBack?: () => void
}

export function ItemEditorLayout({ 
  initialData, 
  mode = 'create',
  onBack 
}: ItemEditorLayoutProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('content')
  const [showPreview, setShowPreview] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [itemData, setItemData] = useState(initialData)

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.push('/collections')
    }
  }

  const handleSuccess = (result: ActionResult<{ id: string }>) => {
    if (result.ok && result.data) {
      setItemData(prev => ({ ...prev, id: result.data!.id }))
      setLastSaved(new Date())
      
      // If this was a create operation, redirect to edit mode
      if (mode === 'create') {
        router.push(`/collections/${initialData?.collectionId}/items/${result.data.id}/edit`)
      }
    }
  }

  const handlePublish = (result: ActionResult) => {
    if (result.ok) {
      setItemData(prev => ({ ...prev, status: 'PUBLISHED' }))
    }
  }

  const handleUnpublish = (result: ActionResult) => {
    if (result.ok) {
      setItemData(prev => ({ ...prev, status: 'DRAFT' }))
    }
  }

  const handleDelete = (result: ActionResult) => {
    if (result.ok) {
      router.push(`/collections/${initialData?.collectionId}`)
    }
  }

  const currentStatus = itemData?.status || 'DRAFT'
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
                    {mode === 'create' ? 'Create New Item' : 'Edit Item'}
                  </h1>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 border">
                    <FileText className="h-3 w-3 mr-1" />
                    {currentStatus}
                  </Badge>
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
                    <ItemEditorForm
                      initialData={itemData}
                      mode={mode}
                      onSuccess={handleSuccess}
                      onPublish={handlePublish}
                      onUnpublish={handleUnpublish}
                      onDelete={handleDelete}
                    />
                  )}
                  {activeTab === 'seo' && (
                    <div className="space-y-4">
                      <div className="text-center py-8 text-muted-foreground">
                        <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>SEO settings are included in the main form</p>
                        <p className="text-sm">Switch to the Content tab to edit them</p>
                      </div>
                    </div>
                  )}
                  {activeTab === 'settings' && (
                    <div className="space-y-4">
                      <div className="text-center py-8 text-muted-foreground">
                        <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Item settings are included in the main form</p>
                        <p className="text-sm">Switch to the Content tab to edit them</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
