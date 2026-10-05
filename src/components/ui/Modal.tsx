import { useEffect } from 'react'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { useT } from '../../hooks'
import { IconButton } from './Button'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  /** 右上角读数注记，如 CONFIRM ACTION */
  meta?: string
  children?: ReactNode
  footer?: ReactNode
  className?: string
}

/** 直角弹窗：顶部 3px 信号边线，ESC 关闭，背景锁定滚动 */
export function Modal({
  open,
  onClose,
  title,
  meta,
  children,
  footer,
  className,
}: ModalProps) {
  const t = useT()

  useEffect(() => {
    if (!open) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = previous
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[var(--z-overlay)] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label={t('modal.closeOverlay')}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/70"
      />
      <div
        className={cn(
          'mcs-panel mcs-panel--raised relative z-[var(--z-base)] w-full max-w-[520px] border-t-[3px] border-t-signal',
          className,
        )}
      >
        <div className="flex h-10 items-center justify-between border-b border-line px-3">
          <span className="mcs-label mcs-label--signal">{title}</span>
          <div className="flex items-center gap-3">
            {meta ? <span className="mcs-label">{meta}</span> : null}
            <IconButton label={t('modal.close')} onClick={onClose}>
              <X size={14} strokeWidth={1.75} />
            </IconButton>
          </div>
        </div>
        <div className="px-4 py-4">{children}</div>
        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-line px-4 py-3">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}
