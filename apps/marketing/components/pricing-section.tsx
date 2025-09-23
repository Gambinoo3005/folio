"use client"

import React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Zap, Crown, Rocket } from "lucide-react"

type PricingPlan = {
  id: string
  name: string
  price: number
  yearlyPrice: number
  description: string
  icon: React.ReactNode
  features: string[]
  limitations: string[]
  popular?: boolean
  cta: string
}

const plans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 299,
    yearlyPrice: 2390, // ~20% discount
    description: "Perfect for individuals just starting their creative journey",
    icon: <Zap className="h-6 w-6" />,
    features: [
      "Custom portfolio design",
      "5 pages included",
      "Basic CMS setup",
      "Mobile responsive",
      "SSL certificate",
      "Basic SEO optimization",
      "1 month support",
    ],
    limitations: ["No e-commerce integration", "No advanced animations", "No custom integrations"],
    cta: "Start Building",
  },
  {
    id: "professional",
    name: "Professional",
    price: 599,
    yearlyPrice: 4792, // ~20% discount
    description: "For established creatives who need more advanced features",
    icon: <Crown className="h-6 w-6" />,
    features: [
      "Everything in Starter",
      "Up to 15 pages",
      "Advanced CMS features",
      "Custom animations",
      "Contact forms",
      "Analytics integration",
      "Social media integration",
      "3 months support",
      "2 rounds of revisions",
    ],
    limitations: ["No e-commerce integration", "No custom integrations"],
    popular: true,
    cta: "Go Professional",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 1299,
    yearlyPrice: 10392, // ~20% discount
    description: "For agencies and businesses requiring full customization",
    icon: <Rocket className="h-6 w-6" />,
    features: [
      "Everything in Professional",
      "Unlimited pages",
      "E-commerce integration",
      "Custom integrations",
      "Advanced SEO",
      "Performance optimization",
      "Priority support",
      "6 months support",
      "Unlimited revisions",
      "Training sessions",
    ],
    limitations: [],
    cta: "Scale Up",
  },
]

const comparisonFeatures = [
  {
    category: "Design & Development",
    features: [
      "Custom portfolio design",
      "Mobile responsive design",
      "Custom animations",
      "Advanced interactions",
      "Performance optimization",
    ],
  },
  {
    category: "Content Management",
    features: [
      "Basic CMS setup",
      "Advanced CMS features",
      "Content scheduling",
      "Multi-user access",
      "Version control",
    ],
  },
  {
    category: "Integrations",
    features: [
      "Social media integration",
      "Analytics integration",
      "Contact forms",
      "E-commerce integration",
      "Custom API integrations",
    ],
  },
  {
    category: "Support & Maintenance",
    features: [
      "Initial setup support",
      "Ongoing technical support",
      "Training sessions",
      "Priority support",
      "Dedicated account manager",
    ],
  },
]

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)
  const [showComparison, setShowComparison] = useState(false)

  return (
    <section className="bg-brand-dark py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-brand-text-dark mb-6 text-balance">
            Choose your <span className="text-[#059669]">creative path</span>
          </h1>
          <p className="text-xl text-brand-muted-dark max-w-2xl mx-auto text-pretty mb-8">
            Transparent pricing for portfolios that grow with your ambitions. No hidden fees, no surprises.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${!isYearly ? "text-brand-text-dark" : "text-brand-muted-dark"}`}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isYearly ? "bg-[#059669]" : "bg-white/20"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isYearly ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm ${isYearly ? "text-brand-text-dark" : "text-brand-muted-dark"}`}>Yearly</span>
            {isYearly && <Badge className="bg-[#34D399]/20 text-[#34D399] ml-2">Save 20%</Badge>}
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                plan.popular
                  ? "border-[#059669] shadow-lg shadow-[#059669]/20"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-[#059669] text-white px-4 py-1">Most Popular</Badge>
                </div>
              )}

              <div className="flex items-center space-x-3 mb-6">
                <div className={`p-2 rounded-lg ${plan.popular ? "bg-[#059669]/20" : "bg-white/10"}`}>
                  <div className={plan.popular ? "text-[#059669]" : "text-brand-text-dark"}>{plan.icon}</div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-brand-text-dark">{plan.name}</h3>
                  <p className="text-sm text-brand-muted-dark">{plan.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-brand-text-dark">
                    ${isYearly ? plan.yearlyPrice : plan.price}
                  </span>
                  <span className="text-brand-muted-dark">{isYearly ? "/year" : "/project"}</span>
                </div>
                {isYearly && (
                  <p className="text-sm text-[#34D399] mt-1">Save ${plan.price * 12 - plan.yearlyPrice} per year</p>
                )}
              </div>

              <Button
                className={`w-full mb-6 ${
                  plan.popular
                    ? "bg-[#059669] hover:bg-[#059669]/90 text-white"
                    : "bg-white/10 hover:bg-white/20 text-brand-text-dark border border-white/20"
                }`}
              >
                {plan.cta}
              </Button>

              <div className="space-y-3">
                <h4 className="font-medium text-brand-text-dark">What's included:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-[#34D399] flex-shrink-0" />
                      <span className="text-sm text-brand-muted-dark">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.limitations.length > 0 && (
                  <div className="pt-4 border-t border-white/10">
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, limitIndex) => (
                        <li key={limitIndex} className="flex items-center space-x-3">
                          <X className="h-4 w-4 text-red-400 flex-shrink-0" />
                          <span className="text-sm text-brand-muted-dark">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-8"
        >
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="text-[#059669] hover:text-[#059669]/80 transition-colors"
          >
            {showComparison ? "Hide" : "Show"} detailed comparison
          </button>
        </motion.div>

        {/* Detailed comparison table */}
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-6 text-brand-text-dark font-medium">Features</th>
                    {plans.map((plan) => (
                      <th key={plan.id} className="text-center p-6 text-brand-text-dark font-medium">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((category, categoryIndex) => (
                    <React.Fragment key={category.category}>
                      <tr className="bg-white/5">
                        <td colSpan={4} className="p-4 text-sm font-medium text-[#059669]">
                          {category.category}
                        </td>
                      </tr>
                      {category.features.map((feature, featureIndex) => (
                        <tr key={featureIndex} className="border-b border-white/5">
                          <td className="p-4 text-sm text-brand-muted-dark">{feature}</td>
                          <td className="p-4 text-center">
                            {/* Starter plan feature availability */}
                            {feature === "Custom portfolio design" ||
                            feature === "Mobile responsive design" ||
                            feature === "Basic CMS setup" ||
                            feature === "Initial setup support" ? (
                              <Check className="h-4 w-4 text-[#34D399] mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-red-400 mx-auto" />
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {/* Professional plan feature availability */}
                            {feature !== "E-commerce integration" &&
                            feature !== "Custom API integrations" &&
                            feature !== "Dedicated account manager" ? (
                              <Check className="h-4 w-4 text-[#34D399] mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-red-400 mx-auto" />
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {/* Enterprise plan has all features */}
                            <Check className="h-4 w-4 text-[#34D399] mx-auto" />
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* FAQ section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl font-bold text-brand-text-dark mb-8">Questions about pricing?</h2>
          <p className="text-brand-muted-dark mb-8 max-w-2xl mx-auto">
            We're here to help you choose the right plan for your creative journey. Get in touch for a personalized
            consultation.
          </p>
          <Button className="bg-[#34D399] hover:bg-[#34D399]/90 text-white">Schedule a Call</Button>
        </motion.div>
      </div>
    </section>
  )
}
