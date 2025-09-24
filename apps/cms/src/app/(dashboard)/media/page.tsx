import { Suspense } from 'react'
import { MediaPageContent } from '@/components/media/media-page-content'
import { MediaPageSkeleton } from '@/components/media/media-page-skeleton'

export default function MediaPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Media Library</h1>
        <p className="text-muted-foreground mt-2">
          Upload and manage your images and files
        </p>
      </div>

      <Suspense fallback={<MediaPageSkeleton />}>
        <MediaPageContent />
      </Suspense>
    </div>
  )
}