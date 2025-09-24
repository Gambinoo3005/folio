import { notFound } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import { getValidatedTenantId } from '@/lib/tenant'
import { ItemEditorLayout } from '@/components/editor/item-editor-layout'

const prisma = new PrismaClient()

interface NewItemProps {
  params: Promise<{
    collection: string
  }>
}

export default async function NewItem({ params }: NewItemProps) {
  const { collection } = await params
  const tenantId = await getValidatedTenantId()
  
  // Verify collection exists and belongs to tenant
  const collectionRecord = await prisma.collection.findFirst({
    where: {
      tenantId,
      slug: collection,
    },
    select: {
      id: true,
    },
  })

  if (!collectionRecord) {
    notFound()
  }

  return (
    <ItemEditorLayout 
      mode="create"
      initialData={{
        collectionId: collectionRecord.id,
        title: '',
        slug: '',
        status: 'DRAFT',
        content: {},
        seo: {},
        mediaRefs: [],
      }}
    />
  )
}
