import { useEffect, useRef } from 'react'
import { MotionConfig } from 'motion/react'
import { BrowserRouter } from 'react-router-dom'
import { BootSequence } from './components/boot/BootSequence'
import { AppShell } from './components/layout'
import { useInterval } from './hooks'
import { AppRoutes } from './routes'
import { useMailStore, useSettingsStore } from './store'

/**
 * 应用根组件：
 *  - 首次挂载即建立全部通讯节点链路
 *  - 把「密度 / 动效」设置落到 documentElement，供 CSS 原语读取
 *  - 自动同步按设置周期轮询已连接节点
 */
export function App() {
  const initialize = useMailStore((state) => state.initialize)
  const initialized = useMailStore((state) => state.initialized)
  const selectNode = useMailStore((state) => state.selectNode)

  const defaultProvider = useSettingsStore((state) => state.defaultProvider)
  const density = useSettingsStore((state) => state.density)
  const motionEnabled = useSettingsStore((state) => state.motionEnabled)
  const autoSync = useSettingsStore((state) => state.autoSync)
  const syncIntervalMinutes = useSettingsStore((state) => state.syncIntervalMinutes)

  const appliedDefault = useRef(false)

  useEffect(() => {
    void initialize()
  }, [initialize])

  useEffect(() => {
    if (!initialized || appliedDefault.current) return
    appliedDefault.current = true
    selectNode(defaultProvider)
  }, [initialized, defaultProvider, selectNode])

  useEffect(() => {
    document.documentElement.dataset.density = density
  }, [density])

  useEffect(() => {
    document.documentElement.dataset.motion = motionEnabled ? 'on' : 'off'
  }, [motionEnabled])

  useInterval(
    () => {
      const { nodes, syncNode } = useMailStore.getState()
      for (const node of nodes) {
        if (node.status === 'disconnected') continue
        void syncNode(node.id)
      }
    },
    autoSync ? syncIntervalMinutes * 60_000 : null,
  )

  return (
    <MotionConfig reducedMotion={motionEnabled ? 'user' : 'always'}>
      <BrowserRouter>
        <BootSequence />
        <AppShell>
          <AppRoutes />
        </AppShell>
      </BrowserRouter>
    </MotionConfig>
  )
}
