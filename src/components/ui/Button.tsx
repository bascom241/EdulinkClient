import React from "react"

type ButtonVariant = "primary" | "secondary" | "outline" | "danger"
type ButtonSize = "sm" | "md" | "lg"
type ButtonType = "button" | "submit"

type ButtonProps = {
  children: React.ReactNode
  type?: ButtonType
  onClick?: () => void
  className?: string
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  isLoading?: boolean
  icon?: any 
  disabled?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[#3BAC51] hover:bg-[#1a5325] text-white",
  secondary: "bg-neutral-200 text-neutral-900 hover:bg-neutral-300",
  outline: "border border-neutral-300 text-neutral-900 hover:bg-neutral-100",
  danger: "bg-red-600 hover:bg-red-700 text-white",
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "py-2 px-3 text-sm",
  md: "py-2.5 px-4 text-base",
  lg: "py-3 px-5 text-lg",
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = "button",
  onClick,
  className = "",
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={`
        font-semibold rounded-md transition flex items-center justify-center gap-2
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
        ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {isLoading ? "Loading..." : children}
    </button>
  )
}

export default Button