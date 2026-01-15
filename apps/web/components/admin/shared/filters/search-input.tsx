'use client'

import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  debounceMs?: number
  className?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
  debounceMs = 300,
  className,
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [localValue, debounceMs, onChange])

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'h-10 w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-sm',
          'placeholder:text-slate-400',
          'focus:border-[#0284C7] focus:outline-none focus:ring-1 focus:ring-[#0284C7]',
          'transition-colors'
        )}
      />
    </div>
  )
}
