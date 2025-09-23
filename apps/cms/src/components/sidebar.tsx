"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Globe, 
  Image, 
  Send, 
  Globe2, 
  BarChart3, 
  Settings, 
  HelpCircle 
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

interface SidebarProps {
  isCollapsed?: boolean
  className?: string
}

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Pages",
    href: "/pages",
    icon: FileText,
  },
  {
    title: "Collections",
    href: "/collections",
    icon: FolderOpen,
  },
  {
    title: "Globals",
    href: "/globals",
    icon: Globe,
  },
  {
    title: "Media",
    href: "/media",
    icon: Image,
  },
  {
    title: "Submissions",
    href: "/submissions",
    icon: Send,
  },
  {
    title: "Domains",
    href: "/domains",
    icon: Globe2,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle,
  },
]

export function Sidebar({ isCollapsed = false, className }: SidebarProps) {
  const pathname = usePathname()
  const sidebarRef = useRef<HTMLElement>(null)

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!sidebarRef.current) return

      const focusableElements = sidebarRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const focusableArray = Array.from(focusableElements) as HTMLElement[]
      const currentIndex = focusableArray.indexOf(document.activeElement as HTMLElement)

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        const nextIndex = (currentIndex + 1) % focusableArray.length
        focusableArray[nextIndex]?.focus()
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        const prevIndex = currentIndex === 0 ? focusableArray.length - 1 : currentIndex - 1
        focusableArray[prevIndex]?.focus()
      } else if (event.key === 'Home') {
        event.preventDefault()
        focusableArray[0]?.focus()
      } else if (event.key === 'End') {
        event.preventDefault()
        focusableArray[focusableArray.length - 1]?.focus()
      }
    }

    const sidebar = sidebarRef.current
    if (sidebar) {
      sidebar.addEventListener('keydown', handleKeyDown)
      return () => sidebar.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "flex h-full flex-col border-r bg-sidebar transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center border-b px-6">
        {!isCollapsed && (
          <span className="text-xl font-bold text-brand-accent">Folio</span>
        )}
        {isCollapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-accent text-brand-accent-foreground">
            <span className="text-sm font-bold">F</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Button
              key={item.href}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                isCollapsed && "px-2"
              )}
              asChild
              aria-current={isActive ? "page" : undefined}
            >
              <Link href={item.href} aria-label={isCollapsed ? item.title : undefined}>
                <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} aria-hidden="true" />
                {!isCollapsed && item.title}
              </Link>
            </Button>
          )
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t p-4">
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            {!isCollapsed && "Folio CMS v1.0"}
          </div>
        </div>
      </div>
    </aside>
  )
}

// Mobile sidebar component
export function MobileSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col border-r bg-sidebar" role="navigation" aria-label="Mobile navigation">
      {/* Mobile Sidebar Header */}
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-xl font-bold text-brand-accent">Folio</span>
      </div>

      {/* Mobile Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Button
              key={item.href}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
              asChild
              aria-current={isActive ? "page" : undefined}
            >
              <Link href={item.href}>
                <Icon className="mr-3 h-4 w-4" aria-hidden="true" />
                {item.title}
              </Link>
            </Button>
          )
        })}
      </nav>

      {/* Mobile Sidebar Footer */}
      <div className="border-t p-4">
        <div className="text-xs text-muted-foreground">
          Folio CMS v1.0
        </div>
      </div>
    </div>
  )
}
