"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"

interface Brand {
  id: number
  name: string
  logo: string
}

export default function BrandsSlider() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBrands()
  }, [])

  const loadBrands = async () => {
    try {
      const res = await fetch("/api/brands")
      const data = await res.json()
      setBrands(data || [])
    } catch (error) {
      console.error("Error loading brands:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (brands.length === 0) return

    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationFrameId: number
    let scrollAmount = 0
    
    // Определяем скорость: на мобильных устройствах в 2 раза медленнее
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const scrollSpeed = isMobile ? 0.25 : 0.5

    const scroll = () => {
      if (!scrollContainer) return
      
      scrollAmount += scrollSpeed
      
      // Бесшовный скролл: когда дошли до конца первой копии, сбрасываем
      const singleSetWidth = scrollContainer.scrollWidth / 3
      if (scrollAmount >= singleSetWidth) {
        scrollAmount = 0
      }
      
      scrollContainer.scrollLeft = scrollAmount
      animationFrameId = requestAnimationFrame(scroll)
    }

    // Ждем пока контент загрузится и изображения отрендерятся
    const timeout = setTimeout(() => {
      // Проверяем что контент действительно загружен
      if (scrollContainer.scrollWidth > scrollContainer.clientWidth) {
        animationFrameId = requestAnimationFrame(scroll)
      }
    }, 300)

    // Обработчик изменения размера окна для обновления скорости
    const handleResize = () => {
      // Скорость обновится при следующем рендере
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', handleResize)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [brands])

  // Дублируем бренды для бесшовного скролла
  const duplicatedBrands = brands.length > 0 ? [...brands, ...brands, ...brands] : []

  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-background border-y border-border w-full max-w-full overflow-x-hidden">
        <div className="container">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Загрузка брендов...</p>
          </div>
        </div>
      </section>
    )
  }

  if (brands.length === 0) {
    return null
  }

  return (
    <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-background border-y border-border w-full max-w-full overflow-x-hidden">
      <div className="container">
        <motion.div
          className="mb-12 sm:mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title mb-6">Нам доверяют</h2>
          <p className="section-subtitle">Мы работаем с ведущими компаниями</p>
        </motion.div>

        <div className="relative overflow-hidden">
          <div
            ref={scrollRef}
            className="flex gap-12 sm:gap-16 md:gap-20 items-center scrollbar-hide"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none', 
              WebkitOverflowScrolling: 'touch',
              willChange: 'scroll-position',
              overflowX: 'auto',
              overflowY: 'hidden'
            }}
          >
            {duplicatedBrands.map((brand, idx) => (
              <div
                key={`${brand.id}-${idx}`}
                className="flex-shrink-0 flex items-center justify-center"
              >
                <div className="relative w-32 h-16 sm:w-40 sm:h-20 md:w-48 md:h-24 opacity-100 transition-opacity duration-300">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Градиенты для плавного перехода */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background via-background to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background via-background to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </section>
  )
}

