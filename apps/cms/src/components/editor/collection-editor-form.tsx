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
  FolderOpen, 
  Search,
  Save,
  Plus,
  X,
  Type,
  Image as ImageIcon,
  Calendar,
  Tag,
  CheckSquare,
  Settings
} from 'lucide-react'
import { CollectionUpsertSchema, type CollectionUpsertInput, type CollectionFieldConfig } from '@/lib/validation'
import { cmsToasts } from '@/lib/toast'
import { 
  createCollection, 
  updateCollection,
  type ActionResult 
} from '@/server/actions'

interface CollectionEditorFormProps {
  initialData?: Partial<CollectionUpsertInput> & { id?: string }
  onSuccess?: (result: ActionResult<{ id: string }>) => void
  mode?: 'create' | 'edit'
}

export function CollectionEditorForm({ 
  initialData, 
  onSuccess, 
  mode = 'create' 
}: CollectionEditorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const form = useForm<CollectionUpsertInput>({
    resolver: zodResolver(CollectionUpsertSchema as any),
    defaultValues: {
      name: '',
      slug: '',
      config: {
        fields: [
          {
            name: 'title',
            type: 'text',
            required: true,
            placeholder: 'Enter title...',
            helpText: 'The main title for this item'
          }
        ],
        displayField: 'title',
        sortField: 'title',
        sortOrder: 'asc'
      },
      ...initialData,
    },
  })

  const handleSubmit = async (data: CollectionUpsertInput) => {
    setIsSubmitting(true)
    try {
      let result: ActionResult<{ id: string }>
      
      if (mode === 'create') {
        result = await createCollection(data)
      } else {
        result = await updateCollection({ ...data, id: initialData?.id! })
      }

      if (result.ok) {
        setLastSaved(new Date())
        cmsToasts.success('Collection saved', 'Your collection has been saved successfully')
        onSuccess?.(result)
      } else {
        // Handle validation errors
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            form.setError(field as keyof CollectionUpsertInput, {
              type: 'manual',
              message: messages[0],
            })
          })
        }
        cmsToasts.error('Failed to save collection', result.message)
      }
    } catch (error) {
      console.error('Failed to save collection:', error)
      cmsToasts.unexpectedError()
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateSlug = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    form.setValue('slug', slug)
  }

  const addField = () => {
    const currentFields = form.getValues('config.fields') || []
    const newField: CollectionFieldConfig = {
      name: `field_${Date.now()}`,
      type: 'text',
      required: false,
      placeholder: '',
      helpText: ''
    }
    form.setValue('config.fields', [...currentFields, newField])
  }

  const removeField = (index: number) => {
    const currentFields = form.getValues('config.fields') || []
    const newFields = currentFields.filter((_: any, i: number) => i !== index)
    form.setValue('config.fields', newFields)
  }

  const updateField = (index: number, field: Partial<CollectionFieldConfig>) => {
    const currentFields = form.getValues('config.fields') || []
    const newFields = [...currentFields]
    newFields[index] = { ...newFields[index], ...field }
    form.setValue('config.fields', newFields)
  }

  const fieldTypes = [
    { value: 'text', label: 'Text', icon: Type },
    { value: 'textarea', label: 'Textarea', icon: Type },
    { value: 'rich_text', label: 'Rich Text', icon: Type },
    { value: 'image', label: 'Image', icon: ImageIcon },
    { value: 'gallery', label: 'Gallery', icon: ImageIcon },
    { value: 'date', label: 'Date', icon: Calendar },
    { value: 'boolean', label: 'Boolean', icon: CheckSquare },
    { value: 'select', label: 'Select', icon: Tag },
    { value: 'multiselect', label: 'Multi-select', icon: Tag },
  ]

  const config = form.watch('config')

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
                <FolderOpen className="h-5 w-5 text-brand-accent" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-muted">Collection Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter collection name..." 
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
                          placeholder="collection-slug" 
                          className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => generateSlug(form.getValues('name'))}
                          className="border-brand-accent/50 text-brand-accent hover:bg-brand-accent/10"
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      This will be used in URLs and API endpoints
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Field Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-border/50 bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-brand">
                <div className="flex items-center gap-2">
                  <Type className="h-5 w-5 text-brand-accent" />
                  Field Configuration
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addField}
                  className="border-brand-accent/50 text-brand-accent hover:bg-brand-accent/10"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.fields?.map((field: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-border/50 rounded-lg bg-background/30"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-brand">Field {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeField(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-brand-muted mb-1 block">
                        Field Name
                      </label>
                      <Input
                        value={field.name}
                        onChange={(e) => updateField(index, { name: e.target.value })}
                        placeholder="field_name"
                        className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-brand-muted mb-1 block">
                        Field Type
                      </label>
                      <select
                        value={field.type}
                        onChange={(e) => updateField(index, { type: e.target.value as any })}
                        className="w-full px-3 py-2 border border-border/50 rounded-md focus:border-brand-accent/50 focus:ring-brand-accent/20 bg-background"
                      >
                        {fieldTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="text-sm font-medium text-brand-muted mb-1 block">
                        Placeholder
                      </label>
                      <Input
                        value={field.placeholder || ''}
                        onChange={(e) => updateField(index, { placeholder: e.target.value })}
                        placeholder="Enter placeholder text..."
                        className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-brand-muted mb-1 block">
                        Help Text
                      </label>
                      <Input
                        value={field.helpText || ''}
                        onChange={(e) => updateField(index, { helpText: e.target.value })}
                        placeholder="Help text for users..."
                        className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(index, { required: e.target.checked })}
                        className="rounded border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
                      />
                      <span className="text-sm font-medium text-brand-muted">Required field</span>
                    </label>
                  </div>
                </motion.div>
              ))}
              
              {(!config.fields || config.fields.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  <Type className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No fields configured yet</p>
                  <p className="text-sm">Add fields to define the structure of your collection</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Collection Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-border/50 bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-brand">
                <Settings className="h-5 w-5 text-brand-accent" />
                Collection Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-brand-muted mb-1 block">
                    Display Field
                  </label>
                  <select
                    value={config.displayField || ''}
                    onChange={(e) => form.setValue('config.displayField', e.target.value)}
                    className="w-full px-3 py-2 border border-border/50 rounded-md focus:border-brand-accent/50 focus:ring-brand-accent/20 bg-background"
                  >
                    <option value="">Select a field...</option>
                    {config.fields?.map((field: any) => (
                      <option key={field.name} value={field.name}>
                        {field.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-brand-muted mb-1 block">
                    Sort Field
                  </label>
                  <select
                    value={config.sortField || ''}
                    onChange={(e) => form.setValue('config.sortField', e.target.value)}
                    className="w-full px-3 py-2 border border-border/50 rounded-md focus:border-brand-accent/50 focus:ring-brand-accent/20 bg-background"
                  >
                    <option value="">Select a field...</option>
                    {config.fields?.map((field: any) => (
                      <option key={field.name} value={field.name}>
                        {field.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-brand-muted mb-1 block">
                  Sort Order
                </label>
                <select
                  value={config.sortOrder || 'asc'}
                  onChange={(e) => form.setValue('config.sortOrder', e.target.value as 'asc' | 'desc')}
                  className="w-full px-3 py-2 border border-border/50 rounded-md focus:border-brand-accent/50 focus:ring-brand-accent/20 bg-background"
                >
                  <option value="asc">Ascending (A-Z)</option>
                  <option value="desc">Descending (Z-A)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div 
          className="flex justify-end"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="bg-brand-accent hover:bg-brand-accent/90 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save Collection'}
          </Button>
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
