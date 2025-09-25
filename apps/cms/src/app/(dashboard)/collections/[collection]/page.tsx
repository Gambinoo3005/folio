import { CmsLayout } from "@/components/cms-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Edit, Eye, Calendar, FolderOpen } from "lucide-react"
import { getCollectionItems, getCollections } from "@/lib/actions/collections"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { notFound } from "next/navigation"

interface CollectionItemsPageProps {
  params: Promise<{
    collection: string
  }>
}

export default async function CollectionItemsPage({ params }: CollectionItemsPageProps) {
  const { collection } = await params
  
  // Get collection details and items
  const [collections, items] = await Promise.all([
    getCollections(),
    getCollectionItems(collection)
  ])
  
  const collectionData = collections.find(c => c.slug === collection)
  
  if (!collectionData) {
    notFound()
  }

  const collectionName = collectionData.name
  const safeItems = items || []

  return (
    <CmsLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <FolderOpen className="h-8 w-8" />
              {collectionName} Items
            </h1>
            <p className="text-muted-foreground">
              Manage the content items within the &quot;{collectionName}&quot; collection.
            </p>
          </div>
          <Button asChild>
            <Link href={`/collections/${collection}/items/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Item
            </Link>
          </Button>
        </div>

        {/* Items List */}
        <Card>
          <CardHeader>
            <CardTitle>All Items</CardTitle>
            <CardDescription>{safeItems.length} items in this collection</CardDescription>
          </CardHeader>
          <CardContent>
            {safeItems.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No items yet</h3>
                <p className="text-muted-foreground">Create your first item for this collection.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {safeItems.map((item) => (
                  <Card key={item.id} className="flex items-center justify-between p-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-medium">{item.title}</h4>
                        <Badge variant={item.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Slug: /{collection}/{item.slug}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Updated {formatDistanceToNow(item.updatedAt)} ago
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CmsLayout>
  )
}
