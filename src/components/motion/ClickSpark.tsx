import { useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, type ReactNode } from 'react'

/**
 * ClickSpark — 改造自 React Bits (reactbits.dev/ClickSpark)
 * 工业改造点：
 *  - 火花改为「黄色信号刻线」，非粒子爆炸
 *  - 低速、短半径、2px 线宽、无发光
 *  - prefers-reduced-motion 时完全禁用
 */

interface Spark {
  x: number
  y: number
  angle: number
  startTime: number
}

export interface ClickSparkProps {
  sparkColor?: string
  sparkSize?: number
  sparkRadius?: number
  sparkCount?: number
  duration?: number
  children?: ReactNode
  className?: string
}

export function ClickSpark({
  sparkColor = '#e8ff00',
  sparkSize = 8,
  sparkRadius = 14,
  sparkCount = 6,
  duration = 320,
  children,
  className = '',
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sparksRef = useRef<Spark[]>([])
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (!canvas || !parent) return

    const resize = () => {
      const { width, height } = parent.getBoundingClientRect()
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
    }

    const observer = new ResizeObserver(resize)
    observer.observe(parent)
    resize()
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || reduced) return

    let frame = 0
    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime
        if (elapsed >= duration) return false
        const eased = 1 - (1 - elapsed / duration) ** 2
        const distance = eased * sparkRadius
        const lineLength = sparkSize * (1 - eased)
        ctx.strokeStyle = sparkColor
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(
          spark.x + distance * Math.cos(spark.angle),
          spark.y + distance * Math.sin(spark.angle),
        )
        ctx.lineTo(
          spark.x + (distance + lineLength) * Math.cos(spark.angle),
          spark.y + (distance + lineLength) * Math.sin(spark.angle),
        )
        ctx.stroke()
        return true
      })
      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [sparkColor, sparkSize, sparkRadius, duration, reduced])

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (reduced) return
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const now = performance.now()
      sparksRef.current.push(
        ...Array.from({ length: sparkCount }, (_, index) => ({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          angle: (Math.PI * 2 * index) / sparkCount,
          startTime: now,
        })),
      )
    },
    [reduced, sparkCount],
  )

  return (
    <div className={`relative ${className}`} onClick={handleClick}>
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-10" />
      {children}
    </div>
  )
}

export default ClickSpark
