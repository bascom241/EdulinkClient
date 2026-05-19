import React from 'react'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'white'
  fullScreen?: boolean
  message?: string
}

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  color = 'primary',
  fullScreen = false,
  message,
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }

  const colorClasses = {
    primary: 'border-primary-200 border-t-primary-700',
    white: 'border-white border-opacity-30 border-t-white',
  }

  const loader = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full border-4 animate-spin`}
      />
      {message && <p className={`text-sm ${color === 'white' ? 'text-white' : 'text-neutral-600'}`}>{message}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-neutral-900 bg-opacity-50 z-50">
        {loader}
      </div>
    )
  }

  return loader
}

export default Loader
