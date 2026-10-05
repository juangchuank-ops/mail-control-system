/**
 * 轻量文案字典
 *
 * 设计约定：所有面向用户的界面标签、读数、按钮、空态与提示文案都经过这里，
 * 由「语言」设置（zh / en）统一切换。技术令牌（邮箱地址、消息编号、验证码数字、
 * Provider 代码、MOCK 标记、数值与单位、品牌名）不入字典，中英保持原样。
 */

export type DictLanguage = 'zh' | 'en'

interface Entry {
  zh: string
  en: string
}

/** 文案插值参数：`{name}` 占位符会被对应值替换 */
export type MessageParams = Record<string, string | number>

export const DICT = {
  'section.nodes.title': { zh: '通讯节点', en: 'Communication nodes' },
  'section.index.title': { zh: '消息索引', en: 'Message index' },
  'section.detail.title': { zh: '消息详情', en: 'Message detail' },
  'section.accounts.title': { zh: '节点账户', en: 'Node accounts' },
  'section.settings.title': { zh: '终端设置', en: 'Terminal settings' },
  'section.about.title': { zh: '系统信息', en: 'System information' },

  'section.nodes.label': { zh: '// 节点链路', en: '// COMMUNICATION NODES' },
  'section.index.label': { zh: '// 索引读数', en: '// MESSAGE INDEX' },
  'section.detail.label': { zh: '// 报文读数', en: '// MESSAGE DETAIL' },
  'section.accounts.label': { zh: '// 链路注册', en: '// NODE ACCOUNTS' },
  'section.settings.label': { zh: '// 终端配置', en: '// TERMINAL SETTINGS' },
  'section.about.label': { zh: '// 系统信息', en: '// SYSTEM INFORMATION' },
  'section.build.label': { zh: '// 构建指纹', en: '// BUILD FINGERPRINT' },

  'nav.console': { zh: '控制台', en: 'CONSOLE' },
  'nav.nodes': { zh: '节点', en: 'NODES' },
  'nav.settings': { zh: '设置', en: 'SETTINGS' },
  'nav.about': { zh: '关于', en: 'ABOUT' },
  'nav.primary': { zh: '主导航', en: 'Primary navigation' },
  'nav.mobile': { zh: '移动导航', en: 'Mobile navigation' },
  'nav.open': { zh: '打开导航', en: 'Open navigation' },
  'nav.close': { zh: '关闭导航', en: 'Close navigation' },
  'header.subtitle': { zh: '工业邮件终端', en: 'INDUSTRIAL MAIL TERMINAL' },
  'header.demo': { zh: '演示 / MOCK 数据', en: 'DEMO / MOCK DATA' },
  'shell.note': { zh: 'MOCK 数据源 / 03 节点 / 实时索引', en: 'MOCK FEED / 03 NODES / REALTIME INDEX' },

  'status.node': { zh: '节点', en: 'NODE' },
  'status.index': { zh: '索引', en: 'INDEX' },
  'status.unread': { zh: '未读', en: 'UNREAD' },
  'status.links': { zh: '链路', en: 'LINKS' },
  'status.filter': { zh: '筛选', en: 'FILTER' },
  'status.all': { zh: '全部', en: 'ALL' },
  'status.syncing': { zh: '同步进行中', en: 'SYNC IN PROGRESS' },
  'status.idle': { zh: '同步空闲', en: 'SYNC IDLE' },
  'status.busy': { zh: '忙碌', en: 'BUSY' },
  'status.ready': { zh: '就绪', en: 'READY' },

  'boot.phase1': { zh: '阶段 01 / 系统初始化', en: 'PHASE 01 / SYSTEM INITIALIZATION' },
  'boot.phase2': { zh: '阶段 02 / 通讯网络', en: 'PHASE 02 / COMMUNICATION NETWORK' },
  'boot.phase3': { zh: '阶段 03 / 邮件节点同步', en: 'PHASE 03 / MAIL NODE SYNCHRONIZATION' },
  'boot.brand': { zh: 'MAIL CONTROL SYSTEM', en: 'MAIL CONTROL SYSTEM' },
  'boot.label': { zh: '启动序列', en: 'BOOT SEQUENCE' },

  'node.status.connected': { zh: '已连接', en: 'CONNECTED' },
  'node.status.syncing': { zh: '同步中', en: 'SYNCING' },
  'node.status.disconnected': { zh: '离线', en: 'OFFLINE' },
  'node.status.error': { zh: '故障', en: 'ERROR' },
  'node.linked': { zh: '已接入', en: 'LINKED' },
  'node.establishing': { zh: '正在建立链路', en: 'ESTABLISHING LINKS' },
  'node.connecting': { zh: '正在连接节点', en: 'CONNECTING NODES' },
  'node.syncAll': { zh: '同步全部节点', en: 'SYNC ALL NODES' },
  'node.sync': { zh: '同步', en: 'SYNC' },
  'node.active': { zh: '在线', en: 'ACTIVE' },
  'node.standby': { zh: '待机', en: 'STANDBY' },
  'node.msg': { zh: '邮件', en: 'MSG' },
  'node.unread': { zh: '未读', en: 'UNREAD' },

  'index.records': { zh: '{n} 条记录', en: '{n} RECORDS' },
  'index.column.id': { zh: '编号', en: 'ID' },
  'index.column.time': { zh: '时间', en: 'TIME' },
  'index.column.node': { zh: '节点', en: 'NODE' },
  'index.column.sender': { zh: '发件人', en: 'SENDER' },
  'index.column.subject': { zh: '主题', en: 'SUBJECT' },
  'index.column.status': { zh: '状态', en: 'STATUS' },
  'index.loadMore': { zh: '再加载 {n} 条（剩余 {m} 条）', en: 'LOAD {n} MORE OF {m} REMAINING' },
  'index.end': { zh: '索引结束', en: 'END OF INDEX' },

  'search.placeholder': { zh: '搜索主题 / 发件人 / 正文', en: 'SEARCH SUBJECT / SENDER / BODY' },
  'search.aria': { zh: '搜索邮件', en: 'Search messages' },
  'search.clear': { zh: '清空搜索', en: 'Clear search' },
  'search.hits': { zh: '命中 {n} 条', en: '{n} HITS' },
  'filter.active': {
    zh: '筛选生效 —— 显示 {n} / 共 {m} 条',
    en: 'FILTER ACTIVE — {n} OF {m} RECORDS SHOWN',
  },
  'filter.indexError': { zh: '索引读取失败', en: 'INDEX READ FAILURE' },
  'filter.read.aria': { zh: '已读状态', en: 'Read state' },
  'filter.node.aria': { zh: '节点筛选', en: 'Node filter' },
  'filter.label.aria': { zh: '标签筛选', en: 'Label filter' },
  'filter.sort.aria': { zh: '排序方式', en: 'Sort by' },
  'filter.all': { zh: '全部', en: 'ALL' },
  'filter.unread': { zh: '未读', en: 'UNREAD' },
  'filter.read': { zh: '已读', en: 'READ' },
  'filter.allNodes': { zh: '全部节点', en: 'ALL NODES' },
  'filter.allLabels': { zh: '全部标签', en: 'ALL LABELS' },
  'filter.sort.timeDesc': { zh: '按时间 ↓', en: 'TIME ↓' },
  'filter.sort.timeAsc': { zh: '按时间 ↑', en: 'TIME ↑' },
  'filter.sort.sender': { zh: '按发件人', en: 'SENDER' },
  'filter.sort.subject': { zh: '按主题', en: 'SUBJECT' },
  'filter.starred': { zh: '星标', en: 'STARRED' },
  'filter.files': { zh: '附件', en: 'FILES' },
  'filter.reset': { zh: '重置', en: 'RESET' },

  'label.verification': { zh: '验证码', en: 'VERIFICATION' },
  'label.security': { zh: '安全', en: 'SECURITY' },
  'label.order': { zh: '订单', en: 'ORDER' },
  'label.billing': { zh: '账单', en: 'BILLING' },
  'label.github': { zh: 'GitHub', en: 'GITHUB' },
  'label.notification': { zh: '通知', en: 'NOTIFICATION' },
  'label.newsletter': { zh: '资讯', en: 'NEWSLETTER' },
  'label.personal': { zh: '个人', en: 'PERSONAL' },

  'row.attachment': { zh: '含附件', en: 'Has attachment' },
  'row.star.add': { zh: '添加星标', en: 'Add star' },
  'row.star.remove': { zh: '取消星标', en: 'Remove star' },
  'row.markRead': { zh: '标记为已读', en: 'Mark as read' },
  'row.markUnread': { zh: '标记为未读', en: 'Mark as unread' },

  'time.yesterday': { zh: '昨天', en: 'YESTERDAY' },
  'time.justNow': { zh: '刚刚', en: 'JUST NOW' },
  'time.minutesAgo': { zh: '{n} 分钟前', en: '{n} MIN AGO' },
  'time.hoursAgo': { zh: '{n} 小时前', en: '{n} H AGO' },
  'time.daysAgo': { zh: '{n} 天前', en: '{n} D AGO' },
  'time.monthsAgo': { zh: '{n} 个月前', en: '{n} MO AGO' },

  'states.loadingIndex': { zh: '正在读取消息索引', en: 'FETCHING MESSAGE INDEX' },
  'states.indexError': { zh: '索引读取失败', en: 'INDEX READ FAILURE' },
  'states.connectionLost': { zh: '连接中断', en: 'CONNECTION LOST' },
  'states.retry': { zh: '重试读取', en: 'RETRY READ' },
  'states.linkFailure': { zh: '链路故障', en: 'LINK FAILURE' },
  'states.initializing': { zh: '系统初始化中', en: 'SYSTEM INITIALIZING' },

  'empty.node.title': { zh: '该节点当前没有邮件记录', en: 'This node has no message records' },
  'empty.node.detail': {
    zh: '尝试同步节点，或切换到其他通讯节点查看。',
    en: 'Sync this node, or switch to another communication node.',
  },
  'empty.filter.title': { zh: '当前筛选条件下没有记录', en: 'No records match the current filters' },
  'empty.filter.detail': {
    zh: '放宽筛选范围，或清空查询条件重新读取整个索引。',
    en: 'Relax the filters, or clear the query to read the whole index again.',
  },
  'empty.filter.action': { zh: '清空筛选', en: 'RESET FILTERS' },
  'empty.detail.title': { zh: '从消息索引中选择一条记录', en: 'Select a record from the message index' },
  'empty.detail.detail': {
    zh: '索引中的任意一行都会在此展开为完整的报文读数。',
    en: 'Any row in the index expands here into the full message readout.',
  },
  'empty.index.code': { zh: '索引为空', en: 'INDEX EMPTY' },
  'empty.filter.code': { zh: '无匹配记录', en: 'NO MATCHING RECORDS' },
  'empty.detail.code': { zh: '未选择记录', en: 'NO RECORD SELECTED' },

  'detail.loading': { zh: '正在读取报文记录', en: 'READING MESSAGE RECORD' },
  'detail.error': { zh: '报文读取失败', en: 'RECORD READ FAILURE' },
  'detail.unavailable': { zh: '报文不可用', en: 'RECORD UNAVAILABLE' },
  'detail.read': { zh: '已读', en: 'READ' },
  'detail.unread': { zh: '未读', en: 'UNREAD' },
  'detail.back': { zh: '索引', en: 'INDEX' },
  'detail.star': { zh: '星标', en: 'STAR' },
  'detail.starred': { zh: '已星标', en: 'STARRED' },
  'detail.markRead': { zh: '标记为已读', en: 'MARK READ' },
  'detail.markUnread': { zh: '标记为未读', en: 'MARK UNREAD' },
  'detail.archive': { zh: '归档', en: 'ARCHIVE' },
  'detail.delete': { zh: '删除', en: 'DELETE' },
  'detail.from': { zh: '发件人', en: 'FROM' },
  'detail.to': { zh: '收件人', en: 'TO' },
  'detail.date': { zh: '日期', en: 'DATE' },
  'detail.record': { zh: '记录', en: 'RECORD' },
  'detail.attachment': { zh: '附件', en: 'ATTACHMENT' },
  'detail.delete.title': { zh: '删除记录', en: 'DELETE RECORD' },
  'detail.delete.cancel': { zh: '取消', en: 'CANCEL' },
  'detail.delete.confirm': { zh: '确认删除', en: 'CONFIRM DELETE' },
  'detail.delete.body': {
    zh: '该记录将被移入回收站，索引中不再显示。是否继续？',
    en: 'This record will be moved to TRASH and hidden from the index. Continue?',
  },
  'detail.delete.closeInstead': { zh: '改为关闭记录', en: 'CLOSE RECORD INSTEAD' },

  'verify.panel.title': { zh: '系统授权', en: 'SYSTEM AUTHORIZATION' },
  'verify.expired': { zh: '验证码已过期', en: 'CODE EXPIRED' },
  'verify.valid': { zh: '验证码有效', en: 'CODE VALID' },
  'verify.noExpiry': { zh: '未声明有效期', en: 'NO EXPIRY DECLARED' },
  'verify.code': { zh: '验证码', en: 'VERIFICATION CODE' },
  'verify.copied': { zh: '已复制验证码', en: 'CODE COPIED' },
  'verify.copy': { zh: '复制验证码', en: 'COPY CODE' },
  'attach.title': { zh: '附件', en: 'ATTACHMENTS' },
  'attach.files': { zh: '{n} 个文件', en: '{n} FILES' },
  'attach.mock': {
    zh: 'MOCK 存储 —— 不提供内容预览',
    en: 'MOCK STORAGE — PAYLOAD PREVIEW NOT AVAILABLE',
  },

  'accounts.meta': { zh: '已登记 {n} 个节点', en: '{n} NODES REGISTERED' },
  'accounts.metric.nodes': { zh: '节点', en: 'NODES' },
  'accounts.metric.connected': { zh: '已连接', en: 'CONNECTED' },
  'accounts.metric.messages': { zh: '邮件', en: 'MESSAGES' },
  'accounts.metric.unread': { zh: '未读', en: 'UNREAD' },
  'accounts.register': { zh: '节点注册表', en: 'NODE REGISTER' },
  'accounts.restore': { zh: '恢复全部节点', en: 'RESTORE ALL NODES' },
  'accounts.header.node': { zh: '节点', en: 'NODE' },
  'accounts.header.email': { zh: '邮箱', en: 'EMAIL' },
  'accounts.header.status': { zh: '状态', en: 'STATUS' },
  'accounts.header.lastSync': { zh: '最近同步', en: 'LAST SYNC' },
  'accounts.header.messages': { zh: '邮件数', en: 'MESSAGES' },
  'accounts.header.unread': { zh: '未读', en: 'UNREAD' },
  'accounts.header.link': { zh: '链路', en: 'LINK' },
  'accounts.never': { zh: '从未同步', en: 'NEVER SYNCED' },
  'accounts.connect': { zh: '连接', en: 'CONNECT' },
  'accounts.disconnect': { zh: '断开', en: 'DISCONNECT' },
  'accounts.sync': { zh: '同步', en: 'SYNC' },
  'accounts.remove': { zh: '移除', en: 'REMOVE' },
  'accounts.empty.code': { zh: '无已连接节点', en: 'NO NODES ATTACHED' },
  'accounts.empty.title': {
    zh: '所有通讯节点都已从控制台分离',
    en: 'All communication nodes are detached from the console',
  },
  'accounts.empty.detail': {
    zh: '「恢复全部节点」会重建 Provider 并恢复全部节点及其原始记录。',
    en: 'RESTORE ALL NODES rebuilds the providers and restores every node with its original records.',
  },
  'accounts.note': {
    zh: '「移除」会把节点从控制台分离并清空其缓存读数；「恢复全部节点」可随时恢复。',
    en: 'REMOVE detaches a node from the console and clears its cached readouts; RESTORE ALL NODES brings everything back at any time.',
  },
  'accounts.remove.title': { zh: '移除节点', en: 'REMOVE NODE' },
  'accounts.remove.cancel': { zh: '取消', en: 'CANCEL' },
  'accounts.remove.confirm': { zh: '确认移除', en: 'CONFIRM REMOVE' },
  'accounts.remove.body': {
    zh: '该节点将从控制台分离，其消息缓存与索引行会立即清空。是否继续？',
    en: 'This node will be detached from the console, and its message cache and index rows will be cleared immediately. Continue?',
  },
  'accounts.remove.note': {
    zh: '该操作只影响当前会话，「恢复全部节点」可恢复全部节点。',
    en: 'This only affects the current session; RESTORE ALL NODES restores every node.',
  },

  'settings.appearance': { zh: '外观', en: 'Appearance' },
  'settings.appearance.desc': {
    zh: '密度影响索引行高与面板间距，语言影响全部界面文案。',
    en: 'Density controls index row height and panel spacing; language controls all interface copy.',
  },
  'settings.density': { zh: '读数密度', en: 'Readout density' },
  'settings.density.comfortable': { zh: '宽松', en: 'COMFORTABLE' },
  'settings.density.compact': { zh: '紧凑', en: 'COMPACT' },
  'settings.language': { zh: '界面语言', en: 'Interface language' },
  'settings.language.note': {
    zh: '界面标签与说明文案都会随该设置切换。',
    en: 'Interface labels and descriptive copy both follow this setting.',
  },
  'settings.panel.motion': { zh: '动效', en: 'MOTION' },
  'settings.panel.notifications': { zh: '通知', en: 'NOTIFICATIONS' },
  'settings.panel.reset': { zh: '重置', en: 'RESET' },
  'settings.motion': { zh: '动效', en: 'Motion' },
  'settings.motion.desc': {
    zh: '关闭后所有过渡与扫描线立即停止，与系统「减少动效」偏好取并集。',
    en: 'When off, all transitions and sweeps stop immediately, combined with the system reduce-motion preference.',
  },
  'settings.motion.enabled': { zh: '启用动效', en: 'Enable motion' },
  'settings.motion.on': { zh: '已启用', en: 'ENABLED' },
  'settings.motion.off': { zh: '已停用', en: 'DISABLED' },
  'settings.notifications': { zh: '通知', en: 'Notifications' },
  'settings.notifications.desc': {
    zh: '同步完成、节点连接等操作的右下角提示条。',
    en: 'Bottom-right notices for sync completion and node link changes.',
  },
  'settings.notifications.enabled': { zh: '启用提示条', en: 'Enable notices' },
  'settings.sync': { zh: '邮件同步', en: 'Mail sync' },
  'settings.sync.desc': {
    zh: '自动同步会按周期轮询全部已连接节点。',
    en: 'Auto sync polls every connected node on the configured interval.',
  },
  'settings.autoSync': { zh: '自动同步', en: 'Auto sync' },
  'settings.interval': { zh: '同步周期', en: 'Sync interval' },
  'settings.interval.every': { zh: '每 {n} 分钟', en: 'EVERY {n} MIN' },
  'settings.defaultProvider': { zh: '默认节点', en: 'Default node' },
  'settings.defaultProvider.desc': {
    zh: '终端启动时优先激活的通讯节点。',
    en: 'The node activated first when the terminal starts.',
  },
  'settings.reset': { zh: '恢复默认设置', en: 'Restore defaults' },
  'settings.reset.note': {
    zh: '恢复全部设置项到出厂读数，不影响节点与邮件数据',
    en: 'Restores every setting to its factory readout without touching nodes or messages.',
  },
  'settings.restore': { zh: '恢复默认', en: 'RESTORE DEFAULTS' },
  'settings.meta': { zh: '仅当前会话 / 不持久化', en: 'SESSION ONLY / NOT PERSISTED' },
  'settings.build': { zh: '构建', en: 'BUILD' },
  'settings.mode': { zh: '模式', en: 'MODE' },
  'settings.dataSource': { zh: '数据来源', en: 'DATA SOURCE' },
  'settings.persistence': { zh: '持久化', en: 'PERSISTENCE' },
  'settings.nodesAttached': { zh: '已接入节点', en: 'NODES ATTACHED' },
  'settings.recordsCached': { zh: '已缓存记录', en: 'RECORDS CACHED' },
  'settings.value.mode': { zh: '工业排版', en: 'INDUSTRIAL EDITORIAL' },
  'settings.value.dataSource': { zh: '内存 MOCK', en: 'IN-MEMORY MOCK' },
  'settings.value.persistence': { zh: '无 / 会话级', en: 'NONE / SESSION' },
  'settings.metric.density': { zh: '密度', en: 'DENSITY' },
  'settings.metric.language': { zh: '语言', en: 'LANGUAGE' },
  'settings.metric.motion': { zh: '动效', en: 'MOTION' },
  'settings.system': { zh: '系统信息', en: 'System information' },
  'settings.system.desc': {
    zh: '构建版本、数据来源与存储读数的当前状态。',
    en: 'Build version, data source and storage readouts at a glance.',
  },

  'about.intro': {
    zh: 'MAIL CONTROL SYSTEM 是一个多节点邮件控制终端。它把三个独立邮箱账户抽象成三条「通讯节点」，在同一张消息索引里统一检索、读取与归档。',
    en: 'MAIL CONTROL SYSTEM is a multi-node mail control terminal. It abstracts three independent mailbox accounts into three communication nodes, unified into a single message index for search, reading and archiving.',
  },
  'about.label': { zh: '// 系统信息', en: '// SYSTEM INFORMATION' },
  'about.badge.multiNode': { zh: '多节点', en: 'MULTI-NODE' },
  'about.badge.mock': { zh: 'MOCK 数据源', en: 'MOCK FEED' },
  'about.badge.version': { zh: '版本 {v}', en: 'VERSION {v}' },
  'about.metric.nodes': { zh: '节点', en: 'NODES' },
  'about.metric.records': { zh: '记录', en: 'RECORDS' },
  'about.metric.providers': { zh: '服务商', en: 'PROVIDERS' },
  'about.metric.build': { zh: '构建', en: 'BUILD' },
  'about.stack': { zh: '技术栈', en: 'Stack' },
  'about.stack.body': {
    zh: 'React 19 + TypeScript + Vite。样式使用 Tailwind v4 的 @theme 令牌与一层工业原语；动效使用 Motion 与 GSAP；状态使用 Zustand；路由使用 React Router。',
    en: 'React 19 + TypeScript + Vite. Styling uses Tailwind v4 @theme tokens plus one layer of industrial primitives. Motion runs on Motion and GSAP, state on Zustand, routing on React Router.',
  },
  'about.data': { zh: '数据来源', en: 'Data source' },
  'about.data.body': {
    zh: '当前接入的是内存态 Mock Provider，共 63 封真实业务邮件，覆盖验证码、安全告警、账单、订单、物流、资讯与个人往来。所有链路延迟都被刻意模拟。',
    en: 'The terminal currently runs an in-memory mock provider with 63 realistic messages covering verification codes, security alerts, billing, orders, logistics, newsletters and personal mail. Every link latency is simulated.',
  },
  'about.design': { zh: '设计约定', en: 'Design rules' },
  'about.design.body': {
    zh: '全直角、零圆角。纸与墨为主色，黄色只作信号色。数字一律等宽，信息密度优先于留白。所有动效在 prefers-reduced-motion 下立即停止。',
    en: 'Right angles only, zero radius. Paper and ink dominate; yellow is reserved strictly as a signal colour. All numerals are tabular, and information density beats whitespace. Every animation stops under prefers-reduced-motion.',
  },
  'about.controls': { zh: '操作说明', en: 'Controls' },
  'about.controls.body': {
    zh: '在控制台点击左侧节点可筛选索引；点击索引中的记录会标记为已读并展开详情；验证码邮件会在详情顶部展开授权面板，可一键复制并显示有效期倒计时。',
    en: 'Click a node on the left of the console to filter the index. Clicking a record marks it read and opens the detail. Verification mail expands an authorization panel with one-click copy and a live validity countdown.',
  },
  'about.build.label': { zh: '// 构建指纹', en: '// BUILD FINGERPRINT' },
  'about.runtime': { zh: '运行时', en: 'RUNTIME' },
  'about.styling': { zh: '样式', en: 'STYLING' },
  'about.state': { zh: '状态', en: 'STATE' },
  'about.storage': { zh: '存储', en: 'STORAGE' },

  'notfound.label': { zh: '// 未注册路由', en: '// ROUTE NOT REGISTERED' },
  'notfound.title': {
    zh: '该路径不在控制台的路由表中',
    en: 'This path is not registered in the console route table',
  },
  'notfound.detail': {
    zh: '请求坐标未找到 / 返回控制台',
    en: 'REQUESTED COORDINATE NOT FOUND / RETURN TO CONSOLE',
  },
  'notfound.action': { zh: '返回控制台', en: 'RETURN TO CONSOLE' },

  'console.step.nodes': { zh: '01 节点', en: '01 NODES' },
  'console.step.index': { zh: '02 索引', en: '02 INDEX' },
  'console.step.detail': { zh: '03 详情', en: '03 DETAIL' },

  'modal.close': { zh: '关闭', en: 'CLOSE' },
  'modal.closeOverlay': { zh: '关闭遮罩', en: 'CLOSE OVERLAY' },

  'toast.close': { zh: '关闭提示', en: 'Close notice' },
  'toast.syncComplete': { zh: '节点 {seq} 同步完成', en: 'NODE {seq} SYNC COMPLETE' },
  'toast.syncFailed': { zh: '节点 {seq} 同步失败', en: 'NODE {seq} SYNC FAILED' },
  'toast.syncDetail': { zh: '{count} 封邮件 / {ms} 毫秒', en: '{count} MESSAGES / {ms} MS' },
  'toast.connected': { zh: '节点 {seq} 已连接', en: 'NODE {seq} CONNECTED' },
  'toast.disconnected': { zh: '节点 {seq} 已断开', en: 'NODE {seq} DISCONNECTED' },
  'toast.removed': { zh: '节点 {name} 已移除', en: 'NODE {name} REMOVED' },
  'toast.detached': { zh: '已从控制台分离', en: 'DETACHED FROM CONSOLE' },
  'toast.restored': { zh: '节点已恢复', en: 'NODES RESTORED' },
  'toast.restoredDetail': {
    zh: '{n} 个通讯节点已重连',
    en: '{n} COMMUNICATION NODES RECONNECTED',
  },
  'error.messageNotFound': { zh: '未找到该报文', en: 'MESSAGE NOT FOUND' },
} as const satisfies Record<string, Entry>

export type MessageKey = keyof typeof DICT

function interpolate(text: string, params?: MessageParams): string {
  if (!params) return text
  return text.replace(/\{(\w+)\}/g, (token, name: string) => {
    const value = params[name]
    return value === undefined ? token : String(value)
  })
}

export function translate(
  language: DictLanguage,
  key: MessageKey,
  params?: MessageParams,
): string {
  return interpolate(DICT[key][language], params)
}
