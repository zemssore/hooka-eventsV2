"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const reviews = [
  {
    id: 1,
    name: "Александр М.",
    company: 'event-агентство "Гранд"',
    rating: 5,
    text: "Работали с Hookah Events для корпоратива 200+ человек. Команда профессиональна, оборудование в идеальном состоянии, гости были в восторге. Рекомендуем!",
  },
  {
    id: 2,
    name: "Анна К.",
    company: 'свадебное агентство "Мечта"',
    rating: 5,
    text: "Кальянная зона на нашей свадьбе стала хитом! Мастера работали чётко, табак премиального качества, оформление соответствовало тематике события.",
  },
  {
    id: 3,
    name: "Иван Петров",
    company: "режиссёр, кинопроизводство",
    rating: 5,
    text: "Для съёмки нужна была реалистичная сцена с кальяном. Hookah Events предоставили всё необходимое, персонал знал, как работать перед камерой.",
  },
]

export default function Reviews() {
  return (
    <section id="reviews" className="py-12 sm:py-16 md:py-24 lg:py-32 bg-background">
      <div className="container">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title mb-6">Отзывы клиентов</h2>
          <p className="section-subtitle">Что говорят о нас наши партнёры</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {reviews.map((review, idx) => (
            <motion.div
              key={review.id}
              className="p-6 sm:p-8 rounded-lg bg-card border border-border hover:border-accent/50 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
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
                <p className="font-semibold text-foreground">{review.name}</p>
                <p className="text-sm text-muted-foreground">{review.company}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground mb-6">Оставьте свой отзыв и помогите другим выбрать качественный кейтеринг</p>
          <button className="btn btn-outline">Написать отзыв</button>
        </motion.div>
      </div>
    </section>
  )
}
