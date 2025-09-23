"use client"

import { useState, useCallback } from "react"

interface LoadingState {
  isLoading: boolean
  error: string | null
}

interface UseLoadingReturn extends LoadingState {
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  execute: <T>(asyncFn: () => Promise<T>) => Promise<T | null>
  reset: () => void
}

export function useLoading(initialState: boolean = false): UseLoadingReturn {
  const [state, setState] = useState<LoadingState>({
    isLoading: initialState,
    error: null,
  })

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading, error: null }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, isLoading: false }))
  }, [])

  const execute = useCallback(async <T>(asyncFn: () => Promise<T>): Promise<T | null> => {
    try {
      setLoading(true)
      const result = await asyncFn()
      setLoading(false)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setError(errorMessage)
      return null
    }
  }, [setLoading, setError])

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null })
  }, [])

  return {
    ...state,
    setLoading,
    setError,
    execute,
    reset,
  }
}

// Hook for managing multiple loading states
export function useMultipleLoading() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: loading }))
  }, [])

  const isLoading = useCallback((key: string) => {
    return loadingStates[key] || false
  }, [loadingStates])

  const isAnyLoading = Object.values(loadingStates).some(Boolean)

  return {
    setLoading,
    isLoading,
    isAnyLoading,
    loadingStates,
  }
}

// Hook for debounced loading states
export function useDebouncedLoading(delay: number = 300) {
  const [isLoading, setIsLoading] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const setLoading = useCallback((loading: boolean) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    if (loading) {
      // Show loading immediately
      setIsLoading(true)
    } else {
      // Hide loading after delay
      const id = setTimeout(() => {
        setIsLoading(false)
      }, delay)
      setTimeoutId(id)
    }
  }, [delay, timeoutId])

  return {
    isLoading,
    setLoading,
  }
}
