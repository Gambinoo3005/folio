"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full p-1">
        <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
      </div>
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-12 h-6 rounded-full transition-colors duration-300 ease-in-out focus:outline-none"
      style={{
        backgroundColor: isDark ? "#34D399" : "#E5E7EB"
      }}
      aria-label="Toggle theme"
    >
      <motion.div
        className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-lg flex items-center justify-center"
        animate={{
          x: isDark ? 24 : 0,
          rotate: isDark ? 180 : 0
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      >
        <motion.div
          initial={false}
          animate={{
            opacity: isDark ? 0 : 1,
            scale: isDark ? 0 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          <Sun className="w-3 h-3 text-yellow-500 fill-current" />
        </motion.div>
        <motion.div
          className="absolute"
          initial={false}
          animate={{
            opacity: isDark ? 1 : 0,
            scale: isDark ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
        >
          <Moon className="w-3 h-3 text-gray-800 fill-current" />
        </motion.div>
      </motion.div>
    </button>
  )
}
