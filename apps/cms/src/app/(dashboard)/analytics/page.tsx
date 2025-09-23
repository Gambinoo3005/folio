import { CmsLayout } from "@/components/cms-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, Eye, MousePointer, TrendingUp } from "lucide-react"

export default function Analytics() {
  return (
    <CmsLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Track your site's performance and visitor insights.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,350</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,847</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42%</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                -3% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2m 34s</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +15s from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>
                Most visited pages this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Home</p>
                    <p className="text-sm text-muted-foreground">/</p>
                  </div>
                  <div className="text-sm font-medium">1,234 views</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">About</p>
                    <p className="text-sm text-muted-foreground">/about</p>
                  </div>
                  <div className="text-sm font-medium">567 views</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Projects</p>
                    <p className="text-sm text-muted-foreground">/projects</p>
                  </div>
                  <div className="text-sm font-medium">345 views</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>
                Where your visitors come from
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Direct</p>
                    <p className="text-sm text-muted-foreground">Direct visits</p>
                  </div>
                  <div className="text-sm font-medium">45%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Google</p>
                    <p className="text-sm text-muted-foreground">Organic search</p>
                  </div>
                  <div className="text-sm font-medium">32%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Social</p>
                    <p className="text-sm text-muted-foreground">Social media</p>
                  </div>
                  <div className="text-sm font-medium">23%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CmsLayout>
  )
}
