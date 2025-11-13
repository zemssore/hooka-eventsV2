"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { scrollToSection, handleAnchorClick } from "@/lib/scroll"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const logoRef = useRef<HTMLAnchorElement>(null)
  const navRef = useRef<HTMLElement>(null)

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

  // Устанавливаем margin-left для логотипа (5px от левого края)
  useEffect(() => {
    const updateLogoMargin = () => {
      if (logoRef.current && navRef.current) {
        const navStyle = window.getComputedStyle(navRef.current)
        const paddingLeft = navStyle.paddingLeft
        logoRef.current.style.marginLeft = `calc(-1 * ${paddingLeft} + 5px)`
      }
    }

    updateLogoMargin()
    window.addEventListener('resize', updateLogoMargin)
    return () => window.removeEventListener('resize', updateLogoMargin)
  }, [])

  const links = [
    { href: "#promotions", label: "Акции" },
    { href: "#advantages", label: "Кальяны" },
    { href: "#menu", label: "Миксы" },
    { href: "#staff", label: "Мастера" },
    { href: "#reviews", label: "Отзывы" },
    { href: "#partners", label: "Партнерам" },
    { href: "#contacts", label: "Контакты" },
    { href: "#about", label: "О нас" },
  ]

  const handleLinkClick = (href: string) => {
    if (href.startsWith("#")) {
      scrollToSection(href)
      setIsOpen(false)
    }
  }

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 bg-background border-b border-border shadow-sm transition-opacity duration-300 lg:z-[9999] w-full max-w-full ${
          isOpen ? 'opacity-0 pointer-events-none z-10 lg:opacity-100 lg:pointer-events-auto' : 'opacity-100 z-[9999]'
        }`}
        style={{ 
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden'
        }}
      >
        <nav ref={navRef} className="container flex items-center justify-between py-3 sm:py-4 md:py-6">
          <Link 
            ref={logoRef}
            href="/" 
            className="text-lg sm:text-xl md:text-2xl font-bold text-accent tracking-wider"
          >
            HOOKAH EVENTS
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex gap-6 xl:gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="text-xs xl:text-sm uppercase tracking-wider text-foreground/70 hover:text-accent transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex gap-3 xl:gap-4">
            <a
              href="tel:+79035299542"
              className="btn btn-outline text-xs px-3 xl:px-6"
            >
              +7 (903) 529-95-42
            </a>
            <button 
              onClick={() => scrollToSection("#calculator")}
              className="btn btn-filled text-xs px-3 xl:px-6"
            >
              Рассчитать
            </button>
          </div>

          {/* Mobile/Tablet Menu Button */}
          <button className="lg:hidden p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
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
                    className="p-2 flex-shrink-0"
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
                          className="text-sm sm:text-base uppercase tracking-wider text-foreground hover:text-accent transition-colors py-3.5 sm:py-4 border-b border-border/30 last:border-b-0 text-left cursor-pointer"
                          onClick={(e) => {
                            handleAnchorClick(e, link.href)
                            setIsOpen(false)
                          }}
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-border/50 pt-5 sm:pt-6 space-y-3">
                    <a
                      href="tel:+79035299542"
                      className="btn btn-outline w-full text-center text-sm sm:text-base block"
                      onClick={() => setIsOpen(false)}
                    >
                      +7 (903) 529-95-42
                    </a>
                    <button
                      className="btn btn-filled w-full text-center text-sm sm:text-base block"
                      onClick={() => {
                        scrollToSection("#calculator")
                        setIsOpen(false)
                      }}
                    >
                      Рассчитать
                    </button>
                    <a
                      href="https://wa.me/79035299542"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline w-full text-center text-sm sm:text-base block"
                      onClick={() => setIsOpen(false)}
                    >
                      Написать менеджеру
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
