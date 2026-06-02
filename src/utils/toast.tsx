import type { Toast } from "react-hot-toast";
import { toast } from "react-hot-toast";
import { HiCheckCircle, HiExclamationCircle, HiXCircle } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import Logo from "../assets/logo (2).png";

type ToastType = "success" | "error" | "warning";

type ModernToastProps = {
  t: Toast;
  type: ToastType;
  message: string;
};

const colors: Record<
  ToastType,
  {
    light: string;
    dark: string;
    bg: string;
  }
> = {
  success: {
    light: "#22C55E",
    dark: "#15803D",
    bg: "rgba(34, 197, 94, 0.1)",
  },
  error: {
    light: "#EF4444",
    dark: "#B91C1C",
    bg: "rgba(239, 68, 68, 0.1)",
  },
  warning: {
    light: "#F59E0B",
    dark: "#B45309",
    bg: "rgba(245, 158, 11, 0.1)",
  },
};

export const showCustomToast = (
  type: ToastType = "success",
  message: string = ""
) => {
  toast.custom((t) => <ModernToast t={t} type={type} message={message} />, {
    duration: 5000,
    position: "top-right",
  });
};

const ModernToast: React.FC<ModernToastProps> = ({ t, type, message }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => toast.dismiss(t.id), 200);
  };

  const colorConfig = colors[type];
  const Icon = getIcon(type);

  return (
    <div
      className={`transform transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
      style={{ maxWidth: "380px", minWidth: "320px" }}
    >
      <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xl dark:border-white/10 dark:bg-gray-950">
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-white/10">
          <div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${colorConfig.light}, ${colorConfig.dark})`,
              animation: "shrink 5s linear forwards",
            }}
          />
        </div>

        <div className="flex items-start gap-3 p-4">
          <div
            className="rounded-lg p-2"
            style={{ backgroundColor: colorConfig.bg }}
          >
            {Icon ? (
              <Icon style={{ color: colorConfig.light }} className="h-5 w-5" />
            ) : (
              <img src={Logo} alt="Logo" className="h-5 w-5 rounded-lg" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h3
                className="text-sm font-semibold"
                style={{ color: colorConfig.dark }}
              >
                {getTitle(type)}
              </h3>

              <button
                type="button"
                onClick={handleDismiss}
                className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-200"
                aria-label="Dismiss notification"
              >
                <IoClose />
              </button>
            </div>

            <p className="mt-1 text-sm leading-5 text-gray-600 dark:text-gray-300">
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const getIcon = (type: ToastType) => {
  switch (type) {
    case "success":
      return HiCheckCircle;
    case "error":
      return HiXCircle;
    case "warning":
      return HiExclamationCircle;
    default:
      return null;
  }
};

const getTitle = (type: ToastType) => {
  switch (type) {
    case "success":
      return "Success";
    case "error":
      return "Action needed";
    case "warning":
      return "Please wait";
    default:
      return "Notification";
  }
};

export const showSuccess = (message: string) => showCustomToast("success", message);
export const showError = (message: string) => showCustomToast("error", message);
export const showWarning = (message: string) => showCustomToast("warning", message);
