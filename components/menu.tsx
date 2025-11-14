"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, X, Circle } from "lucide-react"
import Image from "next/image"

interface Mix {
  id: number
  name: string
  description: string
  image: string | null
  tobaccos: { brand: string; flavor: string }[]
}

// Компонент для всплывающего окна с составом табаков
function InfoTooltip({ mix, onMobileClick }: { mix: Mix; onMobileClick?: () => void }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const iconRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if ((isHovered || isClicked) && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect()
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
      
      if (isMobile) {
        // На мобильных - показываем над иконкой, но проверяем границы экрана
        const tooltipHeight = 200 // Примерная высота tooltip
        const tooltipWidth = 256 // w-64 = 256px
        const spaceAbove = rect.top
        const spaceBelow = window.innerHeight - rect.bottom
        
        let top = rect.top - 8
        let left = rect.left + rect.width / 2
        
        // Если не хватает места сверху, показываем снизу
        if (spaceAbove < tooltipHeight && spaceBelow > tooltipHeight) {
          top = rect.bottom + 8
        } else if (spaceAbove < tooltipHeight) {
          // Если не хватает места ни сверху, ни снизу, центрируем по вертикали
          top = Math.max(8, (window.innerHeight - tooltipHeight) / 2)
        }
        
        // Проверяем горизонтальные границы
        if (left - tooltipWidth / 2 < 8) {
          left = tooltipWidth / 2 + 8
        } else if (left + tooltipWidth / 2 > window.innerWidth - 8) {
          left = window.innerWidth - tooltipWidth / 2 - 8
        }
        
        setPosition({ top, left })
      } else {
        // На десктопе - над иконкой
        setPosition({
          top: rect.top - 8,
          left: rect.left + rect.width / 2,
        })
      }
    }
  }, [isHovered, isClicked])

  // Закрытие при клике вне области
  useEffect(() => {
    if (isClicked) {
      const handleClickOutside = (e: MouseEvent) => {
        if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node) && 
            iconRef.current && !iconRef.current.contains(e.target as Node)) {
          setIsClicked(false)
          if (onMobileClick) onMobileClick()
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isClicked, onMobileClick])

  // Закрытие при скролле страницы
  useEffect(() => {
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop
    let scrollTimeout: NodeJS.Timeout | null = null
    
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop
      
      // Проверяем, действительно ли произошел скролл (изменилась позиция)
      if (Math.abs(currentScrollTop - lastScrollTop) > 5) {
        lastScrollTop = currentScrollTop
        
        // Добавляем небольшую задержку, чтобы не закрывать при клике
        if (scrollTimeout) {
          clearTimeout(scrollTimeout)
        }
        
        scrollTimeout = setTimeout(() => {
          setIsHovered(false)
          setIsClicked(false)
          if (onMobileClick) onMobileClick()
        }, 50)
      }
    }
    
    window.addEventListener('scroll', handleScroll, true)
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
    }
  }, [onMobileClick])

  if (!mix.tobaccos || mix.tobaccos.length === 0) return null

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const showTooltip = isMobile ? isClicked : isHovered

  return (
    <>
      <div 
        ref={iconRef}
        className="relative group/info z-50"
        onMouseEnter={() => {
          if (!isMobile) setIsHovered(true)
        }}
        onMouseLeave={() => {
          if (!isMobile) setIsHovered(false)
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (isMobile) {
            setIsClicked(!isClicked)
            if (onMobileClick) onMobileClick()
          }
        }}
      >
        <div className="cursor-pointer">
          <div className="relative w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center group-hover/info:opacity-80 transition-opacity">
            <Circle size={16} className="sm:w-5 sm:h-5 absolute fill-foreground/20 stroke-foreground/40" strokeWidth={1.5} />
            <span className="text-[9px] sm:text-[11px] font-bold text-foreground relative z-10">i</span>
          </div>
        </div>
      </div>
      {/* Всплывающее окно с составом табаков */}
      {showTooltip && (
        <div 
          ref={tooltipRef}
          className={`fixed w-64 sm:w-72 p-4 rounded-lg bg-background border border-border shadow-xl z-[100] ${isMobile ? 'pointer-events-auto' : 'pointer-events-none'}`}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: isMobile 
              ? (position.top > (typeof window !== 'undefined' ? window.innerHeight / 2 : 400) ? 'translate(-50%, 0)' : 'translate(-50%, -100%)')
              : 'translate(-50%, -100%)',
            marginTop: isMobile ? '0' : '-12px',
          }}
        >
          {isMobile && (
            <button
              onClick={() => {
                setIsClicked(false)
                if (onMobileClick) onMobileClick()
              }}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors z-10"
              aria-label="Закрыть"
            >
              <X size={16} />
            </button>
          )}
          <div className="text-xs sm:text-sm text-foreground">
            <p className="font-bold text-foreground mb-3 uppercase">Состав:</p>
            <div className="space-y-1.5">
              {mix.tobaccos.map((tob, tobIdx) => (
                <div key={tobIdx} className="text-left">
                  <span className="font-semibold italic text-foreground">{tob.brand}</span>
                  <span className="text-muted-foreground"> - {tob.flavor}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Стрелка вниз (для десктопа) или вверх (для мобильных, если tooltip снизу) */}
          {!isMobile ? (
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border"></div>
          ) : position.top > (typeof window !== 'undefined' ? window.innerHeight / 2 : 400) ? (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-border"></div>
          ) : (
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border"></div>
          )}
        </div>
      )}
    </>
  )
}

export default function Menu() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
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
                  className="group relative flex flex-col flex-shrink-0 w-[calc(100vw-4rem)] sm:w-80 md:w-96 rounded-lg bg-background border border-border hover:border-accent/50 transition-all duration-300 overflow-visible snap-start"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  viewport={{ once: true }}
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
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">{mix.name}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base flex-grow mb-4">{mix.description}</p>
                    
                    {/* Информация о табаках с иконкой info */}
                    {mix.tobaccos && mix.tobaccos.length > 0 && (
                      <div className="flex items-center gap-2 mt-auto">
                        <div className="text-xs sm:text-sm font-medium text-foreground">Табаки</div>
                        <InfoTooltip mix={mix} />
                      </div>
                    )}
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
