"use client"

import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AuthLoadingSkeleton } from "./auth-loading-skeleton"

interface AuthWrapperProps {
  children: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setIsRedirecting(true)
      router.push("/sign-in")
    }
  }, [isLoaded, isSignedIn, router])

  // Show loading skeleton while auth is loading or redirecting
  if (!isLoaded || isRedirecting) {
    return <AuthLoadingSkeleton />
  }

  // If not signed in, don't render anything (redirect is happening)
  if (!isSignedIn) {
    return <AuthLoadingSkeleton />
  }

  // User is signed in, render the protected content
  return <>{children}</>
}
