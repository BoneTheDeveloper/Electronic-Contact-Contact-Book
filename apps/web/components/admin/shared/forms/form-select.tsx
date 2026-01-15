'use client'

import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'

export interface FormSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface FormSelectProps {
  name: string
  label: string
  options: FormSelectOption[]
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export function FormSelect({
  name,
  label,
  options,
  placeholder,
  required = false,
  disabled = false,
  className,
}: FormSelectProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const error = errors[name]

  return (
    <div className={cn('form-group', className)}>
      <label
        htmlFor={name}
        className="mb-1 block text-xs font-medium text-slate-700"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <select
        id={name}
        disabled={disabled}
        className={cn(
          'h-12 w-full rounded-lg border px-3 py-2 text-sm transition-colors',
          'focus:border-[#0284C7] focus:outline-none focus:ring-1 focus:ring-[#0284C7]',
          error
            ? 'border-red-500'
            : 'border-slate-300 hover:border-slate-400',
          disabled && 'cursor-not-allowed bg-slate-100'
        )}
        {...register(name)}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error.message?.toString()}
        </p>
      )}
    </div>
  )
}
