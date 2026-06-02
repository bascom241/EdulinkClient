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
    sm: 'w-9 h-9',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  }

  const loader = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-2xl bg-white p-2 shadow-lg ring-1 ring-green-100 app-logo-loader`}>
          <img src="/EdlinkLogo.png" alt="Edlink" className="h-full w-full rounded-xl object-cover" />
        </div>
        <div className="absolute -inset-2 -z-10 rounded-3xl border-2 border-green-200 border-t-green-600 animate-spin" />
      </div>
      {message && <p className={`text-sm font-medium ${color === 'white' ? 'text-white' : 'app-muted'}`}>{message}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm">
        {loader}
      </div>
    )
  }

  return loader
}

export default Loader
