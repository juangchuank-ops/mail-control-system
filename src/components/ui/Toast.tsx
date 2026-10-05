import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { useInterval, useT } from '../../hooks'
import { cn } from '../../lib/cn'
import { useToastStore, useSettingsStore } from '../../store'
import type { ToastTone } from '../../store'
import { StatusLed } from './StatusLed'
import type { LedTone } from './StatusLed'

const TOAST_TTL = 4400

const TONE_CLASS: Record<ToastTone, string> = {
  default: 'border-l-line-strong',
  signal: 'border-l-signal',
  ok: 'border-l-ok',
  danger: 'border-l-danger',
}

const TONE_LED: Record<ToastTone, LedTone> = {
  default: 'idle',
  signal: 'signal',
  ok: 'ok',
  danger: 'danger',
}

/** 系统提示视口：右下角堆叠，自动过期回收 */
export function ToastViewport() {
  const t = useT()
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismiss)
  const notificationsEnabled = useSettingsStore((state) => state.notificationsEnabled)

  useInterval(() => {
    const now = Date.now()
    for (const toast of useToastStore.getState().toasts) {
      if (now - toast.createdAt > TOAST_TTL) dismiss(toast.id)
    }
  }, toasts.length > 0 ? 400 : null)

  if (!notificationsEnabled) return null

  return (
    <div className="pointer-events-none fixed right-3 bottom-9 z-[var(--z-toast)] flex w-[min(340px,calc(100vw-24px))] flex-col gap-2">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 18 }}
            transition={{ duration: 0.16, ease: [0.2, 0, 0, 1] }}
            className={cn(
              'mcs-panel mcs-panel--raised pointer-events-auto border-l-[3px] px-3 py-2.5',
              TONE_CLASS[toast.tone],
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-2">
                <StatusLed tone={TONE_LED[toast.tone]} className="mt-[5px]" />
                <div className="min-w-0">
                  <p className="mcs-label text-ink-0">{toast.title}</p>
                  {toast.detail ? (
                    <p className="mcs-num mt-1 text-[11px] text-ink-2">{toast.detail}</p>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                aria-label={t('toast.close')}
                onClick={() => {
                  dismiss(toast.id)
                }}
                className="text-ink-3 transition-colors duration-[var(--motion-ui)] hover:text-signal"
              >
                <X size={13} strokeWidth={1.75} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
