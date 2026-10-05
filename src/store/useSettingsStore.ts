import { create } from 'zustand'
import type { ProviderId } from '../types'

/**
 * 终端设置。不做持久化，避免 SSR / JSON 兼容问题；
 * 所有设置项都是纯内存状态，刷新即恢复默认。
 */

export type Density = 'comfortable' | 'compact'
export type Language = 'zh' | 'en'

export interface SettingsValues {
  /** comfortable = 宽松读数行高，compact = 密集读数 */
  density: Density
  language: Language
  /** 关闭后全局禁用动画（与系统 prefers-reduced-motion 取并集） */
  motionEnabled: boolean
  notificationsEnabled: boolean
  autoSync: boolean
  /** 自动同步周期（分钟） */
  syncIntervalMinutes: number
  defaultProvider: ProviderId
}

const DEFAULTS: SettingsValues = {
  density: 'comfortable',
  language: 'zh',
  motionEnabled: true,
  notificationsEnabled: true,
  autoSync: false,
  syncIntervalMinutes: 15,
  defaultProvider: 'gmail',
}

interface SettingsState extends SettingsValues {
  update: (patch: Partial<SettingsValues>) => void
  reset: () => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  ...DEFAULTS,
  update: (patch) => {
    set(patch)
  },
  reset: () => {
    set(DEFAULTS)
  },
}))

export const SETTINGS_DEFAULTS = DEFAULTS
