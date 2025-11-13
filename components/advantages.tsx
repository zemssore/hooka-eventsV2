"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface Hookah {
  id: number
  name: string
  description: string
  image: string
}

export default function Advantages() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [hookahs, setHookahs] = useState<Hookah[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHookahs()
  }, [])

  const loadHookahs = async () => {
    try {
      const res = await fetch("/api/hookahs")
      const data = await res.json()
      setHookahs(data || [])
    } catch (error) {
      console.error("Error loading hookahs:", error)
    } finally {
      setLoading(false)
    }
  }

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const cardWidth = 380 // Ширина карточки + gap
      const currentScroll = scrollRef.current.scrollLeft
      const newScroll = direction === "left" ? currentScroll - cardWidth : currentScroll + cardWidth
      scrollRef.current.scrollTo({ left: newScroll, behavior: "smooth" })
      setTimeout(checkScroll, 300)
    }
  }

  useEffect(() => {
    if (!loading && hookahs.length > 0) {
      // Небольшая задержка для корректной проверки после рендера
      const timeoutId = setTimeout(() => {
        checkScroll()
      }, 100)
      const handleResize = () => {
        setTimeout(checkScroll, 100)
      }
      window.addEventListener("resize", handleResize)
      return () => {
        clearTimeout(timeoutId)
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [hookahs, loading])

  return (
    <section id="advantages" className="py-12 sm:py-16 md:py-24 lg:py-32 bg-background w-full max-w-full overflow-x-hidden">
      <div className="container">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title mb-6">Наши кальяны</h2>
          <p className="section-subtitle">Премиальное оборудование для ваших мероприятий</p>
        </motion.div>

        {/* Horizontal Scroll with Buttons - All Screen Sizes */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Загрузка кальянов...</p>
          </div>
        ) : hookahs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Кальяны не добавлены</p>
          </div>
        ) : (
          <div className="relative">
            <div
              ref={scrollRef}
              onScroll={checkScroll}
              className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              {hookahs.map((hookah, idx) => (
              <motion.div
                key={hookah.id}
                className="group relative flex flex-col flex-shrink-0 w-[calc(100vw-4rem)] sm:w-80 md:w-96 rounded-lg bg-card border border-border hover:border-accent/50 transition-all duration-300 overflow-hidden snap-start"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -8,
                }}
              >
                <div className="relative w-full h-64 sm:h-72 md:h-80 overflow-hidden">
                  <Image
                    src={hookah.image || "/placeholder.svg"}
                    alt={hookah.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">{hookah.name}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base flex-grow">{hookah.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation Buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-background/90 backdrop-blur-sm border border-border hover:border-accent/50 text-foreground hover:text-accent transition-all shadow-lg"
              aria-label="Прокрутить влево"
            >
              <ChevronLeft size={24} className="sm:w-6 sm:h-6" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-background/90 backdrop-blur-sm border border-border hover:border-accent/50 text-foreground hover:text-accent transition-all shadow-lg"
              aria-label="Прокрутить вправо"
            >
              <ChevronRight size={24} className="sm:w-6 sm:h-6" />
            </button>
          )}
          </div>
        )}
      </div>
    </section>
  )
}
