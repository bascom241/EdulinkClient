import { forwardRef } from "react";

import type { ForwardedRef } from "react"

type InputProps = {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  className?: string;
  style?: React.CSSProperties;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  maxLength?: number;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, type = "text", placeholder, value, onChange, name, className, style, onKeyDown, onPaste, maxLength },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <div className="flex flex-col gap-1">
        {label && <label className="text-sm font-medium">{label}</label>}

        <input
          ref={ref}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          maxLength={maxLength}
          className={className || "border border-gray-400 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-[#3BAC51]"}
          style={style}
        />
      </div>
    );
  }
);

export default Input;