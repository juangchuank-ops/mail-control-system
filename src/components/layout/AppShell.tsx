import type { ReactNode } from 'react'
import { useT } from '../../hooks'
import { ClickSpark } from '../motion'
import { CropMarks, GridBackdrop } from '../hud'
import { ToastViewport } from '../ui'
import { SystemHeader } from './SystemHeader'
import { StatusBar } from './StatusBar'

/**
 * 应用外壳：
 *  - 顶栏 56px / 底栏 28px / 中间内容区
 *  - 全局工程网格背景 + 视口裁切标记 + 右侧纵向注记
 *  - 点击信号火花（reduced-motion 下自动禁用）
 */
export function AppShell({ children }: { children: ReactNode }) {
  const t = useT()

  return (
    <div className="relative flex min-h-screen flex-col bg-surface-0">
      <GridBackdrop className="fixed inset-0" />
      <CropMarks />

      <div
        className="pointer-events-none fixed top-1/2 right-2 z-[var(--z-hud)] hidden -translate-y-1/2 lg:block"
        aria-hidden="true"
      >
        <span
          className="mcs-label"
          style={{ writingMode: 'vertical-rl', letterSpacing: '0.32em' }}
        >
          {t('shell.note')}
        </span>
      </div>

      <SystemHeader />

      <ClickSpark className="relative z-[var(--z-base)] flex flex-1 flex-col">
        <main className="flex flex-1 flex-col">{children}</main>
      </ClickSpark>

      <StatusBar />
      <ToastViewport />
    </div>
  )
}
