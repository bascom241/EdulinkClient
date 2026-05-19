import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  interactive?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', interactive = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          bg-white border border-neutral-200 rounded-lg p-6
          ${interactive ? 'transition-fast hover:shadow-md hover:border-primary-300 cursor-pointer' : 'shadow-sm'}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={`border-b border-neutral-200 pb-4 mb-4 ${className}`} {...props}>
      {children}
    </div>
  )
)

CardHeader.displayName = 'CardHeader'

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  className?: string
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className = '', ...props }, ref) => (
    <h2 ref={ref} className={`text-2xl font-bold text-neutral-900 ${className}`} {...props}>
      {children}
    </h2>
  )
)

CardTitle.displayName = 'CardTitle'

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
  className?: string
}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className = '', ...props }, ref) => (
    <p ref={ref} className={`text-neutral-600 text-sm mt-1 ${className}`} {...props}>
      {children}
    </p>
  )
)

CardDescription.displayName = 'CardDescription'

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={`${className}`} {...props}>
      {children}
    </div>
  )
)

CardContent.displayName = 'CardContent'

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={`border-t border-neutral-200 pt-4 mt-4 flex gap-3 ${className}`} {...props}>
      {children}
    </div>
  )
)

CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
export default Card
