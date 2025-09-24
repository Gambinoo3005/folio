import { CmsLayout } from "@/components/cms-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  CreditCard, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Pause
} from "lucide-react"
import { getCurrentTenantBilling, getCurrentTenantFeatureFlags } from "@/server/actions/billing"
import { getTenantUsage } from "@/server/features"
import { BillingStatus, BillingPlan } from "@prisma/client"
import { format } from "date-fns"
import { BillingPortalButton } from "@/components/billing/billing-portal-button"

function getStatusIcon(status: BillingStatus) {
  switch (status) {
    case 'ACTIVE':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'PAST_DUE':
      return <AlertCircle className="h-4 w-4 text-red-500" />
    case 'CANCELED':
      return <XCircle className="h-4 w-4 text-gray-500" />
    case 'PAUSED':
      return <Pause className="h-4 w-4 text-yellow-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
  }
}

function getStatusColor(status: BillingStatus) {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-500'
    case 'PAST_DUE':
      return 'bg-red-500'
    case 'CANCELED':
      return 'bg-gray-500'
    case 'PAUSED':
      return 'bg-yellow-500'
    default:
      return 'bg-gray-500'
  }
}

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

export default async function BillingPage() {
  const billing = await getCurrentTenantBilling();
  const featureFlags = await getCurrentTenantFeatureFlags();
  const usage = await getTenantUsage(billing?.tenantId || '');

  const plan = billing?.plan || null
  const status = billing?.status || 'INACTIVE'
  const currentPeriodEnd = billing?.currentPeriodEnd

  return (
    <CmsLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Usage</h1>
          <p className="text-muted-foreground">
            Manage your subscription, view usage, and update payment methods.
          </p>
        </div>

        {/* Current Plan Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Current Plan
            </CardTitle>
            <CardDescription>
              Your current subscription and billing status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{getPlanDisplayName(plan)}</h3>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getStatusIcon(status)}
                    {status}
                  </Badge>
                </div>
                {currentPeriodEnd && (
                  <p className="text-sm text-muted-foreground">
                    Next billing date: {format(currentPeriodEnd, 'PPP')}
                  </p>
                )}
              </div>
              {status === 'ACTIVE' && (
                <BillingPortalButton />
              )}
            </div>

            {status === 'INACTIVE' && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">No Active Subscription</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Contact support to start your subscription and unlock all features.
                </p>
              </div>
            )}

            {status === 'PAST_DUE' && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Payment Failed</span>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  Please update your payment method to continue using the service.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Usage Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Overview</CardTitle>
            <CardDescription>
              Current usage against your plan limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Storage Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Storage</span>
                <span>
                  {(usage.mediaBytes / 1024 / 1024 / 1024).toFixed(2)} GB used
                </span>
              </div>
              <Progress 
                value={plan ? (usage.mediaBytes / (plan === BillingPlan.CARE ? 5 : plan === BillingPlan.CARE_PLUS ? 25 : 100) / 1024 / 1024 / 1024) * 100 : 0} 
                className="h-2" 
              />
              <p className="text-xs text-muted-foreground">
                Plan includes {plan === BillingPlan.CARE ? '5' : plan === BillingPlan.CARE_PLUS ? '25' : '100'} GB
              </p>
            </div>

            <Separator />

            {/* Team Seats */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Team Seats</span>
                <span>{usage.seats} used</span>
              </div>
              <Progress 
                value={plan ? (usage.seats / (plan === BillingPlan.CARE ? 2 : plan === BillingPlan.CARE_PLUS ? 5 : 20)) * 100 : 0} 
                className="h-2" 
              />
              <p className="text-xs text-muted-foreground">
                Plan includes {plan === BillingPlan.CARE ? '2' : plan === BillingPlan.CARE_PLUS ? '5' : '20'} seats
              </p>
            </div>

            <Separator />

            {/* Content Usage */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium">Pages</div>
                <div className="text-2xl font-bold">{usage.pages}</div>
                <div className="text-xs text-muted-foreground">
                  {plan === BillingPlan.CARE ? 'Limit: 10' : plan === BillingPlan.CARE_PLUS ? 'Limit: 50' : 'Unlimited'}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Items</div>
                <div className="text-2xl font-bold">{usage.items}</div>
                <div className="text-xs text-muted-foreground">
                  {plan === BillingPlan.CARE ? 'Limit: 50' : plan === BillingPlan.CARE_PLUS ? 'Limit: 200' : 'Unlimited'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Features */}
        <Card>
          <CardHeader>
            <CardTitle>Plan Features</CardTitle>
            <CardDescription>
              Features included in your current plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { name: 'Custom Domains', available: plan === BillingPlan.CARE_PLUS || plan === BillingPlan.STUDIO },
                { name: 'Advanced SEO', available: plan === BillingPlan.CARE_PLUS || plan === BillingPlan.STUDIO },
                { name: 'Scheduled Publishing', available: plan === BillingPlan.CARE_PLUS || plan === BillingPlan.STUDIO },
                { name: 'Form Submissions', available: plan === BillingPlan.CARE_PLUS || plan === BillingPlan.STUDIO },
                { name: 'Redirects', available: plan === BillingPlan.CARE_PLUS || plan === BillingPlan.STUDIO },
                { name: 'Webhooks', available: plan === BillingPlan.STUDIO },
                { name: 'API Access', available: plan === BillingPlan.STUDIO },
                { name: 'White Label', available: plan === BillingPlan.STUDIO },
                { name: 'Priority Support', available: plan === BillingPlan.STUDIO },
              ].map((feature) => (
                <div key={feature.name} className="flex items-center gap-2">
                  {feature.available ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className={feature.available ? 'text-foreground' : 'text-muted-foreground'}>
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </CmsLayout>
  )
}
