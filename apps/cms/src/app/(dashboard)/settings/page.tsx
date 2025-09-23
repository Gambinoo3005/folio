import { CmsLayout } from "@/components/cms-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { 
  Settings as SettingsIcon, 
  Building2, 
  Globe, 
  CreditCard, 
  Users, 
  HardDrive, 
  Calendar,
  Webhook,
  BarChart3,
  Crown,
  Info,
  ExternalLink
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Settings() {
  // Mock data - in real app this would come from API
  const tenantInfo = {
    name: "Acme Photography Studio",
    domain: "acmephoto.com",
    plan: "Care+",
    planTier: "care-plus" as const,
    billingCycle: "monthly"
  }

  const usage = {
    storage: { used: 2.3, limit: 10, unit: "GB" },
    seats: { used: 2, limit: 5 },
    scheduledPosts: { used: 3, limit: 20 },
    webhooks: { used: 1, limit: 5 }
  }

  const planFeatures = {
    "care": {
      name: "Care",
      description: "Perfect for getting started",
      features: {
        scheduledPosts: false,
        webhooks: false,
        analytics: "basic",
        seats: 2,
        storage: "5GB",
        versions: 5
      }
    },
    "care-plus": {
      name: "Care+",
      description: "For growing portfolios",
      features: {
        scheduledPosts: true,
        webhooks: true,
        analytics: "advanced",
        seats: 5,
        storage: "10GB",
        versions: 10
      }
    },
    "studio": {
      name: "Studio",
      description: "For professional portfolios",
      features: {
        scheduledPosts: true,
        webhooks: true,
        analytics: "premium",
        seats: 15,
        storage: "50GB",
        versions: 25
      }
    }
  }

  const currentPlan = planFeatures[tenantInfo.planTier]

  return (
    <CmsLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings, plan details, and billing.
          </p>
        </div>

        {/* Tenant Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Tenant Information
            </CardTitle>
            <CardDescription>
              Your portfolio site details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tenant Name</label>
                <p className="text-lg font-semibold">{tenantInfo.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Primary Domain</label>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <p className="text-lg font-semibold">{tenantInfo.domain}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan & Billing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Plan & Billing
            </CardTitle>
            <CardDescription>
              Current plan details and billing information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{currentPlan.name}</h3>
                  <Badge variant="secondary">{tenantInfo.billingCycle}</Badge>
                </div>
                <p className="text-muted-foreground">{currentPlan.description}</p>
              </div>
              <Button>
                <CreditCard className="mr-2 h-4 w-4" />
                Open Billing
                <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            </div>

            <Separator />

            {/* Usage Meters */}
            <div className="space-y-4">
              <h4 className="font-medium">Usage</h4>
              
              {/* Storage Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Storage</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Media files, images, and documents</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {usage.storage.used} / {usage.storage.limit} {usage.storage.unit}
                  </span>
                </div>
                <Progress 
                  value={(usage.storage.used / usage.storage.limit) * 100} 
                  className="h-2"
                />
              </div>

              {/* Seats Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Team Seats</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Number of team members who can access the CMS</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {usage.seats.used} / {usage.seats.limit}
                  </span>
                </div>
                <Progress 
                  value={(usage.seats.used / usage.seats.limit) * 100} 
                  className="h-2"
                />
              </div>

              {/* Scheduled Posts Usage */}
              {currentPlan.features.scheduledPosts && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Scheduled Posts (This Month)</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Posts scheduled to publish automatically</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {usage.scheduledPosts.used} / {usage.scheduledPosts.limit}
                    </span>
                  </div>
                  <Progress 
                    value={(usage.scheduledPosts.used / usage.scheduledPosts.limit) * 100} 
                    className="h-2"
                  />
                </div>
              )}

              {/* Webhooks Usage */}
              {currentPlan.features.webhooks && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Webhook className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Webhooks</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Automated notifications to external services</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {usage.webhooks.used} / {usage.webhooks.limit}
                    </span>
                  </div>
                  <Progress 
                    value={(usage.webhooks.used / usage.webhooks.limit) * 100} 
                    className="h-2"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Feature Toggles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Feature Access
            </CardTitle>
            <CardDescription>
              Features available with your current plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {/* Scheduled Posts */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Scheduled Publishing</p>
                    <p className="text-sm text-muted-foreground">
                      Schedule posts to publish automatically
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={currentPlan.features.scheduledPosts} 
                    disabled={!currentPlan.features.scheduledPosts}
                  />
                  {!currentPlan.features.scheduledPosts && (
                    <Badge variant="outline" className="text-xs">
                      Care+ Required
                    </Badge>
                  )}
                </div>
              </div>

              {/* Webhooks */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Webhook className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Webhooks</p>
                    <p className="text-sm text-muted-foreground">
                      Send notifications to external services
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={currentPlan.features.webhooks} 
                    disabled={!currentPlan.features.webhooks}
                  />
                  {!currentPlan.features.webhooks && (
                    <Badge variant="outline" className="text-xs">
                      Care+ Required
                    </Badge>
                  )}
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Analytics</p>
                    <p className="text-sm text-muted-foreground">
                      {currentPlan.features.analytics === "basic" && "Basic page views and traffic"}
                      {currentPlan.features.analytics === "advanced" && "Advanced analytics with insights"}
                      {currentPlan.features.analytics === "premium" && "Premium analytics with custom reports"}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {currentPlan.features.analytics}
                </Badge>
              </div>

              {/* Version History */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SettingsIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Version History</p>
                    <p className="text-sm text-muted-foreground">
                      Keep {currentPlan.features.versions} versions of each content item
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">
                  {currentPlan.features.versions} versions
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Plan Comparison</CardTitle>
            <CardDescription>
              Compare features across all available plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {Object.entries(planFeatures).map(([key, plan]) => (
                <div 
                  key={key}
                  className={`rounded-lg border p-4 ${
                    key === tenantInfo.planTier 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{plan.name}</h4>
                      {key === tenantInfo.planTier && (
                        <Badge>Current</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                    <ul className="space-y-1 text-sm">
                      <li>• {plan.features.seats} team seats</li>
                      <li>• {plan.features.storage} storage</li>
                      <li>• {plan.features.versions} versions</li>
                      <li>• {plan.features.scheduledPosts ? '✓' : '✗'} Scheduled posts</li>
                      <li>• {plan.features.webhooks ? '✓' : '✗'} Webhooks</li>
                      <li>• {plan.features.analytics} analytics</li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </CmsLayout>
  )
}
