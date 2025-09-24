import { CmsLayout } from "@/components/cms-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FolderOpen, FileText, Image, MessageSquare, Calendar } from "lucide-react"
import Link from "next/link"
import { getCollections } from "@/lib/actions/collections"
import { formatDistanceToNow } from "date-fns"

export default async function Collections() {
  const collections = await getCollections()
  return (
    <CmsLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
            <p className="text-muted-foreground">
              Manage your dynamic content collections like projects, posts, and galleries.
            </p>
          </div>
          <Button asChild>
            <Link href="/collections/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Collection
            </Link>
          </Button>
        </div>

        {/* Collections Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {collections.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No collections yet</h3>
              <p className="text-muted-foreground">Create your first collection to organize your content.</p>
            </div>
          ) : (
            collections.map((collection) => (
              <Card key={collection.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5" />
                    {collection.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <span>{collection.itemCount} {collection.itemCount === 1 ? 'item' : 'items'}</span>
                    <span className="text-xs text-muted-foreground">
                      Updated {formatDistanceToNow(collection.updatedAt)} ago
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Created {formatDistanceToNow(collection.createdAt)} ago</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/collections/${collection.slug}`}>
                          View All
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/collections/${collection.id}/items/new`}>
                          Add New
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </CmsLayout>
  )
}