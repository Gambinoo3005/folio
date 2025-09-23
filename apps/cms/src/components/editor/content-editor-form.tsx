'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  Type, 
  Image as ImageIcon, 
  Link, 
  Calendar,
  User,
  Tag,
  Plus,
  X,
  Sparkles,
  Zap
} from 'lucide-react';

// Define the form schema
const contentFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  subtitle: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  heroImage: z.string().optional(),
  heroAlt: z.string().optional(),
  heroCaption: z.string().optional(),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
  author: z.string().default('Your Name'),
  authorBio: z.string().optional(),
  authorEmail: z.string().email('Invalid email').optional(),
  externalUrl: z.string().url('Invalid URL').optional(),
  githubUrl: z.string().url('Invalid URL').optional(),
  demoUrl: z.string().url('Invalid URL').optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  canonicalUrl: z.string().url('Invalid URL').optional(),
  noIndex: z.boolean().default(false),
  featured: z.boolean().default(false),
  public: z.boolean().default(true),
  slug: z.string().optional(),
  publishDate: z.date().optional(),
  publishTime: z.string().optional(),
});

type ContentFormValues = z.infer<typeof contentFormSchema>;

interface ContentEditorFormProps {
  onSubmit?: (data: ContentFormValues) => void;
  initialData?: Partial<ContentFormValues>;
}

export function ContentEditorForm({ onSubmit, initialData }: ContentEditorFormProps) {
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema as any),
    defaultValues: {
      title: '',
      subtitle: '',
      excerpt: '',
      content: '',
      heroImage: '',
      heroAlt: '',
      heroCaption: '',
      tags: [],
      category: '',
      author: 'Your Name',
      authorBio: '',
      authorEmail: '',
      externalUrl: '',
      githubUrl: '',
      demoUrl: '',
      metaTitle: '',
      metaDescription: '',
      canonicalUrl: '',
      noIndex: false,
      featured: false,
      public: true,
      slug: '',
      publishDate: new Date(),
      publishTime: '12:00',
      ...initialData,
    },
  });

  const handleSubmit = (data: ContentFormValues) => {
    console.log('Form submitted:', data);
    onSubmit?.(data);
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !form.getValues('tags').includes(tag.trim())) {
      const currentTags = form.getValues('tags');
      form.setValue('tags', [...currentTags, tag.trim()]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags');
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-border/50 bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-brand">
                <Type className="h-5 w-5 text-brand-accent" />
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
                        placeholder="Enter a compelling title..." 
                        className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-muted">Subtitle</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Optional subtitle or tagline..." 
                        className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-muted">Excerpt</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description or summary..."
                        rows={3}
                        className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-muted">Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Start writing your content here..."
                        rows={10}
                        className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-border/50 bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-brand">
                <ImageIcon className="h-5 w-5 text-brand-accent" />
                Media & Assets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="heroImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-muted">Hero Image URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/image.jpg" 
                        className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heroAlt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-muted">Alt Text</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Describe the image for accessibility..." 
                        className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heroCaption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-muted">Caption</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Optional image caption..." 
                        className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-border/50 bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-brand">
                <Tag className="h-5 w-5 text-brand-accent" />
                Organization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-muted">Category</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Select or enter a category..." 
                        className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label className="text-brand-muted">Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.watch('tags').map((tag) => (
                    <Badge key={tag} className="flex items-center gap-1 bg-brand-accent/10 text-brand-accent border-brand-accent/20">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add a tag..." 
                    className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.target as HTMLInputElement;
                        addTag(input.value);
                        input.value = '';
                      }
                    }}
                  />
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      className="border-brand-accent/50 text-brand-accent hover:bg-brand-accent/10"
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Add a tag..."]') as HTMLInputElement;
                        if (input?.value) {
                          addTag(input.value);
                          input.value = '';
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="border-border/50 bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-brand">
                <User className="h-5 w-5 text-brand-accent" />
                Author Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-muted">Author</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Content author name" 
                        className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="authorBio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-muted">Author Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief author biography..."
                        rows={3}
                        className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="authorEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-muted">Author Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="author@example.com" 
                        className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="border-border/50 bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-brand">
                <Link className="h-5 w-5 text-brand-accent" />
                External Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="externalUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-muted">External URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com" 
                        className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-muted">GitHub URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://github.com/username/repo" 
                        className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="demoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-muted">Demo URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://demo.example.com" 
                        className="border-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="flex justify-end gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              type="button" 
              variant="outline"
              className="border-border/50 hover:bg-brand-accent/10 hover:border-brand-accent/50"
            >
              Save Draft
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              type="submit"
              className="bg-brand-accent hover:bg-brand-accent/90 text-white"
            >
              <Zap className="h-4 w-4 mr-2" />
              Save & Continue
            </Button>
          </motion.div>
        </motion.div>
      </form>
    </Form>
  );
}