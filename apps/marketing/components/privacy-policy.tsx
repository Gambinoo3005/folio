"use client"

import { motion } from "framer-motion"

export function PrivacyPolicy() {
  return (
    <section className="bg-brand-dark py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-brand mb-4">Privacy Policy</h1>
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
              <h2 className="text-2xl font-semibold text-brand mb-4">Information We Collect</h2>
              <p className="leading-relaxed mb-4">
                We collect information you provide directly to us, such as when you create an account, contact us, or
                use our services. This may include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name and contact information</li>
                <li>Project details and requirements</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Communications with our team</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand mb-4">How We Use Your Information</h2>
              <p className="leading-relaxed mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Communicate about new features and updates</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand mb-4">Information Sharing</h2>
              <p className="leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties except as
                described in this policy. We may share your information:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>With service providers who assist in our operations</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>With your consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand mb-4">Data Security</h2>
              <p className="leading-relaxed">
                We implement appropriate security measures to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. However, no method of transmission over the internet is
                100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand mb-4">Your Rights</h2>
              <p className="leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access and update your personal information</li>
                <li>Request deletion of your data</li>
                <li>Opt out of marketing communications</li>
                <li>Request data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand mb-4">Contact Us</h2>
              <p className="leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:privacy@portfoliocms.com" className="text-[#059669] hover:text-[#059669]/80">
                  privacy@portfoliocms.com
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
