'use client'

import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'

export interface FormFieldProps {
  name: string
  label: string
  type?: 'text' | 'email' | 'password' | 'number'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export function FormField({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  className,
}: FormFieldProps) {
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
      <input
        id={name}
        type={type}
        placeholder={placeholder}
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
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error.message?.toString()}
        </p>
      )}
    </div>
  )
}
