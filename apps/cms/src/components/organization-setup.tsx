"use client"

import { useClerk } from "@clerk/nextjs"
import { Button } from "@portfolio-building-service/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@portfolio-building-service/ui"
import { Building2, ArrowRight } from "lucide-react"
import Link from "next/link"

interface OrganizationSetupProps {
  onOrganizationCreated?: () => void
}

export function OrganizationSetup({ onOrganizationCreated }: OrganizationSetupProps) {
  const { openCreateOrganization } = useClerk()

  const handleCreateOrganization = () => {
    openCreateOrganization({
      afterCreateOrganizationUrl: "/settings",
      skipInvitationScreen: true,
    })
  }

  return (
    <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <Building2 className="h-5 w-5" />
          Organization Setup Required
        </CardTitle>
        <CardDescription className="text-amber-700 dark:text-amber-300">
          You need to create or join an organization to access billing and team features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            To use the full features of Folio CMS, you need to be part of an organization. 
            This allows you to manage billing, invite team members, and organize your content.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={handleCreateOrganization}>
              Create Organization
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/sign-in'}>
              Join Organization
            </Button>
          </div>
          <div className="pt-2">
            <Link 
              href="/organization" 
              className="inline-flex items-center text-sm text-amber-700 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-200"
            >
              Learn more about organizations
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
