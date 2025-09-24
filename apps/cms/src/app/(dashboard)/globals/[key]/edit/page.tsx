import { notFound } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import { getValidatedTenantId } from '@/lib/tenant'
import { GlobalEditorLayout } from '@/components/editor/global-editor-layout'

const prisma = new PrismaClient()

interface EditGlobalProps {
  params: Promise<{
    key: string
  }>
}

export default async function EditGlobal({ params }: EditGlobalProps) {
  const { key } = await params
  const tenantId = await getValidatedTenantId()
  
  // Fetch the global data
  const global = await prisma.global.findFirst({
    where: {
      key,
      tenantId,
    },
  })

  // If global doesn't exist, we'll create it with default data
  const initialData = global ? {
    id: global.id,
    key: global.key,
    data: global.data,
  } : {
    key,
    data: {},
  }

  return (
    <GlobalEditorLayout 
      initialData={initialData}
      globalKey={key}
    />
  )
}
