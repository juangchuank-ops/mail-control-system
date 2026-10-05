import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { MailMessage } from '../../types'
import { MessageRow } from './MessageRow'

const MESSAGE: MailMessage = {
  id: 'm1',
  providerId: 'gmail',
  threadId: 'm1',
  from: { name: 'Google', address: 'no-reply@google.com' },
  to: [{ name: 'Operator', address: 'operator.control@gmail.com' }],
  cc: [],
  subject: 'Google verification code',
  preview: 'Your verification code is 482913',
  body: 'Your verification code is 482913',
  timestamp: Date.now(),
  isRead: false,
  isStarred: true,
  hasAttachment: true,
  attachments: [],
  labels: ['verification'],
  folderId: 'inbox',
}

function setup(overrides: Partial<MailMessage> = {}) {
  const onSelect = vi.fn()
  const onToggleStar = vi.fn()
  const onToggleRead = vi.fn()
  render(
    <MessageRow
      message={{ ...MESSAGE, ...overrides }}
      selected={false}
      providerLabel="GMAIL"
      onSelect={onSelect}
      onToggleStar={onToggleStar}
      onToggleRead={onToggleRead}
    />,
  )
  return { onSelect, onToggleStar, onToggleRead }
}

describe('MessageRow', () => {
  it('渲染主题、发件人与记录编号', () => {
    setup()
    expect(screen.getByText('Google verification code')).toBeInTheDocument()
    expect(screen.getByText('no-reply@google.com')).toBeInTheDocument()
    expect(screen.getByText(/^#\d{5}$/)).toBeInTheDocument()
  })

  it('点击整行触发选中', () => {
    const { onSelect } = setup()
    screen.getByRole('row').click()
    expect(onSelect).toHaveBeenCalledWith('m1')
  })

  it('星标按钮独立触发，不冒泡到行选中', () => {
    const { onSelect, onToggleStar } = setup()
    screen.getByLabelText('取消星标').click()
    expect(onToggleStar).toHaveBeenCalledWith('m1')
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('未读态显示「标记为已读」操作', () => {
    const { onToggleRead } = setup()
    screen.getByLabelText('标记为已读').click()
    expect(onToggleRead).toHaveBeenCalledWith('m1')
  })
})
