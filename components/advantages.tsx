"use client"

import { motion } from "framer-motion"
import { CheckCircle, Zap, Layers, Users, Star, Sparkles } from "lucide-react"

const advantages = [
  {
    icon: CheckCircle,
    title: "Полное сопровождение “под ключ”",
    description:
      "Мы берём на себя всё — от предоставления оборудования и табаков до оформления зоны и обслуживания гостей. Клиенту остаётся только наслаждаться атмосферой.",
    color: "text-accent",
  },
  {
    icon: Star,
    title: "Премиальное качество без компромиссов",
    description:
      "Только проверенные табаки (Musthave, Darkside, Sebero и др.), чистые кальяны, идеальные чаши на фруктах и персонал, прошедший профессиональное обучение.",
    color: "text-accent",
  },
  {
    icon: Layers,
    title: "Гибкость под любой формат",
    description:
      "Корпоратив, свадьба, день рождения, конференция, съёмка или вечеринка — мы адаптируемся под любую концепцию и масштаб мероприятия без потери качества.",
    color: "text-accent",
  },
  {
    icon: Users,
    title: "Работаем под вашим брендом",
    description:
      "Можем выступать от лица вашей площадки, кейтеринга или агентства — клиент видит только безупречный результат.",
    color: "text-accent",
  },
  {
    icon: Zap,
    title: "Опытные мастера и единые стандарты",
    description:
      "Каждый кальянщик Hookah Events — это не просто исполнитель, а представитель атмосферы бренда. Мы гарантируем стабильное качество на каждом мероприятии.",
    color: "text-accent",
  },
  {
    icon: Sparkles,
    title: "Атмосфера, которую запоминают",
    description:
      "Кальянная зона становится точкой притяжения гостей. Мы создаём не просто дым, а комфорт, стиль и эмоции, за которые вас будут благодарить.",
    color: "text-accent",
  },
]

export default function Advantages() {
  return (
    <section id="advantages" className="py-12 sm:py-16 md:py-24 lg:py-32 bg-background">
      <div className="container">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title mb-6">Почему мы?</h2>
          <p className="section-subtitle">Премиальное качество, гибкость и внимание к каждой детали</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {advantages.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={idx}
                className="group relative p-6 sm:p-8 rounded-lg bg-card border border-border hover:border-accent/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -8,
                  boxShadow: "0 20px 40px rgba(255,215,0,0.15)",
                }}
                onMouseMove={(e) => {
                  if (e.currentTarget instanceof HTMLElement) {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top
                    e.currentTarget.style.setProperty("--mouse-x", `${x}px`)
                    e.currentTarget.style.setProperty("--mouse-y", `${y}px`)
                  }
                }}
              >
                <Icon
                  className={`${item.color} w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}
                />
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">{item.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
