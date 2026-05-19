import React from 'react'
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react'

type AlertVariant = 'success' | 'error' | 'warning' | 'info'

interface AlertProps {
  variant?: AlertVariant
  title?: string
  message: string
  onClose?: () => void
  dismissible?: boolean
  icon?: React.ReactNode
}

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  message,
  onClose,
  dismissible = true,
  icon,
}) => {
  const variantStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      title: 'text-green-900',
      text: 'text-green-800',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      title: 'text-red-900',
      text: 'text-red-800',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      title: 'text-yellow-900',
      text: 'text-yellow-800',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-900',
      text: 'text-blue-800',
    },
  }

  const defaultIcons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  }

  const styles = variantStyles[variant]

  return (
    <div className={`${styles.bg} border ${styles.border} rounded-lg p-4 flex gap-3`}>
      <div className={`flex-shrink-0 pt-0.5 ${styles.icon}`}>
        {icon || defaultIcons[variant]}
      </div>
      <div className="flex-1">
        {title && <h3 className={`font-semibold ${styles.title}`}>{title}</h3>}
        <p className={`text-sm ${title ? 'mt-1' : ''} ${styles.text}`}>{message}</p>
      </div>
      {dismissible && (
        <button onClick={onClose} className={`flex-shrink-0 ${styles.icon} hover:opacity-75`}>
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

export default Alert
