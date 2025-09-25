"use client"

import { useState, useEffect } from "react"
import { CmsLayout } from "@/components/cms-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@portfolio-building-service/ui"
import { Button } from "@portfolio-building-service/ui"
import { Plus, FolderOpen, FileText, Image, MessageSquare } from "lucide-react"
import Link from "next/link"
import { CollectionsLoadingWrapper } from "@/components/loading-wrapper"
import { EmptyCollections } from "@/components/ui/empty-states"
import { useLoading } from "@/hooks/use-loading"
import { cmsToasts } from "@/lib/toast"

// Mock data fetching functions
const fetchCollectionsData = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Simulate random success/failure
  if (Math.random() > 0.7) {
    throw new Error("Failed to load collections data")
  }
  
  // Simulate empty collections (set to true to see empty state)
  const isEmpty = false
  
  if (isEmpty) {
    return { collections: [] }
  }
  
  return {
    collections: [
      {
        id: "projects",
        name: "Projects",
        icon: FolderOpen,
        description: "12 items • Showcase your work",
        count: 12,
        href: "/collections/projects"
      },
      {
        id: "posts",
        name: "Posts",
        icon: FileText,
        description: "8 items • Blog posts and articles",
        count: 8,
        href: "/collections/posts"
      },
      {
        id: "galleries",
        name: "Galleries",
        icon: Image,
        description: "5 items • Photo galleries",
        count: 5,
        href: "/collections/galleries"
      },
      {
        id: "testimonials",
        name: "Testimonials",
        icon: MessageSquare,
        description: "3 items • Client feedback",
        count: 3,
        href: "/collections/testimonials"
      }
    ]
  }
}

export function CollectionsWithStates() {
  const { isLoading, error, execute, reset } = useLoading(true)
  const [data, setData] = useState<any>(null)

  const loadCollectionsData = async () => {
    const result = await execute(fetchCollectionsData)
    if (result) {
      setData(result)
      cmsToasts.success("Collections loaded", "Your collections data has been refreshed")
    }
  }

  useEffect(() => {
    loadCollectionsData()
  }, [])

  const handleRetry = () => {
    reset()
    loadCollectionsData()
  }

  const handleCreateCollection = () => {
    cmsToasts.info("Create collection", "This feature will be available soon")
  }

  // Show empty state if no collections exist
  if (data && data.collections.length === 0) {
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
            <Button onClick={handleCreateCollection}>
              <Plus className="mr-2 h-4 w-4" />
              Add Collection
            </Button>
          </div>

          <EmptyCollections collectionType="collections" />
        </div>
      </CmsLayout>
    )
  }

  return (
    <CmsLayout>
      <CollectionsLoadingWrapper
        isLoading={isLoading}
        error={error}
        onRetry={handleRetry}
      >
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
              <p className="text-muted-foreground">
                Manage your dynamic content collections like projects, posts, and galleries.
              </p>
            </div>
            <Button onClick={handleCreateCollection}>
              <Plus className="mr-2 h-4 w-4" />
              Add Collection
            </Button>
          </div>

          {/* Collections Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.collections.map((collection: any) => {
              const IconComponent = collection.icon
              return (
                <Card key={collection.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5" />
                      {collection.name}
                    </CardTitle>
                    <CardDescription>
                      {collection.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={collection.href}>View All</Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`${collection.href}/new`}>Add New</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </CollectionsLoadingWrapper>
    </CmsLayout>
  )
}
