import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
  href?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, href, children, ...props }, ref) => {
    // If asChild and href are provided, render as a Link component
    if (asChild && href) {
      return (
        <a
          href={href}
          className={cn(
            'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
            {
              'bg-sky-600 text-white hover:bg-sky-700': variant === 'default',
              'bg-red-600 text-white hover:bg-red-700': variant === 'destructive',
              'border border-gray-300 bg-white hover:bg-gray-100': variant === 'outline',
              'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
              'hover:bg-gray-100 hover:text-gray-900': variant === 'ghost',
              'text-sky-600 underline-offset-4 hover:underline': variant === 'link',
              'h-10 px-4 py-2': size === 'default',
              'h-9 rounded-md px-3': size === 'sm',
              'h-11 rounded-md px-8': size === 'lg',
              'h-10 w-10': size === 'icon',
            },
            className
          )}
          {...(props as any)}
        >
          {children}
        </a>
      )
    }

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-sky-600 text-white hover:bg-sky-700': variant === 'default',
            'bg-red-600 text-white hover:bg-red-700': variant === 'destructive',
            'border border-gray-300 bg-white hover:bg-gray-100': variant === 'outline',
            'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
            'hover:bg-gray-100 hover:text-gray-900': variant === 'ghost',
            'text-sky-600 underline-offset-4 hover:underline': variant === 'link',
            'h-10 px-4 py-2': size === 'default',
            'h-9 rounded-md px-3': size === 'sm',
            'h-11 rounded-md px-8': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }
