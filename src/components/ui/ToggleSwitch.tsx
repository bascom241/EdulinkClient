import React from "react"

type ToggleProps = {
  checked: boolean
  onChange: () => void
   className?: string  
}

const ToggleSwitch: React.FC<ToggleProps> = ({
  checked,
  onChange,
  className=""
}) => {
  return (
    <label className={`flex items-center gap-2 cursor-pointer ${className }`} >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hidden"
      />

      <div
        className={`w-10 h-5 flex items-center rounded-full p-1 ${
          checked ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
      </div>

      <span className="text-sm">
        I agree to the Terms & Privacy Policy
      </span>
    </label>
  )
}

export default ToggleSwitch