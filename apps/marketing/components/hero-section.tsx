"use client"

import { Button } from "@/components/ui/button"
import { 
  ArrowRight, 
  Play, 
  PenTool, 
  Palette, 
  Code, 
  Camera,
  Mic,
  Video,
  Music,
  Paintbrush,
  Laptop,
  Smartphone,
  Gamepad2,
  BookOpen,
  Briefcase,
  GraduationCap,
  Heart,
  Stethoscope,
  Building,
  DollarSign,
  Globe,
  Zap,
  Lightbulb,
  Users,
  Target
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

// Icon bank with professions and descriptions
const iconBank = [
  // Creative & Design
  { icon: PenTool, description: "For writers" },
  { icon: Palette, description: "For artists" },
  { icon: Paintbrush, description: "For illustrators" },
  { icon: Camera, description: "For photographers" },
  { icon: Video, description: "For videographers" },
  { icon: Mic, description: "For podcasters" },
  { icon: Music, description: "For musicians" },
  
  // Technology & Development
  { icon: Code, description: "For developers" },
  { icon: Laptop, description: "For designers" },
  { icon: Smartphone, description: "For app creators" },
  { icon: Gamepad2, description: "For game developers" },
  { icon: Zap, description: "For tech entrepreneurs" },
  
  // Education & Research
  { icon: BookOpen, description: "For educators" },
  { icon: GraduationCap, description: "For students" },
  { icon: Lightbulb, description: "For researchers" },
  { icon: Target, description: "For consultants" },
  
  // Business & Professional
  { icon: Briefcase, description: "For professionals" },
  { icon: Building, description: "For agencies" },
  { icon: DollarSign, description: "For entrepreneurs" },
  { icon: Globe, description: "For freelancers" },
  { icon: Users, description: "For teams" },
  
  // Healthcare & Wellness
  { icon: Heart, description: "For wellness coaches" },
  { icon: Stethoscope, description: "For healthcare professionals" },
]

export function HeroSection() {
  const [currentIcons, setCurrentIcons] = useState({
    topLeft: 0,
    topRight: 1,
    bottomLeft: 2,
    bottomRight: 3
  })
  const [iconsFullyDisplayed, setIconsFullyDisplayed] = useState(true)
  const [tooltipIcons, setTooltipIcons] = useState({
    topLeft: 0,
    topRight: 1,
    bottomLeft: 2,
    bottomRight: 3
  })
  const [tooltipVisible, setTooltipVisible] = useState({
    topLeft: true,
    topRight: true,
    bottomLeft: true,
    bottomRight: true
  })

  // Function to generate a new unique set of 4 icons
  const generateNewIconSet = (currentSet: { topLeft: number; topRight: number; bottomLeft: number; bottomRight: number }) => {
    const currentIndices = [currentSet.topLeft, currentSet.topRight, currentSet.bottomLeft, currentSet.bottomRight]
    const availableIndices = iconBank
      .map((_, index) => index)
      .filter(index => !currentIndices.includes(index))
    
    // If we don't have enough available icons, reset and use all icons
    if (availableIndices.length < 4) {
      const shuffled = [...Array(iconBank.length).keys()].sort(() => Math.random() - 0.5)
      return {
        topLeft: shuffled[0],
        topRight: shuffled[1],
        bottomLeft: shuffled[2],
        bottomRight: shuffled[3]
      }
    }
    
    // Shuffle available indices and pick 4
    const shuffled = availableIndices.sort(() => Math.random() - 0.5)
    return {
      topLeft: shuffled[0],
      topRight: shuffled[1],
      bottomLeft: shuffled[2],
      bottomRight: shuffled[3]
    }
  }

  // Rotate icons every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Hide all tooltips during transition
      setIconsFullyDisplayed(false)
      setTooltipVisible({
        topLeft: false,
        topRight: false,
        bottomLeft: false,
        bottomRight: false
      })
      
      // Update icons
      const newIcons = generateNewIconSet(currentIcons)
      setCurrentIcons(newIcons)
      
      // Update tooltip text after tooltips are hidden
      setTimeout(() => {
        setTooltipIcons(newIcons)
      }, 100)
      
      // Show tooltips after animation completes
      setTimeout(() => {
        setIconsFullyDisplayed(true)
        setTooltipVisible({
          topLeft: true,
          topRight: true,
          bottomLeft: true,
          bottomRight: true
        })
      }, 600)
    }, 3000)

    return () => clearInterval(interval)
  }, [currentIcons])

  return (
    <section className="relative bg-brand overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-60">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(5, 150, 105, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(5, 150, 105, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Rotating profession icons */}
      <div className="absolute inset-0">
        {/* Top Left Position */}
        <div className="absolute top-20 left-20 lg:top-32 lg:left-32 group cursor-pointer">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIcons.topLeft}
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 0.6, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="transition-all duration-300 group-hover:scale-110 group-hover:opacity-80"
            >
              {(() => {
                const IconComponent = iconBank[currentIcons.topLeft].icon
                return <IconComponent className="h-16 w-16 lg:h-20 lg:w-20 text-[#059669] stroke-1" />
              })()}
            </motion.div>
          </AnimatePresence>
          {/* Tooltip */}
          <div className={`absolute -top-16 left-1/2 transform -translate-x-1/2 transition-all duration-300 pointer-events-none ${tooltipVisible.topLeft && iconsFullyDisplayed ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}>
            <div className="bg-[#059669] text-white text-sm font-semibold px-4 py-2.5 rounded-xl whitespace-nowrap shadow-xl">
              {iconBank[tooltipIcons.topLeft].description}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-5 border-r-5 border-t-5 border-transparent border-t-[#059669]"></div>
            </div>
          </div>
        </div>

        {/* Top Right Position */}
        <div className="absolute top-20 right-20 lg:top-32 lg:right-32 group cursor-pointer">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIcons.topRight}
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              animate={{ opacity: 0.6, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: -10 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="transition-all duration-300 group-hover:scale-110 group-hover:opacity-80"
            >
              {(() => {
                const IconComponent = iconBank[currentIcons.topRight].icon
                return <IconComponent className="h-16 w-16 lg:h-20 lg:w-20 text-[#059669] stroke-1" />
              })()}
            </motion.div>
          </AnimatePresence>
          {/* Tooltip */}
          <div className={`absolute -top-16 right-1/2 transform translate-x-1/2 transition-all duration-300 pointer-events-none ${tooltipVisible.topRight && iconsFullyDisplayed ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}>
            <div className="bg-[#059669] text-white text-sm font-semibold px-4 py-2.5 rounded-xl whitespace-nowrap shadow-xl">
              {iconBank[tooltipIcons.topRight].description}
              <div className="absolute top-full right-1/2 transform translate-x-1/2 w-0 h-0 border-l-5 border-r-5 border-t-5 border-transparent border-t-[#059669]"></div>
            </div>
          </div>
        </div>

        {/* Bottom Left Position */}
        <div className="absolute bottom-20 left-20 lg:bottom-32 lg:left-32 group cursor-pointer">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIcons.bottomLeft}
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 0.6, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="transition-all duration-300 group-hover:scale-110 group-hover:opacity-80"
            >
              {(() => {
                const IconComponent = iconBank[currentIcons.bottomLeft].icon
                return <IconComponent className="h-16 w-16 lg:h-20 lg:w-20 text-[#059669] stroke-1" />
              })()}
            </motion.div>
          </AnimatePresence>
          {/* Tooltip */}
          <div className={`absolute -bottom-16 left-1/2 transform -translate-x-1/2 transition-all duration-300 pointer-events-none ${tooltipVisible.bottomLeft && iconsFullyDisplayed ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}>
            <div className="bg-[#059669] text-white text-sm font-semibold px-4 py-2.5 rounded-xl whitespace-nowrap shadow-xl">
              {iconBank[tooltipIcons.bottomLeft].description}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-5 border-r-5 border-b-5 border-transparent border-b-[#059669]"></div>
            </div>
          </div>
        </div>

        {/* Bottom Right Position */}
        <div className="absolute bottom-20 right-20 lg:bottom-32 lg:right-32 group cursor-pointer">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIcons.bottomRight}
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              animate={{ opacity: 0.6, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: -10 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="transition-all duration-300 group-hover:scale-110 group-hover:opacity-80"
            >
              {(() => {
                const IconComponent = iconBank[currentIcons.bottomRight].icon
                return <IconComponent className="h-16 w-16 lg:h-20 lg:w-20 text-[#059669] stroke-1" />
              })()}
            </motion.div>
          </AnimatePresence>
          {/* Tooltip */}
          <div className={`absolute -bottom-16 right-1/2 transform translate-x-1/2 transition-all duration-300 pointer-events-none ${tooltipVisible.bottomRight && iconsFullyDisplayed ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}>
            <div className="bg-[#059669] text-white text-sm font-semibold px-4 py-2.5 rounded-xl whitespace-nowrap shadow-xl">
              {iconBank[tooltipIcons.bottomRight].description}
              <div className="absolute bottom-full right-1/2 transform translate-x-1/2 w-0 h-0 border-l-5 border-r-5 border-b-5 border-transparent border-b-[#059669]"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8 text-center max-w-4xl relative z-10"
          >
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-brand leading-tight text-balance">
                Bespoke portfolio websites with a <span className="text-brand-accent">built-in CMS</span>
              </h1>
              <p className="text-xl text-brand-muted leading-relaxed text-pretty max-w-2xl mx-auto">
                Custom full-stack builds tailored to your craft—fast, secure, and effortless to update.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-brand-accent hover:bg-brand-accent/90 text-white group">
                Book a 15-min intro
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-white/20 text-brand-text-dark hover:bg-white/10 bg-transparent"
              >
                <Link href="/work">
                  <Play className="mr-2 h-4 w-4" />
                  See live examples
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
