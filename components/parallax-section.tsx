"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface ParallaxSectionProps {
  children: React.ReactNode
  offset?: number
}

export function ParallaxSection({ children, offset = 50 }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [y, setY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const distanceFromCenter = rect.top - viewportHeight / 2

      setY(distanceFromCenter * 0.1)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.div ref={ref} style={{ y }} transition={{ type: "spring", stiffness: 100, damping: 30 }}>
      {children}
    </motion.div>
  )
}
