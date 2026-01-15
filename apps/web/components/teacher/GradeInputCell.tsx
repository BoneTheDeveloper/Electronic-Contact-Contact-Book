'use client'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface GradeInputCellProps {
  value?: number
  onChange: (value: number | undefined) => void
  disabled?: boolean
  min?: number
  max?: number
  step?: number
  placeholder?: string
  className?: string
  locked?: boolean
}

export function GradeInputCell({
  value,
  onChange,
  disabled = false,
  min = 0,
  max = 10,
  step = 0.25,
  placeholder = '-',
  className,
  locked = false,
}: GradeInputCellProps) {
  const [inputValue, setInputValue] = useState<string>(
    value !== undefined ? value.toString() : ''
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setInputValue(value !== undefined ? value.toString() : '')
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    // Allow empty input
    if (newValue.trim() === '') {
      onChange(undefined)
      setError(null)
      return
    }

    // Validate number
    const numValue = parseFloat(newValue)

    if (isNaN(numValue)) {
      setError('Không hợp lệ')
      return
    }

    if (numValue < min || numValue > max) {
      setError(`Phải từ ${min} đến ${max}`)
      return
    }

    // Round to step precision
    const steppedValue = Math.round(numValue / step) * step

    setError(null)
    onChange(steppedValue)
  }

  const handleBlur = () => {
    if (inputValue.trim() === '' || isNaN(parseFloat(inputValue))) {
      setInputValue('')
      setError(null)
    } else {
      const numValue = parseFloat(inputValue)
      if (numValue >= min && numValue <= max) {
        const steppedValue = Math.round(numValue / step) * step
        setInputValue(steppedValue.toString())
      }
    }
  }

  // Get grade color based on value
  const getGradeColor = (val: number) => {
    if (val >= 9) return 'text-green-600 font-semibold'
    if (val >= 8) return 'text-blue-600 font-semibold'
    if (val >= 6.5) return 'text-yellow-600'
    if (val >= 5) return 'text-orange-600'
    return 'text-red-600 font-semibold'
  }

  return (
    <div className="relative">
      <Input
        type="number"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled || locked}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        className={cn(
          'w-20 h-10 text-center font-mono font-bold text-sm',
          !disabled && !locked && 'focus:ring-2 focus:ring-blue-500',
          error && 'border-red-500 focus:ring-red-500',
          value !== undefined && !error && getGradeColor(parseFloat(inputValue)),
          locked && 'bg-slate-100 text-slate-500 cursor-not-allowed',
          className
        )}
        aria-label={`Grade input ${error ? '- ' + error : ''}`}
      />
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg
            className="h-4 w-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
      )}
      {error && (
        <div className="absolute -bottom-5 left-0 right-0">
          <span className="text-[9px] text-red-600 font-medium block text-center">
            {error}
          </span>
        </div>
      )}
    </div>
  )
}

// Helper function to validate grade
export function isValidGrade(value: number, min = 0, max = 10): boolean {
  return !isNaN(value) && value >= min && value <= max
}

// Helper function to format grade for display
export function formatGrade(value: number | undefined): string {
  if (value === undefined) return '-'
  return value % 1 === 0 ? value.toString() : value.toFixed(2)
}
