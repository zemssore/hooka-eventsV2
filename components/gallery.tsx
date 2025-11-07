"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

const galleryItems = [
  { id: 1, category: "corporate", title: "Корпоратив", image: "/corporate-hookah-event.jpg" },
  { id: 2, category: "wedding", title: "Свадьба", image: "/wedding-hookah-lounge.jpg" },
  { id: 3, category: "party", title: "Вечеринка", image: "/party-hookah-setup.jpg" },
  { id: 4, category: "corporate", title: "Конференция", image: "/conference-hookah-catering.jpg" },
  { id: 5, category: "wedding", title: "Приватный банкет", image: "/private-hookah-event.jpg" },
  { id: 6, category: "shooting", title: "Съёмка", image: "/film-production-hookah.jpg" },
]

const categories = [
  { id: "all", label: "Все" },
  { id: "corporate", label: "Корпоратив" },
  { id: "wedding", label: "Свадьба" },
  { id: "party", label: "Вечеринка" },
  { id: "shooting", label: "Съёмка" },
]

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("all")

  const filtered =
    activeCategory === "all" ? galleryItems : galleryItems.filter((item) => item.category === activeCategory)

  return (
    <section id="gallery" className="py-12 sm:py-16 md:py-24 lg:py-32 bg-background">
      <div className="container">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title mb-6">Фото и кейсы</h2>
          <p className="section-subtitle">Примеры наших лучших работ</p>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-8 sm:mb-12 px-4">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 sm:px-6 py-2 rounded-sm text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 ${
                activeCategory === cat.id
                  ? "bg-accent text-accent-foreground"
                  : "bg-card text-foreground border border-border hover:border-accent/50"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>

        {/* Gallery - Horizontal Slider on Mobile, Grid on Desktop */}
        <div className="md:hidden -mx-4 px-4">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <AnimatePresence mode="wait">
              {filtered.map((item) => (
                <motion.div
                  key={item.id}
                  layoutId={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group relative flex-shrink-0 w-[280px] h-[200px] rounded-lg overflow-hidden bg-card border border-border hover:border-accent/50 cursor-pointer snap-start"
                  whileHover={{ y: -4 }}
                >
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-accent font-semibold text-sm">{item.title}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Gallery Grid - Desktop */}
        <motion.div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" layout>
          <AnimatePresence mode="wait">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layoutId={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden rounded-lg h-56 md:h-64 bg-card border border-border hover:border-accent/50 cursor-pointer"
                whileHover={{ y: -8 }}
              >
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-accent font-semibold">{item.title}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
