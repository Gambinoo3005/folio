"use client"

import { motion } from "framer-motion"
import { MessageCircle, Code, Handshake, HeartHandshake } from "lucide-react"

export function ExplainerSection() {
  const steps = [
    {
      number: "1",
      icon: MessageCircle,
      title: "Discovery",
      description: "Brief call, understand your aesthetic & goals",
    },
    {
      number: "2",
      icon: Code,
      title: "Build",
      description: "We craft the site; you watch progress and give feedback",
    },
    {
      number: "3",
      icon: Handshake,
      title: "Handover",
      description: "You get the CMS; publish in one click",
    },
    {
      number: "4",
      icon: HeartHandshake,
      title: "Care/Care+",
      description: "Monthly upkeep; optional monthly strategy call",
    },
  ]

  return (
    <section className="bg-brand-dark-section py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-brand mb-4 text-balance">How it works</h2>
          <p className="text-xl text-brand-muted max-w-2xl mx-auto text-pretty">
            From concept to launch, we handle the technical complexity while you focus on your craft.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-[#059669]/20 via-[#34D399]/40 to-[#059669]/20 transform -translate-y-1/2"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                {/* Step number circle */}
                <div className="relative z-10 w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#059669] to-[#34D399] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{step.number}</span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-center">
                    <step.icon className="h-8 w-8 text-[#059669]" />
                  </div>
                  <h3 className="text-xl font-semibold text-brand">{step.title}</h3>
                  <p className="text-brand-muted leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
