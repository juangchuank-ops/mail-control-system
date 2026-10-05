import { cn } from '../../lib/cn'
import { useT } from '../../hooks'
import { hasActiveFilters } from '../../lib/mail-query'
import { PROVIDER_IDS, useMailStore } from '../../store'
import { FilterBar } from './FilterBar'
import { SearchBar } from './SearchBar'

/** MESSAGE INDEX 工具条：搜索 + 筛选 + 排序 */
export function MessageToolbar({ className }: { className?: string }) {
  const t = useT()
  const query = useMailStore((state) => state.query)
  const nodeMessages = useMailStore((state) => state.nodeMessages)
  const indexMessages = useMailStore((state) => state.indexMessages)
  const indexStatus = useMailStore((state) => state.indexStatus)
  const setQuery = useMailStore((state) => state.setQuery)
  const resetQuery = useMailStore((state) => state.resetQuery)

  const filtering = hasActiveFilters(query)
  const total = PROVIDER_IDS.reduce(
    (count, id) => count + (nodeMessages[id]?.length ?? 0),
    0,
  )

  return (
    <div className={cn('flex flex-col gap-2.5 border-b border-line p-3', className)}>
      <SearchBar
        value={query.search}
        resultCount={indexMessages.length}
        onChange={(next) => {
          setQuery({ search: next })
        }}
      />
      <FilterBar query={query} onChange={setQuery} onReset={resetQuery} />
      {filtering ? (
        <p className="mcs-label">
          {t('filter.active', { n: indexMessages.length, m: total })}
        </p>
      ) : null}
      {indexStatus === 'error' ? (
        <p className="mcs-label text-danger">{t('filter.indexError')}</p>
      ) : null}
    </div>
  )
}
