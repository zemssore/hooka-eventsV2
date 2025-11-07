"use client"

import type React from "react"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface SmoothScrollButtonProps {
  href: string
  children: ReactNode
  className?: string
}

export function SmoothScrollButton({ href, children, className = "" }: SmoothScrollButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("#")) {
      e.preventDefault()
      const element = document.querySelector(href)
      element?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <motion.a
      href={href}
      onClick={handleClick}
      className={className}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.a>
  )
}
