import { IGNORE_SCROLL_PAGES } from '@app/constants/ignoreScrollPage'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const useScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual' 
    }

    const restoreKey = `scroll-position:${pathname}`
    const ignoreScrollPaths = IGNORE_SCROLL_PAGES.some((path) => pathname.startsWith(path))

    if (ignoreScrollPaths) {
      const saved = sessionStorage.getItem(restoreKey)
      if (saved) {
        requestAnimationFrame(() => {
          window.scrollTo(0, parseInt(saved, 10))
        })
      }
    } else {
      window.scrollTo(0, 0)
    }

    return () => {
      sessionStorage.setItem(restoreKey, window.scrollY.toString())
    }
  }, [pathname])
}

export default useScrollToTop
