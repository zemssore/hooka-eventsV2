"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface StaggeredListProps {
  items: Array<{
    id: string | number
    content: ReactNode
  }>
  delay?: number
}

export function StaggeredList({ items, delay = 0.1 }: StaggeredListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {items.map((item) => (
        <motion.div key={item.id} variants={itemVariants}>
          {item.content}
        </motion.div>
      ))}
    </motion.div>
  )
}
