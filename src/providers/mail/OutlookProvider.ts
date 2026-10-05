import { outlookMessages } from '../../data/mock'
import type { MailProviderMeta } from '../../types'
import { MockMailProvider } from './MockMailProvider'

export const OUTLOOK_META: MailProviderMeta = {
  id: 'outlook',
  label: 'OUTLOOK',
  sequence: '03',
  mock: true,
}

/** NODE 03 — 中等延迟，历史数据最多 */
export class OutlookProvider extends MockMailProvider {
  constructor(address = 'operator@outlook.com') {
    super({
      meta: OUTLOOK_META,
      address,
      seed: outlookMessages,
      latency: [130, 280],
    })
  }
}
