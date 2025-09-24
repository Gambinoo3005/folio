import { CollectionEditorLayout } from '@/components/editor/collection-editor-layout'

export default function NewCollection() {
  return (
    <CollectionEditorLayout 
      mode="create"
      initialData={{
        name: '',
        slug: '',
        config: {
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              placeholder: 'Enter title...',
              helpText: 'The main title for this item'
            }
          ],
          displayField: 'title',
          sortField: 'title',
          sortOrder: 'asc'
        }
      }}
    />
  )
}
