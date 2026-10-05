import { gmailMessages } from '../../data/mock'
import type { MailProviderMeta } from '../../types'
import { MockMailProvider } from './MockMailProvider'

export const GMAIL_META: MailProviderMeta = {
  id: 'gmail',
  label: 'GMAIL',
  sequence: '01',
  mock: true,
}

/** NODE 01 — 平均链路延迟最低 */
export class GmailProvider extends MockMailProvider {
  constructor(address = 'operator.control@gmail.com') {
    super({
      meta: GMAIL_META,
      address,
      seed: gmailMessages,
      latency: [110, 240],
    })
  }
}
