"use client"

import { useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

interface FocalPointEditorProps {
  imageUrl: string
  focalPoint: { x: number; y: number }
  onFocalPointChange: (focalPoint: { x: number; y: number }) => void
  className?: string
}

export function FocalPointEditor({
  imageUrl,
  focalPoint,
  onFocalPointChange,
  className
}: FocalPointEditorProps) {
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    updateFocalPoint(e)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      updateFocalPoint(e)
    }
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const updateFocalPoint = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    const clampedX = Math.max(0, Math.min(100, x))
    const clampedY = Math.max(0, Math.min(100, y))

    onFocalPointChange({ x: clampedX, y: clampedY })
  }, [onFocalPointChange])

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-video bg-muted rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25 cursor-crosshair",
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <img
        src={imageUrl}
        alt="Focal point editor"
        className="w-full h-full object-cover opacity-50 select-none"
        draggable={false}
      />
      
      {/* Focal point indicator */}
      <div
        className={cn(
          "absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-all duration-150",
          isDragging && "scale-110 shadow-xl"
        )}
        style={{
          left: `${focalPoint.x}%`,
          top: `${focalPoint.y}%`
        }}
      />
      
      {/* Grid overlay for better positioning */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full grid grid-cols-3 grid-rows-3 opacity-20">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="border border-muted-foreground/30" />
          ))}
        </div>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-2 left-2 right-2 text-center">
        <p className="text-xs text-muted-foreground bg-background/80 backdrop-blur-sm rounded px-2 py-1">
          Click or drag to set focal point
        </p>
      </div>
    </div>
  )
}
