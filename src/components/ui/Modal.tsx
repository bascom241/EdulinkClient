import React, { useState } from 'react'
import { X } from 'lucide-react'


interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnEsc?: boolean
  closeOnBackdropClick?: boolean
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnEsc = true,
  closeOnBackdropClick = true,
}) => {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClose = () => {
    setIsAnimating(true)
    setTimeout(() => {
      onClose()
      setIsAnimating(false)
    }, 200)
  }

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, closeOnEsc])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-fast ${isAnimating ? 'opacity-0' : 'opacity-30'}`}
        onClick={closeOnBackdropClick ? handleClose : undefined}
        style={{ zIndex: 999 }}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 1000 }}
      >
        <div
          className={`
            bg-white rounded-lg shadow-xl w-full mx-4 pointer-events-auto
            transform transition-fast
            ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
            ${sizeClasses[size]}
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
              {description && <p className="text-neutral-600 text-sm mt-1">{description}</p>}
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-fast text-neutral-500 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="p-6 border-t border-neutral-200 flex gap-3 justify-end bg-neutral-50 rounded-b-lg">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Modal
