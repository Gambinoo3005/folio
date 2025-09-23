"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageCircle, Calendar, Clock, Send } from "lucide-react"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    project: "",
    budget: "",
    timeline: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

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
            Let's create something <span className="text-[#059669]">extraordinary</span>
          </h1>
          <p className="text-xl text-brand-muted-dark max-w-2xl mx-auto text-pretty">
            Ready to bring your creative vision to life? Tell us about your project and let's start building your dream
            portfolio.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-semibold text-brand-text-dark mb-6">Start Your Project</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-brand-text-dark mb-2">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-white/10 border-white/20 text-brand-text-dark placeholder:text-brand-muted-dark"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-brand-text-dark mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-white/10 border-white/20 text-brand-text-dark placeholder:text-brand-muted-dark"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="project" className="block text-sm font-medium text-brand-text-dark mb-2">
                    Project Type *
                  </label>
                  <select
                    id="project"
                    name="project"
                    value={formData.project}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-brand-text-dark"
                  >
                    <option value="">Select project type</option>
                    <option value="photography">Photography Portfolio</option>
                    <option value="design">Design Portfolio</option>
                    <option value="writing">Writing Portfolio</option>
                    <option value="development">Development Portfolio</option>
                    <option value="business">Business Website</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-brand-text-dark mb-2">
                      Budget Range
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-brand-text-dark"
                    >
                      <option value="">Select budget</option>
                      <option value="starter">$299 - Starter</option>
                      <option value="professional">$599 - Professional</option>
                      <option value="enterprise">$1299+ - Enterprise</option>
                      <option value="custom">Custom Quote</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="timeline" className="block text-sm font-medium text-brand-text-dark mb-2">
                      Timeline
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-brand-text-dark"
                    >
                      <option value="">Select timeline</option>
                      <option value="asap">ASAP</option>
                      <option value="1-2weeks">1-2 weeks</option>
                      <option value="1month">1 month</option>
                      <option value="2-3months">2-3 months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-brand-text-dark mb-2">
                    Project Details *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="bg-white/10 border-white/20 text-brand-text-dark placeholder:text-brand-muted-dark"
                    placeholder="Tell us about your project, goals, and any specific requirements..."
                  />
                </div>

                <Button type="submit" className="w-full bg-[#059669] hover:bg-[#059669]/90 text-white">
                  <Send className="h-4 w-4 mr-2" />
                  Send Project Details
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Contact info and process */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Contact methods */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-semibold text-brand-text-dark mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-[#059669]/20 rounded-lg">
                    <Mail className="h-5 w-5 text-[#059669]" />
                  </div>
                  <div>
                    <p className="text-brand-text-dark font-medium">Email</p>
                    <p className="text-brand-muted-dark">hello@portfoliocms.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-[#34D399]/20 rounded-lg">
                    <MessageCircle className="h-5 w-5 text-[#34D399]" />
                  </div>
                  <div>
                    <p className="text-brand-text-dark font-medium">Live Chat</p>
                    <p className="text-brand-muted-dark">Available 9 AM - 6 PM EST</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-[#059669]/20 rounded-lg">
                    <Calendar className="h-5 w-5 text-[#059669]" />
                  </div>
                  <div>
                    <p className="text-brand-text-dark font-medium">Schedule a Call</p>
                    <p className="text-brand-muted-dark">Book a free consultation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Process overview */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-semibold text-brand-text-dark mb-6">Our Process</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Badge className="bg-[#059669]/20 text-[#059669] mt-1">1</Badge>
                  <div>
                    <p className="text-brand-text-dark font-medium">Discovery Call</p>
                    <p className="text-sm text-brand-muted-dark">We discuss your vision, goals, and requirements</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Badge className="bg-[#059669]/20 text-[#059669] mt-1">2</Badge>
                  <div>
                    <p className="text-brand-text-dark font-medium">Proposal & Planning</p>
                    <p className="text-sm text-brand-muted-dark">Custom proposal with timeline and deliverables</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Badge className="bg-[#059669]/20 text-[#059669] mt-1">3</Badge>
                  <div>
                    <p className="text-brand-text-dark font-medium">Design & Development</p>
                    <p className="text-sm text-brand-muted-dark">
                      We bring your portfolio to life with regular updates
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Badge className="bg-[#34D399]/20 text-[#34D399] mt-1">4</Badge>
                  <div>
                    <p className="text-brand-text-dark font-medium">Launch & Support</p>
                    <p className="text-sm text-brand-muted-dark">Go live with ongoing support and training</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response time */}
            <div className="bg-gradient-to-r from-[#059669]/10 to-[#34D399]/10 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center space-x-3 mb-2">
                <Clock className="h-5 w-5 text-[#34D399]" />
                <p className="text-brand-text-dark font-medium">Quick Response</p>
              </div>
              <p className="text-sm text-brand-muted-dark">
                We typically respond to all inquiries within 2-4 hours during business hours.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
