'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@portfolio-building-service/ui';
import { Input } from '@portfolio-building-service/ui';
import { Label } from '@portfolio-building-service/ui';
import { Textarea } from '@portfolio-building-service/ui';
import { Button } from '@portfolio-building-service/ui';
import { Badge } from '@portfolio-building-service/ui';
import { Switch } from '@portfolio-building-service/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@portfolio-building-service/ui';
import { 
  Settings, 
  Calendar,
  Hash,
  Link as LinkIcon,
  Tag,
  Database,
  Code,
  Copy,
  RefreshCw
} from 'lucide-react';
import { Alert, AlertDescription } from '@portfolio-building-service/ui';
import { Separator } from '@portfolio-building-service/ui';

interface SettingsTabProps {
  // Add props as needed
}

export function SettingsTab({}: SettingsTabProps) {
  const [slug, setSlug] = useState('');
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true);
  const [publishDate, setPublishDate] = useState('');
  const [publishTime, setPublishTime] = useState('');
  const [scheduled, setScheduled] = useState(false);
  const [collection, setCollection] = useState('');
  const [customFields, setCustomFields] = useState<Array<{key: string, value: string, type: string}>>([]);
  const [schemaVersion, setSchemaVersion] = useState('1.0.0');
  const [hasSchemaChanges, setHasSchemaChanges] = useState(false);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const addCustomField = () => {
    setCustomFields([...customFields, { key: '', value: '', type: 'text' }]);
  };

  const updateCustomField = (index: number, field: 'key' | 'value' | 'type', value: string) => {
    const updated = [...customFields];
    updated[index][field] = value;
    setCustomFields(updated);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const migrateSchema = () => {
    // Simulate schema migration
    setSchemaVersion('1.1.0');
    setHasSchemaChanges(false);
    // In a real implementation, this would run the actual migration
  };

  return (
    <div className="space-y-6">
      {/* Basic Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Basic Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="slug">URL Slug</Label>
              <div className="flex items-center gap-2">
                <Switch
                  id="auto-slug"
                  checked={autoGenerateSlug}
                  onCheckedChange={setAutoGenerateSlug}
                />
                <Label htmlFor="auto-slug" className="text-sm">
                  Auto-generate from title
                </Label>
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="url-slug"
                disabled={autoGenerateSlug}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSlug(generateSlug('Your Page Title Here'))}
                disabled={autoGenerateSlug}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              URL: https://yoursite.com/{slug || 'url-slug'}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Collection</Label>
            <Select value={collection} onValueChange={setCollection}>
              <SelectTrigger>
                <SelectValue placeholder="Select a collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pages">Pages</SelectItem>
                <SelectItem value="posts">Posts</SelectItem>
                <SelectItem value="projects">Projects</SelectItem>
                <SelectItem value="portfolio">Portfolio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Publishing Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Publishing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="scheduled">Schedule Publishing</Label>
              <p className="text-sm text-muted-foreground">
                Set a specific date and time for publishing
              </p>
            </div>
            <Switch
              id="scheduled"
              checked={scheduled}
              onCheckedChange={setScheduled}
            />
          </div>

          {scheduled && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="publish-date">Publish Date</Label>
                <Input
                  id="publish-date"
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publish-time">Publish Time</Label>
                <Input
                  id="publish-time"
                  type="time"
                  value={publishTime}
                  onChange={(e) => setPublishTime(e.target.value)}
                />
              </div>
            </div>
          )}

          {scheduled && publishDate && publishTime && (
            <Alert className="border-blue-200 bg-blue-50">
              <Calendar className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                This content will be published on {publishDate} at {publishTime}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Custom Fields */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            Custom Fields
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {customFields.length > 0 ? (
            <div className="space-y-3">
              {customFields.map((field, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1 space-y-2">
                    <Label>Field Name</Label>
                    <Input
                      value={field.key}
                      onChange={(e) => updateCustomField(index, 'key', e.target.value)}
                      placeholder="field_name"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Type</Label>
                    <Select value={field.type} onValueChange={(value) => updateCustomField(index, 'type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="url">URL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Value</Label>
                    <Input
                      value={field.value}
                      onChange={(e) => updateCustomField(index, 'value', e.target.value)}
                      placeholder="Field value"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomField(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No custom fields defined</p>
              <p className="text-sm">Add custom fields to extend your content structure</p>
            </div>
          )}
          
          <Button onClick={addCustomField} variant="outline" size="sm">
            <Code className="h-4 w-4 mr-2" />
            Add Custom Field
          </Button>
        </CardContent>
      </Card>

      {/* Schema Version */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Schema Version
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Current Version</p>
              <p className="text-sm text-muted-foreground">
                Schema version: {schemaVersion}
              </p>
            </div>
            <Badge variant={hasSchemaChanges ? 'destructive' : 'secondary'}>
              {hasSchemaChanges ? 'Update Available' : 'Up to Date'}
            </Badge>
          </div>

          {hasSchemaChanges && (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertDescription className="text-amber-800">
                <div className="space-y-2">
                  <p><strong>Schema Update Available</strong></p>
                  <p className="text-sm">
                    Your content structure has been updated. Click "Migrate" to apply the changes.
                  </p>
                  <Button onClick={migrateSchema} size="sm" className="mt-2">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Migrate to v1.1.0
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="text-sm text-muted-foreground">
            <p>Schema versioning helps maintain compatibility when content structures change.</p>
            <p>Updates are applied automatically and preserve your existing content.</p>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="canonical">Canonical URL</Label>
            <Input
              id="canonical"
              placeholder="https://yoursite.com/canonical-url"
            />
            <p className="text-sm text-muted-foreground">
              Override the default canonical URL for this content
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="template">Template</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="landing">Landing Page</SelectItem>
                <SelectItem value="blog">Blog Post</SelectItem>
                <SelectItem value="portfolio">Portfolio Item</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Settings Guidelines */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Settings Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 text-sm space-y-2">
          <p>• Use descriptive, SEO-friendly slugs</p>
          <p>• Schedule publishing for optimal timing</p>
          <p>• Custom fields extend your content structure</p>
          <p>• Schema migrations preserve your content</p>
          <p>• Canonical URLs help with SEO</p>
        </CardContent>
      </Card>
    </div>
  );
}
