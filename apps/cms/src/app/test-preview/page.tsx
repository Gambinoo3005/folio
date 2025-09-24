import { getPreviewMode, isPreview } from '@/lib/preview'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function TestPreviewPage() {
  const inPreview = await isPreview()
  const preview = await getPreviewMode()

  // Get a sample page to test with
  const samplePage = await prisma.page.findFirst({
    where: {
      deletedAt: null,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      body: true,
    },
  })

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Preview Mode Test</h1>
        
        <div className="space-y-6">
          {/* Preview Status */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Preview Status</h2>
            <div className="space-y-2">
              <p><strong>In Preview Mode:</strong> {inPreview ? 'Yes' : 'No'}</p>
              {preview && (
                <div className="mt-4 p-4 bg-muted rounded">
                  <h3 className="font-semibold mb-2">Preview Details:</h3>
                  <ul className="space-y-1 text-sm">
                    <li><strong>Target:</strong> {preview.target}</li>
                    <li><strong>ID:</strong> {preview.id}</li>
                    <li><strong>Token:</strong> {preview.token}</li>
                    <li><strong>Timestamp:</strong> {new Date(preview.timestamp).toLocaleString()}</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Sample Content */}
          {samplePage && (
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Sample Page Content</h2>
              <div className="space-y-2">
                <p><strong>Title:</strong> {samplePage.title}</p>
                <p><strong>Slug:</strong> {samplePage.slug}</p>
                <p><strong>Status:</strong> {samplePage.status}</p>
                <p><strong>Body:</strong> {typeof samplePage.body === 'string' ? samplePage.body : 'No body content'}</p>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">How to Test</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Go to the CMS editor for a page or item</li>
              <li>Click the "Preview" button in the editor header</li>
              <li>This should open a new tab with the preview URL</li>
              <li>You should see "PREVIEW ACTIVE" indicator in the editor</li>
              <li>Draft content should be visible in the preview</li>
              <li>Click "Exit preview" to stop preview mode</li>
            </ol>
          </div>

          {/* API Test Links */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">API Test Links</h2>
            <div className="space-y-2">
              <p>
                <a 
                  href="/api/v1/pages" 
                  className="text-blue-600 hover:underline"
                  target="_blank"
                >
                  GET /api/v1/pages
                </a>
                {' '}(should show draft content if in preview mode)
              </p>
              <p>
                <a 
                  href="/api/v1/collections" 
                  className="text-blue-600 hover:underline"
                  target="_blank"
                >
                  GET /api/v1/collections
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
