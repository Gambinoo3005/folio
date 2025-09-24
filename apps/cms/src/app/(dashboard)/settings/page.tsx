import { CmsLayout } from "@/components/cms-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OrganizationSetup } from "@/components/organization-setup"
import { 
  Settings as SettingsIcon, 
  Building2, 
  Globe, 
  CreditCard, 
  Users, 
  HardDrive,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import { getCurrentTenantBilling } from "@/server/actions/billing"
import { getTenantUsage } from "@/server/features"
import { BillingPlan } from "@prisma/client"

function getPlanDisplayName(plan: BillingPlan | null) {
  switch (plan) {
    case BillingPlan.CARE:
      return 'Care'
    case BillingPlan.CARE_PLUS:
      return 'Care+'
    case BillingPlan.STUDIO:
      return 'Studio'
    default:
      return 'No Plan'
  }
}

export default async function Settings() {
  let billing = null;
  let usage = null;
  let hasOrganization = true;

  try {
    billing = await getCurrentTenantBilling();
    usage = await getTenantUsage(billing?.tenantId || '');
  } catch (error) {
    // Handle case where no organization is selected
    if (error instanceof Error && error.message.includes('No organization selected')) {
      hasOrganization = false;
    } else if (error instanceof Error && error.message.includes('does not exist')) {
      // Handle case where billing tables don't exist yet (database migration needed)
      hasOrganization = true; // User has org, but billing tables missing
      console.warn('Billing tables not found. Database migration may be needed:', error.message);
    } else {
      // Re-throw other errors
      throw error;
    }
  }

  const plan = billing?.plan || null
  const status = billing?.status || 'INACTIVE'

  return (
    <CmsLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings, plan details, and billing.
          </p>
        </div>

        {/* Organization Setup Required */}
        {!hasOrganization && (
          <OrganizationSetup />
        )}

        {/* Database Migration Required */}
        {hasOrganization && !billing && (
          <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <Settings className="h-5 w-5" />
                Database Setup Required
              </CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                Your organization is set up, but the billing tables need to be created.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  The database migration needs to be run to create the billing tables. 
                  Please run the following command in your terminal:
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                  <code className="text-sm">
                    cd apps/cms && npx prisma migrate deploy
                  </code>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Make sure your database server is running before executing this command.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Overview - Only show when organization exists */}
        {hasOrganization && (
          <>
            <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getPlanDisplayName(plan)}</div>
              <p className="text-xs text-muted-foreground">
                Status: {status}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usage ? (usage.mediaBytes / 1024 / 1024 / 1024).toFixed(1) : '0.0'} GB
              </div>
              <p className="text-xs text-muted-foreground">
                {plan === BillingPlan.CARE ? 'Limit: 5GB' : plan === BillingPlan.CARE_PLUS ? 'Limit: 25GB' : 'Limit: 100GB'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usage ? usage.seats : 1}</div>
              <p className="text-xs text-muted-foreground">
                {plan === BillingPlan.CARE ? 'Limit: 2' : plan === BillingPlan.CARE_PLUS ? 'Limit: 5' : 'Limit: 20'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Settings Sections */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Billing & Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing & Usage
              </CardTitle>
              <CardDescription>
                Manage your subscription and view usage details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Plan</span>
                  <Badge variant="outline">{getPlanDisplayName(plan)}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant={status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {status}
                  </Badge>
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href="/settings/billing">
                  View Billing Details
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Content Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Content Overview
              </CardTitle>
              <CardDescription>
                Your current content and usage statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Pages</div>
                  <div className="text-2xl font-bold">{usage ? usage.pages : 0}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Items</div>
                  <div className="text-2xl font-bold">{usage ? usage.items : 0}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Collections</div>
                  <div className="text-2xl font-bold">{usage ? usage.collections : 0}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Media Files</div>
                  <div className="text-2xl font-bold">
                    {usage ? Math.round(usage.mediaBytes / 1024 / 1024) : 0} MB
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common settings and management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button variant="outline" asChild>
                <Link href="/settings/billing">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Manage Billing
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/collections">
                  <Globe className="h-4 w-4 mr-2" />
                  Manage Content
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/media">
                  <HardDrive className="h-4 w-4 mr-2" />
                  Manage Media
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
          </>
        )}
      </div>
    </CmsLayout>
  )
}