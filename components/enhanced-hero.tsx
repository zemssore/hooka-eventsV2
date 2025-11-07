"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export default function EnhancedHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !textRef.current) return
      const { clientX, clientY } = e
      const { width, height, left, top } = containerRef.current.getBoundingClientRect()

      const moveX = (clientX - left - width / 2) * 0.02
      const moveY = (clientY - top - height / 2) * 0.02

      textRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <section className="relative w-full h-screen pt-20 flex items-center justify-center overflow-hidden bg-background">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, oklch(0.3 0 0 / 0.12) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, oklch(0.3 0 0 / 0.12) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, oklch(0.3 0 0 / 0.12) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
      />

      {/* Parallax effect on scroll */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          y: scrollY * 0.5,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, oklch(0.3 0 0 / 0.12) 0%, transparent 50%)",
          }}
        />
      </motion.div>

      <div ref={containerRef} className="relative z-10 w-full h-full flex items-center justify-center">
        <motion.div
          ref={textRef}
          className="text-center transition-transform duration-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        ></motion.div>
      </div>

      {/* Enhanced scroll indicator with animation */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 border-2 border-accent rounded-full flex items-center justify-center">
          <motion.div
            className="w-1 h-2 bg-accent rounded-full"
            animate={{ opacity: [1, 0.3, 1], y: [0, 3, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>
      </motion.div>
    </section>
  )
}
