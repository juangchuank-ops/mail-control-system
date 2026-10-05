import { Search, X } from 'lucide-react'
import { useT } from '../../hooks'
import { pad } from '../../lib/format'

export interface SearchBarProps {
  value: string
  resultCount: number
  onChange: (next: string) => void
}

export function SearchBar({ value, resultCount, onChange }: SearchBarProps) {
  const t = useT()

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex flex-1 items-center">
        <Search
          size={13}
          strokeWidth={1.75}
          className="pointer-events-none absolute left-2.5 text-ink-3"
          aria-hidden="true"
        />
        <input
          type="search"
          value={value}
          aria-label={t('search.aria')}
          placeholder={t('search.placeholder')}
          onChange={(event) => {
            onChange(event.target.value)
          }}
          className="mcs-input pr-8 pl-8"
        />
        {value ? (
          <button
            type="button"
            aria-label={t('search.clear')}
            onClick={() => {
              onChange('')
            }}
            className="absolute right-2 text-ink-3 transition-colors duration-[var(--motion-ui)] hover:text-signal"
          >
            <X size={13} strokeWidth={1.75} />
          </button>
        ) : null}
      </div>
      <span className="mcs-label shrink-0 tabular-nums">{t('search.hits', { n: pad(resultCount, 3) })}</span>
    </div>
  )
}
