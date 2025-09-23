"use client"

import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  const faqs = [
    {
      question: "How custom is 'custom'?",
      answer:
        "We design and engineer every portfolio from scratch. No builder themes, no templates. Each site is crafted specifically for your aesthetic, content, and goals. You get a unique design that truly represents your work.",
    },
    {
      question: "Can I move my domain?",
      answer:
        "Absolutely. We support custom domains and make the verification and switching process simple. You can use your existing domain or register a new one through our platform.",
    },
    {
      question: "Can I edit my content?",
      answer:
        "Yes! Every portfolio comes with an intuitive CMS where you can easily edit pages, add projects, upload images, and manage your content. No technical knowledge required.",
    },
    {
      question: "What's included in the monthly plans?",
      answer:
        "Care ($10/mo) includes hosting, maintenance, security updates, and basic support. Care+ ($20/mo) adds priority support, monthly strategy calls, and higher asset limits.",
    },
    {
      question: "Can you migrate my existing site?",
      answer:
        "Yes, we can help migrate content from most platforms. We'll evaluate your current site during the discovery call and provide a migration plan as part of your build.",
    },
    {
      question: "What happens after the build is complete?",
      answer:
        "You get full access to your CMS and can start publishing immediately. We provide training and documentation, plus ongoing support through your monthly plan.",
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
          <h2 className="text-4xl font-bold text-brand mb-4 text-balance">Frequently asked questions</h2>
          <p className="text-xl text-brand-muted max-w-2xl mx-auto text-pretty">
            Everything you need to know about our process and service.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white/5 border border-white/10 rounded-2xl px-6 data-[state=open]:bg-white/10"
              >
                <AccordionTrigger className="text-brand hover:text-[#059669] text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-brand-muted leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
