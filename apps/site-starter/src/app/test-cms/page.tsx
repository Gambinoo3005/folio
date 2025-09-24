import { getClient } from '@portfolio-building-service/site-core'

export default async function TestCMSPage() {
  // Create client instance
  const client = getClient({
    apiBase: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001',
    siteId: process.env.SITE_ID || 'dev-site-1',
    cdnBase: process.env.NEXT_PUBLIC_CDN_BASE,
  })

  let collections: any[] = []
  let pages: any[] = []
  let error: string | null = null

  try {
    // Test collections API
    collections = await client.collections.list()
    
    // Test pages API
    pages = await client.pages.list()
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error'
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            CMS SDK Test
          </h1>
          <p className="text-xl text-muted-foreground">
            Testing the Folio CMS SDK integration
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Configuration */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>API Base:</strong> {process.env.NEXT_PUBLIC_API_BASE || 'Not set'}
              </div>
              <div>
                <strong>Site ID:</strong> {process.env.SITE_ID || 'Not set'}
              </div>
              <div>
                <strong>CDN Base:</strong> {process.env.NEXT_PUBLIC_CDN_BASE || 'Not set'}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-destructive mb-4">Error</h2>
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {/* Collections */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Collections ({collections.length})</h2>
            {collections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {collections.map((collection) => (
                  <div key={collection.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold">{collection.name}</h3>
                    <p className="text-sm text-muted-foreground">Slug: {collection.slug}</p>
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(collection.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No collections found</p>
            )}
          </div>

          {/* Pages */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Pages ({pages.length})</h2>
            {pages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pages.map((page) => (
                  <div key={page.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold">{page.title}</h3>
                    <p className="text-sm text-muted-foreground">Slug: {page.slug}</p>
                    <p className="text-xs text-muted-foreground">
                      Status: {page.status}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(page.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No pages found</p>
            )}
          </div>

          {/* SDK Features */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">SDK Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">✅ Implemented</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• getClient() factory function</li>
                  <li>• Typed fetchers (pages, collections, items, globals)</li>
                  <li>• Automatic tenant headers (x-folio-site-id)</li>
                  <li>• Preview mode support (x-folio-preview)</li>
                  <li>• Built-in retry/backoff logic</li>
                  <li>• 60s cache for published resources</li>
                  <li>• imageUrl() helper for Cloudflare Images</li>
                  <li>• seo.from() helper for meta tags</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">🔄 Next Steps</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Live Preview Mode integration</li>
                  <li>• Publish hooks and revalidation</li>
                  <li>• Collection/page rendering components</li>
                  <li>• Dynamic routing setup</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
