import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  containerClassName?: string
  fullWidth?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      containerClassName = '',
      fullWidth = true,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-neutral-900 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">{icon}</div>}
          <input
            ref={ref}
            disabled={disabled}
            className={`
              w-full px-4 py-2.5 text-base rounded-lg border-2
              transition-fast focus:outline-none focus:ring-2 focus:ring-offset-2
              disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-500
              ${icon ? 'pl-10' : ''}
              ${
                error
                  ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-primary-700 focus:ring-primary-500'
              }
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="text-red-600 text-sm mt-1.5">{error}</p>}
        {helperText && !error && <p className="text-neutral-500 text-sm mt-1.5">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
