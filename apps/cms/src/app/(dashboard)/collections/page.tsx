import { CmsLayout } from "@/components/cms-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FolderOpen, FileText, Image, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function Collections() {
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
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Collection
          </Button>
        </div>

        {/* Collections Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Projects
              </CardTitle>
              <CardDescription>
                12 items • Showcase your work
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View All
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/collections/projects/new">Add New</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Posts
              </CardTitle>
              <CardDescription>
                8 items • Blog posts and articles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View All
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/collections/posts/new">Add New</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Galleries
              </CardTitle>
              <CardDescription>
                5 items • Photo galleries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View All
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/collections/galleries/new">Add New</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Testimonials
              </CardTitle>
              <CardDescription>
                3 items • Client feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View All
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/collections/testimonials/new">Add New</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CmsLayout>
  )
}