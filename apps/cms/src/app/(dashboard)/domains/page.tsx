"use client"

import { CmsLayout } from "@/components/cms-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Globe2, 
  Plus, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  ExternalLink,
  Copy,
  AlertTriangle,
  Shield,
  Zap
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"

export default function Domains() {
  const [checkingDomains, setCheckingDomains] = useState<Set<string>>(new Set())
  const [lastCheckResults, setLastCheckResults] = useState<Record<string, any>>({})
  // Mock data - in real app this would come from API
  const domains = [
    {
      name: "acmephoto.com",
      status: "active" as const,
      isPrimary: true,
      sslStatus: "valid" as const,
      lastChecked: "2024-01-15T10:30:00Z"
    },
    {
      name: "www.acmephoto.com",
      status: "pending" as const,
      isPrimary: false,
      sslStatus: "pending" as const,
      lastChecked: "2024-01-15T10:25:00Z"
    }
  ]

  const dnsRecords = [
    {
      type: "A",
      name: "@",
      value: "192.0.2.1",
      status: "verified" as const,
      required: true,
      description: "Root domain pointing to our servers"
    },
    {
      type: "CNAME",
      name: "www",
      value: "acmephoto.com",
      status: "verified" as const,
      required: true,
      description: "WWW subdomain redirect"
    },
    {
      type: "TXT",
      name: "_verification",
      value: "folio-verification=abc123def456",
      status: "verified" as const,
      required: true,
      description: "Domain ownership verification"
    },
    {
      type: "CNAME",
      name: "_folio-cdn",
      value: "cdn.folio.com",
      status: "pending" as const,
      required: false,
      description: "CDN optimization (optional)"
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
      case "active":
      case "valid":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
      case "invalid":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
      case "active":
      case "valid":
        return <Badge variant="default" className="bg-green-100 text-green-800">Verified</Badge>
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "failed":
      case "invalid":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // In a real app, you'd show a toast notification here
  }

  const checkDomain = async (domainName: string) => {
    setCheckingDomains(prev => new Set(prev).add(domainName))
    
    try {
      const response = await fetch('/api/v1/domains/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: domainName }),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setLastCheckResults(prev => ({
          ...prev,
          [domainName]: {
            ...result.data,
            checkedAt: new Date().toISOString(),
          }
        }))
        // In a real app, you'd show a success toast here
        console.log('Domain check completed:', result.data)
      } else {
        console.error('Domain check failed:', result.error)
        // In a real app, you'd show an error toast here
      }
    } catch (error) {
      console.error('Domain check error:', error)
      // In a real app, you'd show an error toast here
    } finally {
      setCheckingDomains(prev => {
        const newSet = new Set(prev)
        newSet.delete(domainName)
        return newSet
      })
    }
  }

  const checkAllDomains = async () => {
    for (const domain of domains) {
      await checkDomain(domain.name)
    }
  }

  return (
    <CmsLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Domains</h1>
            <p className="text-muted-foreground">
              Manage your custom domains, DNS records, and SSL certificates.
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Domain
          </Button>
        </div>

        {/* Domain List */}
        <div className="space-y-4">
          {domains.map((domain) => (
            <Card key={domain.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {domain.name}
                        {domain.isPrimary && (
                          <Badge variant="secondary" className="text-xs">Primary</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {domain.isPrimary ? "Primary domain" : "Subdomain"}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(domain.status)}
                    {getStatusBadge(domain.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">SSL Certificate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(domain.sslStatus)}
                      <span className="text-sm text-muted-foreground">
                        {domain.sslStatus === "valid" ? "Valid" : "Pending"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Performance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-muted-foreground">Optimized</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Last Checked</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(domain.lastChecked).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => checkDomain(domain.name)}
                    disabled={checkingDomains.has(domain.name)}
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${checkingDomains.has(domain.name) ? 'animate-spin' : ''}`} />
                    {checkingDomains.has(domain.name) ? 'Checking...' : 'Re-check'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit Site
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* DNS Records Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              DNS Configuration Checklist
            </CardTitle>
            <CardDescription>
              Configure these DNS records with your domain provider to complete setup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dnsRecords.map((record, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-medium">
                              {record.type} {record.name}
                            </span>
                            {record.required && (
                              <Badge variant="outline" className="text-xs">Required</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {record.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-mono text-sm bg-muted px-2 py-1 rounded">
                          {record.value}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(record.value)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy to clipboard</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        {getStatusBadge(record.status)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Verification Status</h4>
                  <p className="text-sm text-muted-foreground">
                    Overall domain verification progress
                  </p>
                </div>
                <Button 
                  variant="outline"
                  onClick={checkAllDomains}
                  disabled={checkingDomains.size > 0}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${checkingDomains.size > 0 ? 'animate-spin' : ''}`} />
                  {checkingDomains.size > 0 ? 'Checking...' : 'Re-check All'}
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">DNS Records</span>
                    <span className="text-sm text-muted-foreground">3/4 verified</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">SSL Certificate</span>
                    <span className="text-sm text-muted-foreground">1/2 valid</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Common issues and solutions for domain setup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">DNS Propagation</h4>
                <p className="text-sm text-muted-foreground">
                  DNS changes can take up to 48 hours to propagate worldwide. 
                  If your records show as "pending" after 24 hours, contact your domain provider.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">SSL Certificate Issues</h4>
                <p className="text-sm text-muted-foreground">
                  SSL certificates are automatically provisioned once DNS records are verified. 
                  This process typically takes 5-10 minutes after DNS propagation.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Common DNS Providers</h4>
                <p className="text-sm text-muted-foreground">
                  Popular providers: Cloudflare, GoDaddy, Namecheap, Google Domains, Route 53. 
                  Each has different interfaces but the DNS record types remain the same.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CmsLayout>
  )
}
