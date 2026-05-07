import React from "react"

type SocialButtonProps = {
  icon: React.ReactNode
  onClick?: () => void
}

const SocialButton: React.FC<SocialButtonProps> = ({
  icon,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-full sm:w-24 h-12 bg-[#E4E4E4B2] rounded-md hover:bg-gray-100"
    >
      {icon}
    </button>
  )
}

export default SocialButton