import { CmsLayout } from "@/components/cms-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@portfolio-building-service/ui"
import { FileText, FolderOpen, Image, BarChart3 } from "lucide-react"
import { RecentEditsSection } from "@/components/dashboard/recent-edits-section"
import { QuickActionsSection } from "@/components/dashboard/quick-actions-section"
import { UsageSection } from "@/components/dashboard/usage-section"
import { PublishingStatusSection } from "@/components/dashboard/publishing-status-section"
import { getRecentEdits, getUsageStats, getPublishingStatus } from "@/lib/adapters/dashboard-adapters"

export default async function Dashboard() {
  // Fetch all dashboard data on the server
  const [recentEdits, usageStats, publishingStatus] = await Promise.all([
    getRecentEdits(),
    getUsageStats(),
    getPublishingStatus(),
  ])

  return (
    <CmsLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your content.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pages</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageStats.pages.total}</div>
              <p className="text-xs text-muted-foreground">
                {usageStats.pages.published} published, {usageStats.pages.drafts} drafts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collections</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageStats.collections.total}</div>
              <p className="text-xs text-muted-foreground">
                {usageStats.items.total} total items
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Media</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageStats.media.total}</div>
              <p className="text-xs text-muted-foreground">
                {(usageStats.media.totalSize / 1024 / 1024).toFixed(1)} MB used
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishingStatus.publishedCount}</div>
              <p className="text-xs text-muted-foreground">
                {publishingStatus.draftCount} drafts pending
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Sections */}
        <div className="grid gap-6 md:grid-cols-2">
          <RecentEditsSection recentEdits={recentEdits} />
          <PublishingStatusSection publishingStatus={publishingStatus} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <UsageSection usageStats={usageStats} />
          <QuickActionsSection />
        </div>
      </div>
    </CmsLayout>
  )
}