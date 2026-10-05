import { useSettingsStore } from '../store'
import { useMediaQuery } from './useMediaQuery'

/**
 * 最终是否「减少动效」：终端开关与系统偏好取并集。
 * 关闭动画开关后，SignalSweep / AnimatedList / DecryptedText 等
 * 都会退化到静态呈现，而不是变成另一套动画。
 */
export function useReducedMotionPref(): boolean {
  const motionEnabled = useSettingsStore((state) => state.motionEnabled)
  const systemPrefersReduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  return !motionEnabled || systemPrefersReduced
}
