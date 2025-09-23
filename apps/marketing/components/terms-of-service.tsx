"use client"

import { motion } from "framer-motion"

export function TermsOfService() {
  return (
    <section className="bg-brand-dark py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-brand mb-4">Terms of Service</h1>
          <p className="text-brand-muted">Last updated: January 2025</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 prose prose-invert max-w-none"
        >
          <div className="space-y-8 text-brand-muted">
            <section>
              <h2 className="text-2xl font-semibold text-brand mb-4">Acceptance of Terms</h2>
              <p className="leading-relaxed">
                By accessing and using our services, you accept and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand mb-4">Service Description</h2>
              <p className="leading-relaxed mb-4">
                We provide custom portfolio website design and development services with integrated content management
                systems. Our services include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Custom website design and development</li>
                <li>Content management system setup</li>
                <li>Technical support and maintenance</li>
                <li>Training and documentation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand mb-4">Payment Terms</h2>
              <p className="leading-relaxed mb-4">Payment terms vary by service package. Generally:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>50% deposit required to begin work</li>
                <li>Remaining balance due upon project completion</li>
                <li>Monthly/yearly subscriptions billed in advance</li>
                <li>Refunds available within 30 days of service delivery</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand mb-4">Intellectual Property</h2>
              <p className="leading-relaxed mb-4">
                Upon full payment, you own the rights to your custom website design and content. However:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We retain rights to our proprietary tools and methodologies</li>
                <li>Third-party components remain subject to their respective licenses</li>
                <li>We may showcase your project in our portfolio with your permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand mb-4">Limitation of Liability</h2>
              <p className="leading-relaxed">
                Our liability is limited to the amount paid for our services. We are not responsible for any indirect,
                incidental, or consequential damages arising from the use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand mb-4">Termination</h2>
              <p className="leading-relaxed">
                Either party may terminate services with 30 days written notice. Upon termination, you retain access to
                completed work, and we will provide necessary files for transition.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand mb-4">Changes to Terms</h2>
              <p className="leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon
                posting. Continued use of our services constitutes acceptance of modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand mb-4">Contact Information</h2>
              <p className="leading-relaxed">
                For questions about these Terms of Service, please contact us at{" "}
                <a href="mailto:legal@portfoliocms.com" className="text-[#059669] hover:text-[#059669]/80">
                  legal@portfoliocms.com
                </a>
                .
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
