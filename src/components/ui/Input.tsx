import { useEffect, useId, useRef, useState } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 左侧内嵌注记（如搜索前缀） */
  prefix?: string
}

export function Input({ className, prefix, ...rest }: InputProps) {
  if (!prefix) return <input className={cn('mcs-input', className)} {...rest} />
  return (
    <div className="relative flex items-center">
      <span className="mcs-label pointer-events-none absolute left-2.5">{prefix}</span>
      <input className={cn('mcs-input pl-8', className)} {...rest} />
    </div>
  )
}

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  options: readonly SelectOption[]
  value: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
  'aria-label'?: string
}

/**
 * 工业风下拉选择。
 *
 * 不使用原生 <select>：它的弹出层由操作系统绘制（蓝色高亮、圆角、系统字体），
 * CSS 无法覆盖，与全直角的工业观感直接冲突。这里用自定义 listbox 复刻同一套
 * 「细线分隔 + 等宽字 + 信号黄」语言，并保留键盘操作。
 */
export function Select({
  options,
  value,
  onChange,
  className,
  disabled = false,
  'aria-label': ariaLabel,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const listId = useId()
  const selectedIndex = options.findIndex((option) => option.value === value)
  const current = selectedIndex >= 0 ? options[selectedIndex] : undefined

  useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const openList = () => {
    setActive(selectedIndex >= 0 ? selectedIndex : 0)
    setOpen(true)
  }

  const commit = (index: number) => {
    const option = options[index]
    if (option) onChange(option.value)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => {
          if (open) setOpen(false)
          else openList()
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            if (open) setActive((index) => Math.min(index + 1, options.length - 1))
            else openList()
          } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            if (open) setActive((index) => Math.max(index - 1, 0))
            else openList()
          } else if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            if (open) commit(active)
            else openList()
          } else if (event.key === 'Escape' && open) {
            event.preventDefault()
            setOpen(false)
          }
        }}
        className={cn(
          'mcs-input flex w-full items-center justify-between gap-3 text-left',
          open && 'border-signal',
          disabled && 'cursor-not-allowed opacity-40',
        )}
      >
        <span className="mcs-label truncate">{current?.label ?? ''}</span>
        <ChevronDown
          size={12}
          strokeWidth={1.75}
          aria-hidden="true"
          className={cn(
            'shrink-0 transition-transform duration-[var(--motion-ui)]',
            open ? 'rotate-180 text-signal' : 'text-ink-3',
          )}
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute top-full left-0 z-50 mt-px max-h-72 w-full overflow-y-auto border border-line-strong bg-panel-1"
        >
          {options.map((option, index) => {
            const selected = option.value === value
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={selected}
                onPointerEnter={() => {
                  setActive(index)
                }}
                onClick={() => {
                  commit(index)
                }}
                className={cn(
                  'mcs-label flex cursor-pointer items-center justify-between gap-2 border-b border-line px-2.5 py-2 transition-colors duration-[var(--motion-fast)] last:border-b-0',
                  index === active ? 'bg-panel-2 text-ink-0' : 'text-ink-1',
                  selected && 'text-signal',
                )}
              >
                <span className="truncate">{option.label}</span>
                {selected ? <Check size={11} strokeWidth={2} aria-hidden="true" /> : null}
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}

export interface ToggleProps {
  checked: boolean
  onChange: (next: boolean) => void
  label?: string
  disabled?: boolean
  className?: string
}

/** 直角开关：不使用圆角药丸，避免 SaaS 观感 */
export function Toggle({ checked, onChange, label, disabled = false, className }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => {
        onChange(!checked)
      }}
      className={cn(
        'inline-flex items-center gap-2',
        disabled && 'cursor-not-allowed opacity-35',
        className,
      )}
    >
      <span
        className={cn(
          'relative flex h-4 w-8 items-center border transition-colors duration-[var(--motion-ui)]',
          checked ? 'border-signal bg-signal' : 'border-line-strong bg-surface-1',
        )}
      >
        <span
          className={cn(
            'absolute top-px h-[12px] w-[12px] transition-transform duration-[var(--motion-ui)]',
            checked ? 'translate-x-[16px] bg-surface-0' : 'translate-x-[2px] bg-ink-3',
          )}
        />
      </span>
      {label ? <span className="mcs-label">{label}</span> : null}
    </button>
  )
}
