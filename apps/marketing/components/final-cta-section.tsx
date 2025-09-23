"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function FinalCTASection() {
  return (
    <section className="bg-brand-dark py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-5xl font-bold text-brand-text-dark mb-6 text-balance">
            Ready to have a portfolio you're <span className="text-[#059669]">proud to show?</span>
          </h2>

          <p className="text-xl text-brand-muted-dark mb-8 text-pretty">
            No pressure. We'll discuss your goals and map the build.
          </p>

          <Button size="lg" className="bg-brand-accent hover:bg-brand-accent/90 text-white group">
            Book a 15-min intro
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
