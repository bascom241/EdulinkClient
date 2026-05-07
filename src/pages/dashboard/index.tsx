import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

const DashboardIndex = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (role === "ROLE_TEACHER") {
        navigate("/dashboard/teacher");
      } else if (role === "ROLE_USER") {
        navigate("/dashboard/student");
      } else if (role === "ROLE_ADMIN") {
        navigate("/dashboard/admin");
      } else {
        navigate("/login");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [role, navigate]);

  const message =
    role === "TEACHER"
      ? "Preparing your teaching workspace..."
      : role === "STUDENT"
      ? "Loading your learning dashboard..."
      : role === "ADMIN"
      ? "Setting up admin controls..."
      : "Getting things ready...";

  return (
    <main className="min-h-screen flex items-center justify-center bg-green-50">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white/80 backdrop-blur-lg p-10 rounded-2xl shadow-xl flex flex-col items-center gap-5"
      >
        {/*  Pulse Spinner */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-green-200 animate-ping opacity-50"></div>
          <FaSpinner className="relative text-green-600 text-3xl animate-spin" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800">
          Setting up your dashboard...
        </h2>

        {/* Message */}
        <p className="text-gray-500 text-sm text-center">
          {message} 🌿
        </p>
      </motion.div>
    </main>
  );
};

export default DashboardIndex;