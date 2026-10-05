import { GmailProvider } from './GmailProvider'
import type { MailProvider } from './MailProvider'
import { OutlookProvider } from './OutlookProvider'
import { QQMailProvider } from './QQMailProvider'

/**
 * 构建全部通讯节点。
 * 顺序即节点编号顺序：01 GMAIL → 02 QQ MAIL → 03 OUTLOOK。
 */
export function buildProviders(): MailProvider[] {
  return [new GmailProvider(), new QQMailProvider(), new OutlookProvider()]
}
