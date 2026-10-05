import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MessageDetail } from '../components/mail'
import { useMailStore } from '../store'

/**
 * 单条记录页（/mail/:id）：直接把 URL 中的记录读入详情区。
 * 记录不存在时详情区显示「未选择记录」空态，返回按钮回到 /mail。
 */
export function MailDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const selectMessage = useMailStore((state) => state.selectMessage)

  useEffect(() => {
    if (!id) return
    void selectMessage(id)
  }, [id, selectMessage])

  return (
    <div
      className="flex flex-col"
      style={{ height: 'calc(100dvh - var(--header-h) - var(--statusbar-h))' }}
    >
      <MessageDetail
        className="border-x border-line lg:mx-auto lg:w-full lg:max-w-[920px]"
        onBack={() => {
          navigate('/mail')
        }}
      />
    </div>
  )
}
