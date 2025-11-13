"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface StaffMember {
  id: number
  name: string
  role: string
  image: string
}

export default function Staff() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    loadStaff()
  }, [])

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const cardWidth = 220 // Ширина карточки + gap
      const currentScroll = scrollRef.current.scrollLeft
      const newScroll = direction === "left" ? currentScroll - cardWidth : currentScroll + cardWidth
      scrollRef.current.scrollTo({ left: newScroll, behavior: "smooth" })
      setTimeout(checkScroll, 300)
    }
  }

  useEffect(() => {
    if (!loading && staffMembers.length > 0) {
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
  }, [staffMembers, loading])

  const loadStaff = async () => {
    try {
      const res = await fetch("/api/staff")
      const data = await res.json()
      setStaffMembers(data || [])
    } catch (error) {
      console.error("Error loading staff:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="staff" className="py-12 sm:py-16 md:py-24 lg:py-32 bg-card border-y border-border w-full max-w-full overflow-x-hidden">
      <div className="container">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title mb-6">Наша команда</h2>
          <p className="section-subtitle">Опытные мастера, которые создают атмосферу вашего события</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Загрузка команды...</p>
          </div>
        ) : (
          <>
            {/* Staff - Horizontal Slider on Mobile, Grid on Desktop */}
            <div className="md:hidden w-full max-w-full overflow-hidden relative">
              <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
              >
                {staffMembers.map((member, idx) => (
                  <motion.div
                    key={member.id}
                    className="text-center flex-shrink-0 w-[calc(100vw-2rem)] sm:w-[200px] snap-start"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-card border border-border mb-3 group">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">{member.name}</h3>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
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

        {/* Staff Grid - Desktop */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {staffMembers.map((member, idx) => (
            <motion.div
              key={member.id}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-card border border-border mb-4 group">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">{member.name}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{member.role}</p>
            </motion.div>
          ))}
        </div>
          </>
        )}
      </div>
    </section>
  )
}

