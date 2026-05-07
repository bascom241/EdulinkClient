import type{  ChangeEvent, KeyboardEvent, ClipboardEvent, Dispatch, SetStateAction } from "react";
import {useRef, useEffect} from "react"
import Input from "./Input";

interface TokenInputProps {
  onComplete?: (token: string) => void;
  autoSubmit?: boolean;
  token: string []
  setToken:Dispatch<SetStateAction<string[]>>
}

const TokenInput: React.FC<TokenInputProps> = ({ onComplete, autoSubmit = false , token, setToken}) => {

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);


  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^[a-zA-Z0-9]$/.test(value)) return;

    const newToken = [...token];
    newToken[index] = value.toUpperCase();
    setToken(newToken);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const completeToken = newToken.join("");
    if (autoSubmit && completeToken.length === 6 && !newToken.includes("")) {
      onComplete?.(completeToken);
    }
  };

  // Handle key down events
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (token[index] === "" && index > 0) {
        const newToken = [...token];
        newToken[index - 1] = "";
        setToken(newToken);
        inputRefs.current[index - 1]?.focus();
      } else if (token[index] !== "") {
        const newToken = [...token];
        newToken[index] = "";
        setToken(newToken);
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (e.key === "Delete") {
      const newToken = [...token];
      newToken[index] = "";
      setToken(newToken);
    }
  };

  // Handle paste event
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const cleanedData = pastedData.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    if (cleanedData) {
      const newToken = [...token];
      const chars = cleanedData.split("").slice(0, 6);

      for (let i = 0; i < chars.length; i++) {
        newToken[i] = chars[i];
      }

      setToken(newToken);

      const lastFilledIndex = Math.min(chars.length - 1, 5);
      const nextIndex = chars.length < 6 ? lastFilledIndex + 1 : lastFilledIndex;
      inputRefs.current[nextIndex < 6 ? nextIndex : lastFilledIndex]?.focus();

      const completeToken = newToken.join("");
      if (autoSubmit && completeToken.length === 6 && !newToken.includes("")) {
        onComplete?.(completeToken);
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  }, []);

  return (
    <div className="w-full">
      <div className="flex gap-3 justify-center items-center">
        {token.map((value, index) => (
          <Input
            key={index}
           ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            value={value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            maxLength={1}
            className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 focus:outline-none transition-all duration-200"
            style={{
              textTransform: "uppercase",
              backgroundColor: value ? "#f9fafb" : "white",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TokenInput;