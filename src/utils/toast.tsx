import type  { Toast } from "react-hot-toast";
import { toast } from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import Logo from "../assets/logo (2).png";

type ToastType = "success" | "error" | "warning";

type ModernToastProps = {
  t: Toast;
  type: ToastType;
  message: string;
};

// Modern color palette
const colors: Record<ToastType, {
  light: string;
  dark: string;
  bg: string;
  border: string;
}> = {
  success: {
    light: "#22C55E",
    dark: "#15803D",
    bg: "rgba(34, 197, 94, 0.1)",
    border: "rgba(34, 197, 94, 0.2)",
  },
  error: {
    light: "#EF4444",
    dark: "#B91C1C",
    bg: "rgba(239, 68, 68, 0.1)",
    border: "rgba(239, 68, 68, 0.2)",
  },
  warning: {
    light: "#F59E0B",
    dark: "#B45309",
    bg: "rgba(245, 158, 11, 0.1)",
    border: "rgba(245, 158, 11, 0.2)",
  },
};

export const showCustomToast = (
  type: ToastType = "success",
  message: string = ""
) => {
  toast.custom(
    (t) => <ModernToast t={t} type={type} message={message} />,
    {
      duration: 4000,
      position: "top-right",
    }
  );
};

const ModernToast: React.FC<ModernToastProps> = ({ t, type, message }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      toast.dismiss(t.id);
    }, 200);
  };

  const colorConfig = colors[type];
  const icon = getIcon(type, colorConfig);

  return (
    <div
      className={`transform transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
      style={{ maxWidth: "380px", minWidth: "320px" }}
    >
      <div className="relative bg-white rounded-xl shadow-2xl border overflow-hidden">
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
          <div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${colorConfig.light}, ${colorConfig.dark})`,
              animation: "shrink 4s linear forwards",
            }}
          />
        </div>

        <div className="p-4 flex items-start gap-3">
          <div>
            {icon ? (
              <div
                className="rounded-lg p-2"
                style={{ backgroundColor: colorConfig.bg }}
              >
                <div className="w-5 h-5">{icon}</div>
              </div>
            ) : (
              <img src={Logo} alt="Logo" className="w-10 h-10 rounded-lg" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex justify-between">
              <h3
                className="text-sm font-semibold"
                style={{ color: colorConfig.dark }}
              >
                {getTitle(type)}
              </h3>

              <button onClick={handleDismiss}>
                <IoClose />
              </button>
            </div>

            <p className="text-sm text-gray-600 mt-1">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const getIcon = (
  type: ToastType,
  colors: { light: string }
) => {
  switch (type) {
    case "success":
      return <span style={{ color: colors.light }}>✓</span>;
    case "error":
      return <span style={{ color: colors.light }}>✕</span>;
    case "warning":
      return <span style={{ color: colors.light }}>!</span>;
    default:
      return null;
  }
};

const getTitle = (type: ToastType) => {
  switch (type) {
    case "success":
      return "Success";
    case "error":
      return "Error";
    case "warning":
      return "Warning";
    default:
      return "Notification";
  }
};

// Helpers
export const showSuccess = (message: string) =>
  showCustomToast("success", message);

export const showError = (message: string) =>
  showCustomToast("error", message);

export const showWarning = (message: string) =>
  showCustomToast("warning", message);