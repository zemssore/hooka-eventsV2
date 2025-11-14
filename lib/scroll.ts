/**
 * Smooth scroll to element
 */
export function scrollToSection(sectionId: string) {
  const performScroll = (element: Element) => {
    const html = document.documentElement
    const originalScrollBehavior = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          const header = document.querySelector("header") as HTMLElement | null
          const headerOffset = header ? header.offsetHeight : 0
          
          const currentScrollY = window.pageYOffset || document.documentElement.scrollTop
          const rect = (element as HTMLElement).getBoundingClientRect()
          const elementTop = rect.top + currentScrollY
          
          const computedStyle = window.getComputedStyle(element as HTMLElement)
          const scrollMarginTop = parseInt(computedStyle.scrollMarginTop) || 0
          const htmlComputedStyle = window.getComputedStyle(document.documentElement)
          const scrollPaddingTop = parseInt(htmlComputedStyle.scrollPaddingTop) || 0
          
          let targetOffset: number
          
          if (scrollMarginTop > 0) {
            targetOffset = scrollMarginTop
          } else if (scrollPaddingTop > 0) {
            targetOffset = scrollPaddingTop
          } else {
            targetOffset = headerOffset + 15
          }
          
          let offsetPosition = elementTop - targetOffset
          const isCalculator = (element as HTMLElement).id === "calculator"
          const isAdvantages = (element as HTMLElement).id === "advantages"
          const isDesktop = window.innerWidth >= 1024
          let skipBottomCheck = false
          
          if (isCalculator) {
            const isMobile = window.innerWidth < 1024
            
            if (isMobile) {
              const subtitleElement = element.querySelector("p.section-subtitle")
              if (subtitleElement) {
                const subtitleRect = subtitleElement.getBoundingClientRect()
                const subtitleBottom = subtitleRect.bottom + currentScrollY
                offsetPosition = subtitleBottom - targetOffset + 30
                skipBottomCheck = true
              } else {
                const titleElement = element.querySelector("h2")
                if (titleElement) {
                  const titleRect = titleElement.getBoundingClientRect()
                  const titleBottom = titleRect.bottom + currentScrollY
                  offsetPosition = titleBottom - targetOffset + 50
                  skipBottomCheck = true
                }
              }
            } else {
              const titleElement = element.querySelector("h2")
              if (titleElement) {
                const titleRect = titleElement.getBoundingClientRect()
                const titleTop = titleRect.top + currentScrollY
                offsetPosition = titleTop - targetOffset - 20
                skipBottomCheck = true
              } else {
                skipBottomCheck = true
              }
            }
          } else if (isAdvantages) {
            const subtitleElement = element.querySelector("p.section-subtitle")
            if (subtitleElement) {
              const subtitleRect = subtitleElement.getBoundingClientRect()
              const subtitleBottom = subtitleRect.bottom + currentScrollY
              offsetPosition = subtitleBottom - targetOffset + 30
              skipBottomCheck = true
            } else {
              const titleElement = element.querySelector("h2")
              if (titleElement) {
                const titleRect = titleElement.getBoundingClientRect()
                const titleBottom = titleRect.bottom + currentScrollY
                offsetPosition = titleBottom - targetOffset + 50
                skipBottomCheck = true
              }
            }
          }
          
          const viewportHeight = window.innerHeight
          
          if (!skipBottomCheck) {
            const elementHeight = (element as HTMLElement).offsetHeight
            const elementBottom = elementTop + elementHeight
            const bottomPositionAfterScroll = elementBottom - offsetPosition
            
            if (bottomPositionAfterScroll > viewportHeight && elementHeight > viewportHeight * 0.5) {
              const minScrollForBottom = elementBottom - viewportHeight + 60
              const topAfterBottomScroll = elementTop - minScrollForBottom
              const topVisibleWithHeader = topAfterBottomScroll >= targetOffset - 20
              
              if (topVisibleWithHeader) {
                offsetPosition = minScrollForBottom
              } else {
                const compromiseScroll = offsetPosition + Math.min(200, (bottomPositionAfterScroll - viewportHeight) / 2)
                offsetPosition = compromiseScroll
              }
            }
          }
          
          offsetPosition = Math.max(0, offsetPosition)
          
          const documentHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
          )
          const maxScroll = Math.max(0, documentHeight - viewportHeight)
          offsetPosition = Math.min(offsetPosition, maxScroll)
          
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          })
          
          setTimeout(() => {
            html.style.scrollBehavior = originalScrollBehavior || ''
          }, 300)
        }, 50)
      })
    })
  }

  let element = document.querySelector(sectionId)
  
  if (element) {
    if (sectionId === "#calculator") {
      if ((element as HTMLElement).id === "calculator" && element.tagName === "SECTION") {
        performScroll(element)
        return
      } else {
        element = null
      }
    } else {
      performScroll(element)
      return
    }
  }

  const maxAttempts = 5
  let attempt = 0

  const findAndScroll = setInterval(() => {
    attempt++
    element = document.querySelector(sectionId)
    
    if (element) {
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
 * Anchor click handler
 */
export function handleAnchorClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (href.startsWith("#")) {
    e.preventDefault()
    e.stopPropagation()
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToSection(href)
      })
    })
  }
}
