'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@portfolio-building-service/ui';
import { Input } from '@portfolio-building-service/ui';
import { Label } from '@portfolio-building-service/ui';
import { Textarea } from '@portfolio-building-service/ui';
import { Badge } from '@portfolio-building-service/ui';
import { Button } from '@portfolio-building-service/ui';
import { 
  Type, 
  FileText, 
  Tag, 
  Calendar,
  User,
  ExternalLink,
  Plus,
  X
} from 'lucide-react';
import { SemanticBlockEditor } from '../blocks/semantic-block-editor';
import { Separator } from '@portfolio-building-service/ui';

interface ContentTabProps {
  // Add props as needed
}

export function ContentTab({}: ContentTabProps) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [author, setAuthor] = useState('');
  const [date, setDate] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [externalLinks, setExternalLinks] = useState<Array<{label: string, url: string}>>([]);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addExternalLink = () => {
    setExternalLinks([...externalLinks, { label: '', url: '' }]);
  };

  const updateExternalLink = (index: number, field: 'label' | 'url', value: string) => {
    const updated = [...externalLinks];
    updated[index][field] = value;
    setExternalLinks(updated);
  };

  const removeExternalLink = (index: number) => {
    setExternalLinks(externalLinks.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Basic Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5 text-primary" />
            Basic Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter the main title..."
              className="text-lg font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Enter a subtitle..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief description or summary..."
              rows={3}
            />
            <p className="text-sm text-muted-foreground">
              {excerpt.length}/200 characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Main Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Content *</Label>
            <SemanticBlockEditor
              content={body}
              onChange={setBody}
              placeholder="Start writing your content here..."
              onValidationChange={setValidationErrors}
            />
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Metadata
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button onClick={addTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* External Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-primary" />
            External Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {externalLinks.map((link, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1 space-y-2">
                <Label>Label</Label>
                <Input
                  value={link.label}
                  onChange={(e) => updateExternalLink(index, 'label', e.target.value)}
                  placeholder="Link label..."
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label>URL</Label>
                <Input
                  value={link.url}
                  onChange={(e) => updateExternalLink(index, 'url', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExternalLink(index)}
                className="text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button onClick={addExternalLink} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Link
          </Button>
        </CardContent>
      </Card>

      {/* Content Guidelines */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Content Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 text-sm space-y-2">
          <p>• Use H2-H4 headings only (H1 is reserved for page titles)</p>
          <p>• Maintain proper heading hierarchy (H2 → H3 → H4)</p>
          <p>• All images must have descriptive alt text</p>
          <p>• Use descriptive link text instead of "click here"</p>
          <p>• Keep paragraphs concise and scannable</p>
        </CardContent>
      </Card>
    </div>
  );
}
