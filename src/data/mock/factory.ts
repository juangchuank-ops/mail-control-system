/**
 * MOCK DATA FACTORY
 *
 * 所有 Mock 邮件都由这里统一构造，保证：
 *  - verificationCode / verificationExpiresAt 一定由真实识别引擎推导，而不是手写
 *  - preview 一定从正文截取，避免列表与正文不一致
 *  - hasAttachment 一定由 attachments 推导
 *  - timestamp 相对 Date.now() 生成，列表时间读数始终自然
 *
 * 禁止任何 lorem ipsum：所有正文都是可读的真实业务内容。
 */

import { extractValiditySeconds, extractVerificationCode } from '../../lib/verification'
import type {
  MailAddress,
  MailAttachment,
  MailLabel,
  MailMessage,
  ProviderId,
} from '../../types'

const MINUTE = 60_000

export interface MessageSeed {
  id: string
  from: MailAddress
  subject: string
  body: string
  /** 距今多少分钟，用于生成自然的时间戳 */
  minutesAgo: number
  isRead?: boolean
  isStarred?: boolean
  labels?: MailLabel[]
  attachments?: MailAttachment[]
  folderId?: string
  to?: MailAddress[]
  cc?: MailAddress[]
  /** 一般不需要手写，识别引擎会自动提取；仅用于识别不到时的兜底 */
  verificationCode?: string
}

export function addr(name: string, address: string): MailAddress {
  return { name, address }
}

export function attachment(
  id: string,
  filename: string,
  mimeType: string,
  size: number,
): MailAttachment {
  return { id, filename, mimeType, size }
}

function buildPreview(body: string): string {
  return body.replace(/\s+/g, ' ').trim().slice(0, 168)
}

function resolveLabels(seed: MessageSeed, hasCode: boolean): MailLabel[] {
  const labels = new Set<MailLabel>(seed.labels ?? ['notification'])
  if (hasCode) labels.add('verification')
  return [...labels]
}

/** 把一批 seed 编译成完整的 MailMessage 列表 */
export function buildMessages(
  providerId: ProviderId,
  seeds: readonly MessageSeed[],
  now: number = Date.now(),
): MailMessage[] {
  return seeds.map((seed) => {
    const timestamp = now - seed.minutesAgo * MINUTE
    const haystack = `${seed.subject}\n${seed.body}`
    const extracted = extractVerificationCode(haystack)
    // 只信任「关键词邻近」的提取结果。主题行裸数字兜底会把订单号 / 工单号
    // 误判成验证码，因此这里显式排除。
    const code =
      seed.verificationCode ??
      (extracted && extracted.kind !== 'subject_numeric' ? extracted.code : undefined)
    const ttl = extractValiditySeconds(seed.body)
    const attachments = seed.attachments ?? []

    return {
      id: seed.id,
      providerId,
      threadId: seed.id,
      from: seed.from,
      to: seed.to ?? [addr('Control Operator', 'operator@mail-control.system')],
      cc: seed.cc ?? [],
      subject: seed.subject,
      preview: buildPreview(seed.body),
      body: seed.body,
      timestamp,
      isRead: seed.isRead ?? false,
      isStarred: seed.isStarred ?? false,
      hasAttachment: attachments.length > 0,
      attachments,
      labels: resolveLabels(seed, Boolean(code)),
      folderId: seed.folderId ?? 'inbox',
      ...(code ? { verificationCode: code } : {}),
      ...(code && ttl ? { verificationExpiresAt: timestamp + ttl * 1000 } : {}),
    } satisfies MailMessage
  })
}
