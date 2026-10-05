import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { useCopyToClipboard, useCountdown, useT } from '../../hooks'
import { cn } from '../../lib/cn'
import { formatBytes, formatDuration } from '../../lib/format'
import type { MailAttachment } from '../../types'
import { SignalSweep } from '../motion'

/** 附件清单：只读呈现（Mock 环境下不提供真实下载） */
export function AttachmentList({
  attachments,
  className,
}: {
  attachments: MailAttachment[]
  className?: string
}) {
  const t = useT()

  if (attachments.length === 0) return null

  return (
    <div className={cn('border-t border-line', className)}>
      <div className="flex items-center justify-between px-4 py-2">
        <span className="mcs-label mcs-label--signal">{t('attach.title')}</span>
        <span className="mcs-label">{t('attach.files', { n: attachments.length })}</span>
      </div>
      <ul>
        {attachments.map((file) => {
          const extension = file.filename.split('.').pop()?.toUpperCase() ?? 'FILE'
          return (
            <li
              key={file.id}
              className="flex items-center gap-3 border-t border-line px-4 py-2.5"
            >
              <span className="mcs-cut-br mcs-label inline-flex h-7 w-11 shrink-0 items-center justify-center border border-line-strong text-ink-1">
                {extension.slice(0, 4)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] text-ink-0">{file.filename}</span>
                <span className="mcs-num block text-[11px] text-ink-3">{file.mimeType}</span>
              </span>
              <span className="mcs-num shrink-0 text-[11px] text-ink-2">
                {formatBytes(file.size)}
              </span>
            </li>
          )
        })}
      </ul>
      <p className="mcs-label border-t border-line px-4 py-2 text-ink-3">
        {t('attach.mock')}
      </p>
    </div>
  )
}

export interface VerificationCodePanelProps {
  code: string
  expiresAt?: number
  className?: string
}

/**
 * SYSTEM AUTHORIZATION 面板：
 * 大字验证码 + 复制 + 有效期倒计时。这是系统的核心读数区。
 */
export function VerificationCodePanel({
  code,
  expiresAt,
  className,
}: VerificationCodePanelProps) {
  const t = useT()
  const remaining = useCountdown(expiresAt)
  const { copied, copy } = useCopyToClipboard()
  const [sweepKey, setSweepKey] = useState(0)

  const expired = remaining === 0
  const hasExpiry = remaining !== null

  const handleCopy = async () => {
    const ok = await copy(code)
    if (ok) setSweepKey((key) => key + 1)
  }

  return (
    <div
      className={cn(
        'mcs-panel mcs-frame mcs-frame--signal relative overflow-hidden border-signal/40',
        className,
      )}
    >
      <SignalSweep trigger={`sweep-${sweepKey}`} />

      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <span className="mcs-label mcs-label--signal">{t('verify.panel.title')}</span>
        <span className="mcs-label">
          {expired ? (
            <span className="text-danger">{t('verify.expired')}</span>
          ) : hasExpiry ? (
            <>
              {t('verify.valid')} <span className="mcs-num">{formatDuration(remaining)}</span>
            </>
          ) : (
            t('verify.noExpiry')
          )}
        </span>
      </div>

      <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mcs-label">{t('verify.code')}</p>
          <p
            className={cn(
              'mcs-num mt-2 text-[40px] leading-none tracking-[0.18em]',
              expired ? 'text-ink-3 line-through' : 'text-signal',
            )}
          >
            {code}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            void handleCopy()
          }}
          className={cn('mcs-btn mcs-cut-br shrink-0', copied ? 'mcs-btn--signal' : '')}
        >
          {copied ? <Check size={13} strokeWidth={2} /> : <Copy size={13} strokeWidth={1.75} />}
          {copied ? t('verify.copied') : t('verify.copy')}
        </button>
      </div>
    </div>
  )
}
