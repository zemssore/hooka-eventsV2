"use client"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface Mix {
  id: number
  name: string
  description: string
  image: string | null
  tobaccos: { brand: string; flavor: string }[]
}

export default function Menu() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [mixes, setMixes] = useState<Mix[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMixes()
  }, [])

  const loadMixes = async () => {
    try {
      const res = await fetch("/api/mixes")
      const data = await res.json()
      setMixes(data.classic || [])
    } catch (error) {
      console.error("Error loading mixes:", error)
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
    if (!loading && mixes.length > 0) {
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
  }, [mixes, loading])

  return (
    <section id="menu" className="py-12 sm:py-16 md:py-24 lg:py-32 bg-card border-y border-border w-full max-w-full overflow-x-hidden">
      <div className="container">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title mb-6">Меню миксов</h2>
          <p className="section-subtitle">Авторские комбинации премиальных табаков</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Загрузка миксов...</p>
          </div>
        ) : mixes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Миксы не добавлены</p>
          </div>
        ) : (
          <div className="relative">
            <div
              ref={scrollRef}
              onScroll={checkScroll}
              className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              {mixes.map((mix, idx) => (
                <motion.div
                  key={mix.id}
                  className="group relative flex flex-col flex-shrink-0 w-[calc(100vw-4rem)] sm:w-80 md:w-96 rounded-lg bg-background border border-border hover:border-accent/50 transition-all duration-300 overflow-hidden snap-start"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  onMouseEnter={() => setHoveredId(mix.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="relative w-full h-64 sm:h-72 md:h-80 overflow-hidden">
                    {mix.image ? (
                      <Image
                        src={mix.image}
                        alt={mix.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-card flex items-center justify-center">
                        <span className="text-muted-foreground">Нет изображения</span>
                      </div>
                    )}
                    {/* Всплывающий список табаков при наведении */}
                    <AnimatePresence>
                      {hoveredId === mix.id && mix.tobaccos && mix.tobaccos.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute inset-0 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-10"
                        >
                          <p className="text-xs font-semibold text-accent mb-4 uppercase tracking-wider">Табак</p>
                          <div className="space-y-2 w-full">
                            {mix.tobaccos.map((tob, tobIdx) => (
                              <motion.div
                                key={tobIdx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: tobIdx * 0.05 }}
                                className="flex items-center justify-between text-sm sm:text-base"
                              >
                                <span className="text-foreground font-medium">{tob.brand}</span>
                                <span className="text-muted-foreground">– {tob.flavor}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">{mix.name}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base flex-grow">{mix.description}</p>
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
