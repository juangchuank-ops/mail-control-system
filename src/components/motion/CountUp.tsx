import { useInView, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useCallback, useEffect, useRef } from 'react'

/**
 * CountUp — 改造自 React Bits (reactbits.dev/CountUp)
 * 工业改造点：
 *  - 强制 tabular-nums 等宽数字，读数不抖动
 *  - supports prefers-reduced-motion：直接落值
 */

export interface CountUpProps {
  to: number
  from?: number
  direction?: 'up' | 'down'
  /** 秒 */
  duration?: number
  /** 秒 */
  delay?: number
  className?: string
  separator?: string
  startWhen?: boolean
  onEnd?: () => void
}

export function CountUp({
  to,
  from = 0,
  direction = 'up',
  duration = 1.1,
  delay = 0,
  className = '',
  separator = '',
  startWhen = true,
  onEnd,
}: CountUpProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === 'down' ? to : from)

  const safeDuration = Math.max(duration, 0.2)
  const damping = 20 + 40 * (1 / safeDuration)
  const stiffness = 100 * (1 / safeDuration)

  const springValue = useSpring(motionValue, { damping, stiffness })
  const isInView = useInView(ref, { once: true, margin: '0px' })

  const decimals = (() => {
    const str = to.toString()
    if (!str.includes('.')) return 0
    const fraction = str.split('.')[1]
    return fraction && Number.parseInt(fraction, 10) !== 0 ? fraction.length : 0
  })()

  const format = useCallback(
    (value: number) => {
      const formatted = Intl.NumberFormat('en-US', {
        useGrouping: Boolean(separator),
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value)
      return separator ? formatted.replace(/,/g, separator) : formatted
    },
    [decimals, separator],
  )

  useEffect(() => {
    if (!isInView || !startWhen || !ref.current) return
    if (reduced) {
      ref.current.textContent = format(direction === 'down' ? from : to)
      onEnd?.()
      return
    }
    const startTimer = setTimeout(() => {
      motionValue.set(direction === 'down' ? from : to)
    }, delay * 1000)
    const endTimer = setTimeout(() => onEnd?.(), (delay + safeDuration) * 1000)
    return () => {
      clearTimeout(startTimer)
      clearTimeout(endTimer)
    }
  }, [isInView, startWhen, reduced, motionValue, direction, from, to, delay, safeDuration, format, onEnd])

  useEffect(() => {
    if (!isInView && ref.current) {
      ref.current.textContent = format(direction === 'down' ? to : from)
    }
  }, [isInView, direction, from, to, format])

  useEffect(() => {
    return springValue.on('change', (latest) => {
      if (ref.current) ref.current.textContent = format(latest)
    })
  }, [springValue, format])

  return <span ref={ref} className={`mcs-num ${className}`} />
}

export default CountUp
