"use client"

import { UserButton, OrganizationSwitcher } from "@clerk/nextjs"
import { Menu } from "lucide-react"
import { Button } from "@portfolio-building-service/ui"
import { Sheet, SheetContent, SheetTrigger } from "@portfolio-building-service/ui"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@portfolio-building-service/ui"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sidebar } from "./sidebar"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"

interface TopbarProps {
  onMenuClick?: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Generate breadcrumb from pathname
  const generateBreadcrumb = () => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbItems = []
    
    // Always start with Dashboard
    breadcrumbItems.push(
      <BreadcrumbItem key="dashboard">
        <BreadcrumbLink asChild>
          <Link href="/">Dashboard</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
    )
    
    // Add other segments
    segments.forEach((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/')
      const isLast = index === segments.length - 1
      const label = segment.charAt(0).toUpperCase() + segment.slice(1)
      
      if (isLast) {
        breadcrumbItems.push(
          <BreadcrumbItem key={segment}>
            <BreadcrumbPage>{label}</BreadcrumbPage>
          </BreadcrumbItem>
        )
      } else {
        breadcrumbItems.push(
          <BreadcrumbItem key={segment}>
            <BreadcrumbLink asChild>
              <Link href={href}>{label}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        )
      }
      
      if (!isLast) {
        breadcrumbItems.push(
          <BreadcrumbSeparator key={`sep-${segment}`} />
        )
      }
    })
    
    return breadcrumbItems
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left: Logo and Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              {mounted ? (
                <Sidebar />
              ) : (
                <div className="flex h-full flex-col">
                  <div className="flex h-16 items-center border-b px-6">
                    <div className="w-16 h-6 bg-muted rounded animate-pulse"></div>
                  </div>
                  <div className="flex-1 p-4 space-y-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="w-full h-10 bg-muted rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
          
          {/* Desktop menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={onMenuClick}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-brand-accent">Folio</span>
          </Link>
        </div>

        {/* Center: Breadcrumb */}
        <div className="hidden md:flex">
          <Breadcrumb>
            <BreadcrumbList>
              {generateBreadcrumb()}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Right: Organization Switcher, Theme Toggle, User Button */}
        <div className="flex items-center gap-2">
          {mounted ? (
            <>
              <OrganizationSwitcher
                appearance={{
                  elements: {
                    organizationSwitcherTrigger: "px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors",
                  },
                }}
              />
              <ThemeToggle />
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </>
          ) : (
            // Loading placeholder to prevent layout shift
            <div className="flex items-center gap-2">
              <div className="w-20 h-8 bg-muted rounded-md animate-pulse"></div>
              <div className="w-12 h-6 bg-muted rounded-full animate-pulse"></div>
              <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
