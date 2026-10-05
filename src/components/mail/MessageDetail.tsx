import { useState } from 'react'
import { Archive, ArrowLeft, Star, Trash } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useT } from '../../hooks'
import { formatDateTime, formatMessageRef } from '../../lib/format'
import type { MessageKey } from '../../lib/i18n'
import { isVerificationMessage } from '../../lib/verification'
import { useMailStore } from '../../store'
import type { MailLabel } from '../../types'
import { SectionHeader } from '../hud'
import { Badge, Button, EmptyState, ErrorState, LoadingState, Modal, StatusLed } from '../ui'
import { AttachmentList, VerificationCodePanel } from './VerificationCodePanel'

const LABEL_KEY: Record<MailLabel, MessageKey> = {
  verification: 'label.verification',
  security: 'label.security',
  order: 'label.order',
  billing: 'label.billing',
  github: 'label.github',
  notification: 'label.notification',
  newsletter: 'label.newsletter',
  personal: 'label.personal',
}

/** 03 — MESSAGE DETAIL：单封邮件记录 */
export function MessageDetail({
  className,
  onBack,
}: {
  className?: string
  onBack?: () => void
}) {
  const t = useT()
  const message = useMailStore((state) => state.selectedMessage)
  const detailStatus = useMailStore((state) => state.detailStatus)
  const error = useMailStore((state) => state.error)
  const nodes = useMailStore((state) => state.nodes)
  const selectMessage = useMailStore((state) => state.selectMessage)
  const toggleStar = useMailStore((state) => state.toggleStar)
  const toggleRead = useMailStore((state) => state.toggleRead)
  const archiveMessage = useMailStore((state) => state.archiveMessage)
  const removeMessage = useMailStore((state) => state.removeMessage)

  const [confirming, setConfirming] = useState(false)

  const node = message ? nodes.find((item) => item.id === message.providerId) : undefined

  if (detailStatus === 'loading') {
    return (
      <section className={cn('flex h-full min-h-0 items-center justify-center', className)}>
        <LoadingState phase={t('detail.loading')} />
      </section>
    )
  }

  if (detailStatus === 'error') {
    return (
      <section className={cn('flex h-full min-h-0 items-start p-4', className)}>
        <ErrorState title={t('detail.error')} detail={error ?? t('detail.unavailable')} />
      </section>
    )
  }

  if (!message) {
    return (
      <section className={cn('flex h-full min-h-0 flex-col', className)}>
        <SectionHeader
          index="03"
          label={t('section.detail.label')}
          title={t('section.detail.title')}
          className="px-4 pt-5 pb-3"
        />
        <div className="flex-1">
          <EmptyState
            code={t('empty.detail.code')}
            title={t('empty.detail.title')}
            detail={t('empty.detail.detail')}
          />
        </div>
      </section>
    )
  }

  const paragraphs = message.body.split('\n').filter((line) => line.trim().length > 0)
  const hasVerification = isVerificationMessage(message) && Boolean(message.verificationCode)

  return (
    <section className={cn('flex h-full min-h-0 flex-col', className)}>
      <SectionHeader
        index="03"
        label={t('section.detail.label')}
        title={formatMessageRef(message.id)}
        meta={
          <span className="mcs-label flex items-center gap-2">
            <StatusLed tone={message.isRead ? 'idle' : 'signal'} />
            {message.isRead ? t('detail.read') : t('detail.unread')}
          </span>
        }
        className="px-4 pt-5 pb-3"
      />

      <div className="flex flex-wrap items-center gap-2 border-y border-line bg-panel-0 px-4 py-2">
        {onBack ? (
          <Button size="sm" onClick={onBack} className="md:hidden">
            <ArrowLeft size={12} strokeWidth={1.75} />
            {t('detail.back')}
          </Button>
        ) : null}
        <Button
          size="sm"
          onClick={() => {
            void toggleStar(message.id)
          }}
          className={cn(message.isStarred && 'border-signal text-signal')}
        >
          <Star size={12} strokeWidth={1.75} fill={message.isStarred ? 'currentColor' : 'none'} />
          {message.isStarred ? t('detail.starred') : t('detail.star')}
        </Button>
        <Button
          size="sm"
          onClick={() => {
            void toggleRead(message.id)
          }}
        >
          {message.isRead ? t('detail.markUnread') : t('detail.markRead')}
        </Button>
        <Button
          size="sm"
          onClick={() => {
            void archiveMessage(message.id)
          }}
        >
          <Archive size={12} strokeWidth={1.75} />
          {t('detail.archive')}
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={() => {
            setConfirming(true)
          }}
        >
          <Trash size={12} strokeWidth={1.75} />
          {t('detail.delete')}
        </Button>
        <span className="mcs-label ml-auto">
          {node ? `${node.sequence} ${node.label}` : message.providerId.toUpperCase()}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mcs-density-block px-4">
          <h1 className="text-[17px] leading-snug font-medium text-ink-0">{message.subject}</h1>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {message.labels.map((label) => (
              <Badge key={label} tone={label === 'verification' ? 'signal' : 'default'}>
                {t(LABEL_KEY[label])}
              </Badge>
            ))}
            {message.hasAttachment ? <Badge tone="default">{t('detail.attachment')}</Badge> : null}
          </div>

          <dl className="mt-4 grid gap-x-6 gap-y-2 border-t border-line pt-3 sm:grid-cols-2">
            <div className="flex gap-3">
              <dt className="mcs-label w-16 shrink-0">{t('detail.from')}</dt>
              <dd className="min-w-0 text-[12px] text-ink-0">
                <span className="block truncate">{message.from.name}</span>
                <span className="mcs-num block truncate text-[11px] text-ink-3">
                  {message.from.address}
                </span>
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="mcs-label w-16 shrink-0">{t('detail.to')}</dt>
              <dd className="min-w-0 text-[12px] text-ink-1">
                {message.to.map((recipient) => (
                  <span key={recipient.address} className="mcs-num block truncate text-[11px]">
                    {recipient.address}
                  </span>
                ))}
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="mcs-label w-16 shrink-0">{t('detail.date')}</dt>
              <dd className="mcs-num text-[12px] text-ink-1">
                {formatDateTime(message.timestamp)}
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="mcs-label w-16 shrink-0">{t('detail.record')}</dt>
              <dd className="mcs-num text-[12px] text-ink-1">
                {formatMessageRef(message.id)} / {message.folderId.toUpperCase()}
              </dd>
            </div>
          </dl>
        </div>

        {hasVerification && message.verificationCode ? (
          <div className="px-4 pb-4">
            <VerificationCodePanel
              code={message.verificationCode}
              expiresAt={message.verificationExpiresAt}
            />
          </div>
        ) : null}

        <div className="mcs-prose mcs-density-block border-t border-line px-4">
          {paragraphs.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>

        <AttachmentList attachments={message.attachments} />
      </div>

      <Modal
        open={confirming}
        onClose={() => {
          setConfirming(false)
        }}
        title={t('detail.delete.title')}
        meta={formatMessageRef(message.id)}
        footer={
          <>
            <Button
              size="sm"
              onClick={() => {
                setConfirming(false)
              }}
            >
              {t('detail.delete.cancel')}
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                setConfirming(false)
                void removeMessage(message.id)
              }}
            >
              {t('detail.delete.confirm')}
            </Button>
          </>
        }
      >
        <p className="text-[13px] text-ink-1">{t('detail.delete.body')}</p>
        <p className="mcs-label mt-3">
          <button
            type="button"
            className="underline decoration-line-strong underline-offset-2 hover:text-signal"
            onClick={() => {
              setConfirming(false)
              void selectMessage(null)
            }}
          >
            {t('detail.delete.closeInstead')}
          </button>
        </p>
      </Modal>
    </section>
  )
}
