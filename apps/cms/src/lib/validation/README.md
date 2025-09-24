# Validation Schemas

This directory contains Zod validation schemas for all CMS entities. These schemas provide:

- **Type safety** - TypeScript types are automatically inferred
- **Runtime validation** - Data is validated at runtime before database operations
- **Consistent validation** - Same rules applied across all server actions and API endpoints
- **Error messages** - User-friendly validation error messages

## Usage

### In Server Actions

```typescript
import { PageUpsertSchema, type PageUpsertInput } from '@/lib/validation'

export async function createPage(data: unknown) {
  // Validate input data
  const validatedData = PageUpsertSchema.parse(data)
  
  // Now you have type-safe data
  const page = await prisma.page.create({
    data: {
      ...validatedData,
      tenantId: await getValidatedTenantId(),
    },
  })
  
  return page
}
```

### In API Routes

```typescript
import { PageUpsertSchema } from '@/lib/validation'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = PageUpsertSchema.parse(body)
    
    // Process validated data...
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    throw error
  }
}
```

### In React Hook Form

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageUpsertSchema, type PageUpsertInput } from '@/lib/validation'

export function PageForm() {
  const form = useForm<PageUpsertInput>({
    resolver: zodResolver(PageUpsertSchema),
    defaultValues: {
      title: '',
      slug: '',
      status: 'DRAFT',
      body: {},
    },
  })
  
  // Form implementation...
}
```

## Schema Structure

### Common Schemas (`common.ts`)
- `SlugSchema` - URL-safe slug validation
- `StatusSchema` - DRAFT/PUBLISHED status validation
- `JsonContentSchema` - Flexible JSON content validation
- `SeoMetadataSchema` - SEO metadata validation
- `MediaReferenceSchema` - Media reference validation

### Entity Schemas
- `page.ts` - Page validation schemas
- `collection.ts` - Collection validation schemas  
- `item.ts` - Item validation schemas
- `global.ts` - Global validation schemas

Each entity has:
- `UpsertSchema` - For create/update operations
- `CreateSchema` - For create-only operations
- `UpdateSchema` - For update-only operations (includes ID)
- `QuerySchema` - For filtering/querying
- `ResponseSchema` - For API responses

## Validation Rules

### Slugs
- Lowercase letters, numbers, and hyphens only
- Cannot start or end with hyphens
- 1-100 characters

### Status
- Must be either `DRAFT` or `PUBLISHED`

### SEO Fields
- Title: max 60 characters
- Description: max 160 characters
- Canonical URLs must be valid URLs

### Media References
- Alt text required for accessibility
- Focal point coordinates (0-1 range)
- UUID validation for media IDs

## Error Handling

All schemas provide descriptive error messages. Use Zod's error handling:

```typescript
try {
  const data = SomeSchema.parse(input)
} catch (error) {
  if (error instanceof z.ZodError) {
    // Handle validation errors
    console.log(error.errors) // Array of validation errors
  }
}
```
