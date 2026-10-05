import { useEffect, useRef } from 'react'

/** 稳定引用的 setInterval：delay 为 null 时暂停 */
export function useInterval(callback: () => void, delay: number | null): void {
  const saved = useRef(callback)

  useEffect(() => {
    saved.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return
    const id = setInterval(() => {
      saved.current()
    }, delay)
    return () => {
      clearInterval(id)
    }
  }, [delay])
}
