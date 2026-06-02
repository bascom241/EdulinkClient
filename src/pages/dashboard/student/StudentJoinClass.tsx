import { useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineUserAdd } from "react-icons/hi";
import axiosInstance from "../../../api/axios";
import DashboardShell from "../shared/DashboardShell";
import { getApiErrorMessage } from "../../../utils/apiError";

const StudentJoinClass = () => {
  const [form, setForm] = useState({ classId: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.classId || !form.email) {
      toast.error("Class ID and email are required");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post("/classroom/join", form);
      const data = res.data?.data;
      if (typeof data === "string" && data.startsWith("http")) {
        window.location.href = data;
        return;
      }
      toast.success(data || "Joined successfully");
      setForm({ classId: "", email: "" });
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, "Could not join class"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardShell title="Join Class" subtitle="Use your teacher's class ID and your account email to enroll." icon={HiOutlineUserAdd}>
      <form onSubmit={submit} className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Class ID</label>
            <input value={form.classId} onChange={(e) => setForm((prev) => ({ ...prev, classId: e.target.value }))} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500" placeholder="Paste class ID" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500" placeholder="student@example.com" />
          </div>
          <button disabled={isSubmitting} className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
            {isSubmitting ? "Joining..." : "Join class"}
          </button>
        </div>
      </form>
    </DashboardShell>
  );
};

export default StudentJoinClass;
