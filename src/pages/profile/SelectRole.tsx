import { useUpdateRole } from "../../features/profile/hooks/useUpdateRole";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import type { UpdateRole } from "../../types/userType";
import { useNavigate, useSearchParams } from "react-router-dom";
import { showCustomToast } from "../../utils/toast";
import { getAccessToken, saveAuthSession } from "../../features/auth/utils/authToken";

const Select = () => {
  const { role, setRole } = useAuthStore();
  const { mutate, isPending } = useUpdateRole();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSelect = (selectedRole: "ROLE_USER" | "ROLE_TEACHER") => {
    setRole(selectedRole);
  };

  const handleSubmit = () => {
    if (!role) return;

    const dataToSend: UpdateRole = { role };

    mutate(dataToSend, {
      onSuccess: (data) => {
        showCustomToast(
          "success",
          data?.message || `Role has been set to ${role}`
        );

        const token = data?.data?.token || getAccessToken();
        if (token) {
          saveAuthSession({
            accessToken: token,
            refreshToken: data?.data?.refreshToken,
            role: data?.data?.role || role,
          });
        }

        if (role === "ROLE_USER") {
          navigate(searchParams.get("redirect") || "/dashboard/student");
        } else {
          navigate("/teacher-profile");
        }
      },
      onError: (error: any) => {
        let errorMessage = "Something went wrong ❌";

        if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }

        showCustomToast("error", errorMessage);
      },
    });
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      
      {/* Logo */}
      <h1 className="text-3xl font-bold text-green-500 mb-2">
        EduLink
      </h1>

      <p className="text-gray-600 mb-10 text-center">
        Select the role that best describes you
      </p>

      {/* Cards */}
      <div className="flex gap-6 flex-col md:flex-row">
        
        {/* Student */}
        <div
          onClick={() => handleSelect("ROLE_USER")}
          className={`w-72 p-6 rounded-xl border-2 cursor-pointer transition-all
          ${role === "ROLE_USER"
              ? "border-green-500 bg-green-50"
              : "border-gray-200 hover:border-green-300"
            }`}
        >
          <div className="text-4xl mb-4">📚</div>
          <h2 className="text-xl font-semibold">Student</h2>
          <p className="text-gray-500 mt-2">
            Find and attend trusted classes
          </p>
        </div>

        {/* Teacher */}
        <div
          onClick={() => handleSelect("ROLE_TEACHER")}
          className={`w-72 p-6 rounded-xl border-2 cursor-pointer transition-all
          ${role === "ROLE_TEACHER"
              ? "border-green-500 bg-green-50"
              : "border-gray-200 hover:border-green-300"
            }`}
        >
          <div className="text-4xl mb-4">🎓</div>
          <h2 className="text-xl font-semibold">Teacher</h2>
          <p className="text-gray-500 mt-2">
            Create & run structured courses
          </p>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handleSubmit}
        disabled={!role || isPending}
        className="mt-10 px-10 py-3 rounded-lg bg-green-500 text-white font-medium
        disabled:bg-gray-300 transition"
      >
        {isPending ? "Loading..." : "Next"}
      </button>
    </main>
  );
};

export default Select;
