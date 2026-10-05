import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { pad } from '../../lib/format'
import { useMediaQuery, useT } from '../../hooks'
import type { MessageKey } from '../../lib/i18n'

const PHASES: ReadonlyArray<MessageKey> = [
  'boot.phase1',
  'boot.phase2',
  'boot.phase3',
  'boot.brand',
]

/**
 * 系统启动动画（仅首次加载播放）
 *
 * 时间线：
 *   0.0s  左侧 8px 竖条 scaleY 0 → 1（1.9s）
 *   0.0s  底部细进度线 + 三位读数 000 → 100（window 未 load 时封顶 99）
 *   1.55s 阶段文本退场
 *   2.0s  遮罩整体右移 102%，左缘 3px 信号线作为引导边（0.78s）
 *   ~3.1s 移除遮罩并派发 loader:done
 *
 * prefers-reduced-motion 时直接进入系统，不做任何位移。
 */
export function BootSequence() {
  const t = useT()
  const [done, setDone] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const maskRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const readoutRef = useRef<HTMLSpanElement>(null)
  const phasesRef = useRef<HTMLDivElement>(null)

  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  useEffect(() => {
    document.body.classList.add('is-loading')

    const finish = () => {
      document.body.classList.remove('is-loading')
      window.dispatchEvent(new Event('loader:done'))
      setDone(true)
    }

    if (reducedMotion) {
      const timer = setTimeout(finish, 220)
      return () => {
        clearTimeout(timer)
        document.body.classList.remove('is-loading')
      }
    }

    const counter = { value: 0 }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ onComplete: finish })

      timeline.to(
        counter,
        {
          value: 100,
          duration: 1.9,
          ease: 'none',
          onUpdate: () => {
            const loaded = document.readyState === 'complete'
            const value = Math.min(counter.value, loaded ? 100 : 99)
            if (readoutRef.current) {
              readoutRef.current.textContent = pad(Math.floor(value), 3)
            }
          },
        },
        0,
      )

      timeline.fromTo(
        barRef.current,
        { scaleY: 0 },
        { scaleY: 1, duration: 1.9, ease: 'power1.inOut' },
        0,
      )

      timeline.fromTo(
        progressRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.9, ease: 'none' },
        0,
      )

      const phases = phasesRef.current?.querySelectorAll('[data-phase]') ?? []
      timeline.fromTo(
        phases,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.42, ease: 'power2.out' },
        0.08,
      )
      timeline.to(phases, { opacity: 0, duration: 0.24, stagger: 0.06 }, 1.58)

      timeline.to(
        maskRef.current,
        { xPercent: 102, duration: 0.78, ease: 'power4.inOut' },
        2,
      )
    }, rootRef)

    return () => {
      ctx.revert()
      document.body.classList.remove('is-loading')
    }
  }, [reducedMotion])

  if (done) return null

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[var(--z-boot)] overflow-hidden"
      aria-hidden="true"
    >
      <div ref={maskRef} className="absolute inset-0 bg-surface-0">
        <div className="mcs-grid-bg absolute inset-0 opacity-40" />

        <div
          ref={barRef}
          className="absolute top-0 bottom-0 left-10 w-2 origin-top bg-signal"
        />

        <div
          ref={phasesRef}
          className="absolute top-1/2 left-20 -translate-y-1/2 space-y-3"
        >
          {PHASES.map((phase, index) => (
            <p
              key={phase}
              data-phase
              className={
                index === PHASES.length - 1
                  ? 'mcs-label text-ink-0'
                  : 'mcs-label'
              }
            >
              {t(phase)}
            </p>
          ))}
        </div>

        <div className="absolute right-10 bottom-10 left-20">
          <div className="flex items-end justify-between">
            <span ref={readoutRef} className="mcs-num text-[13px] text-ink-0">
              000
            </span>
            <span className="mcs-label">{t('boot.label')}</span>
          </div>
          <div className="mt-2 h-px w-full bg-line">
            <div ref={progressRef} className="h-px w-full origin-left bg-signal" />
          </div>
        </div>

        {/* 遮罩左缘：3px 信号引导边 */}
        <div className="absolute inset-y-0 left-0 w-[3px] bg-signal" />
      </div>
    </div>
  )
}
