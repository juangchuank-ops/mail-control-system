import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useT } from '../hooks'
import { Button, Panel } from '../components/ui'

/** 404：未注册的路由读数 */
export function NotFoundPage() {
  const t = useT()

  return (
    <div className="mx-auto flex w-full max-w-[640px] flex-col items-center px-4 py-20">
      <Panel className="mcs-frame w-full px-6 py-10 text-center">
        <p className="mcs-label mcs-label--signal">{t('notfound.label')}</p>
        <p
          className="mt-4 font-mono text-[72px] leading-none text-transparent select-none"
          style={{ WebkitTextStroke: '1px var(--color-line-strong)' }}
          aria-hidden="true"
        >
          404
        </p>
        <h1 className="mt-4 text-[16px] font-medium text-ink-0">{t('notfound.title')}</h1>
        <p className="mcs-num mt-3 text-[12px] text-ink-2">{t('notfound.detail')}</p>
        <div className="mt-6 flex justify-center">
          <Link to="/">
            <Button variant="signal" cut>
              <ArrowLeft size={12} strokeWidth={1.75} />
              {t('notfound.action')}
            </Button>
          </Link>
        </div>
      </Panel>
    </div>
  )
}
