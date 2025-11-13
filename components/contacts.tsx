"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Send } from "lucide-react"
import { useState } from "react"
import { formatPhoneNumber, isValidPhoneNumber, getPhoneNumbers } from "@/lib/phone-utils"
import { useToast } from "@/components/ui/toast"

export default function Contacts() {
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [phone, setPhone] = useState("")

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const formatted = formatPhoneNumber(value)
    setPhone(formatted)
    
    // Очищаем ошибку при начале ввода
    if (phoneError) {
      setPhoneError("")
    }

    // Валидация при вводе (показываем ошибку только если пользователь ввел что-то, но номер неполный)
    if (formatted && formatted.length > 0) {
      const numbers = getPhoneNumbers(formatted)
      if (numbers.length > 0 && numbers.length < 11) {
        // Показываем ошибку только если номер уже достаточно длинный, но не полный
        if (numbers.length >= 4) {
          setPhoneError("Введите полный номер телефона")
        }
      } else if (numbers.length === 11 && !isValidPhoneNumber(formatted)) {
        setPhoneError("Номер должен начинаться с +7")
      }
    }
  }

  const handlePhoneBlur = () => {
    // Валидация при потере фокуса
    if (phone && !isValidPhoneNumber(phone)) {
      const numbers = getPhoneNumbers(phone)
      if (numbers.length === 0) {
        setPhoneError("Введите номер телефона")
      } else if (numbers.length < 11) {
        setPhoneError("Введите полный номер телефона (11 цифр)")
      } else if (!numbers.startsWith("7")) {
        setPhoneError("Номер должен начинаться с +7")
      } else {
        setPhoneError("Введите корректный номер телефона")
      }
    } else {
      setPhoneError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setPhoneError("")
    setSuccess(false)

    // Валидация телефона
    if (!phone || !isValidPhoneNumber(phone)) {
      setPhoneError("Введите корректный номер телефона (например: +7 (999) 123-45-67)")
      setLoading(false)
      return
    }

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const data = Object.fromEntries(formData)
      
      // Используем номер только с цифрами для отправки
      data.phone = getPhoneNumbers(phone)

      const res = await fetch("/api/lead", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      })

      const result = await res.json()

      if (res.ok && result.success) {
        setSuccess(true)
        setPhone("")
        ;(e.target as HTMLFormElement).reset()
        setTimeout(() => setSuccess(false), 5000)
        toast.showSuccess("Заявка успешно отправлена!")
      } else {
        setError(result.error || "Ошибка при отправке формы")
        toast.showError(result.error || "Ошибка при отправке формы")
      }
    } catch (error) {
      console.error(error)
      setError("Ошибка при отправке формы. Попробуйте еще раз.")
      toast.showError("Ошибка при отправке формы. Попробуйте еще раз.")
    } finally {
      setLoading(false)
    }
  }

  const contactMethods = [
    {
      icon: Phone,
      title: "Телефон",
      value: "+7 (903) 529-95-42",
      link: "tel:+79035299542",
      color: "text-blue-400",
    },
    {
      icon: Mail,
      title: "Email",
      value: "hookah.events@yandex.ru",
      link: "mailto:hookah.events@yandex.ru",
      color: "text-red-400",
    },
    {
      icon: MapPin,
      title: "Адрес",
      value: "Россия, Москва, м. Пролетарская",
      link: "https://yandex.ru/maps/?text=%D0%BC%D0%B5%D1%82%D1%80%D0%BE%20%D0%9F%D1%80%D0%BE%D0%BB%D0%B5%D1%82%D0%B0%D1%80%D1%81%D0%BA%D0%B0%D1%8F%20%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0",
      color: "text-green-400",
    },
  ]

  return (
    <section id="contacts" className="py-12 sm:py-16 md:py-24 lg:py-32 bg-card border-t border-border w-full max-w-full overflow-x-hidden">
      <div className="container">
        <motion.div
          className="mb-12 sm:mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <h2 className="section-title mb-6">Контакты и реквизиты</h2>
          <p className="section-subtitle">Свяжитесь с нами удобным способом</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto items-start">
          {/* Contact Methods */}
          <motion.div
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
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
                Пн-Пт: 10:00 - 00:00
                <br />
                Сб-Вс: 11:00 - 03:00
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            id="quick-order"
            className="p-6 sm:p-8 rounded-lg bg-background border border-border shadow-sm"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-5 sm:mb-6">Быстрая заявка</h3>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {success && (
                <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3">
                  <p className="text-sm text-green-600 text-center">Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.</p>
                </div>
              )}
              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                  <p className="text-sm text-red-500 text-center">{error}</p>
                </div>
              )}
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
                  Телефон <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  onBlur={handlePhoneBlur}
                  placeholder="+7 (999) 123-45-67"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  className={`w-full px-4 py-2.5 rounded-sm bg-card border text-foreground placeholder:text-muted-foreground focus:outline-none transition-all ${
                    phoneError
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-border focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  }`}
                />
                {phoneError && (
                  <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                )}
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-semibold text-foreground mb-2">
                  Дата события
                </label>
                <input
                  id="date"
                  type="date"
                  name="date"
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
