"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  // Блокируем скролл body когда меню открыто
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const links = [
    { href: "#about", label: "О нас" },
    { href: "#gallery", label: "Портфолио" },
    { href: "#menu", label: "Миксы" },
    { href: "#services", label: "Услуги" },
    { href: "#contacts", label: "Контакты" },
  ]

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 bg-background border-b border-border shadow-sm transition-opacity duration-300 lg:z-[9999] ${
          isOpen ? 'opacity-0 pointer-events-none z-10 lg:opacity-100 lg:pointer-events-auto' : 'opacity-100 z-[9999]'
        }`}
        style={{ 
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden'
        }}
      >
        <nav className="container flex items-center justify-between py-3 sm:py-4 md:py-6">
          <Link href="/" className="text-lg sm:text-xl md:text-2xl font-bold text-accent tracking-wider">
            HOOKAH EVENTS
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex gap-6 xl:gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs xl:text-sm uppercase tracking-wider text-foreground/70 hover:text-accent transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex gap-3 xl:gap-4">
            <a
              href="https://wa.me/79991234567"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline text-xs px-3 xl:px-6"
            >
              WhatsApp
            </a>
            <button className="btn btn-filled text-xs px-3 xl:px-6">Рассчитать</button>
          </div>

          {/* Mobile/Tablet Menu Button */}
          <button className="lg:hidden p-2 -mr-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X size={24} className="text-foreground" /> : <Menu size={24} className="text-foreground" />}
          </button>
        </nav>
      </header>

      {/* Mobile Sidebar Menu - Outside header */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Background Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Menu */}
            <motion.div
              className="fixed top-0 right-0 h-full w-[90%] sm:w-[85%] max-w-sm bg-background border-l border-border shadow-2xl z-[10001] lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex flex-col h-full">
                {/* Header - Fixed */}
                <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-border flex-shrink-0">
                  <Link
                    href="/"
                    className="text-base sm:text-lg font-bold text-accent tracking-wider text-left"
                    onClick={() => setIsOpen(false)}
                  >
                    HOOKAH EVENTS
                  </Link>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 -mr-2 flex-shrink-0"
                    aria-label="Close menu"
                  >
                    <X size={24} className="text-foreground" />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto min-h-0">
                  {/* Navigation Links */}
                  <div className="px-5 sm:px-6 py-5 sm:py-6">
                    <div className="flex flex-col">
                      {links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          className="text-sm sm:text-base uppercase tracking-wider text-foreground hover:text-accent transition-colors py-3.5 sm:py-4 border-b border-border/30 last:border-b-0 text-left"
                          onClick={() => setIsOpen(false)}
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-border/50 pt-5 sm:pt-6 space-y-3">
                    <a
                      href="https://wa.me/79991234567"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline w-full text-center text-sm sm:text-base block"
                      onClick={() => setIsOpen(false)}
                    >
                      WhatsApp
                    </a>
                    <button
                      className="btn btn-filled w-full text-center text-sm sm:text-base block"
                      onClick={() => setIsOpen(false)}
                    >
                      Рассчитать
                    </button>
                    <a
                      href="https://tg.me/hookahevents"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline w-full text-center text-sm sm:text-base block"
                      onClick={() => setIsOpen(false)}
                    >
                      Написать в Telegram
                    </a>
                  </div>

                  {/* Footer Info */}
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-border/50 pt-5 sm:pt-6">
                    <div className="space-y-2 text-xs sm:text-sm text-muted-foreground leading-relaxed text-left">
                      <p className="text-left">Премиум-оборудование</p>
                      <p className="text-left">Обслуживание под ключ</p>
                      <p className="text-left">Работаем под вашим брендом</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
