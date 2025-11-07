"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface FloatingButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export function FloatingButton({ children, onClick, className = "" }: FloatingButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={className}
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {children}
    </motion.button>
  )
}
