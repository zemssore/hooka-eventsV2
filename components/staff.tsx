"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function Staff() {
  // Placeholder для фото персонала
  const staffMembers = [
    { id: 1, name: "Мастер 1", role: "Кальянщик", image: "/placeholder-user.jpg" },
    { id: 2, name: "Мастер 2", role: "Кальянщик", image: "/placeholder-user.jpg" },
    { id: 3, name: "Мастер 3", role: "Кальянщик", image: "/placeholder-user.jpg" },
    { id: 4, name: "Мастер 4", role: "Кальянщик", image: "/placeholder-user.jpg" },
  ]

  return (
    <section id="staff" className="py-12 sm:py-16 md:py-24 lg:py-32 bg-card border-y border-border">
      <div className="container">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title mb-6">Наша команда</h2>
          <p className="section-subtitle">Опытные мастера, которые создают атмосферу вашего события</p>
        </motion.div>

        {/* Staff - Horizontal Slider on Mobile, Grid on Desktop */}
        <div className="md:hidden -mx-4 px-4">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {staffMembers.map((member, idx) => (
              <motion.div
                key={member.id}
                className="text-center flex-shrink-0 w-[200px] snap-start"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-card border border-border mb-3 group">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{member.name}</h3>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Staff Grid - Desktop */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {staffMembers.map((member, idx) => (
            <motion.div
              key={member.id}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-card border border-border mb-4 group">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">{member.name}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

