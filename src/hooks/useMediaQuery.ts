import { useEffect, useState } from 'react'

/** 订阅 CSS 媒体查询（用于响应式布局与 prefers-reduced-motion） */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const list = window.matchMedia(query)
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }
    setMatches(list.matches)
    list.addEventListener('change', handler)
    return () => {
      list.removeEventListener('change', handler)
    }
  }, [query])

  return matches
}
