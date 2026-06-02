import { HiOutlineCog, HiOutlineUserCircle } from "react-icons/hi";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/axios";
import DashboardShell from "./DashboardShell";

const Settings = () => {
  const role = localStorage.getItem("role");
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;
  const profilePath = role === "ROLE_TEACHER" ? "/profile/teacher" : "/profile/student";
  const { data: profileResponse } = useQuery({
    queryKey: ["profile", role],
    queryFn: async () => {
      const res = await axiosInstance.get(profilePath);
      return res.data;
    },
    enabled: !!role,
    retry: false,
  });
  const profile = profileResponse?.data;

  return (
    <DashboardShell
      title="Settings"
      subtitle="Review account identity, profile details, and workspace preferences."
      icon={HiOutlineCog}
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-1">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600">
            <HiOutlineUserCircle size={34} />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            {profile?.fullName || parsedUser?.fullName || "Edlink User"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">{parsedUser?.email || profile?.email || "No email available"}</p>
          <span className="mt-4 inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            {role === "ROLE_TEACHER" ? "Teacher" : "Student"}
          </span>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900">Workspace Preferences</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              ["Default Theme", "Light"],
              ["Dashboard Density", "Comfortable"],
              ["Email Alerts", "Enabled"],
              ["Class Reminders", "Enabled"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">{label}</p>
                <p className="mt-1 font-semibold text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Profile Details</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-gray-100 p-4">
            <p className="text-sm text-gray-500">Title</p>
            <p className="mt-1 font-semibold text-gray-900">{profile?.professionalTitle || "Not set"}</p>
          </div>
          <div className="rounded-xl border border-gray-100 p-4">
            <p className="text-sm text-gray-500">Country</p>
            <p className="mt-1 font-semibold text-gray-900">{profile?.country || "Not set"}</p>
          </div>
          <div className="rounded-xl border border-gray-100 p-4">
            <p className="text-sm text-gray-500">Badge</p>
            <p className="mt-1 font-semibold text-gray-900">{profile?.teacherBadge || "New member"}</p>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
};

export default Settings;
