/**
 * Плавная прокрутка к элементу по ID
 */
export function scrollToSection(sectionId: string) {
  // Функция для выполнения прокрутки
  const performScroll = (element: Element) => {
    // Временно отключаем CSS scroll-behavior для точного контроля
    const html = document.documentElement
    const originalScrollBehavior = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'
    
    // Ждем полной стабилизации layout перед прокруткой
    // Используем несколько requestAnimationFrame для гарантии стабильности
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Дополнительная небольшая задержка для полной стабилизации DOM
        setTimeout(() => {
          const header = document.querySelector("header") as HTMLElement | null
          const headerOffset = header ? header.offsetHeight : 0
          
          // Получаем текущую позицию скролла
          const currentScrollY = window.pageYOffset || document.documentElement.scrollTop
          
          // Получаем позицию элемента относительно viewport
          const rect = (element as HTMLElement).getBoundingClientRect()
          
          // Вычисляем позицию элемента относительно документа
          const elementTop = rect.top + currentScrollY
          
          // Получаем scroll-margin-top из CSS секции (если установлен)
          const computedStyle = window.getComputedStyle(element as HTMLElement)
          const scrollMarginTop = parseInt(computedStyle.scrollMarginTop) || 0
          
          // Получаем scroll-padding-top из html (глобальный отступ)
          const htmlComputedStyle = window.getComputedStyle(document.documentElement)
          const scrollPaddingTop = parseInt(htmlComputedStyle.scrollPaddingTop) || 0
          
          // Вычисляем оптимальный отступ с учетом высоты хедера и адаптивных значений
          let targetOffset: number
          
          if (scrollMarginTop > 0) {
            // Используем scroll-margin-top из CSS (уже адаптивный)
            targetOffset = scrollMarginTop
          } else if (scrollPaddingTop > 0) {
            // Используем scroll-padding-top из html
            targetOffset = scrollPaddingTop
          } else {
            // Fallback: высота хедера + небольшой отступ для комфорта
            targetOffset = headerOffset + 15
          }
          
          // Вычисляем базовую позицию прокрутки с учетом отступа для хедера
          let offsetPosition = elementTop - targetOffset
          
          // Для калькулятора на ПК прокручиваем дальше, чтобы был виден сам калькулятор
          const isCalculator = (element as HTMLElement).id === "calculator"
          const isAdvantages = (element as HTMLElement).id === "advantages"
          const isDesktop = window.innerWidth >= 1024
          let skipBottomCheck = false // Флаг для пропуска проверки нижней части
          
          if (isCalculator) {
            // Для калькулятора прокручиваем к заголовку, чтобы были видны "Калькулятор стоимости" и подзаголовок
            const titleElement = element.querySelector("h2")
            if (titleElement) {
              const titleRect = titleElement.getBoundingClientRect()
              const titleTop = titleRect.top + currentScrollY
              
              // Прокручиваем так, чтобы заголовок был виден с учетом хедера
              offsetPosition = titleTop - targetOffset - 20 // 20px отступ сверху для комфорта
              skipBottomCheck = true // Пропускаем дальнейшие проверки для калькулятора
            } else {
              // Если не нашли заголовок, используем стандартную логику
              // Но все равно пропускаем проверку нижней части
              skipBottomCheck = true
            }
          } else if (isAdvantages) {
            // Для раздела "Кальяны" прокручиваем чуть ниже заголовка и подзаголовка
            // Находим подзаголовок (p с классом section-subtitle)
            const subtitleElement = element.querySelector("p.section-subtitle")
            if (subtitleElement) {
              const subtitleRect = subtitleElement.getBoundingClientRect()
              const subtitleBottom = subtitleRect.bottom + currentScrollY
              
              // Прокручиваем чуть ниже подзаголовка, чтобы текст был виден, но прокрутка была ниже
              offsetPosition = subtitleBottom - targetOffset + 30 // 30px ниже подзаголовка
              skipBottomCheck = true // Пропускаем дальнейшие проверки
            } else {
              // Если не нашли подзаголовок, ищем заголовок
              const titleElement = element.querySelector("h2")
              if (titleElement) {
                const titleRect = titleElement.getBoundingClientRect()
                const titleBottom = titleRect.bottom + currentScrollY
                offsetPosition = titleBottom - targetOffset + 50 // 50px ниже заголовка
                skipBottomCheck = true
              }
            }
          }
          
          // Получаем размеры viewport (нужно для всех расчетов)
          const viewportHeight = window.innerHeight
          
          // Получаем размеры для проверки видимости кнопок внизу секции
          // (только если не калькулятор на ПК)
          if (!skipBottomCheck) {
            const elementHeight = (element as HTMLElement).offsetHeight
            const elementBottom = elementTop + elementHeight
            
            // Вычисляем, будет ли нижняя часть секции видна после прокрутки
            // После прокрутки на offsetPosition, нижняя точка секции будет на: elementBottom - offsetPosition
            const bottomPositionAfterScroll = elementBottom - offsetPosition
            
            // Если нижняя часть секции не видна (выходит за пределы viewport),
            // и секция достаточно высокая, пытаемся показать кнопки
            if (bottomPositionAfterScroll > viewportHeight && elementHeight > viewportHeight * 0.5) {
              // Вычисляем минимальную прокрутку для показа нижней части с отступом
              const minScrollForBottom = elementBottom - viewportHeight + 60 // 60px отступ снизу для кнопок
              
              // Проверяем, не скроется ли верхняя часть хедером при такой прокрутке
              const topAfterBottomScroll = elementTop - minScrollForBottom
              const topVisibleWithHeader = topAfterBottomScroll >= targetOffset - 20 // 20px допуск
              
              if (topVisibleWithHeader) {
                // Если верхняя часть все еще видна с хедером, используем позицию для кнопок
                offsetPosition = minScrollForBottom
              } else {
                // Если верхняя часть скроется, используем компромиссное значение
                // Показываем верх с хедером, но прокручиваем немного больше для видимости кнопок
                const compromiseScroll = offsetPosition + Math.min(200, (bottomPositionAfterScroll - viewportHeight) / 2)
                offsetPosition = compromiseScroll
              }
            }
          }
          
          // Убеждаемся, что позиция не отрицательная
          offsetPosition = Math.max(0, offsetPosition)
          
          // Получаем максимальную высоту документа
          const documentHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
          )
          const maxScroll = Math.max(0, documentHeight - viewportHeight)
          
          // Ограничиваем позицию максимальным значением
          offsetPosition = Math.min(offsetPosition, maxScroll)
          
          // Прокручиваем напрямую с учетом offset
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          })
          
          // Восстанавливаем CSS scroll-behavior после прокрутки
          setTimeout(() => {
            html.style.scrollBehavior = originalScrollBehavior || ''
          }, 300)
        }, 50) // Небольшая задержка для стабилизации layout
      })
    })
  }

  // Ищем элемент
  let element = document.querySelector(sectionId)
  
  // Проверяем, что найден правильный элемент (для калькулятора проверяем ID)
  if (element) {
    if (sectionId === "#calculator") {
      // Убеждаемся, что это действительно секция калькулятора
      if ((element as HTMLElement).id === "calculator" && element.tagName === "SECTION") {
        performScroll(element)
        return
      } else {
        // Если нашли не тот элемент, ищем заново
        element = null
      }
    } else {
      performScroll(element)
      return
    }
  }

  // Если элемент не найден сразу, пробуем найти его через небольшие задержки
  const maxAttempts = 5
  let attempt = 0

  const findAndScroll = setInterval(() => {
    attempt++
    element = document.querySelector(sectionId)
    
    if (element) {
      // Для калькулятора дополнительно проверяем, что это правильный элемент
      if (sectionId === "#calculator") {
        if ((element as HTMLElement).id === "calculator" && element.tagName === "SECTION") {
          clearInterval(findAndScroll)
          performScroll(element)
        }
      } else {
        clearInterval(findAndScroll)
        performScroll(element)
      }
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
    // Небольшая задержка для предотвращения конфликтов с нативной прокруткой браузера
    // Используем requestAnimationFrame для синхронизации с рендерингом
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToSection(href)
      })
    })
  }
}

