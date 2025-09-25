"use client"

import { useState, useEffect } from "react"
import { Topbar } from "./topbar"
import { Sidebar } from "./sidebar"

interface CmsLayoutProps {
  children: React.ReactNode
}

interface CmsLayoutEmptyProps {
  children: React.ReactNode
}

export function CmsLayout({ children }: CmsLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Handle escape key to close mobile sidebar
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSidebarCollapsed(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <div className="flex h-screen bg-background">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:border focus:border-border focus:rounded-md focus:text-foreground focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar 
          isCollapsed={sidebarCollapsed}
          className="transition-all duration-300"
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        <Topbar onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        <main 
          id="main-content"
          className="flex-1 overflow-auto p-6 focus:outline-none"
          tabIndex={-1}
        >
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export function CmsLayoutEmpty({ children }: CmsLayoutEmptyProps) {
  return (
    <div className="flex h-screen bg-background">
      <div className="flex flex-1 flex-col overflow-hidden">
        <main 
          id="main-content"
          className="flex-1 overflow-auto p-6 focus:outline-none"
          tabIndex={-1}
        >
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}