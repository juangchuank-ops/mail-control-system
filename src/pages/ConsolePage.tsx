import { useEffect, useRef, useState } from 'react'
import { CommunicationNodes, MessageDetail, MessageIndex } from '../components/mail'
import { useT } from '../hooks'
import { cn } from '../lib/cn'
import type { MessageKey } from '../lib/i18n'
import { useMailStore } from '../store'

type Step = 'nodes' | 'index' | 'detail'

const STEPS: ReadonlyArray<{ value: Step; label: MessageKey }> = [
  { value: 'nodes', label: 'console.step.nodes' },
  { value: 'index', label: 'console.step.index' },
  { value: 'detail', label: 'console.step.detail' },
]

/**
 * 控制台：桌面三栏（节点 / 索引 / 详情），窄屏按步骤切换。
 * 窄屏不是「手机版仪表盘」，而是把同一条工作流拆成 01 → 02 → 03 三段。
 */
export function ConsolePage() {
  const t = useT()
  const activeNodeId = useMailStore((state) => state.activeNodeId)
  const selectedMessageId = useMailStore((state) => state.selectedMessageId)
  const [step, setStep] = useState<Step>('nodes')

  const previousNode = useRef(activeNodeId)
  const previousMessage = useRef(selectedMessageId)

  useEffect(() => {
    if (previousNode.current === activeNodeId) return
    previousNode.current = activeNodeId
    setStep('index')
  }, [activeNodeId])

  useEffect(() => {
    if (previousMessage.current === selectedMessageId) return
    previousMessage.current = selectedMessageId
    if (selectedMessageId) setStep('detail')
  }, [selectedMessageId])

  return (
    <div
      className="flex flex-col"
      style={{ height: 'calc(100dvh - var(--header-h) - var(--statusbar-h))' }}
    >
      <div className="flex items-stretch border-b border-line bg-panel-0 lg:hidden">
        {STEPS.map((entry) => (
          <button
            key={entry.value}
            type="button"
            aria-pressed={step === entry.value}
            onClick={() => {
              setStep(entry.value)
            }}
            className={cn(
              'mcs-label flex-1 border-r border-line py-2.5 transition-colors duration-[var(--motion-ui)]',
              step === entry.value ? 'bg-panel-1 text-signal' : 'text-ink-2',
            )}
          >
            {t(entry.label)}
          </button>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[var(--rail-w)_var(--index-w)_minmax(0,1fr)]">
        <CommunicationNodes
          className={cn('border-r', step !== 'nodes' && 'hidden lg:flex')}
        />
        <MessageIndex className={cn('border-r', step !== 'index' && 'hidden lg:flex')} />
        <MessageDetail
          className={cn(step !== 'detail' && 'hidden lg:flex')}
          onBack={() => {
            setStep('index')
          }}
        />
      </div>
    </div>
  )
}
