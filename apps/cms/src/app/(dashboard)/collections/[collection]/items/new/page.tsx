import { notFound } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import { getValidatedTenantId } from '@/lib/tenant'
import { UnifiedEditor } from '@/components/editor/unified-editor'

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
    <UnifiedEditor 
      contentType="item"
      mode="create"
      collectionId={collectionRecord.id}
      initialData={{
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
