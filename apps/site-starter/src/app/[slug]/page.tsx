import { notFound } from 'next/navigation'
import { getClient } from '@portfolio-building-service/site-core'
import { isPreview } from '@/lib/preview'
import { generateNextMetadata } from '@portfolio-building-service/site-core'

export const revalidate = 60

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const client = getClient({
    apiBase: process.env.NEXT_PUBLIC_API_BASE!,
    siteId: process.env.SITE_ID!,
  })

  const previewMode = await isPreview()
  const page = await client.pages.getBySlug(slug, { preview: previewMode })

  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }

  return generateNextMetadata({ page })
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const client = getClient({
    apiBase: process.env.NEXT_PUBLIC_API_BASE!,
    siteId: process.env.SITE_ID!,
  })

  const previewMode = await isPreview()
  const page = await client.pages.getBySlug(slug, { preview: previewMode })

  if (!page) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {page.title}
            </h1>
            {page.status === 'DRAFT' && (
              <div className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                Draft
              </div>
            )}
          </header>
          
          <div className="prose prose-lg max-w-none">
            {page.content && (
              <div 
                className="text-foreground"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            )}
          </div>
        </article>
      </div>
    </main>
  )
}
