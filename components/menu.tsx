"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const mixes = {
  classic: [
    {
      id: 1,
      name: "ВОСТОЧНЫЙ БРИЗ",
      description: "Грейпфрут, лайм, ледяная мята, цитрусовый чай",
      tobaccos: [
        { brand: "Darkside", flavor: "Grapefruit" },
        { brand: "Musthave", flavor: "Citrus Tea" },
        { brand: "Starline", flavor: "Ice Mint" },
      ],
    },
    {
      id: 2,
      name: "ЛЁГКИЙ ЗАКАТ",
      description: "Манго, персик, мята, лёгкая свежесть",
      tobaccos: [
        { brand: "Sebero", flavor: "Mango" },
        { brand: "Starline", flavor: "Peach" },
        { brand: "Bonche", flavor: "Mint" },
      ],
    },
    {
      id: 3,
      name: "ЯГОДНЫЙ ШТОРМ",
      description: "Малина, черника, вишня",
      tobaccos: [
        { brand: "Darkside", flavor: "Wildberry" },
        { brand: "Musthave", flavor: "Raspberry" },
        { brand: "Sebero", flavor: "Cherry" },
      ],
    },
    {
      id: 4,
      name: "CITRUS ENERGY",
      description: "Грейпфрут, лимон, энергетик",
      tobaccos: [
        { brand: "Element", flavor: "Lemon" },
        { brand: "Black Burn", flavor: "Energy" },
        { brand: "Musthave", flavor: "Grapefruit" },
      ],
    },
    {
      id: 5,
      name: "ICE JUNGLE",
      description: "Дыня, киви, мята",
      tobaccos: [
        { brand: "Sebero", flavor: "Melon" },
        { brand: "Darkside", flavor: "Kiwi" },
        { brand: "Starline", flavor: "Menthol" },
      ],
    },
    {
      id: 6,
      name: "VANILLA SKY",
      description: "Ваниль, груша, сливки",
      tobaccos: [
        { brand: "Bonche", flavor: "Vanilla" },
        { brand: "Musthave", flavor: "Cream" },
        { brand: "Sebero", flavor: "Pear" },
      ],
    },
    {
      id: 7,
      name: "CHOCO BERRY",
      description: "Шоколад, ягоды, мороженое",
      tobaccos: [
        { brand: "Darkside", flavor: "Berries" },
        { brand: "Black Burn", flavor: "Chocolate" },
        { brand: "Element", flavor: "Ice Cream" },
      ],
    },
    {
      id: 8,
      name: "ГРАНАТОВЫЙ НЕГРОНИ",
      description: "Гранат, базилик, грейпфрут",
      tobaccos: [
        { brand: "Darkside", flavor: "Grapefruit" },
        { brand: "Musthave", flavor: "Basil" },
        { brand: "Sebero", flavor: "Pomegranate" },
      ],
    },
    {
      id: 9,
      name: "НОЧНОЙ ЛАУНДЖ",
      description: "Кофе, карамель, ваниль",
      tobaccos: [
        { brand: "Bonche", flavor: "Coffee" },
        { brand: "Element", flavor: "Caramel" },
        { brand: "Darkside", flavor: "Vanilla" },
      ],
    },
    {
      id: 10,
      name: "МАРАКУЙЯ ФРОСТ",
      description: "Маракуйя, ананас, ледяная свежесть",
      tobaccos: [
        { brand: "Sebero", flavor: "Passion Fruit" },
        { brand: "Musthave", flavor: "Mint" },
        { brand: "Black Burn", flavor: "Pineapple" },
      ],
    },
  ],
}

export default function Menu() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section id="menu" className="py-12 sm:py-16 md:py-24 lg:py-32 bg-card border-y border-border">
      <div className="container">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title mb-6">Меню миксов</h2>
          <p className="section-subtitle">Авторские комбинации премиальных табаков</p>
        </motion.div>

        <div className="mb-8 text-center">
          <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-4">МИКСЫ КЛАССИК</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {mixes.classic.map((mix, idx) => (
            <motion.div
              key={mix.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="group relative"
              onMouseEnter={() => setHoveredId(mix.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="w-full p-5 sm:p-6 rounded-lg bg-background border border-border hover:border-accent/50 hover:bg-background/80 transition-all duration-300">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-base sm:text-lg font-bold text-foreground">{mix.name}</h3>
                  <div className="text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    📲
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">{mix.description}</p>

                {/* Показываем информацию о табаках при наведении */}
                <AnimatePresence>
                  {hoveredId === mix.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden mt-4 pt-4 border-t border-border/50"
                    >
                      <p className="text-xs font-semibold text-accent mb-3 uppercase tracking-wider">Табак</p>
                      <div className="space-y-2">
                        {mix.tobaccos.map((tob, tobIdx) => (
                          <div key={tobIdx} className="flex items-center justify-between text-sm">
                            <span className="text-foreground font-medium">{tob.brand}</span>
                            <span className="text-muted-foreground">– {tob.flavor}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
