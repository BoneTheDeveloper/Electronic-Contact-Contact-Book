'use client'

import { cn } from '@/lib/utils'

export interface SecondaryButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  fullWidth?: boolean
  size?: 'small' | 'medium' | 'large'
  className?: string
}

const sizeClasses = {
  small: 'h-10 px-4 text-xs',
  medium: 'h-12 px-6 text-sm',
  large: 'h-14 px-8 text-base',
}

export function SecondaryButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
  size = 'medium',
  className,
}: SecondaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-lg',
        'border-2 border-[#0284C7] bg-white font-bold uppercase tracking-wider text-[#0284C7]',
        'transition-all duration-200',
        'hover:bg-slate-50',
        'focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        fullWidth && 'w-full',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </button>
  )
}
