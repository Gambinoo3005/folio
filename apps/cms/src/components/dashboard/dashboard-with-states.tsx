"use client"

import { useState, useEffect } from "react"
import { CmsLayout } from "@/components/cms-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FolderOpen, Image, BarChart3 } from "lucide-react"
import { RecentEditsSection } from "@/components/dashboard/recent-edits-section"
import { QuickActionsSection } from "@/components/dashboard/quick-actions-section"
import { UsageSection } from "@/components/dashboard/usage-section"
import { PublishingStatusSection } from "@/components/dashboard/publishing-status-section"
import { DashboardLoadingWrapper } from "@/components/loading-wrapper"
import { EmptyDashboard } from "@/components/ui/empty-states"
import { useLoading } from "@/hooks/use-loading"
import { cmsToasts } from "@/lib/toast"

// Mock data fetching functions
const fetchDashboardData = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Simulate random success/failure
  if (Math.random() > 0.8) {
    throw new Error("Failed to load dashboard data")
  }
  
  return {
    pages: 3,
    projects: 12,
    mediaFiles: 45,
    pageViews: 2350,
    hasContent: true
  }
}

export function DashboardWithStates() {
  const { isLoading, error, execute, reset } = useLoading(true)
  const [data, setData] = useState<any>(null)

  const loadDashboardData = async () => {
    const result = await execute(fetchDashboardData)
    if (result) {
      setData(result)
      cmsToasts.success("Dashboard loaded", "Your dashboard data has been refreshed")
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const handleRetry = () => {
    reset()
    loadDashboardData()
  }

  // Show empty state if no content exists
  if (data && !data.hasContent) {
    return (
      <CmsLayout>
        <EmptyDashboard />
      </CmsLayout>
    )
  }

  return (
    <CmsLayout>
      <DashboardLoadingWrapper
        isLoading={isLoading}
        error={error}
        onRetry={handleRetry}
      >
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to your portfolio CMS. Manage your content and track your site&apos;s performance.
            </p>
          </div>

          {/* Overview Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pages</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.pages || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +1 from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projects</CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.projects || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +3 from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Media Files</CardTitle>
                <Image className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.mediaFiles || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +8 from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.pageViews || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +180 from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Sections */}
          <div className="grid gap-6 md:grid-cols-2">
            <RecentEditsSection />
            <QuickActionsSection />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <UsageSection />
            <PublishingStatusSection />
          </div>
        </div>
      </DashboardLoadingWrapper>
    </CmsLayout>
  )
}
