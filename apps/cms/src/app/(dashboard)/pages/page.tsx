import { CmsLayout } from "@/components/cms-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Edit, Eye, Calendar, Trash2, Copy } from "lucide-react"
import { getPages } from "@/lib/actions/pages"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

export default async function Pages() {
  const pages = await getPages()
  return (
    <CmsLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
            <p className="text-muted-foreground">
              Manage your site's static pages like Home, About, and Contact.
            </p>
          </div>
          <Button asChild>
            <Link href="/pages/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Page
            </Link>
          </Button>
        </div>

        {/* Pages Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pages.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No pages yet</h3>
              <p className="text-muted-foreground">Create your first page to get started.</p>
            </div>
          ) : (
            pages.map((page) => (
              <Card key={page.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {page.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Badge variant={page.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                      {page.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Updated {formatDistanceToNow(page.updatedAt)} ago
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {page.publishedAt ? (
                        <span>Published {formatDistanceToNow(page.publishedAt)} ago</span>
                      ) : (
                        <span>Not published</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/pages/${page.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View
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
