"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50 w-full transition-all duration-200 border-b border-border/50 bg-background"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-[#059669] to-[#34D399] flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-foreground font-semibold text-base sm:text-lg">Portfolio CMS</span>
            </Link>
          </motion.div>

          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center space-x-8"
          >
            <Link
              href="/work"
              className="text-foreground hover:text-brand-accent transition-colors text-sm font-medium relative group"
            >
              Work
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-accent transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link
              href="/pricing"
              className="text-foreground hover:text-brand-accent transition-colors text-sm font-medium relative group"
            >
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-accent transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link
              href="/contact"
              className="text-foreground hover:text-brand-accent transition-colors text-sm font-medium relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-accent transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:flex items-center space-x-4"
          >
            <Link
              href={`${process.env.NEXT_PUBLIC_APP_ORIGIN}/login`}
              className="text-foreground hover:text-brand-accent transition-colors text-sm font-medium"
            >
              Sign in
            </Link>
            <ThemeToggle />
          </motion.div>

          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground hover:text-brand-accent transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border/50 py-4"
          >
            <nav className="flex flex-col space-y-4">
              <Link
                href="/work"
                className="text-foreground hover:text-brand-accent transition-colors text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Work
              </Link>
              <Link
                href="/pricing"
                className="text-foreground hover:text-brand-accent transition-colors text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                className="text-foreground hover:text-brand-accent transition-colors text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-border/50">
                <Link
                  href={`${process.env.NEXT_PUBLIC_APP_ORIGIN}/login`}
                  className="text-foreground hover:text-brand-accent transition-colors text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}
