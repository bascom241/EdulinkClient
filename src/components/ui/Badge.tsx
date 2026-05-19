import React from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  size?: 'sm' | 'md'
  children: React.ReactNode
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'primary', size = 'sm', className = '', children, ...props }, ref) => {
    const variantStyles = {
      primary: 'bg-primary-100 text-primary-800',
      secondary: 'bg-neutral-100 text-neutral-800',
      success: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      info: 'bg-blue-100 text-blue-800',
    }

    const sizeStyles = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
    }

    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center font-medium rounded-full
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge
