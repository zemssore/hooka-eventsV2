"use client"

import type React from "react"

import { motion } from "framer-motion"
import { FileDown } from "lucide-react"
import { useState } from "react"

export default function Partners() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Здесь будет обработка формы через API
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <section id="partners" className="py-12 sm:py-16 md:py-24 lg:py-32 bg-card border-y border-border">
      <div className="container">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title mb-6">Партнёрам</h2>
          <p className="section-subtitle">Зарабатывай вместе с нами!</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto items-center">
          {/* Left Column - Info & Download */}
          <motion.div
            className="space-y-6 sm:space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">Зарабатывай вместе с нами!</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Вся подробная информация в нашей мини-презентации.
              </p>

              <div className="space-y-3">
                <p className="text-sm text-foreground font-semibold">Что вы получите:</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-accent">✓</span>
                    <span>Привлекательные комиссии за каждое мероприятие</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">✓</span>
                    <span>Персональный менеджер поддержки</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">✓</span>
                    <span>Маркетинговые материалы и поддержку</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">✓</span>
                    <span>Первоочередной доступ к новым сервисам</span>
                  </li>
                </ul>
              </div>
            </div>

            <a
              href="/assets/partner_presentation.pdf"
              download
              className="inline-flex items-center gap-3 px-6 py-3 rounded-sm border border-accent bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
            >
              <FileDown size={20} />
              <span>Скачать презентацию</span>
            </a>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            className="p-6 sm:p-8 rounded-lg bg-background border border-border"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-5 sm:mb-6">Стать партнёром</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Имя</label>
                <input
                  type="text"
                  placeholder="Ваше имя"
                  required
                  className="w-full px-4 py-2 rounded-sm bg-card border border-border text-foreground placeholder-muted focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Телефон</label>
                <input
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  required
                  className="w-full px-4 py-2 rounded-sm bg-card border border-border text-foreground placeholder-muted focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Компания / Площадка</label>
                <input
                  type="text"
                  placeholder="Название"
                  className="w-full px-4 py-2 rounded-sm bg-card border border-border text-foreground placeholder-muted focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Сообщение</label>
                <textarea
                  placeholder="Расскажите о вашем интересе"
                  rows={4}
                  className="w-full px-4 py-2 rounded-sm bg-card border border-border text-foreground placeholder-muted focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <button type="submit" disabled={loading} className="w-full btn btn-filled disabled:opacity-50">
                {loading ? "Отправка..." : "Отправить заявку"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
