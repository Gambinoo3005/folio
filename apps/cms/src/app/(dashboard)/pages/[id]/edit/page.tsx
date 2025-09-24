import { notFound } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import { getValidatedTenantId } from '@/lib/tenant'
import { PageEditorLayout } from '@/components/editor/page-editor-layout'

const prisma = new PrismaClient()

interface EditPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditPage({ params }: EditPageProps) {
  const { id } = await params
  const tenantId = await getValidatedTenantId()
  
  // Fetch the page data
  const page = await prisma.page.findFirst({
    where: {
      id,
      tenantId,
      deletedAt: null,
    },
  })

  if (!page) {
    notFound()
  }

  return (
    <PageEditorLayout 
      mode="edit"
      initialData={{
        id: page.id,
        title: page.title,
        slug: page.slug,
        status: page.status,
        body: page.body,
        seoTitle: page.seoTitle || '',
        seoDescription: page.seoDescription || '',
        ogImageId: page.ogImageId,
      }}
    />
  )
}
