"use client"

import { motion, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"

interface AnimatedCounterProps {
  from: number
  to: number
  duration?: number
  suffix?: string
}

export function AnimatedCounter({ from, to, duration = 2, suffix = "" }: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(from)

  useEffect(() => {
    if (!isInView) return

    let start = from
    const increment = (to - from) / (duration * 60)
    let animationFrameId: number

    const tick = () => {
      start += increment
      if (start >= to) {
        setCount(to)
      } else {
        setCount(Math.round(start))
        animationFrameId = requestAnimationFrame(tick)
      }
    }

    animationFrameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animationFrameId)
  }, [isInView, from, to, duration])

  return (
    <motion.div ref={ref} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <span className="text-accent font-bold">
        {count.toLocaleString()}
        {suffix}
      </span>
    </motion.div>
  )
}
