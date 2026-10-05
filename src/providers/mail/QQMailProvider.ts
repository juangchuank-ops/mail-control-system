import { qqMessages } from '../../data/mock'
import type { MailProviderMeta } from '../../types'
import { MockMailProvider } from './MockMailProvider'

export const QQ_META: MailProviderMeta = {
  id: 'qq',
  label: 'QQ MAIL',
  sequence: '02',
  mock: true,
}

/** NODE 02 — 链路较长，模拟跨区域网关 */
export class QQMailProvider extends MockMailProvider {
  constructor(address = 'operator@qq.com') {
    super({
      meta: QQ_META,
      address,
      seed: qqMessages,
      latency: [160, 320],
    })
  }
}
