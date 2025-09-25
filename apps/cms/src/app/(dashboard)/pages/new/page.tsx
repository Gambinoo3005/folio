import { UnifiedEditor } from '@/components/editor/unified-editor'

export default function NewPage() {
  return (
    <UnifiedEditor 
      contentType="page"
      mode="create"
      initialData={{
        title: '',
        slug: '',
        status: 'DRAFT',
        body: {},
        seoTitle: '',
        seoDescription: '',
        ogImageId: null,
      }}
    />
  )
}
