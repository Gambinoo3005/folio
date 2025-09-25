'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@portfolio-building-service/ui'
import { Button } from '@portfolio-building-service/ui'
import { Badge } from '@portfolio-building-service/ui'
import { MediaUpload } from './media-upload'
import { toastHelpers } from '@/lib/toast'

export function TestMediaContent() {
  const [uploadResults, setUploadResults] = useState<any[]>([])
  const [isTestingApi, setIsTestingApi] = useState(false)

  const handleUploadComplete = (results: any[]) => {
    setUploadResults(prev => [...prev, ...results])
    toastHelpers.success('Test upload complete', `${results.length} file(s) uploaded`)
  }

  const testApiEndpoints = async () => {
    setIsTestingApi(true)
    try {
      // Test upload URL endpoint
      const uploadUrlResponse = await fetch('/api/v1/media/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'image',
          filename: 'test.jpg',
          mime: 'image/jpeg',
          size: 1024,
        }),
      })

      if (!uploadUrlResponse.ok) {
        throw new Error('Upload URL endpoint failed')
      }

      const uploadUrlData = await uploadUrlResponse.json()
      console.log('Upload URL response:', uploadUrlData)

      // Test media list endpoint
      const mediaListResponse = await fetch('/api/v1/media')
      if (!mediaListResponse.ok) {
        throw new Error('Media list endpoint failed')
      }

      const mediaListData = await mediaListResponse.json()
      console.log('Media list response:', mediaListData)

      toastHelpers.success('API endpoints working', 'All media API endpoints are functional')
    } catch (error) {
      console.error('API test error:', error)
      toastHelpers.error('API test failed', error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsTestingApi(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Environment Check */}
      <Card>
        <CardHeader>
          <CardTitle>Environment Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Required Environment Variables</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant={process.env.NEXT_PUBLIC_CDN_BASE ? 'default' : 'destructive'}>
                    {process.env.NEXT_PUBLIC_CDN_BASE ? 'Set' : 'Missing'}
                  </Badge>
                  <span>NEXT_PUBLIC_CDN_BASE</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Server Only</Badge>
                  <span>CLOUDFLARE_ACCOUNT_ID</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Server Only</Badge>
                  <span>CLOUDFLARE_IMAGES_TOKEN</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Server Only</Badge>
                  <span>CLOUDFLARE_R2_ACCESS_KEY_ID</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Server Only</Badge>
                  <span>CLOUDFLARE_R2_SECRET_ACCESS_KEY</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Server Only</Badge>
                  <span>CLOUDFLARE_R2_BUCKET</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Current Values</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">CDN Base:</span>{' '}
                  <code className="bg-muted px-1 rounded">
                    {process.env.NEXT_PUBLIC_CDN_BASE || 'Not set'}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Test */}
      <Card>
        <CardHeader>
          <CardTitle>API Endpoints Test</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={testApiEndpoints} disabled={isTestingApi}>
            {isTestingApi ? 'Testing...' : 'Test API Endpoints'}
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Tests the upload URL and media list endpoints
          </p>
        </CardContent>
      </Card>

      {/* Upload Test */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Test</CardTitle>
        </CardHeader>
        <CardContent>
          <MediaUpload onUploadComplete={handleUploadComplete} />
        </CardContent>
      </Card>

      {/* Upload Results */}
      {uploadResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadResults.map((result, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Upload #{index + 1}</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">ID:</span> {result.id}
                    </div>
                    <div>
                      <span className="font-medium">Delivery URL:</span>{' '}
                      <a 
                        href={result.deliveryUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {result.deliveryUrl}
                      </a>
                    </div>
                    <div>
                      <span className="font-medium">Size:</span> {result.metadata.size} bytes
                    </div>
                    {result.metadata.width && result.metadata.height && (
                      <div>
                        <span className="font-medium">Dimensions:</span> {result.metadata.width} × {result.metadata.height}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Test Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">1. Environment Setup</h4>
            <p className="text-sm text-muted-foreground">
              Ensure all required environment variables are set in your .env.local file
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">2. API Test</h4>
            <p className="text-sm text-muted-foreground">
              Click "Test API Endpoints" to verify the media API is working
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">3. Upload Test</h4>
            <p className="text-sm text-muted-foreground">
              Try uploading an image or file to test the direct upload functionality
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">4. Check Results</h4>
            <p className="text-sm text-muted-foreground">
              Verify that files are uploaded successfully and delivery URLs are generated
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
