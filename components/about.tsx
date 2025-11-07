"use client"

import { motion } from "framer-motion"

export default function About() {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-24 lg:py-32 bg-card border-t border-border">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title mb-4 sm:mb-6">О компании</h2>
            <div className="space-y-4 sm:space-y-6 text-muted-foreground">
              <p className="leading-relaxed">
                <strong className="text-foreground">Hookah Events</strong> — профессиональный кальянный кейтеринг для
                мероприятий любого формата. Мы создаём атмосферу, беря на себя всё: оборудование, табак, персонал и
                обслуживание гостей.
              </p>
              <p className="leading-relaxed">
                Только премиальные материалы, опытные мастера и внимание к деталям — чтобы каждый гость почувствовал
                комфорт и стиль события.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="relative h-64 sm:h-80 md:h-96 bg-gradient-to-br from-accent/20 via-transparent to-transparent rounded-lg overflow-hidden border border-border/50"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl text-accent/20">🎭</div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
