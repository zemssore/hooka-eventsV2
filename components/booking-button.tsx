"use client"

import { motion } from "framer-motion"
import { Phone } from "lucide-react"
import { scrollToSection } from "@/lib/scroll"

export default function BookingButton() {
  const handleBookingClick = () => {
    // Scroll to quick order form
    scrollToSection("#quick-order")
  }

  return (
    <motion.button
      onClick={handleBookingClick}
      className="fixed bottom-6 right-6 z-50 btn btn-filled flex items-center gap-2 shadow-lg"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        delay: 1
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Phone size={18} />
      <span className="font-medium">Забронировать</span>
    </motion.button>
  )
}