# Server Actions

This directory contains secure server actions for CRUD operations on CMS entities. All actions include:

- **Tenant isolation** - Actions are scoped to the current tenant
- **Input validation** - All inputs are validated using Zod schemas
- **Structured responses** - Consistent `{ ok: boolean, data?, errors? }` format
- **Cache revalidation** - Automatic cache invalidation on data changes
- **Audit logging** - Publish/unpublish actions are logged to PublishLog

## Usage

### Page Actions

```typescript
import { createPage, updatePage, publishPage } from '@/server/actions'

// Create a new page
const result = await createPage({
  title: 'About Us',
  slug: 'about-us',
  status: 'DRAFT',
  body: { content: 'About us content...' },
  seoTitle: 'About Us - Company Name',
  seoDescription: 'Learn more about our company...',
})

if (result.ok) {
  console.log('Page created:', result.data.id)
} else {
  console.error('Validation errors:', result.errors)
}

// Publish a page
const publishResult = await publishPage(pageId)
if (publishResult.ok) {
  console.log('Page published successfully')
}
```

### Collection Actions

```typescript
import { createCollection, updateCollection } from '@/server/actions'

// Create a new collection
const result = await createCollection({
  name: 'Projects',
  slug: 'projects',
  config: {
    fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'description', type: 'textarea' },
      { name: 'heroImage', type: 'image' },
    ]
  }
})
```

### Item Actions

```typescript
import { createItem, publishItem } from '@/server/actions'

// Create a new item
const result = await createItem({
  collectionId: 'collection-uuid',
  title: 'My Project',
  slug: 'my-project',
  status: 'DRAFT',
  content: {
    title: 'My Project',
    summary: 'A great project...',
    body: 'Project details...',
  },
  seo: {
    title: 'My Project - Portfolio',
    description: 'Check out this amazing project...',
  },
  mediaRefs: [
    { id: 'media-uuid', alt: 'Project screenshot' }
  ]
})
```

### Global Actions

```typescript
import { upsertGlobal, getGlobal } from '@/server/actions'

// Upsert navigation data
const result = await upsertGlobal({
  key: 'navigation',
  data: {
    items: [
      { label: 'Home', url: '/', external: false },
      { label: 'About', url: '/about', external: false },
    ]
  }
})

// Get global data
const navResult = await getGlobal('navigation')
if (navResult.ok) {
  console.log('Navigation:', navResult.data.data)
}
```

## Response Format

All actions return a consistent response format:

```typescript
interface ActionResult<T = unknown> {
  ok: boolean
  data?: T
  errors?: Record<string, string[]>
  message?: string
}
```

### Success Response
```typescript
{
  ok: true,
  data: { id: "uuid" },
  message: "Page created successfully"
}
```

### Error Response
```typescript
{
  ok: false,
  errors: {
    "title": ["Title is required"],
    "slug": ["Slug must contain only lowercase letters, numbers, and hyphens"]
  },
  message: "Validation failed"
}
```

## Cache Revalidation

Actions automatically revalidate relevant cache tags:

- **Tenant-wide**: `tenant:${tenantId}`
- **Entity-specific**: `${entityType}:slug:${slug}`
- **Collection items**: When items are modified, the collection cache is also revalidated

## Security Features

### Tenant Isolation
- All actions resolve the current tenant ID from the request context
- Database queries are automatically scoped to the current tenant
- Cross-tenant data access is prevented

### Input Validation
- All inputs are validated using Zod schemas
- Validation errors are returned in a structured format
- Invalid data is rejected before database operations

### Audit Logging
- Publish/unpublish actions are logged to the PublishLog table
- Logs include tenant, actor, target, action, and timestamp
- Logging failures don't break the main operation

## Error Handling

Actions handle errors gracefully:

1. **Validation errors** - Return structured error responses
2. **Database errors** - Logged and returned as general errors
3. **Tenant access errors** - Thrown as exceptions (handled by middleware)
4. **Cache revalidation errors** - Logged but don't break the operation

## Best Practices

1. **Always check the `ok` field** before accessing `data`
2. **Handle validation errors** by displaying them to the user
3. **Use the structured error format** for consistent error handling
4. **Don't expose internal errors** to the client
5. **Log errors** for debugging and monitoring

## Testing

Server actions can be tested by:

1. **Unit tests** - Test validation and business logic
2. **Integration tests** - Test with actual database operations
3. **E2E tests** - Test the full user flow

Example test:
```typescript
import { createPage } from '@/server/actions'

test('creates page with valid input', async () => {
  const result = await createPage({
    title: 'Test Page',
    slug: 'test-page',
    status: 'DRAFT',
    body: { content: 'test' }
  })
  
  expect(result.ok).toBe(true)
  expect(result.data?.id).toBeDefined()
})
```
