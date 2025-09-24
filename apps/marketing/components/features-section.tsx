"use client"

import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit3, ImageIcon, Zap, Shield, Globe, CreditCard } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      id: "cms",
      label: "CMS",
      icon: Edit3,
      title: "Content Management",
      description: "Intuitive editing experience built for creators",
      items: [
        "Pages & projects management",
        "TipTap rich text editor",
        "Draft, preview & publish workflow",
        "Version history & rollbacks",
      ],
    },
    {
      id: "media",
      label: "Media",
      icon: ImageIcon,
      title: "Media Handling",
      description: "Optimized image delivery and asset management",
      items: [
        "UploadThing → R2 storage",
        "Cloudflare Images variants",
        "Comprehensive asset library",
        "Automatic optimization",
      ],
    },
    {
      id: "performance",
      label: "Performance",
      icon: Zap,
      title: "Speed & Performance",
      description: "Built for speed with modern web technologies",
      items: [
        "Next.js ISR & cache tags",
        "ETag headers for efficiency",
        "Lighthouse-optimized",
        "CDN-first architecture",
      ],
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
      title: "Security & Privacy",
      description: "Enterprise-grade security for your content",
      items: ["Postgres RLS isolation", "JWT session management", "SSO with Google", "Rate limiting & CSP"],
    },
    {
      id: "domains",
      label: "Domains",
      icon: Globe,
      title: "Domain Management",
      description: "Easy domain setup and management",
      items: ["Subdomains by default", "Custom domain self-serve", "Vercel Domains API", "SSL certificates included"],
    },
    {
      id: "billing",
      label: "Billing",
      icon: CreditCard,
      title: "Billing & Payments",
      description: "Transparent pricing with flexible plans",
      items: [
        "Stripe checkout integration",
        "Customer portal access",
        "$10 Care / $20 Care+ tiers",
        "Usage-based billing",
      ],
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
          <h2 className="text-4xl font-bold text-brand mb-4 text-balance">
            Everything you need, nothing you don't
          </h2>
          <p className="text-xl text-brand-muted max-w-2xl mx-auto text-pretty">
            Comprehensive features designed specifically for creative professionals.
          </p>
        </motion.div>

        <Tabs defaultValue="cms" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-8 bg-white/5 border border-white/10 h-auto">
            {features.map((feature) => (
              <TabsTrigger
                key={feature.id}
                value={feature.id}
                className="data-[state=active]:bg-[#059669] data-[state=active]:text-white text-xs sm:text-sm py-2 sm:py-3"
              >
                <feature.icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{feature.label}</span>
                <span className="sm:hidden">{feature.label.slice(0, 3)}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {features.map((feature) => (
            <TabsContent key={feature.id} value={feature.id}>
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-[#059669]/20 flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-[#059669]" />
                    </div>
                    <div>
                      <CardTitle className="text-brand">{feature.title}</CardTitle>
                      <CardDescription className="text-brand-muted">{feature.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {feature.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-[#34D399] rounded-full"></div>
                        <span className="text-brand">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Code snippet example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <div className="bg-gray-900 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-[#059669]/20 text-[#059669]">
                  ISR-fast
                </Badge>
                <Badge variant="secondary" className="bg-[#34D399]/20 text-[#34D399]">
                  RLS-secured
                </Badge>
              </div>
              <span className="text-brand-muted text-sm">Next.js App Router</span>
            </div>
            <pre className="text-green-400 text-sm overflow-x-auto">
              <code>{`// Automatic cache invalidation
await revalidateTag('tenant:portfolio-123')

// Multi-tenant security
const { data } = await supabase
  .from('projects')
  .select('*')
  .eq('tenant_id', user.tenant_id)`}</code>
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
