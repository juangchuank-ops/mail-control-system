import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * 复制到剪贴板，并返回短暂的 COPIED 确认态。
 * 复制动作与确认态都是「瞬时」的，不弹 Toast，避免打断操作。
 */
export function useCopyToClipboard(resetMs = 1600): {
  copied: boolean
  copy: (text: string) => Promise<boolean>
} {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text)
        } else {
          const area = document.createElement('textarea')
          area.value = text
          area.setAttribute('readonly', '')
          area.style.position = 'absolute'
          area.style.left = '-9999px'
          document.body.appendChild(area)
          area.select()
          document.execCommand('copy')
          document.body.removeChild(area)
        }
        setCopied(true)
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => setCopied(false), resetMs)
        return true
      } catch {
        return false
      }
    },
    [resetMs],
  )

  return { copied, copy }
}
