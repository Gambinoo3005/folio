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
  Globe, 
  Save,
  Navigation,
  Square,
  Share2,
  Settings
} from 'lucide-react'
import { GlobalUpsertSchema, type GlobalUpsertInput } from '@/lib/validation'
import { cmsToasts } from '@/lib/toast'
import { 
  upsertGlobal,
  type ActionResult 
} from '@/server/actions'

interface GlobalEditorFormProps {
  initialData?: Partial<GlobalUpsertInput> & { id?: string }
  onSuccess?: (result: ActionResult<{ id: string }>) => void
  globalKey?: string
}

export function GlobalEditorForm({ 
  initialData, 
  onSuccess,
  globalKey 
}: GlobalEditorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const form = useForm<GlobalUpsertInput>({
    resolver: zodResolver(GlobalUpsertSchema as any),
    defaultValues: {
      key: globalKey || '',
      data: {},
      ...initialData,
    },
  })

  const handleSubmit = async (data: GlobalUpsertInput) => {
    setIsSubmitting(true)
    try {
      const result = await upsertGlobal(data)

      if (result.ok) {
        setLastSaved(new Date())
        cmsToasts.success('Global saved', 'Your global settings have been saved successfully')
        onSuccess?.(result)
      } else {
        // Handle validation errors
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            form.setError(field as keyof GlobalUpsertInput, {
              type: 'manual',
              message: messages[0],
            })
          })
        }
        cmsToasts.error('Failed to save global', result.message)
      }
    } catch (error) {
      console.error('Failed to save global:', error)
      cmsToasts.unexpectedError()
    } finally {
      setIsSubmitting(false)
    }
  }

  const getGlobalIcon = (key: string) => {
    switch (key) {
      case 'navigation':
        return Navigation
      case 'footer':
        return Square
      case 'social':
        return Share2
      default:
        return Globe
    }
  }

  const getGlobalTitle = (key: string) => {
    switch (key) {
      case 'navigation':
        return 'Navigation'
      case 'footer':
        return 'Footer'
      case 'social':
        return 'Social Links'
      case 'seo_defaults':
        return 'SEO Defaults'
      default:
        return key.charAt(0).toUpperCase() + key.slice(1)
    }
  }

  const getGlobalDescription = (key: string) => {
    switch (key) {
      case 'navigation':
        return 'Main site navigation menu'
      case 'footer':
        return 'Footer content and links'
      case 'social':
        return 'Social media profiles'
      case 'seo_defaults':
        return 'Default SEO settings'
      default:
        return 'Global site settings'
    }
  }

  const getDefaultData = (key: string) => {
    switch (key) {
      case 'navigation':
        return {
          items: [
            { label: 'Home', url: '/', external: false },
            { label: 'About', url: '/about', external: false },
            { label: 'Contact', url: '/contact', external: false }
          ]
        }
      case 'footer':
        return {
          copyright: '© 2024 Your Company. All rights reserved.',
          links: [
            { label: 'Privacy Policy', url: '/privacy', external: false },
            { label: 'Terms of Service', url: '/terms', external: false }
          ],
          socialLinks: []
        }
      case 'social':
        return {
          platforms: [
            { name: 'Twitter', url: '', username: '', verified: false },
            { name: 'LinkedIn', url: '', username: '', verified: false },
            { name: 'GitHub', url: '', username: '', verified: false }
          ]
        }
      case 'seo_defaults':
        return {
          title: 'Your Site Title',
          description: 'Your site description',
          keywords: [],
          ogImageId: null,
          twitterHandle: '',
          siteName: 'Your Site Name'
        }
      default:
        return {}
    }
  }

  const Icon = getGlobalIcon(globalKey || '')
  const title = getGlobalTitle(globalKey || '')
  const description = getGlobalDescription(globalKey || '')

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Global Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-border/50 bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-brand">
                <Icon className="h-5 w-5 text-brand-accent" />
                {title}
              </CardTitle>
              <p className="text-muted-foreground">{description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-muted">Global Key</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="global-key" 
                        className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
                        {...field}
                        disabled={!!globalKey} // Disable if key is provided
                      />
                    </FormControl>
                    <FormDescription>
                      Unique identifier for this global setting
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-border/50 bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-brand">
                <Settings className="h-5 w-5 text-brand-accent" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-muted">Data (JSON)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter JSON configuration..."
                        rows={15}
                        className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20 font-mono text-sm"
                        value={JSON.stringify(field.value, null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value)
                            field.onChange(parsed)
                          } catch {
                            // Keep the string value if JSON is invalid
                            field.onChange(e.target.value)
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter valid JSON configuration for this global setting
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const defaultData = getDefaultData(globalKey || '')
                    form.setValue('data', defaultData)
                  }}
                  className="border-brand-accent/50 text-brand-accent hover:bg-brand-accent/10"
                >
                  Load Default
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentData = form.getValues('data')
                    form.setValue('data', {})
                    setTimeout(() => form.setValue('data', currentData), 100)
                  }}
                  className="border-brand-accent/50 text-brand-accent hover:bg-brand-accent/10"
                >
                  Format JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div 
          className="flex justify-end"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="bg-brand-accent hover:bg-brand-accent/90 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save Global'}
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
