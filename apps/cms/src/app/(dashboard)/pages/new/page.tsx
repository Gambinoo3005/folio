import { PageEditorLayout } from '@/components/editor/page-editor-layout'

export default function NewPage() {
  return (
    <PageEditorLayout 
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
