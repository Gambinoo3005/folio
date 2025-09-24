"use client"

import { motion } from "framer-motion"
import { Palette, Settings, Shield, Zap } from "lucide-react"

export function ValuePropsSection() {
  const valueProps = [
    {
      icon: Palette,
      title: "Truly Custom",
      description: "No templates. Designed & engineered to your taste.",
      color: "#059669",
    },
    {
      icon: Settings,
      title: "CMS, minus the noise",
      description: "Edit pages & projects, images auto-optimized.",
      color: "#34D399",
    },
    {
      icon: Shield,
      title: "Tech you can trust",
      description: "Next.js + Postgres (RLS), Cloudflare Images, ISR.",
      color: "#059669",
    },
    {
      icon: Zap,
      title: "Fast by default",
      description: "CDN-optimized, cache-tagged, SEO-ready.",
      color: "#34D399",
    },
  ]

  return (
    <section className="bg-brand-dark py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-brand mb-4 text-balance">Built different, built better</h2>
          <p className="text-xl text-brand-muted max-w-2xl mx-auto text-pretty">
            Every portfolio is crafted from scratch with modern technology and thoughtful design.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {valueProps.map((prop, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-white/20 transition-all duration-200 hover:-translate-y-1">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${prop.color}20` }}
                >
                  <prop.icon className="h-6 w-6" style={{ color: prop.color }} />
                </div>
                <h3 className="text-xl font-semibold text-brand mb-3">{prop.title}</h3>
                <p className="text-brand-muted leading-relaxed">{prop.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
