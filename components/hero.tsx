"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !textRef.current) return
      const { clientX, clientY } = e
      const { width, height, left, top } = containerRef.current.getBoundingClientRect()

      const moveX = (clientX - left - width / 2) * 0.02
      const moveY = (clientY - top - height / 2) * 0.02

      textRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section className="relative w-full min-h-screen pt-16 sm:pt-20 pb-8 sm:pb-0 flex items-center justify-center overflow-hidden bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, oklch(0.3 0 0 / 0.15) 0%, transparent 50%)",
          }}
        />
      </div>

      <div ref={containerRef} className="relative z-10 w-full h-full flex items-center justify-center">
        <motion.div
          ref={textRef}
          className="text-center transition-transform duration-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground mb-4 sm:mb-6 tracking-tighter px-4"
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0" }}
            transition={{ duration: 1.5, delay: 0.3 }}
          >
            HOOKAH EVENTS
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-accent mb-3 sm:mb-4 font-light tracking-wide px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            Кальянный кейтеринг на мероприятия в Москве и области
          </motion.p>

          <motion.p
            className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            Предоставим кальяны и персонал под ваш формат события
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 w-full sm:w-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <button className="btn btn-filled w-full sm:w-auto text-sm sm:text-base">Рассчитать под свой формат</button>
            <a href="https://tg.me/hookahevents" target="_blank" rel="noopener noreferrer" className="btn btn-outline w-full sm:w-auto text-sm sm:text-base">
              Написать в Telegram
            </a>
          </motion.div>

          <motion.p
            className="text-xs sm:text-sm text-muted-foreground mt-6 sm:mt-8 tracking-wide px-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            <span className="block sm:inline">Премиум-оборудование</span>
            <span className="hidden sm:inline"> | </span>
            <span className="block sm:inline">Обслуживание под ключ</span>
            <span className="hidden sm:inline"> | </span>
            <span className="block sm:inline">Работаем под вашим брендом</span>
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="w-6 h-10 border-2 border-accent rounded-full flex items-center justify-center">
          <div className="w-1 h-2 bg-accent rounded-full animate-pulse" />
        </div>
      </motion.div>
    </section>
  )
}
