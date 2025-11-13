"use client"

import { motion } from "framer-motion"

export default function Promotions() {
  const promotions = [
    {
      id: 1,
      title: "День Рождения",
      discount: "скидка -15%",
    },
    {
      id: 2,
      title: "На аренду от 10 часов",
      discount: "-10%",
    },
    {
      id: 3,
      title: "Комиссия от 25%",
      subtitle: "для наших партнёров",
    },
  ]

  return (
    <section id="promotions" className="py-8 sm:py-12 md:py-16 bg-background w-full max-w-full overflow-x-hidden">
      <div className="container">
        <motion.div
          className="mb-6 sm:mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Акции</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {promotions.map((promo, idx) => (
            <motion.div
              key={promo.id}
              className="bg-card border border-border rounded-lg p-5 sm:p-6 hover:border-accent/50 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                y: -4,
              }}
            >
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">{promo.title}</h3>
              {promo.discount && (
                <p className="text-accent text-lg sm:text-xl font-semibold">{promo.discount}</p>
              )}
              {promo.subtitle && (
                <p className="text-muted-foreground text-sm mt-2">{promo.subtitle}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

