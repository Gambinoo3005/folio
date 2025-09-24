import { notFound } from 'next/navigation'
import { getClient } from '@portfolio-building-service/site-core'
import { isPreview } from '@/lib/preview'
import { generateNextMetadata } from '@portfolio-building-service/site-core'

export const revalidate = 60

interface ItemPageProps {
  params: Promise<{ collection: string; item: string }>
}

export async function generateMetadata({ params }: ItemPageProps) {
  const { collection, item } = await params
  const client = getClient({
    apiBase: process.env.NEXT_PUBLIC_API_BASE!,
    siteId: process.env.SITE_ID!,
  })

  const previewMode = await isPreview()
  const itemData = await client.items.getBySlug(collection, item, { preview: previewMode })

  if (!itemData) {
    return {
      title: 'Item Not Found',
    }
  }

  return generateNextMetadata({ item: itemData })
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { collection, item } = await params
  const client = getClient({
    apiBase: process.env.NEXT_PUBLIC_API_BASE!,
    siteId: process.env.SITE_ID!,
  })

  const previewMode = await isPreview()
  const itemData = await client.items.getBySlug(collection, item, { preview: previewMode })

  if (!itemData) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <nav className="text-sm text-muted-foreground mb-4">
              <a href={`/${collection}`} className="hover:text-foreground">
                {collection}
              </a>
              <span className="mx-2">/</span>
              <span>{itemData.title}</span>
            </nav>
            
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {itemData.title}
            </h1>
            
            {itemData.status === 'DRAFT' && (
              <div className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                Draft
              </div>
            )}
            
            {itemData.publishedAt && (
              <p className="text-sm text-muted-foreground">
                Published {new Date(itemData.publishedAt).toLocaleDateString()}
              </p>
            )}
          </header>
          
          <div className="prose prose-lg max-w-none">
            {itemData.content && (
              <div 
                className="text-foreground"
                dangerouslySetInnerHTML={{ __html: itemData.content }}
              />
            )}
          </div>
        </article>
      </div>
    </main>
  )
}
