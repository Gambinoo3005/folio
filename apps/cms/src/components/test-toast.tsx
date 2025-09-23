"use client"

import { Button } from "@/components/ui/button"
import { cmsToasts } from "@/lib/toast"

export function TestToast() {
  const handleTest = () => {
    console.log("Testing toast...")
    console.log("cmsToasts:", cmsToasts)
    console.log("cmsToasts.success:", typeof cmsToasts.success)
    
    try {
      cmsToasts.success("Test Success", "This is a test message")
    } catch (error) {
      console.error("Toast error:", error)
    }
  }

  return (
    <Button onClick={handleTest}>
      Test Toast
    </Button>
  )
}
