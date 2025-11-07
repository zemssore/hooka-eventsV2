"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface CalculatorState {
  hookahs: number
  hours: number
  bowlType: string
  tobaccoType: string
  service: string
}

const BASE_PRICE_PER_HOOKAH_HOUR = 2500
const FRUIT_BOWL_FEE = 3000
const PREMIUM_TOBACCO_MULTIPLIER = 1.3
const VIP_SERVICE_MULTIPLIER = 1.5

export default function Calculator() {
  const [state, setState] = useState<CalculatorState>({
    hookahs: 5,
    hours: 4,
    bowlType: "regular",
    tobaccoType: "regular",
    service: "basic",
  })

  const calculatePrice = () => {
    let basePrice = BASE_PRICE_PER_HOOKAH_HOUR * state.hookahs * state.hours

    if (state.bowlType === "fruit") {
      basePrice += FRUIT_BOWL_FEE * state.hookahs
    }

    if (state.tobaccoType === "premium") {
      basePrice *= PREMIUM_TOBACCO_MULTIPLIER
    }

    if (state.service === "vip") {
      basePrice *= VIP_SERVICE_MULTIPLIER
    }

    return Math.round(basePrice)
  }

  const price = calculatePrice()

  return (
    <section id="calculator" className="py-12 sm:py-16 md:py-24 lg:py-32 bg-card border-y border-border">
      <div className="container">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title mb-6">Калькулятор стоимости</h2>
          <p className="section-subtitle">Рассчитайте примерную стоимость под ваш формат</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* Calculator Form */}
          <motion.div
            className="space-y-6 sm:space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Hookahs */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                Количество кальянов: <span className="text-accent">{state.hookahs}</span>
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={state.hookahs}
                onChange={(e) => setState({ ...state, hookahs: Number.parseInt(e.target.value) })}
                className="w-full h-2 bg-border rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>1</span>
                <span>50</span>
              </div>
            </div>

            {/* Hours */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                Количество часов: <span className="text-accent">{state.hours}</span>
              </label>
              <input
                type="range"
                min="1"
                max="12"
                value={state.hours}
                onChange={(e) => setState({ ...state, hours: Number.parseInt(e.target.value) })}
                className="w-full h-2 bg-border rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>1ч</span>
                <span>12ч</span>
              </div>
            </div>

            {/* Bowl Type */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                Тип чаши
              </label>
              <div className="space-y-2">
                {[
                  { id: "regular", label: "Обычная чаша" },
                  { id: "fruit", label: "Чаша на фруктах (+3000₽ за кальян)" },
                ].map((option) => (
                  <label key={option.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="bowl"
                      value={option.id}
                      checked={state.bowlType === option.id}
                      onChange={(e) => setState({ ...state, bowlType: e.target.value })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tobacco Type */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                Качество табака
              </label>
              <div className="space-y-2">
                {[
                  { id: "regular", label: "Стандартный" },
                  { id: "premium", label: "Премиальный (×1,3)" },
                ].map((option) => (
                  <label key={option.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="tobacco"
                      value={option.id}
                      checked={state.tobaccoType === option.id}
                      onChange={(e) => setState({ ...state, tobaccoType: e.target.value })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Service Type */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                Обслуживание
              </label>
              <div className="space-y-2">
                {[
                  { id: "basic", label: "Стандартное" },
                  { id: "vip", label: "VIP обслуживание (×1,5)" },
                ].map((option) => (
                  <label key={option.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="service"
                      value={option.id}
                      checked={state.service === option.id}
                      onChange={(e) => setState({ ...state, service: e.target.value })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Price Summary */}
          <motion.div
            className="lg:sticky lg:top-32 h-fit order-first lg:order-last"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="p-6 sm:p-8 rounded-lg bg-background border border-accent/50 space-y-5 sm:space-y-6">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mb-2">Ваш расчёт</p>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-accent">{price.toLocaleString()}₽</h3>
              </div>

              <div className="space-y-4 py-6 border-y border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Кальянов × часов</span>
                  <span className="text-foreground">
                    {state.hookahs} × {state.hours}ч
                  </span>
                </div>
                {state.bowlType === "fruit" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Чаши на фруктах</span>
                    <span className="text-foreground">+ {(FRUIT_BOWL_FEE * state.hookahs).toLocaleString()}₽</span>
                  </div>
                )}
                {state.tobaccoType === "premium" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Премиальный табак</span>
                    <span className="text-foreground">×1,3</span>
                  </div>
                )}
                {state.service === "vip" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">VIP обслуживание</span>
                    <span className="text-foreground">×1,5</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                Это примерная стоимость. Финальная цена может варьироваться в зависимости от специальных пожеланий и
                особенностей мероприятия.
              </p>

              <button className="w-full btn btn-filled">Узнать финальную цену</button>
              <a
                href="https://wa.me/79991234567"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center btn btn-outline"
              >
                Написать в WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
