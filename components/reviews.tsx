"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/components/ui/toast"

interface Review {
  id: number
  name: string
  company: string
  rating: number
  text: string
  status?: string
  createdAt?: string
}

export default function Reviews() {
  const toast = useToast()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    text: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(true)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    loadReviews()
  }, [])

  // Блокируем скролл body когда модальное окно открыто
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isModalOpen])

  const loadReviews = async () => {
    try {
      const response = await fetch("/api/review")
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    } catch (error) {
      console.error("Error loading reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    if (!loading && reviews.length > 0) {
      // Небольшая задержка для корректной проверки после рендера
      const timeoutId = setTimeout(() => {
        checkScrollButtons()
      }, 100)
      const handleResize = () => {
        setTimeout(checkScrollButtons, 100)
      }
      window.addEventListener("resize", handleResize)
      return () => {
        clearTimeout(timeoutId)
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [reviews, loading])

  const scrollLeft = () => {
    const container = scrollContainerRef.current
    if (container) {
      // Получаем ширину первой видимой карточки + gap
      const firstCard = container.querySelector('.flex-shrink-0') as HTMLElement
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth + 24 // gap = 24px (gap-6)
        container.scrollBy({ left: -cardWidth, behavior: "smooth" })
      }
    }
  }

  const scrollRight = () => {
    const container = scrollContainerRef.current
    if (container) {
      // Получаем ширину первой видимой карточки + gap
      const firstCard = container.querySelector('.flex-shrink-0') as HTMLElement
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth + 24 // gap = 24px (gap-6)
        container.scrollBy({ left: cardWidth, behavior: "smooth" })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.text) {
      toast.showError("Пожалуйста, заполните все обязательные поля")
      return
    }

    if (formData.name.trim().length < 2) {
      toast.showError("Имя должно содержать минимум 2 символа")
      return
    }

    if (formData.text.trim().length < 10) {
      toast.showError("Текст отзыва должен содержать минимум 10 символов")
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.showSuccess("Отзыв успешно отправлен на модерацию. После проверки он появится на сайте. Спасибо!")
        setFormData({ name: "", rating: 5, text: "" })
        setIsModalOpen(false)
      } else {
        const errorMessage = data.error || "Ошибка при отправке отзыва"
        toast.showError(`Ошибка: ${errorMessage}. Попробуйте позже или свяжитесь с нами.`)
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.showError("Произошла ошибка при отправке отзыва. Проверьте подключение к интернету и попробуйте снова.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="reviews" className="py-12 sm:py-16 md:py-24 lg:py-32 bg-background w-full max-w-full overflow-x-hidden">
      <div className="container">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <h2 className="section-title mb-6">Отзывы клиентов</h2>
          <p className="section-subtitle">Что говорят о нас наши клиенты</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Загрузка отзывов...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Пока нет отзывов</p>
          </div>
        ) : (
          <div className="relative w-full max-w-full overflow-hidden">
            {/* Кнопка влево */}
            {canScrollLeft && (
              <button
                onClick={scrollLeft}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-background/90 backdrop-blur-sm border border-border hover:border-accent/50 text-foreground hover:text-accent transition-all shadow-lg"
                aria-label="Прокрутить влево"
              >
                <ChevronLeft size={24} className="sm:w-6 sm:h-6" />
              </button>
            )}

            {/* Кнопка вправо */}
            {canScrollRight && (
              <button
                onClick={scrollRight}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-background/90 backdrop-blur-sm border border-border hover:border-accent/50 text-foreground hover:text-accent transition-all shadow-lg"
                aria-label="Прокрутить вправо"
              >
                <ChevronRight size={24} className="sm:w-6 sm:h-6" />
              </button>
            )}

            <div 
              ref={scrollContainerRef}
              onScroll={checkScrollButtons}
              className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              {reviews.map((review, idx) => (
                <motion.div
                  key={review.id}
                  className="flex-shrink-0 w-[calc(100vw-2rem)] sm:w-[380px] md:w-[420px] p-4 sm:p-6 md:p-8 rounded-lg bg-card border border-border hover:border-accent/50 transition-all duration-300 snap-start"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05, ease: "easeOut" }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={16} className="fill-accent text-accent" />
                    ))}
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed">{review.text}</p>

                  <div className="border-t border-border pt-4">
                    <p className="font-semibold text-foreground">{review.name.split(' ')[0]}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground mb-6">Оставьте свой отзыв и помогите другим выбрать нас!</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn btn-outline"
          >
            Написать отзыв
          </button>
        </motion.div>
      </div>

      {/* Модальное окно для отправки отзыва */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              className="fixed inset-0 z-[10001] flex items-center justify-center p-4 pointer-events-none"
            >
              <motion.div
                className="bg-background border border-border rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ 
                  type: "spring", 
                  damping: 30, 
                  stiffness: 400,
                  mass: 0.8
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-foreground">Написать отзыв</h3>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 hover:bg-background/80 rounded-lg transition-colors"
                      aria-label="Закрыть"
                    >
                      <X size={24} className="text-foreground" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Ваше имя *
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 rounded-sm bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                        placeholder="Введите ваше имя"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Оценка *
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setFormData({ ...formData, rating })}
                            className="p-2 hover:bg-background/80 rounded-lg transition-colors"
                          >
                            <Star
                              size={32}
                              className={formData.rating >= rating ? "fill-accent text-accent" : "fill-none text-muted-foreground"}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="text" className="block text-sm font-medium text-foreground mb-2">
                        Текст отзыва *
                      </label>
                      <textarea
                        id="text"
                        value={formData.text}
                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                        required
                        rows={6}
                        className="w-full px-4 py-2.5 rounded-sm bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none"
                        placeholder="Напишите ваш отзыв..."
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 btn btn-outline"
                        disabled={submitting}
                      >
                        Отмена
                      </button>
                      <button
                        type="submit"
                        className="flex-1 btn btn-filled"
                        disabled={submitting}
                      >
                        {submitting ? "Отправка..." : "Отправить отзыв"}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
