"use client"

import Link from "next/link"
import { Github, Twitter, Instagram } from "lucide-react"
import { motion } from "framer-motion"

export function Footer() {
  return (
    <footer className="bg-brand-section border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-[#059669] to-[#34D399] flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-brand font-semibold text-lg">Portfolio CMS</span>
            </div>
            <p className="text-brand-muted text-sm leading-relaxed">
              Bespoke portfolio websites with built-in CMS. Crafted for creatives who demand excellence.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-brand font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/work" className="text-brand-muted hover:text-brand-accent transition-colors text-sm">
                  Work
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-brand-muted hover:text-brand-accent transition-colors text-sm">
                  Pricing
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-brand font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-brand-muted hover:text-brand-accent transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-brand font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-brand-muted hover:text-brand-accent transition-colors text-sm">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-brand-muted hover:text-brand-accent transition-colors text-sm">
                  Privacy
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center"
        >
          <p className="text-brand-muted text-sm">© 2025 Portfolio CMS. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Link href="#" className="text-brand-muted hover:text-brand-accent transition-colors">
              <Github className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-brand-muted hover:text-brand-accent transition-colors">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-brand-muted hover:text-brand-accent transition-colors">
              <Instagram className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
