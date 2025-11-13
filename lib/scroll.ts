/**
 * Плавная прокрутка к элементу по ID
 */
export function scrollToSection(sectionId: string) {
  // Функция для выполнения прокрутки
  const performScroll = (element: Element) => {
    // Используем requestAnimationFrame для более точного контроля
    requestAnimationFrame(() => {
      const header = document.querySelector("header")
      const headerOffset = header ? header.offsetHeight : 0
      
      // Получаем текущую позицию скролла
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop
      
      // Получаем позицию элемента относительно viewport
      const rect = element.getBoundingClientRect()
      // Вычисляем позицию элемента относительно документа
      const elementTop = rect.top + currentScrollY
      // Вычитаем высоту хедера для правильного позиционирования
      const offsetPosition = elementTop - headerOffset
      
      // Прокручиваем напрямую с учетом offset, без scrollIntoView
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      })
    })
  }

  // Ищем элемент
  let element = document.querySelector(sectionId)
  
  if (element) {
    performScroll(element)
    return
  }

  // Если элемент не найден сразу, пробуем найти его через небольшие задержки
  const maxAttempts = 5
  let attempt = 0

  const findAndScroll = setInterval(() => {
    attempt++
    element = document.querySelector(sectionId)
    
    if (element) {
      clearInterval(findAndScroll)
      performScroll(element)
    } else if (attempt >= maxAttempts) {
      clearInterval(findAndScroll)
    }
  }, 100)
}

/**
 * Обработчик клика для ссылок с якорями
 */
export function handleAnchorClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (href.startsWith("#")) {
    e.preventDefault()
    e.stopPropagation()
    // Небольшая задержка, чтобы убедиться, что нативная прокрутка браузера не выполняется
    setTimeout(() => {
      scrollToSection(href)
    }, 0)
  }
}

