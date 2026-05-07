import React from "react"

type ButtonProps = {
  children: React.ReactNode
  type?: "button" | "submit"
  onClick?: () => void
  className?: string   
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = "button",
  onClick,
  className = "",   
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full bg-[#3BAC51] hover:bg-[#1a5325] text-white py-3 rounded-md font-semibold ${className}`}
    >
      {children}
    </button>
  )
}

export default Button