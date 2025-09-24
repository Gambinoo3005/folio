"use client"

import { motion } from "framer-motion"

export function SocialProofSection() {
  const testimonials = [
    {
      quote: "Finally, a portfolio that actually represents my work. The CMS makes updates effortless.",
      author: "Sarah Chen",
      role: "Photographer",
      avatar: "/professional-photographer-headshot.png",
    },
    {
      quote: "The technical foundation is solid. Fast, secure, and built exactly how I wanted.",
      author: "Marcus Rodriguez",
      role: "Developer",
      avatar: "/software-developer-headshot.jpg",
    },
    {
      quote: "My writing finally has a home that matches its quality. The design is beautiful.",
      author: "Emma Thompson",
      role: "Writer",
      avatar: "/professional-writer-headshot.png",
    },
  ]

  return (
    <section className="bg-brand-dark-section py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-brand-muted text-sm uppercase tracking-wider mb-8">Used by creators from</p>

          {/* Logo placeholders */}
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 lg:gap-12 mb-16 opacity-60">
            <div className="text-brand-muted text-sm sm:text-lg font-semibold">Adobe</div>
            <div className="text-brand-muted text-sm sm:text-lg font-semibold">Figma</div>
            <div className="text-brand-muted text-sm sm:text-lg font-semibold">Dribbble</div>
            <div className="text-brand-muted text-sm sm:text-lg font-semibold">Behance</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <p className="text-brand mb-4 leading-relaxed">"{testimonial.quote}"</p>
              <div className="flex items-center space-x-3">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.author}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-brand font-semibold text-sm">{testimonial.author}</p>
                  <p className="text-brand-muted text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
