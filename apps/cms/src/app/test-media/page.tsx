import { Suspense } from 'react'
import { TestMediaContent } from '@/components/media/test-media-content'

export default function TestMediaPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Media System Test</h1>
        <p className="text-muted-foreground mt-2">
          Test the media upload and management functionality
        </p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <TestMediaContent />
      </Suspense>
    </div>
  )
}
