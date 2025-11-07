"use client"

import { useEffect, type ReactNode } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { useRef } from "react"

interface ScrollTriggerProps {
  children: ReactNode
  delay?: number
}

export function ScrollTrigger({ children, delay = 0 }: ScrollTriggerProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  )
}
