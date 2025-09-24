import { notFound } from 'next/navigation'
import { getClient } from '@portfolio-building-service/site-core'
import { isPreview } from '@/lib/preview'
import { generateNextMetadata } from '@portfolio-building-service/site-core'

export const revalidate = 60

export async function generateMetadata() {
  const client = getClient({
    apiBase: process.env.NEXT_PUBLIC_API_BASE!,
    siteId: process.env.SITE_ID!,
  })

  const previewMode = await isPreview()
  const page = await client.pages.getBySlug('home', { preview: previewMode })

  if (!page) {
    return {
      title: 'Portfolio Site Starter',
      description: 'A starter template for portfolio sites powered by the Folio CMS',
    }
  }

  return generateNextMetadata({ page })
}

export default async function HomePage() {
  const client = getClient({
    apiBase: process.env.NEXT_PUBLIC_API_BASE!,
    siteId: process.env.SITE_ID!,
  })

  const previewMode = await isPreview()
  const page = await client.pages.getBySlug('home', { preview: previewMode })

  // If no home page exists, show fallback
  if (!page) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Portfolio Site Starter
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              A starter template for portfolio sites powered by the Folio CMS
            </p>
            <div className="bg-card border rounded-lg p-6 max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
              <p className="text-muted-foreground mb-4">
                Create a page with slug "home" in your CMS to customize this page.
              </p>
              <div className="text-left space-y-2 mb-6">
                <p><strong>API Base:</strong> {process.env.NEXT_PUBLIC_API_BASE || 'Not configured'}</p>
                <p><strong>Site ID:</strong> {process.env.SITE_ID || 'Not configured'}</p>
                <p><strong>CDN Base:</strong> {process.env.NEXT_PUBLIC_CDN_BASE || 'Not configured'}</p>
              </div>
              <div className="flex gap-4 justify-center">
                <a 
                  href="/test-cms" 
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Test CMS SDK
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
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
