# UI Contracts - CMS Editor Fields

This document defines the expected fields and data structures for the CMS editor components. These contracts will guide the Prisma schema design and API implementation.

## Content Editor Form Fields

### Core Content Fields
```typescript
interface ContentFormValues {
  // Basic Information
  title: string;                    // Required, max 100 chars
  subtitle?: string;                // Optional
  excerpt?: string;                 // Optional, for summaries
  content: string;                  // Required, rich text content
  
  // Media
  heroImage?: string;               // URL to hero image
  heroAlt?: string;                 // Alt text for hero image
  gallery?: string[];               // Array of image URLs
  
  // SEO & Metadata
  slug?: string;                    // URL slug, auto-generated from title
  metaTitle?: string;               // SEO title, falls back to title
  metaDescription?: string;         // SEO description
  socialImage?: string;             // Social media preview image
  canonicalUrl?: string;            // Canonical URL
  noIndex?: boolean;                // Hide from search engines
  
  // Content Organization
  tags?: string[];                  // Content tags
  categories?: string[];            // Content categories
  featured?: boolean;               // Featured content flag
  public?: boolean;                 // Public visibility
  
  // Publishing
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  publishDate?: string;             // ISO date string
  publishTime?: string;             // Time for scheduled publishing
  author?: string;                  // Content author
  
  // External Links
  externalLinks?: {
    label: string;
    url: string;
  }[];
}
```

## Collection-Specific Fields

### Projects Collection
```typescript
interface ProjectFields extends ContentFormValues {
  // Project-specific fields
  role?: string;                    // Role in the project
  date?: string;                    // Project completion date
  stack?: string[];                 // Technologies used
  client?: string;                  // Client name
  duration?: string;                // Project duration
  teamSize?: number;                // Team size
  
  // External Links
  githubUrl?: string;               // GitHub repository
  liveUrl?: string;                 // Live project URL
  caseStudyUrl?: string;            // Detailed case study
}
```

### Posts Collection (Blog)
```typescript
interface PostFields extends ContentFormValues {
  // Blog-specific fields
  readingTime?: number;             // Estimated reading time in minutes
  wordCount?: number;               // Word count
  lastModified?: string;            // Last modification date
  
  // Series/Collections
  series?: string;                  // Blog series name
  seriesOrder?: number;             // Order within series
}
```

### Galleries Collection
```typescript
interface GalleryFields extends ContentFormValues {
  // Gallery-specific fields
  imageCount?: number;              // Number of images
  totalSize?: number;               // Total file size in bytes
  featuredImage?: string;           // Featured image URL
  
  // Organization
  location?: string;                // Photo location
  event?: string;                   // Event name
  date?: string;                    // Photo date
}
```

## Global Settings Fields

### Navigation
```typescript
interface NavigationSettings {
  links: {
    label: string;
    url: string;
    external?: boolean;
  }[];
}
```

### Footer
```typescript
interface FooterSettings {
  content?: string;                 // Footer content/description
  copyright?: string;               // Copyright text
  links?: {
    label: string;
    url: string;
  }[];
}
```

### Social Media
```typescript
interface SocialSettings {
  platforms: {
    platform: 'twitter' | 'linkedin' | 'github' | 'instagram' | 'facebook' | 'youtube';
    url: string;
    handle?: string;
  }[];
}
```

### SEO Defaults
```typescript
interface SEODefaults {
  defaultTitle?: string;            // Default meta title
  defaultDescription?: string;      // Default meta description
  defaultSocialImage?: string;      // Default social image
  siteName?: string;                // Site name
  siteUrl?: string;                 // Site URL
}
```

## Media Library Fields

### Media Item
```typescript
interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  thumbnailUrl?: string;
  mimeType: string;
  size: number;                     // File size in bytes
  width?: number;                   // Image width
  height?: number;                  // Image height
  alt?: string;                     // Alt text
  caption?: string;                 // Image caption
  focalPoint?: {                    // Focal point for cropping
    x: number;                      // 0-1 range
    y: number;                      // 0-1 range
  };
  tags?: string[];                  // Media tags
  uploadedAt: string;               // Upload date
  uploadedBy: string;               // User who uploaded
}
```

## Form Validation Rules

### Title
- Required
- Min length: 1 character
- Max length: 100 characters
- No special characters except hyphens and spaces

### Slug
- Auto-generated from title
- Lowercase, hyphenated
- Unique within collection
- Max length: 100 characters

### Meta Description
- Optional
- Max length: 160 characters
- Recommended: 50-160 characters

### Tags
- Array of strings
- Max 10 tags per item
- Each tag max 30 characters
- No special characters except hyphens

### Categories
- Array of strings
- Max 5 categories per item
- Each category max 50 characters

### External Links
- Array of objects with label and URL
- Max 5 external links
- URL must be valid HTTP/HTTPS

## Data Relationships

### Content References
- Pages can reference collections (e.g., featured projects)
- Collections can reference media items
- Media items can be used across multiple content items

### User Context
- All content is associated with a user/tenant
- Users can only access their own content
- Role-based permissions (Owner, Admin, Editor, Contributor, Viewer)

## API Endpoints (Future)

### Content Management
- `GET /api/content` - List content
- `POST /api/content` - Create content
- `GET /api/content/[id]` - Get content by ID
- `PUT /api/content/[id]` - Update content
- `DELETE /api/content/[id]` - Delete content
- `POST /api/content/[id]/publish` - Publish content
- `POST /api/content/[id]/schedule` - Schedule content

### Media Management
- `GET /api/media` - List media items
- `POST /api/media/upload` - Upload media
- `GET /api/media/[id]` - Get media by ID
- `PUT /api/media/[id]` - Update media metadata
- `DELETE /api/media/[id]` - Delete media

### Settings
- `GET /api/settings` - Get global settings
- `PUT /api/settings` - Update global settings

## Database Schema Considerations

### Content Tables
- `pages` - Singleton pages (Home, About, Contact)
- `projects` - Project portfolio items
- `posts` - Blog posts
- `galleries` - Photo galleries
- `media` - Media library items
- `settings` - Global site settings

### Common Fields
All content tables should include:
- `id` (UUID primary key)
- `title` (string)
- `slug` (string, unique)
- `content` (text/JSON)
- `status` (enum)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)
- `publishedAt` (timestamp, nullable)
- `userId` (foreign key)

### Indexes
- `slug` - Unique index
- `status` - Index for filtering
- `userId` - Index for user isolation
- `publishedAt` - Index for published content queries
