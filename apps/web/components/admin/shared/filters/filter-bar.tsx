'use client'

import { memo } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SearchInput } from './search-input'

export interface FilterOption {
  value: string
  label: string
}

export interface Filter {
  key: string
  label: string
  type: 'select' | 'multiselect' | 'search'
  options?: FilterOption[]
  value?: string | string[] | number
}

export interface FilterBarProps {
  filters: Filter[]
  values: Record<string, string | string[] | number>
  onChange: (key: string, value: string | string[] | number) => void
  onClear: () => void
  searchKey?: string
  searchPlaceholder?: string
  className?: string
}

export const FilterBar = memo(function FilterBar({
  filters,
  values,
  onChange,
  onClear,
  searchKey,
  searchPlaceholder,
  className,
}: FilterBarProps) {
  const hasActiveFilters =
    Object.values(values).some((v) =>
      Array.isArray(v) ? v.length > 0 : v !== undefined && v !== ''
    ) || false

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Row */}
      {searchKey && (
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <SearchInput
              value={values[searchKey] || ''}
              onChange={(val) => onChange(searchKey, val)}
              placeholder={searchPlaceholder}
            />
          </div>
          {hasActiveFilters && (
            <button
              onClick={onClear}
              className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <X className="h-4 w-4" />
              Xóa bộ lọc
            </button>
          )}
        </div>
      )}

      {/* Filter Row */}
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <div key={filter.key} className="flex-1 min-w-[200px]">
            <label className="mb-1 block text-xs font-medium text-slate-700">
              {filter.label}
            </label>
            {filter.type === 'select' && (
              <select
                value={values[filter.key] || ''}
                onChange={(e) => onChange(filter.key, e.target.value)}
                className={cn(
                  'h-10 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm',
                  'focus:border-[#0284C7] focus:outline-none focus:ring-1 focus:ring-[#0284C7]',
                  'transition-colors'
                )}
              >
                <option value="">Tất cả</option>
                {filter.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  )
})
