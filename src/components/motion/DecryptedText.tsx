import { motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/**
 * DecryptedText — 改造自 React Bits (reactbits.dev/DecryptedText)
 * 工业改造点：
 *  - 乱码字符集改为工程符号 + 十六进制，而不是通用 ASCII
 *  - 解算完成使用纸色，乱码期间使用弱信号色，无彩色发光
 *  - 支持 prefers-reduced-motion：直接呈现明文
 */

const INDUSTRIAL_CHARS = '0123456789ABCDEF#$%&*<>/\\|[]{}'

export interface DecryptedTextProps {
  text: string
  /** 每帧间隔 ms */
  speed?: number
  /** 非顺序模式的迭代次数 */
  maxIterations?: number
  /** 顺序解密（逐字解锁） */
  sequential?: boolean
  /** 触发方式 */
  animateOn?: 'mount' | 'view' | 'hover'
  className?: string
  encryptedClassName?: string
  parentClassName?: string
}

export function DecryptedText({
  text,
  speed = 32,
  maxIterations = 9,
  sequential = true,
  animateOn = 'mount',
  className = '',
  encryptedClassName = 'text-ink-3',
  parentClassName = '',
}: DecryptedTextProps) {
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(text)
  const [revealed, setRevealed] = useState(0)
  const [running, setRunning] = useState(false)
  const [started, setStarted] = useState(false)
  const containerRef = useRef<HTMLSpanElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const glyphs = useMemo(() => INDUSTRIAL_CHARS.split(''), [])

  const scramble = useCallback(
    (revealedCount: number) =>
      text
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' '
          if (index < revealedCount) return char
          return glyphs[Math.floor(Math.random() * glyphs.length)]
        })
        .join(''),
    [glyphs, text],
  )

  const start = useCallback(() => {
    if (reduced) {
      setDisplay(text)
      setRevealed(text.length)
      setRunning(false)
      setStarted(true)
      return
    }
    setStarted(true)
    setRunning(true)
    setRevealed(0)
  }, [reduced, text])

  useEffect(() => {
    if (animateOn === 'mount') start()
  }, [animateOn, start])

  useEffect(() => {
    if (animateOn !== 'view') return
    const node = containerRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started) start()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [animateOn, start, started])

  useEffect(() => {
    if (!running) return
    let iteration = 0
    timerRef.current = setInterval(() => {
      iteration += 1
      if (sequential) {
        setRevealed((prev) => {
          const next = prev + 1
          if (next >= text.length) {
            if (timerRef.current) clearInterval(timerRef.current)
            setRunning(false)
            setDisplay(text)
            return text.length
          }
          setDisplay(scramble(next))
          return next
        })
      } else {
        if (iteration >= maxIterations) {
          if (timerRef.current) clearInterval(timerRef.current)
          setRunning(false)
          setDisplay(text)
          setRevealed(text.length)
          return
        }
        setDisplay(scramble(0))
      }
    }, speed)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [running, sequential, maxIterations, scramble, speed, text])

  const handleHover = () => {
    if (animateOn === 'hover') start()
  }

  return (
    <motion.span
      ref={containerRef}
      className={`inline-block whitespace-pre-wrap ${parentClassName}`}
      onMouseEnter={handleHover}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {display.split('').map((char, index) => (
          <span
            key={index}
            className={index < revealed || !running ? className : encryptedClassName}
          >
            {char}
          </span>
        ))}
      </span>
    </motion.span>
  )
}

export default DecryptedText
