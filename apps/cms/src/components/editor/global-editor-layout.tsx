'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Globe,
  Sparkles
} from 'lucide-react'
import { GlobalEditorForm } from './global-editor-form'
import { type GlobalUpsertInput, type ActionResult } from '@/lib/validation'

interface GlobalEditorLayoutProps {
  initialData?: Partial<GlobalUpsertInput> & { id?: string }
  globalKey?: string
  onBack?: () => void
}

export function GlobalEditorLayout({ 
  initialData, 
  globalKey,
  onBack 
}: GlobalEditorLayoutProps) {
  const router = useRouter()
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.push('/globals')
    }
  }

  const handleSuccess = (result: ActionResult<{ id: string }>) => {
    if (result.ok) {
      setLastSaved(new Date())
    }
  }

  return (
    <div className="flex h-screen bg-brand overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-20">
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

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Editor Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="sm" onClick={handleBack} className="hover:bg-brand-accent/10">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </motion.div>
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h1 className="text-lg font-semibold text-brand">
                    {globalKey ? `Edit ${globalKey}` : 'Edit Global'}
                  </h1>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800 border">
                    <Globe className="h-3 w-3 mr-1" />
                    Global
                  </Badge>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Editor Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex-1 overflow-auto bg-background/50"
        >
          <div className="p-6">
            <GlobalEditorForm
              initialData={initialData}
              globalKey={globalKey}
              onSuccess={handleSuccess}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
