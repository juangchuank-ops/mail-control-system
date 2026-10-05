/**
 * MOCK DATA — 三个通讯节点的信件种子
 * 编译结果在模块首次加载时生成，之后保持稳定。
 */

import { buildMessages } from './factory'
import { gmailSeed } from './gmail'
import { outlookSeed } from './outlook'
import { qqSeed } from './qq'

export const gmailMessages = buildMessages('gmail', gmailSeed)
export const qqMessages = buildMessages('qq', qqSeed)
export const outlookMessages = buildMessages('outlook', outlookSeed)

export { addr, attachment, buildMessages } from './factory'
export type { MessageSeed } from './factory'
