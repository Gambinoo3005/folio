"use client"

import { useState } from "react"
import { CmsLayout } from "@/components/cms-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  DashboardStatsSkeleton, 
  DashboardRecentEditsSkeleton, 
  DashboardQuickActionsSkeleton,
  EditorLayoutSkeleton,
  MediaLibrarySkeleton,
  CollectionsListSkeleton,
  SettingsSkeleton,
  TableSkeleton,
  FormSkeleton
} from "@/components/ui/skeleton-variants"
import { 
  EmptyDashboard,
  EmptyPages,
  EmptyCollections,
  EmptyMediaLibrary,
  EmptyAnalytics,
  EmptySubmissions,
  EmptyDomains,
  EmptyGlobals,
  EmptyHelp,
  LoadingState,
  ErrorState
} from "@/components/ui/empty-states"
import { DashboardLoadingWrapper } from "@/components/loading-wrapper"
import { useLoading } from "@/hooks/use-loading"
import { cmsToasts } from "@/lib/toast"
import { debugToast } from "@/lib/toast-debug"

export default function DemoStates() {
  const [activeTab, setActiveTab] = useState("skeletons")
  const { isLoading, error, execute, reset } = useLoading(false)

  const handleToastDemo = () => {
    console.log("Toast demo called")
    console.log("cmsToasts:", cmsToasts)
    console.log("cmsToasts.success:", typeof cmsToasts.success)
    
    try {
      debugToast.success("Success!", "This is a success message")
      setTimeout(() => debugToast.info("Info", "This is an info message"), 1000)
      setTimeout(() => debugToast.warning("Warning", "This is a warning message"), 2000)
      setTimeout(() => debugToast.error("Error", "This is an error message"), 3000)
    } catch (error) {
      console.error("Toast demo error:", error)
    }
  }

  const handleLoadingDemo = async () => {
    await execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 3000))
      if (Math.random() > 0.5) {
        throw new Error("Simulated error occurred")
      }
      return "Success!"
    })
  }

  const handleRetry = () => {
    reset()
    handleLoadingDemo()
  }

  return (
    <CmsLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loading & Empty States Demo</h1>
          <p className="text-muted-foreground">
            This page demonstrates all the loading, empty, and error states used throughout the CMS.
          </p>
        </div>

        {/* Interactive Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Demo</CardTitle>
            <CardDescription>
              Try out the loading states and toast notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={handleToastDemo}>
                Show Toast Messages (Debug)
              </Button>
              <Button onClick={() => {
                console.log("Testing cmsToasts directly...")
                console.log("cmsToasts object:", cmsToasts)
                console.log("cmsToasts.success type:", typeof cmsToasts.success)
                if (typeof cmsToasts.success === 'function') {
                  cmsToasts.success("Direct test", "Testing cmsToasts directly")
                } else {
                  console.error("cmsToasts.success is not a function!")
                }
              }} variant="outline">
                Test cmsToasts Direct
              </Button>
              <Button onClick={handleLoadingDemo} disabled={isLoading}>
                {isLoading ? "Loading..." : "Simulate Loading"}
              </Button>
              {error && (
                <Button onClick={handleRetry} variant="outline">
                  Retry
                </Button>
              )}
            </div>
            
            {isLoading && (
              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Loading in progress...</p>
              </div>
            )}
            
            {error && (
              <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <p className="text-sm text-destructive">Error: {error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* States Demo */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="skeletons">Skeletons</TabsTrigger>
            <TabsTrigger value="empty">Empty States</TabsTrigger>
            <TabsTrigger value="loading">Loading States</TabsTrigger>
            <TabsTrigger value="error">Error States</TabsTrigger>
          </TabsList>

          <TabsContent value="skeletons" className="space-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Dashboard Skeletons</h3>
                <div className="space-y-4">
                  <DashboardStatsSkeleton />
                  <div className="grid gap-6 md:grid-cols-2">
                    <DashboardRecentEditsSkeleton />
                    <DashboardQuickActionsSkeleton />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Editor Skeleton</h3>
                <EditorLayoutSkeleton />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Media Library Skeleton</h3>
                <MediaLibrarySkeleton />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Collections Skeleton</h3>
                <CollectionsListSkeleton />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Settings Skeleton</h3>
                <SettingsSkeleton />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Table & Form Skeletons</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Table Skeleton</h4>
                    <TableSkeleton rows={5} columns={4} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Form Skeleton</h4>
                    <FormSkeleton fields={4} />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="empty" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <EmptyDashboard />
              <EmptyPages />
              <EmptyCollections collectionType="projects" />
              <EmptyCollections collectionType="posts" />
              <EmptyCollections collectionType="galleries" />
              <EmptyMediaLibrary />
              <EmptyAnalytics />
              <EmptySubmissions />
              <EmptyDomains />
              <EmptyGlobals />
              <EmptyHelp />
            </div>
          </TabsContent>

          <TabsContent value="loading" className="space-y-6">
            <div className="space-y-6">
              <LoadingState message="Loading dashboard..." />
              <LoadingState message="Loading media library..." />
              <LoadingState message="Loading collections..." />
              <LoadingState message="Loading settings..." />
            </div>
          </TabsContent>

          <TabsContent value="error" className="space-y-6">
            <div className="space-y-6">
              <ErrorState 
                title="Network Error"
                description="Unable to connect to the server. Please check your internet connection and try again."
                onRetry={() => console.log("Retry clicked")}
              />
              <ErrorState 
                title="Permission Denied"
                description="You don't have permission to access this resource. Please contact your administrator."
              />
              <ErrorState 
                title="Server Error"
                description="The server encountered an unexpected error. Please try again later."
                onRetry={() => console.log("Retry clicked")}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </CmsLayout>
  )
}
