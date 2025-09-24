import { notFound } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import { getValidatedTenantId } from '@/lib/tenant'
import { ItemEditorLayout } from '@/components/editor/item-editor-layout'

const prisma = new PrismaClient()

interface EditItemProps {
  params: Promise<{
    collection: string
    id: string
  }>
}

export default async function EditItem({ params }: EditItemProps) {
  const { collection, id } = await params
  const tenantId = await getValidatedTenantId()
  
  // First find the collection by slug
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
  
  // Fetch the item data
  const item = await prisma.item.findFirst({
    where: {
      id,
      collectionId: collectionRecord.id,
      tenantId,
      deletedAt: null,
    },
  })

  if (!item) {
    notFound()
  }

  return (
    <ItemEditorLayout 
      mode="edit"
      initialData={{
        id: item.id,
        collectionId: item.collectionId,
        title: item.title,
        slug: item.slug,
        status: item.status,
        content: item.content,
        seo: item.seo as any,
        mediaRefs: [],
      }}
    />
  )
}
