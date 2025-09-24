import { notFound } from 'next/navigation'
import { getClient } from '@portfolio-building-service/site-core'
import { isPreview } from '@/lib/preview'
import Link from 'next/link'

export const revalidate = 60

interface CollectionPageProps {
  params: Promise<{ collection: string }>
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const { collection } = await params
  
  return {
    title: `${collection.charAt(0).toUpperCase() + collection.slice(1)} - Portfolio`,
    description: `Browse ${collection} items`,
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collection } = await params
  const client = getClient({
    apiBase: process.env.NEXT_PUBLIC_API_BASE!,
    siteId: process.env.SITE_ID!,
  })

  const previewMode = await isPreview()
  
  try {
    const response = await client.items.list(collection, {
      preview: previewMode,
      status: previewMode ? 'ALL' : 'PUBLISHED',
      limit: 50,
    })

    if (!response.data || response.data.length === 0) {
      notFound()
    }

    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {response.collection.name}
            </h1>
            <p className="text-xl text-muted-foreground">
              {response.pagination.total} {response.pagination.total === 1 ? 'item' : 'items'}
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {response.data.map((item) => (
              <Link
                key={item.id}
                href={`/${collection}/${item.slug}`}
                className="group block bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h2>
                
                {item.status === 'DRAFT' && (
                  <div className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium mb-3">
                    Draft
                  </div>
                )}
                
                {item.publishedAt && (
                  <p className="text-sm text-muted-foreground">
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </p>
                )}
                
                {item.content && (
                  <div 
                    className="text-sm text-muted-foreground mt-3 line-clamp-3"
                    dangerouslySetInnerHTML={{ 
                      __html: item.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' 
                    }}
                  />
                )}
              </Link>
            ))}
          </div>

          {response.pagination.hasMore && (
            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Showing {response.data.length} of {response.pagination.total} items
              </p>
            </div>
          )}
        </div>
      </main>
    )
  } catch (error) {
    console.error('Collection page error:', error)
    notFound()
  }
}
