import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type ButtonVariant = 'default' | 'signal' | 'danger' | 'ghost'
export type ButtonSize = 'md' | 'sm'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** 切角（工业主按钮常用） */
  cut?: boolean
  /** 忙碌态：显示闪烁方块并禁用交互 */
  busy?: boolean
  children?: ReactNode
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  default: '',
  signal: 'mcs-btn--signal',
  danger: 'mcs-btn--danger',
  ghost: 'mcs-btn--ghost',
}

export function Button({
  variant = 'default',
  size = 'md',
  cut = false,
  busy = false,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'mcs-btn',
        VARIANT_CLASS[variant],
        size === 'sm' && 'mcs-btn--sm',
        cut && 'mcs-cut-br',
        className,
      )}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      {...rest}
    >
      {busy ? (
        <span className="mcs-blink inline-block h-2 w-2 bg-current" aria-hidden="true" />
      ) : null}
      {children}
    </button>
  )
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 无障碍名称，必填 */
  label: string
  variant?: ButtonVariant
  children?: ReactNode
}

export function IconButton({
  label,
  variant = 'ghost',
  className,
  children,
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn('mcs-btn mcs-btn--icon', VARIANT_CLASS[variant], className)}
      {...rest}
    >
      {children}
    </button>
  )
}
