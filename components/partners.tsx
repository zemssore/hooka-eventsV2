"use client"

import type React from "react"

import { motion } from "framer-motion"
import { FileDown } from "lucide-react"
import { useState } from "react"
import { formatPhoneNumber, isValidPhoneNumber } from "@/lib/phone-utils"
import { useToast } from "@/components/ui/toast"

export default function Partners() {
  const toast = useToast()
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
        // Показываем ошибку только если пользователь перестал вводить (после небольшой задержки)
        // Или если номер уже достаточно длинный, но не полный
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
    setError("")
    setPhoneError("")

    // Валидация телефона
    if (!phone || !isValidPhoneNumber(phone)) {
      setPhoneError("Введите корректный номер телефона (например: +7 (999) 123-45-67)")
      return
    }

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const data = Object.fromEntries(formData)
      
      // Формируем сообщение для WhatsApp
      const phoneNumber = "79035299542"
      const name = (data.name as string) || ""
      const company = (data.company as string) || ""
      const messageText = (data.message as string) || ""
      const phoneFormatted = phone
      
      let whatsappMessage = `Здравствуйте! Хочу стать партнёром:\n\n`
      if (name) whatsappMessage += `Имя: ${name}\n`
      if (phoneFormatted) whatsappMessage += `Телефон: ${phoneFormatted}\n`
      if (company) whatsappMessage += `Компания/Площадка: ${company}\n`
      if (messageText) whatsappMessage += `Сообщение: ${messageText}\n`

      const encodedMessage = encodeURIComponent(whatsappMessage)
      window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank")
      
      // Очищаем форму после отправки
      setPhone("")
      ;(e.target as HTMLFormElement).reset()
      toast.showSuccess("Заявка отправлена в WhatsApp!")
    } catch (error) {
      console.error(error)
      setError("Ошибка при отправке. Попробуйте еще раз.")
      toast.showError("Ошибка при отправке. Попробуйте еще раз.")
    }
  }

  return (
    <section id="partners" className="py-12 sm:py-16 md:py-24 lg:py-32 bg-card border-y border-border w-full max-w-full overflow-x-hidden">
      <div className="container">
        <motion.div
          className="mb-12 sm:mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <h2 className="section-title mb-6">Партнёрам</h2>
          <p className="section-subtitle">Зарабатывай вместе с нами! Зарабатывайте "больше" вместе с нами!</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto items-center">
          {/* Left Column - Info & Download */}
          <motion.div
            className="space-y-5 sm:space-y-6 md:space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
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
                    <span>Лучшая комиссия за каждое мероприятие для вас</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">✓</span>
                    <span>Выгодные условия сотрудничество</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">✓</span>
                    <span>Гарантия на работу</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">✓</span>
                    <span>Ваш бренд - наш профессионализм</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">✓</span>
                    <span>Кросс-рекомендации: двойная выгода</span>
                  </li>
                </ul>
              </div>
            </div>

            <a
              href="/presentation.pdf"
              download="Презентация предложения Hookah Events.pdf"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-sm border border-accent bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
            >
              <FileDown size={20} />
              <span>Скачать презентацию</span>
            </a>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            className="p-5 sm:p-6 md:p-8 rounded-lg bg-background border border-border"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-5 sm:mb-6">Стать партнёром</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                  <p className="text-sm text-red-500 text-center">{error}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Имя</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ваше имя"
                  required
                  className="w-full px-4 py-2 rounded-sm bg-card border border-border text-foreground placeholder-muted focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Телефон <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  onBlur={handlePhoneBlur}
                  placeholder="+7 (999) 123-45-67"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  className={`w-full px-4 py-2 rounded-sm bg-card border text-foreground placeholder-muted focus:outline-none transition-colors ${
                    phoneError
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-border focus:border-accent"
                  }`}
                />
                {phoneError && (
                  <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Компания / Площадка</label>
                <input
                  type="text"
                  name="company"
                  placeholder="Название"
                  className="w-full px-4 py-2 rounded-sm bg-card border border-border text-foreground placeholder-muted focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Сообщение</label>
                <textarea
                  name="message"
                  placeholder="Расскажите о вашем интересе"
                  rows={4}
                  className="w-full px-4 py-2 rounded-sm bg-card border border-border text-foreground placeholder-muted focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <button type="submit" className="w-full btn btn-filled">
                Отправить заявку
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
