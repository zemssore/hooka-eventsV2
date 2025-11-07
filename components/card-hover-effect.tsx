"use client"

import type React from "react"

import { motion, useMotionTemplate, useMotionValue } from "framer-motion"
import { type ReactNode, useRef } from "react"

interface CardHoverEffectProps {
  children: ReactNode
  className?: string
}

export function CardHoverEffect({ children, className = "" }: CardHoverEffectProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const background = useMotionTemplate`radial-gradient(200px circle at ${x}px ${y}px, rgba(255,215,0,0.15), transparent 80%)`

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set(e.clientX - rect.left)
    y.set(e.clientY - rect.top)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ background }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}
