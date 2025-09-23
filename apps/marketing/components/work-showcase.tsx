"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ExternalLink, Eye } from "lucide-react"

type Portfolio = {
  id: string
  title: string
  craft: "Photography" | "Writing" | "Design" | "Code"
  description: string
  image: string
  images: string[]
  url?: string
  details: string
}

const portfolios: Portfolio[] = [
  {
    id: "1",
    title: "Elena Rodriguez Photography",
    craft: "Photography",
    description:
      "Minimalist portfolio showcasing architectural and portrait photography with a focus on natural light.",
    image: "/elena-rodriguez-photography-portfolio-website.jpg",
    images: [
      "/elena-rodriguez-photography-portfolio-website.jpg",
      "/elena-rodriguez-photography-gallery-page.jpg",
      "/elena-rodriguez-photography-about-page.jpg",
    ],
    url: "https://elena-rodriguez.example.com",
    details:
      "Built with a custom image gallery system, optimized for high-resolution photography display. Features lazy loading, lightbox functionality, and mobile-responsive design.",
  },
  {
    id: "2",
    title: "Marcus Chen Design Studio",
    craft: "Design",
    description: "Bold, experimental portfolio for a graphic designer specializing in brand identity and digital art.",
    image: "/marcus-chen-design-studio-portfolio.jpg",
    images: [
      "/marcus-chen-design-studio-portfolio.jpg",
      "/marcus-chen-design-studio-projects.jpg",
      "/marcus-chen-design-studio-contact.jpg",
    ],
    url: "https://marcuschen.design",
    details:
      "Interactive portfolio with custom animations and transitions. Features project case studies with before/after comparisons and client testimonials.",
  },
  {
    id: "3",
    title: "Sarah Thompson Writing",
    craft: "Writing",
    description: "Clean, readable portfolio for a freelance writer and journalist with integrated blog functionality.",
    image: "/sarah-thompson-writing-portfolio.jpg",
    images: [
      "/sarah-thompson-writing-portfolio.jpg",
      "/sarah-thompson-writing-articles.jpg",
      "/sarah-thompson-writing-about.jpg",
    ],
    url: "https://sarahthompson.writer",
    details:
      "Typography-focused design with custom reading experience. Includes article archive, search functionality, and newsletter signup integration.",
  },
  {
    id: "4",
    title: "Alex Kim Development",
    craft: "Code",
    description: "Technical portfolio showcasing full-stack projects with live demos and detailed case studies.",
    image: "/alex-kim-development-portfolio.jpg",
    images: [
      "/alex-kim-development-portfolio.jpg",
      "/alex-kim-development-projects.jpg",
      "/alex-kim-development-blog.jpg",
    ],
    url: "https://alexkim.dev",
    details:
      "Developer-focused portfolio with integrated code snippets, GitHub integration, and technical blog. Features dark/light mode toggle and performance metrics.",
  },
  {
    id: "5",
    title: "Luna Martinez Art",
    craft: "Design",
    description: "Artistic portfolio for a digital artist and illustrator with immersive visual storytelling.",
    image: "/luna-martinez-art-portfolio.jpg",
    images: ["/luna-martinez-art-portfolio.jpg", "/luna-martinez-art-gallery.jpg", "/luna-martinez-art-commission.jpg"],
    url: "https://lunamartinez.art",
    details:
      "Visually rich portfolio with custom scroll animations and interactive elements. Features commission request system and print shop integration.",
  },
  {
    id: "6",
    title: "David Park Photography",
    craft: "Photography",
    description: "Wedding and event photography portfolio with client gallery access and booking system.",
    image: "/david-park-photography-portfolio.jpg",
    images: [
      "/david-park-photography-portfolio.jpg",
      "/david-park-photography-weddings.jpg",
      "/david-park-photography-contact.jpg",
    ],
    url: "https://davidpark.photo",
    details:
      "Client-focused portfolio with password-protected galleries, booking calendar integration, and automated client communication workflows.",
  },
]

export function WorkShowcase() {
  const [selectedFilter, setSelectedFilter] = useState<string>("All")
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null)

  const filters = ["All", "Photography", "Writing", "Design", "Code"]

  const filteredPortfolios = portfolios.filter(
    (portfolio) => selectedFilter === "All" || portfolio.craft === selectedFilter,
  )

  return (
    <section className="bg-brand-dark py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-brand mb-6 text-balance">
            Portfolios that <span className="text-[#059669]">showcase craft</span>
          </h1>
          <p className="text-xl text-brand-muted max-w-2xl mx-auto text-pretty">
            Each portfolio is uniquely designed and built to highlight the creator's individual style and work.
          </p>
        </motion.div>

        {/* Filter chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedFilter === filter
                  ? "bg-[#059669] text-white"
                  : "bg-white/10 text-brand-muted hover:bg-white/20 hover:text-brand"
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* Portfolio grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPortfolios.map((portfolio, index) => (
            <motion.div
              key={portfolio.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setSelectedPortfolio(portfolio)}
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="relative overflow-hidden">
                  <img
                    src={portfolio.image || "/placeholder.svg"}
                    alt={portfolio.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <Badge className="bg-[#059669]/90 text-white">{portfolio.craft}</Badge>
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-white" />
                        <span className="text-white text-sm">View Details</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-brand mb-2 group-hover:text-[#059669] transition-colors">
                    {portfolio.title}
                  </h3>
                  <p className="text-brand-muted leading-relaxed text-sm">{portfolio.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Case detail modal */}
        <Dialog open={!!selectedPortfolio} onOpenChange={() => setSelectedPortfolio(null)}>
          <DialogContent className="max-w-4xl bg-brand-dark-section border-white/20">
            {selectedPortfolio && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <DialogTitle className="text-2xl text-brand mb-2">
                        {selectedPortfolio.title}
                      </DialogTitle>
                      <Badge className="bg-[#059669]/20 text-[#059669]">{selectedPortfolio.craft}</Badge>
                    </div>
                    {selectedPortfolio.url && (
                      <a
                        href={selectedPortfolio.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-[#34D399] hover:text-[#34D399]/80 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="text-sm">Visit Site</span>
                      </a>
                    )}
                  </div>
                </DialogHeader>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedPortfolio.images.map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`${selectedPortfolio.title} screenshot ${index + 1}`}
                        className="w-full rounded-lg"
                      />
                    ))}
                  </div>

                  <div className="space-y-4">
                    <p className="text-brand-muted leading-relaxed">{selectedPortfolio.description}</p>
                    <p className="text-brand leading-relaxed">{selectedPortfolio.details}</p>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
