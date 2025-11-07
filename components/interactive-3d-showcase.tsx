"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import 3D hookah to avoid SSR issues
const ThreeDHookah = dynamic(() => import("./3d-hookah"), { ssr: false })

export default function Interactive3DShowcase() {
  const [show3D, setShow3D] = useState(false)

  return (
    <section id="interactive-showcase" className="py-12 sm:py-16 md:py-24 lg:py-32 bg-background border-y border-border">
      <div className="container">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title mb-6">Интерактивная демонстрация</h2>
          <p className="section-subtitle">Посмотрите наше премиальное оборудование в 3D</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
          {/* Left: Info */}
          <motion.div
            className="space-y-5 sm:space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">Современное оборудование</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Все наши кальяны — это премиум-класс с идеальной тягой, герметичными соединениями и красивым дизайном.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { title: "Премиальные материалы", desc: "Латунь, нержавеющая сталь, качественные шланги" },
                { title: "Чистота и гигиена", desc: "Каждый кальян обрабатывается перед использованием" },
                { title: "Инновационный дизайн", desc: "Современные модели с улучшенной аэродинамикой" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="p-4 rounded-lg bg-card border border-border/50"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <p className="font-semibold text-accent mb-1">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={() => setShow3D(!show3D)}
              className="btn btn-filled"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {show3D ? "Скрыть 3D модель" : "Показать 3D модель"}
            </motion.button>
          </motion.div>

          {/* Right: 3D Display */}
          <motion.div
            className="relative h-64 sm:h-80 md:h-96 rounded-lg bg-card border border-border/50 overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {show3D ? (
              <div className="w-full h-full">
                <ThreeDHookah />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <motion.div
                  className="text-center"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  <div className="text-6xl mb-4">🎨</div>
                  <p className="text-muted-foreground">Нажмите кнопку выше, чтобы увидеть 3D</p>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
