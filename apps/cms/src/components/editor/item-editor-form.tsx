'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { 
  FileText, 
  Search,
  Save,
  Send,
  Eye,
  Copy,
  Trash2,
  Type,
  Image as ImageIcon,
  Tag
} from 'lucide-react'
import { ItemUpsertSchema, type ItemUpsertInput } from '@/lib/validation'
import { cmsToasts } from '@/lib/toast'
import { 
  createItem, 
  updateItem, 
  publishItem, 
  unpublishItem,
  deleteItem,
  type ActionResult 
} from '@/server/actions'

interface ItemEditorFormProps {
  initialData?: Partial<ItemUpsertInput> & { id?: string; collectionId?: string }
  onSuccess?: (result: ActionResult<{ id: string }>) => void
  onPublish?: (result: ActionResult) => void
  onUnpublish?: (result: ActionResult) => void
  onDelete?: (result: ActionResult) => void
  mode?: 'create' | 'edit'
}

export function ItemEditorForm({ 
  initialData, 
  onSuccess, 
  onPublish, 
  onUnpublish,
  onDelete,
  mode = 'create' 
}: ItemEditorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const form = useForm<ItemUpsertInput>({
    resolver: zodResolver(ItemUpsertSchema as any),
    defaultValues: {
      title: '',
      slug: '',
      status: 'DRAFT',
      content: {},
      seo: {},
      mediaRefs: [],
      ...initialData,
    },
  })

  const handleSubmit = async (data: ItemUpsertInput) => {
    setIsSubmitting(true)
    try {
      let result: ActionResult<{ id: string }>
      
      if (mode === 'create') {
        result = await createItem({ ...data, collectionId: initialData?.collectionId! })
      } else {
        result = await updateItem({ ...data, id: initialData?.id! })
      }

      if (result.ok) {
        setLastSaved(new Date())
        cmsToasts.contentSaved()
        onSuccess?.(result)
      } else {
        // Handle validation errors
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            form.setError(field as keyof ItemUpsertInput, {
              type: 'manual',
              message: messages[0],
            })
          })
        }
        cmsToasts.error('Failed to save item', result.message)
      }
    } catch (error) {
      console.error('Failed to save item:', error)
      cmsToasts.unexpectedError()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePublish = async () => {
    if (!initialData?.id) return
    
    setIsPublishing(true)
    try {
      const result = await publishItem(initialData.id)
      
      if (result.ok) {
        cmsToasts.contentPublished()
        form.setValue('status', 'PUBLISHED')
        onPublish?.(result)
      } else {
        cmsToasts.error('Failed to publish item', result.message)
      }
    } catch (error) {
      console.error('Failed to publish item:', error)
      cmsToasts.unexpectedError()
    } finally {
      setIsPublishing(false)
    }
  }

  const handleUnpublish = async () => {
    if (!initialData?.id) return
    
    setIsPublishing(true)
    try {
      const result = await unpublishItem(initialData.id)
      
      if (result.ok) {
        cmsToasts.success('Item unpublished', 'The item is no longer live')
        form.setValue('status', 'DRAFT')
        onUnpublish?.(result)
      } else {
        cmsToasts.error('Failed to unpublish item', result.message)
      }
    } catch (error) {
      console.error('Failed to unpublish item:', error)
      cmsToasts.unexpectedError()
    } finally {
      setIsPublishing(false)
    }
  }

  const handleDelete = async () => {
    if (!initialData?.id) return
    
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return
    }
    
    setIsDeleting(true)
    try {
      const result = await deleteItem(initialData.id)
      
      if (result.ok) {
        cmsToasts.contentDeleted()
        onDelete?.(result)
      } else {
        cmsToasts.error('Failed to delete item', result.message)
      }
    } catch (error) {
      console.error('Failed to delete item:', error)
      cmsToasts.unexpectedError()
    } finally {
      setIsDeleting(false)
    }
  }

  const generateSlug = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    form.setValue('slug', slug)
  }

  const currentStatus = form.watch('status')
  const isPublished = currentStatus === 'PUBLISHED'

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-border/50 bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-brand">
                <FileText className="h-5 w-5 text-brand-accent" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-muted">Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter item title..." 
                        className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          if (!form.getValues('slug')) {
                            generateSlug(e.target.value)
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-muted">URL Slug</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="item-slug" 
                          className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => generateSlug(form.getValues('title'))}
                          className="border-brand-accent/50 text-brand-accent hover:bg-brand-accent/10"
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      This will be the URL path for your item
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Status</FormLabel>
                      <FormDescription>
                        {isPublished ? 'This item is live on your site' : 'This item is saved as a draft'}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Badge variant={isPublished ? 'default' : 'secondary'}>
                        {field.value}
                      </Badge>
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-border/50 bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-brand">
                <Type className="h-5 w-5 text-brand-accent" />
                Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-muted">Item Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter your item content here..."
                        rows={10}
                        className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
                        value={typeof field.value === 'string' ? field.value : JSON.stringify(field.value, null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value)
                            field.onChange(parsed)
                          } catch {
                            field.onChange(e.target.value)
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      You can enter plain text or JSON for structured content
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* SEO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-border/50 bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-brand">
                <Search className="h-5 w-5 text-brand-accent" />
                SEO & Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="seo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-muted">SEO Data (JSON)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter SEO metadata as JSON..."
                        rows={5}
                        className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20 font-mono text-sm"
                        value={JSON.stringify(field.value, null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value)
                            field.onChange(parsed)
                          } catch {
                            field.onChange(e.target.value)
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      SEO metadata in JSON format
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div 
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex gap-2">
            {mode === 'edit' && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-accent hover:bg-brand-accent/90 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
            
            {mode === 'edit' && (
              <>
                {isPublished ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleUnpublish}
                    disabled={isPublishing}
                    className="border-amber-200 text-amber-600 hover:bg-amber-50 hover:border-amber-300"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {isPublishing ? 'Unpublishing...' : 'Unpublish'}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isPublishing ? 'Publishing...' : 'Publish'}
                  </Button>
                )}
              </>
            )}
          </div>
        </motion.div>

        {/* Last Saved Indicator */}
        {lastSaved && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground text-center"
          >
            Last saved {lastSaved.toLocaleTimeString()}
          </motion.div>
        )}
      </form>
    </Form>
  )
}
