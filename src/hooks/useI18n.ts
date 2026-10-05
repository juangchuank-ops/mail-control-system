import { useCallback } from 'react'
import { translate } from '../lib/i18n'
import type { MessageKey, MessageParams } from '../lib/i18n'
import { useSettingsStore } from '../store'
import type { Language } from '../store'

/** 界面文案取词钩子：返回按当前语言取词、并支持 `{name}` 插值的函数 */
export function useT(): (key: MessageKey, params?: MessageParams) => string {
  const language = useSettingsStore((state) => state.language)
  return useCallback(
    (key: MessageKey, params?: MessageParams) => translate(language, key, params),
    [language],
  )
}

/** 当前界面语言，供纯函数（如时间格式化）按语言分支 */
export function useLanguage(): Language {
  return useSettingsStore((state) => state.language)
}
