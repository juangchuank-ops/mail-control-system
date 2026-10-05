import { cn } from '../../lib/cn'

export type LedTone = 'idle' | 'signal' | 'ok' | 'warn' | 'danger'

const TONE_CLASS: Record<Exclude<LedTone, 'idle'>, string> = {
  signal: 'mcs-led--signal',
  ok: 'mcs-led--ok',
  warn: 'mcs-led--warn',
  danger: 'mcs-led--danger',
}

export interface StatusLedProps {
  tone?: LedTone
  /** 呼吸闪烁（仅用于「进行中」状态） */
  blink?: boolean
  className?: string
}

/** 方形状态灯（直角，非圆点） */
export function StatusLed({ tone = 'idle', blink = false, className }: StatusLedProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'mcs-led',
        tone !== 'idle' && TONE_CLASS[tone],
        blink && 'mcs-blink',
        className,
      )}
    />
  )
}
