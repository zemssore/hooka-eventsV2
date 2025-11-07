"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface TextRevealProps {
  children: ReactNode
  delay?: number
}

export function TextReveal({ children, delay = 0 }: TextRevealProps) {
  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05 + delay,
        duration: 0.5,
      },
    }),
  }

  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {typeof children === "string" ? (
        <div className="flex flex-wrap gap-1">
          {children.split(" ").map((word, i) => (
            <motion.span key={i} custom={i} variants={textVariants}>
              {word}
            </motion.span>
          ))}
        </div>
      ) : (
        <motion.div custom={0} variants={textVariants}>
          {children}
        </motion.div>
      )}
    </motion.div>
  )
}
