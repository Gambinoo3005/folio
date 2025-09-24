import { notFound } from 'next/navigation'
import { getPreviewMode, isPreview } from '@/lib/preview'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface PreviewPageProps {
  params: Promise<{
    target: string
    id: string
  }>
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { target, id } = await params
  // Check if preview mode is active
  const inPreview = await isPreview()
  if (!inPreview) {
    notFound()
  }

  // Get preview details
  const preview = await getPreviewMode()
  if (!preview || preview.target !== target || preview.id !== id) {
    notFound()
  }

  // Fetch the content based on target type
  let content = null
  
  if (target === 'page') {
    content = await prisma.page.findFirst({
      where: {
        id,
        tenantId: preview.tenantId,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        body: true,
        status: true,
        seoTitle: true,
        seoDescription: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  } else if (target === 'item') {
    content = await prisma.item.findFirst({
      where: {
        id,
        tenantId: preview.tenantId,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        collection: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })
  }

  if (!content) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Preview Header */}
      <div className="border-b border-border bg-orange-50 dark:bg-orange-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-orange-800 dark:text-orange-400">
                  PREVIEW MODE
                </span>
              </div>
              <span className="text-sm text-orange-700 dark:text-orange-300">
                {target === 'page' ? 'Page' : 'Item'}: {content.title}
              </span>
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400">
              Draft content visible
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            {content.title}
          </h1>
          
          {target === 'page' && 'body' in content && (
            <div 
              className="text-foreground"
              dangerouslySetInnerHTML={{ __html: content.body || '' }}
            />
          )}
          
          {target === 'item' && 'content' in content && (
            <div className="text-foreground">
              <pre className="bg-muted p-4 rounded-lg overflow-auto">
                {JSON.stringify(content.content, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
