"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Send } from "lucide-react"
import { useState } from "react"

export default function Contacts() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData(e.target as HTMLFormElement)
      await fetch("/api/lead", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { "Content-Type": "application/json" },
      })
      setLoading(false)
      ;(e.target as HTMLFormElement).reset()
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const contactMethods = [
    {
      icon: Phone,
      title: "Телефон",
      value: "+7 (999) 123-45-67",
      link: "tel:+79991234567",
      color: "text-blue-400",
    },
    {
      icon: Mail,
      title: "Email",
      value: "info@hookahevents.ru",
      link: "mailto:info@hookahevents.ru",
      color: "text-red-400",
    },
    {
      icon: MapPin,
      title: "Адрес",
      value: "Москва, Россия",
      link: "#",
      color: "text-green-400",
    },
  ]

  return (
    <section id="contacts" className="py-12 sm:py-16 md:py-24 lg:py-32 bg-card border-t border-border">
      <div className="container">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title mb-6">Контакты и реквизиты</h2>
          <p className="section-subtitle">Свяжитесь с нами удобным способом</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto items-start">
          {/* Contact Methods */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="space-y-4">
              {contactMethods.map((method, idx) => {
                const Icon = method.icon
                return (
                  <motion.a
                    key={idx}
                    href={method.link}
                    className="block p-6 rounded-lg bg-background border border-border hover:border-accent/50 hover:shadow-md transition-all duration-300 group"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <Icon className="text-accent w-6 h-6 mt-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-accent transition-colors">
                          {method.title}
                        </h3>
                        <p className="text-muted-foreground text-sm break-words">{method.value}</p>
                      </div>
                    </div>
                  </motion.a>
                )
              })}
            </div>

            <motion.div
              className="p-6 rounded-lg bg-accent/10 border border-accent/30"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <p className="text-sm text-foreground leading-relaxed">
                <strong className="block mb-2">Время работы:</strong>
                Пн-Пт: 10:00 - 22:00
                <br />
                Сб-Вс: 12:00 - 23:00
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="p-6 sm:p-8 rounded-lg bg-background border border-border shadow-sm"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-5 sm:mb-6">Быстрая заявка</h3>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                  Ваше имя
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Иван"
                  required
                  className="w-full px-4 py-2.5 rounded-sm bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-2">
                  Телефон
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="+7 (999) 123-45-67"
                  required
                  className="w-full px-4 py-2.5 rounded-sm bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-semibold text-foreground mb-2">
                  Дата события
                </label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  required
                  className="w-full px-4 py-2.5 rounded-sm bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">
                  Сообщение
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Расскажите о вашем событии..."
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-sm bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none"
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full btn btn-filled flex items-center justify-center gap-2 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Send size={18} />
                {loading ? "Отправка..." : "Отправить"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
