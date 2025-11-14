"use client"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Info, X, Circle } from "lucide-react"
import Image from "next/image"

interface Hookah {
  id: number
  name: string
  description: string
  image: string
  tobaccos?: { brand: string; flavor: string }[]
}

// Компонент для всплывающего окна с составом табаков
function InfoTooltip({ hookah }: { hookah: Hookah }) {
  const [isHovered, setIsHovered] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const iconRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isHovered && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect()
      setPosition({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      })
    }
  }, [isHovered])

  if (!hookah.tobaccos || hookah.tobaccos.length === 0) return null

  return (
    <>
      <div 
        ref={iconRef}
        className="relative group/info z-50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="cursor-pointer">
          <div className="relative w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center group-hover/info:opacity-80 transition-opacity">
            <Circle size={16} className="sm:w-5 sm:h-5 absolute fill-foreground/20 stroke-foreground/40" strokeWidth={1.5} />
            <span className="text-[9px] sm:text-[11px] font-bold text-foreground relative z-10">i</span>
          </div>
        </div>
      </div>
      {/* Всплывающее окно с составом табаков */}
      {isHovered && (
        <div 
          className="fixed w-56 sm:w-64 p-4 rounded-lg bg-background/98 backdrop-blur-sm border border-border shadow-xl z-[100] pointer-events-none"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: 'translate(-50%, -100%)',
            marginTop: '-12px',
          }}
        >
          <div className="text-xs sm:text-sm text-foreground">
            <p className="font-bold text-foreground mb-3 uppercase">Состав:</p>
            <div className="space-y-1.5">
              {hookah.tobaccos.map((tob, tobIdx) => (
                <div key={tobIdx} className="text-left">
                  <span className="font-semibold italic text-foreground">{tob.brand}</span>
                  <span className="text-muted-foreground"> - {tob.flavor}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Стрелка вниз */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border"></div>
        </div>
      )}
    </>
  )
}

export default function Advantages() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [hookahs, setHookahs] = useState<Hookah[]>([])
  const [loading, setLoading] = useState(true)
  const [clickedId, setClickedId] = useState<number | null>(null)

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
      // Динамически вычисляем ширину карточки в зависимости от размера экрана
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
      const isTablet = typeof window !== 'undefined' && window.innerWidth >= 640 && window.innerWidth < 1024
      const cardWidth = isMobile 
        ? window.innerWidth * 0.5 + 24 // 50% экрана + gap
        : isTablet 
        ? 320 + 24 // 320px + gap для планшета
        : 384 + 24 // 384px + gap для десктопа
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
              className="flex gap-6 overflow-x-auto overflow-y-visible pb-8 snap-x snap-mandatory scrollbar-hide px-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              {hookahs.map((hookah, idx) => (
              <motion.div
                key={hookah.id}
                className="group relative flex flex-col flex-shrink-0 w-[calc(50vw-2rem)] sm:w-80 md:w-96 rounded-lg bg-card border border-border hover:border-accent/50 transition-all duration-300 overflow-visible snap-start"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                {/* Изображение кальяна */}
                <div className="relative w-full h-80 sm:h-[28rem] md:h-[32rem] overflow-hidden bg-muted">
                  <Image
                    src={hookah.image || "/placeholder.svg"}
                    alt={hookah.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Контент карточки */}
                <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
                  {/* Заголовок */}
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-1">{hookah.name}</h3>
                  
                  {/* Подзаголовок [кальянный микс] */}
                  <div className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">[кальянный микс]</div>
                  
                  {/* Описание */}
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4 flex-grow">
                    {hookah.description}
                  </p>
                  
                  {/* Информация о табаках с перевернутым восклицательным знаком */}
                  {hookah.tobaccos && hookah.tobaccos.length > 0 && (
                    <div className="flex items-center gap-2 mt-auto mb-1">
                      <div className="text-xs sm:text-sm font-medium text-foreground">Табаки</div>
                      <InfoTooltip hookah={hookah} />
                      {/* Кнопка Info для мобильной версии (скрыта на десктопе) */}
                      <div className="relative group/tobacco md:hidden">
                        <button
                          onClick={() => {
                            if (typeof window !== 'undefined' && window.innerWidth < 768) {
                              setClickedId(clickedId === hookah.id ? null : hookah.id)
                            }
                          }}
                          className="flex items-center justify-center w-4 h-4 text-foreground hover:text-accent transition-colors"
                          aria-label="Показать состав табаков"
                        >
                          <Info size={12} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Overlay с табаками - для мобильной версии (при клике) */}
                <AnimatePresence>
                  {clickedId === hookah.id && hookah.tobaccos && hookah.tobaccos.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="md:hidden absolute inset-0 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-20"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setClickedId(null)
                        }}
                        className="absolute top-3 right-3 p-2 rounded-full bg-background/90 backdrop-blur-sm border border-border hover:border-accent/50 text-foreground hover:text-accent transition-all"
                        aria-label="Закрыть"
                      >
                        <X size={20} />
                      </button>
                      <p className="text-xs font-semibold text-accent mb-4 uppercase tracking-wider">Состав:</p>
                      <div className="space-y-2 w-full text-left">
                        {hookah.tobaccos.map((tob, tobIdx) => (
                          <motion.div
                            key={tobIdx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: tobIdx * 0.05 }}
                            className="text-sm sm:text-base"
                          >
                            <span className="text-foreground font-medium italic">{tob.brand}</span>
                            <span className="text-muted-foreground"> - {tob.flavor}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
