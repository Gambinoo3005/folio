# Optimized Folio CMS Editor

This document outlines the complete rebuild of the Folio CMS Editor based on the optimized plan. The new editor focuses on clarity over power, fast defaults, and safe publishing.

## 🎯 Key Improvements

### 1. Editor Information Architecture (IA)
- **Header Layout**: Title input • Status (Draft/Published/Scheduled) • Autosave dot • Preview • Publish (primary) • Actions menu
- **Left Tabs**: Content, Media, SEO & Metadata, Quality, Settings
- **Right Rail**: Publish Checklist (live), References (incoming/outgoing), Activity (recent edits)
- **Split Preview**: Toggle between editor and live preview

### 2. Semantic Block Editor
- **Constrained Blocks**: Headings (H2–H4), Paragraph, List, Quote, Code, Image, Embed, Callout
- **Hard Guardrails**: Heading order validation, required alt text, approved embed domains
- **Inline Help**: Per-block help text and examples
- **Real-time Validation**: Invalid headings trigger inline nudges

### 3. Media UX
- **Cover Image**: With focal point picker and required alt text
- **Gallery**: Multiple images with focal point editing
- **OG Image**: Social sharing preview with live card preview
- **CDN Integration**: Automatic width/height detection and size optimization

### 4. SEO Panel
- **Live Analyzers**: Title length, description length, slug readability
- **Missing H2 Detection**: Highlights missing headings
- **Internal Links Count**: Shows internal link statistics
- **Quick Actions**: "Use Title as SEO Title" and "Generate Description from Body"

### 5. Quality Tab
- **A11y Checks**: Image alt, heading order, color contrast, link text clarity
- **Link Checker**: Validates internal slugs and external links with timeout
- **Real-time Validation**: Updates keystroke-by-keystroke
- **Publish Blockers**: Critical failures prevent publishing

### 6. Enhanced Preview
- **Device Presets**: Mobile, tablet, desktop view toggles
- **Draft Mode**: Shows/hides draft content with watermark
- **Split Preview**: Side-by-side editing and preview
- **External Preview**: Opens live preview in new tab

## 🏗️ Architecture

### Component Structure
```
apps/cms/src/components/editor/
├── optimized-editor-layout.tsx     # Main editor shell
├── blocks/
│   └── semantic-block-editor.tsx   # Constrained block editor
├── tabs/
│   ├── content-tab.tsx            # Main content editing
│   ├── media-tab.tsx              # Media management
│   ├── seo-tab.tsx                # SEO optimization
│   ├── quality-tab.tsx            # A11y and quality checks
│   └── settings-tab.tsx           # Advanced settings
├── right-rail/
│   ├── publish-checklist.tsx      # Live publish checklist
│   ├── references-inspector.tsx   # Link references
│   └── activity-feed.tsx          # Recent activity
└── preview/
    └── preview-panel.tsx          # Enhanced preview
```

### Key Features

#### Autosave System
- **5-second debounce**: Saves only changed fields
- **Visual indicators**: Shows saving, saved, and unsaved states
- **Local caching**: Preserves work on accidental tab close

#### Validation System
- **Fail-fast approach**: Shows errors immediately
- **Inline validation**: Real-time feedback on content issues
- **Publish blocking**: Critical errors prevent publishing
- **Jump to field**: Error messages link to problematic fields

#### Role-Based Access
- **Viewer**: Read-only editor UI
- **Editor**: Edit & save draft
- **Admin/Owner**: Publish/unpublish/delete
- **Transparent permissions**: Disabled controls show tooltips

## 🚀 Usage

### Basic Setup
```tsx
import { OptimizedEditorLayout } from '@/components/editor/optimized-editor-layout';

export default function MyEditorPage() {
  return (
    <OptimizedEditorLayout
      title="My Page Title"
      status="draft"
      onSave={handleSave}
      onPublish={handlePublish}
      previewTarget="page"
      previewId="my-page"
      contentType="page"
      userRole="editor"
    />
  );
}
```

### Content Editing
The semantic block editor provides constrained, predictable content creation:

```tsx
import { SemanticBlockEditor } from '@/components/editor/blocks/semantic-block-editor';

<SemanticBlockEditor
  content={content}
  onChange={setContent}
  onValidationChange={setValidationErrors}
  placeholder="Start writing your content here..."
/>
```

### Media Management
The media tab handles all media-related functionality:

- **Cover Image**: Required for pages, with focal point editing
- **OG Image**: Optional but recommended for social sharing
- **Gallery**: Multiple images with individual focal points
- **Alt Text**: Required for accessibility compliance

### SEO Optimization
The SEO tab provides live analysis and optimization:

- **Title Analysis**: Length and keyword optimization
- **Description Analysis**: Length and readability
- **Heading Structure**: H2-H4 hierarchy validation
- **Internal Links**: Count and validation

### Quality Assurance
The quality tab ensures content meets standards:

- **Accessibility**: Alt text, heading order, color contrast
- **Link Validation**: Internal and external link checking
- **Content Quality**: Readability and structure analysis

## 🔧 Configuration

### Validation Rules
The editor enforces these validation rules:

```typescript
interface ValidationRules {
  // Content rules
  title: { required: true, maxLength: 200 };
  content: { required: true };
  
  // Media rules
  coverImage: { required: true, altText: true };
  ogImage: { altText: true };
  
  // SEO rules
  seoTitle: { maxLength: 60 };
  seoDescription: { maxLength: 160 };
  
  // Quality rules
  headingHierarchy: { h2Required: true, noH1: true };
  imageAltText: { required: true };
  linkText: { descriptive: true };
}
```

### Custom Fields
The settings tab allows custom field configuration:

```typescript
interface CustomField {
  key: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'url';
  value: string;
}
```

## 🎨 Styling

The editor uses a consistent design system:

- **Colors**: Primary, secondary, muted, accent colors
- **Spacing**: Consistent padding and margins
- **Typography**: Clear hierarchy with proper contrast
- **Animations**: Smooth transitions and micro-interactions

## 🔄 Migration

### From Old Editor
The new editor is designed to be a drop-in replacement:

1. **Data Model**: Uses existing Zod schemas
2. **API Compatibility**: Works with existing server actions
3. **Preview System**: Maintains current preview cookie system
4. **Permissions**: Integrates with existing RBAC system

### Schema Versioning
The editor includes schema versioning for future updates:

- **Version Badge**: Shows current schema version
- **Migration Button**: One-click schema updates
- **Change Log**: Documents what changed in updates

## 🧪 Testing

### Demo Page
A demo page is available at `/demo-editor` to test all features:

- **Content Editing**: Try the semantic block editor
- **Media Management**: Upload and edit images
- **SEO Analysis**: Test the live SEO analyzer
- **Quality Checks**: Run accessibility and link checks
- **Preview System**: Test device presets and draft mode

### Test Scenarios
1. **Content Creation**: Create a new page with all content types
2. **Media Upload**: Upload images and set focal points
3. **SEO Optimization**: Optimize title, description, and structure
4. **Quality Validation**: Test accessibility and link validation
5. **Publishing**: Test publish, unpublish, and scheduling

## 🚀 Performance

### Optimizations
- **Autosave Debouncing**: Prevents excessive API calls
- **Lazy Loading**: Components load as needed
- **Local Caching**: Preserves editor state
- **Efficient Validation**: Only validates changed content

### Monitoring
- **Performance Metrics**: Track editor load times
- **User Interactions**: Monitor common workflows
- **Error Rates**: Track validation and save failures

## 🔮 Future Enhancements

### Planned Features
1. **Version History**: Full content versioning with diffs
2. **Collaborative Editing**: Real-time multi-user editing
3. **Advanced Scheduling**: Recurring and conditional publishing
4. **Content Templates**: Reusable content structures
5. **AI Assistance**: Content suggestions and optimization

### Extensibility
The editor is designed for easy extension:

- **Custom Blocks**: Add new block types
- **Validation Rules**: Extend validation system
- **Media Providers**: Add new media sources
- **Preview Modes**: Add custom preview layouts

## 📚 Resources

### Documentation
- [Component API Reference](./docs/component-api.md)
- [Validation Rules](./docs/validation-rules.md)
- [Customization Guide](./docs/customization.md)
- [Migration Guide](./docs/migration.md)

### Examples
- [Basic Page Editor](./examples/basic-page.tsx)
- [Blog Post Editor](./examples/blog-post.tsx)
- [Portfolio Item Editor](./examples/portfolio-item.tsx)
- [Custom Field Setup](./examples/custom-fields.tsx)

---

This optimized editor represents a significant improvement in user experience, focusing on clarity, safety, and efficiency. The constrained approach prevents common content issues while providing powerful features for content creators.
