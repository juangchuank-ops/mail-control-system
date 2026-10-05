/**
 * 工业读数格式化工具
 * 数字一律等宽（配合 .mcs-num / font-mono）
 * 涉及自然语言的读数按当前界面语言产出。
 */

import { translate } from './i18n'
import type { DictLanguage } from './i18n'

const pad2 = (n: number): string => String(n).padStart(2, '0')

export function pad(value: number, length: number): string {
  return String(value).padStart(length, '0')
}

/** 17:42:08 */
export function formatClock(ts: number): string {
  const d = new Date(ts)
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
}

/** 2026.10.05 */
export function formatDate(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}.${pad2(d.getMonth() + 1)}.${pad2(d.getDate())}`
}

/** 2026.10.05 / 17:42:08 */
export function formatDateTime(ts: number): string {
  return `${formatDate(ts)} / ${formatClock(ts)}`
}

/** ISO 风格的紧凑时间戳：2026-10-05T17:42:08 */
export function formatIso(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(
    d.getHours(),
  )}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
}

/** 1,284 */
export function formatCount(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

/** 99.8% */
export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`
}

/** 42.6 KB */
export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const exp = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const size = bytes / 1024 ** exp
  const digits = exp === 0 ? 0 : size >= 100 ? 0 : 1
  return `${size.toFixed(digits)} ${units[exp]}`
}

/** 秒数 → 04:32（用于 CODE VALID 倒计时） */
export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${pad2(minutes)}:${pad2(seconds)}`
}

export function isSameDay(a: number, b: number): boolean {
  const da = new Date(a)
  const db = new Date(b)
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  )
}

/** 列表用相对时间：今天显示时刻，昨天显示「昨天」，其余显示日期 */
export function formatListTime(
  ts: number,
  language: DictLanguage = 'en',
  now: number = Date.now(),
): string {
  if (isSameDay(ts, now)) return formatClock(ts)
  const yesterday = now - 24 * 60 * 60 * 1000
  if (isSameDay(ts, yesterday)) return translate(language, 'time.yesterday')
  return formatDate(ts)
}

/** 相对时间读数：刚刚 / 3 分钟前 / 2 小时前 / 4 天前 */
export function formatRelative(
  ts: number,
  language: DictLanguage = 'en',
  now: number = Date.now(),
): string {
  const diff = Math.max(0, now - ts)
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return translate(language, 'time.justNow')
  if (minutes < 60) return translate(language, 'time.minutesAgo', { n: minutes })
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return translate(language, 'time.hoursAgo', { n: hours })
  const days = Math.floor(hours / 24)
  if (days < 30) return translate(language, 'time.daysAgo', { n: days })
  const months = Math.floor(days / 30)
  return translate(language, 'time.monthsAgo', { n: months })
}

/** GITHUB → github.com 域名（用于头像占位） */
export function senderDomain(address: string): string {
  const at = address.split('@')[1] ?? ''
  return at.toLowerCase()
}

/** 取显示名首字母（用于直角字母块） */
export function senderInitial(name: string, address: string): string {
  const source = name.trim() || address.trim()
  const first = source.replace(/[^A-Za-z0-9\u4e00-\u9fa5]/g, '').charAt(0)
  return (first || '?').toUpperCase()
}

/**
 * 邮件记录编号：#00182
 * 由 id 稳定派生，筛选 / 排序变化时编号不漂移。
 */
export function formatMessageRef(id: string): string {
  let hash = 7
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash * 31 + id.charCodeAt(index)) % 100000
  }
  return `#${pad(hash, 5)}`
}

