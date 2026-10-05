import { MessageDetail, MessageIndex } from '../components/mail'
import { cn } from '../lib/cn'
import { useMailStore } from '../store'

/**
 * 邮件工作台（/mail）：索引 + 详情双栏。
 * 窄屏时详情以整屏接管，返回即清空选中记录。
 */
export function MailListPage() {
  const selectedMessageId = useMailStore((state) => state.selectedMessageId)
  const selectMessage = useMailStore((state) => state.selectMessage)

  return (
    <div
      className="flex flex-col"
      style={{ height: 'calc(100dvh - var(--header-h) - var(--statusbar-h))' }}
    >
      <div className="grid min-h-0 flex-1 lg:grid-cols-[var(--index-w)_minmax(0,1fr)]">
        <MessageIndex
          className={cn('border-r', selectedMessageId && 'hidden lg:flex')}
        />
        <MessageDetail
          className={cn(!selectedMessageId && 'hidden lg:flex')}
          onBack={() => {
            void selectMessage(null)
          }}
        />
      </div>
    </div>
  )
}
