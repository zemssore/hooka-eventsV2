"use client"

import { motion } from "framer-motion"

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-10 sm:mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-accent mb-4">HOOKAH EVENTS</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Премиальный кальянный кейтеринг для мероприятий в Москве и области.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-foreground mb-4 uppercase text-sm tracking-wider">Навигация</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#about" className="hover:text-accent transition-colors">
                  О нас
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-accent transition-colors">
                  Портфолио
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-accent transition-colors">
                  Меню
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-accent transition-colors">
                  Услуги
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-foreground mb-4 uppercase text-sm tracking-wider">Услуги</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Корпоративы
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Свадьбы
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  День рождения
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Съёмки
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-foreground mb-4 uppercase text-sm tracking-wider">Контакты</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="tel:+79991234567" className="text-accent hover:text-accent/80 transition-colors">
                  +7 (999) 123-45-67
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/79991234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="https://tg.me/hookahevents"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  Telegram
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Instagram
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>&copy; 2025 Hookah Events. Все права защищены.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-accent transition-colors">
              Политика конфиденциальности
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Условия использования
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
