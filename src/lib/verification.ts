/**
 * 验证码识别引擎
 *
 * 识别来源关键词：
 *   Verification Code / 验证码 / OTP / security code /
 *   one-time password / confirmation code / 校验码 / 动态码
 *
 * 同时解析有效期（CODE VALID），用于倒计时展示。
 */

const STRONG_LABELS = [
  'verification code',
  'security code',
  'one-time password',
  'one time password',
  'one-time code',
  'confirmation code',
  'authentication code',
  'login code',
  'verification pin',
  '验证码',
  '校验码',
  '动态码',
  '驗證碼',
]

const WEAK_LABELS = ['otp', 'passcode', 'pin', 'code']

const NUMERIC_CODE = /(?<![0-9])([0-9]{4,8})(?![0-9])/g
const ALNUM_CODE = /(?<![A-Z0-9])([A-Z0-9]{6})(?![A-Z0-9])/g

type CodeKind = 'numeric' | 'alphanumeric'

interface LabelHit {
  label: string
  strength: 2 | 1
  index: number
}

function collectLabels(haystack: string): LabelHit[] {
  const hits: LabelHit[] = []
  for (const label of STRONG_LABELS) {
    let from = 0
    for (;;) {
      const index = haystack.indexOf(label, from)
      if (index === -1) break
      hits.push({ label, strength: 2, index })
      from = index + label.length
    }
  }
  for (const label of WEAK_LABELS) {
    let from = 0
    for (;;) {
      const index = haystack.indexOf(label, from)
      if (index === -1) break
      hits.push({ label, strength: 1, index })
      from = index + label.length
    }
  }
  return hits
}

function firstCodeAfter(
  source: string,
  startIndex: number,
  window = 48,
): { code: string; kind: CodeKind; distance: number } | null {
  const slice = source.slice(startIndex, startIndex + window)
  NUMERIC_CODE.lastIndex = 0
  const numeric = NUMERIC_CODE.exec(slice)
  if (numeric) {
    return { code: numeric[1], kind: 'numeric', distance: numeric.index }
  }
  ALNUM_CODE.lastIndex = 0
  const alnum = ALNUM_CODE.exec(slice)
  if (alnum) {
    return { code: alnum[1], kind: 'alphanumeric', distance: alnum.index }
  }
  return null
}

export interface ExtractedCode {
  code: string
  kind: string
}

/**
 * 从任意文本中提取验证码。
 * 采用「关键词 + 邻近度」打分，优先返回紧跟在关键词后的数字。
 */
export function extractVerificationCode(text: string): ExtractedCode | null {
  if (!text) return null
  const haystack = text.toLowerCase()
  const hits = collectLabels(haystack)

  let best: { code: string; kind: string; score: number } | null = null

  for (const hit of hits) {
    const candidate = firstCodeAfter(haystack, hit.index + hit.label.length)
    if (!candidate) continue
    // 分数：标签强度权重高，距离越近越好，纯数字更可信
    const score =
      hit.strength * 100 -
      Math.min(candidate.distance, 40) +
      (candidate.kind === 'numeric' ? 12 : 0)
    if (!best || score > best.score) {
      best = {
        code: candidate.code,
        kind: hit.label.replace(/\s+/g, '_'),
        score,
      }
    }
  }

  if (best) return { code: best.code, kind: best.kind }

  // 兜底：主题行中独立出现的 4-8 位数字（常见于纯 OTP 标题）
  const subjectLine = text.split('\n')[0] ?? ''
  NUMERIC_CODE.lastIndex = 0
  const subjectMatch = NUMERIC_CODE.exec(subjectLine)
  if (subjectMatch && /[0-9]{4,8}/.test(subjectMatch[1])) {
    return { code: subjectMatch[1], kind: 'subject_numeric' }
  }

  return null
}

const MINUTE = 60
const HOUR = 60 * MINUTE

/**
 * 解析验证码有效期，返回剩余秒数。
 * 支持的写法：expires in 10 minutes / valid for 5 minutes /
 *             有效期 10 分钟 / 10 分钟内有效
 */
export function extractValiditySeconds(text: string): number | undefined {
  if (!text) return undefined
  const source = text.toLowerCase()

  const patterns: Array<{ re: RegExp; unit: (m: RegExpExecArray) => number }> = [
    {
      re: /(?:expires?|expiring|valid)\s*(?:in|for|within)?\s*([0-9]{1,3})\s*(minutes?|mins?|hours?|hrs?|分钟|小时)/i,
      unit: (m) => (/hour|hr|小时/.test(m[2]) ? HOUR : MINUTE),
    },
    {
      re: /(?:有效期|有效期限|请在)\s*([0-9]{1,3})\s*(分钟|小时|分)/i,
      unit: (m) => (/小时/.test(m[2]) ? HOUR : MINUTE),
    },
    {
      re: /([0-9]{1,3})\s*(?:minutes?|mins?)\s*(?:to expire|remaining|left|内有效)/i,
      unit: () => MINUTE,
    },
  ]

  for (const { re, unit } of patterns) {
    const match = re.exec(source)
    if (!match) continue
    const amount = Number.parseInt(match[1], 10)
    if (!Number.isFinite(amount) || amount <= 0) continue
    return amount * unit(match)
  }

  return undefined
}

/** 剩余秒数（用于 CODE VALID 倒计时）；无过期时间返回 null */
export function remainingSeconds(
  expiresAt: number | undefined,
  now: number = Date.now(),
): number | null {
  if (typeof expiresAt !== 'number') return null
  return Math.max(0, Math.floor((expiresAt - now) / 1000))
}

/** 是否为「需要展示验证码面板」的邮件 */
export function isVerificationMessage(message: {
  verificationCode?: string
  labels?: readonly string[]
}): boolean {
  if (message.verificationCode) return true
  return Boolean(message.labels?.includes('verification'))
}
