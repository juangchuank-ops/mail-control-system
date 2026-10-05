import { useEffect, useState } from 'react'
import { remainingSeconds } from '../lib/verification'
import { useInterval } from './useInterval'

/**
 * 验证码有效期倒计时（秒）。
 * expiresAt 为空时返回 null（表示该邮件没有声明有效期）。
 */
export function useCountdown(expiresAt: number | undefined): number | null {
  const [now, setNow] = useState(() => Date.now())

  useInterval(() => setNow(Date.now()), expiresAt ? 1000 : null)

  useEffect(() => {
    setNow(Date.now())
  }, [expiresAt])

  return remainingSeconds(expiresAt, now)
}
