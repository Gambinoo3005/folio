import { CmsLayout } from "@/components/cms-layout"
import { OrganizationSetup } from "@/components/organization-setup"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Settings } from "lucide-react"

export default async function OrganizationPage() {
  return (
    <CmsLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organization</h1>
          <p className="text-muted-foreground">
            Manage your organization settings and team members.
          </p>
        </div>

        {/* Organization Setup */}
        <OrganizationSetup />

        {/* Organization Information */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Organization Benefits
              </CardTitle>
              <CardDescription>
                What you get with an organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">Team collaboration</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">Billing management</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">Content organization</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">Role-based permissions</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Getting Started
              </CardTitle>
              <CardDescription>
                Steps to set up your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium">Create Organization</p>
                    <p className="text-xs text-muted-foreground">Set up your organization with a name and description</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium">Invite Team Members</p>
                    <p className="text-xs text-muted-foreground">Add collaborators to your organization</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium">Configure Settings</p>
                    <p className="text-xs text-muted-foreground">Set up billing and organization preferences</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CmsLayout>
  )
}
