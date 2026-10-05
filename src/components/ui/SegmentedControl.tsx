import { cn } from '../../lib/cn'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
}

export interface SegmentedControlProps<T extends string> {
  options: ReadonlyArray<SegmentedOption<T>>
  value: T
  onChange: (next: T) => void
  label?: string
  className?: string
}

/** 分段读数切换：直角、激活项信号色底 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn('inline-flex border border-line', className)}
    >
      {options.map((option, index) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => {
              onChange(option.value)
            }}
            className={cn(
              'mcs-label px-2.5 py-1.5 transition-colors duration-[var(--motion-ui)]',
              index > 0 && 'border-l border-line',
              active
                ? 'bg-signal text-surface-0'
                : 'text-ink-2 hover:text-ink-0',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
