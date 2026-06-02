import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineVideoCamera } from "react-icons/hi";
import { useGetAllTeacherClassrooms } from "../../../features/classroom/hooks/useTeacher";
import { workspaceKeys } from "../../../features/workspace/workspaceKeys";
import { useCreateRecording, useRecordings } from "../../../features/workspace/hooks/useWorkspace";
import DashboardShell from "../shared/DashboardShell";

const TeacherRecordings = () => {
  const queryClient = useQueryClient();
  const { data: classrooms = [] } = useGetAllTeacherClassrooms();
  const { data: recordings = [], isLoading } = useRecordings();
  const createRecording = useCreateRecording();
  const [form, setForm] = useState({ classroom: "", title: "", url: "", durationMinutes: 0 });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.classroom || !form.title || !form.url) {
      toast.error("Class, title, and recording URL are required");
      return;
    }
    await createRecording.mutateAsync(form);
    queryClient.invalidateQueries({ queryKey: workspaceKeys.recordings });
    setForm({ classroom: "", title: "", url: "", durationMinutes: 0 });
    toast.success("Recording added");
  };

  return (
    <DashboardShell title="Recordings" subtitle="Attach replay links to classes so students can revise after live sessions." icon={HiOutlineVideoCamera}>
      <form onSubmit={submit} className="grid grid-cols-1 gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:grid-cols-2">
        <select value={form.classroom} onChange={(e) => setForm((prev) => ({ ...prev, classroom: e.target.value }))} className="rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500">
          <option value="">Select class</option>
          {classrooms.map((classroom) => <option key={classroom._id} value={classroom._id}>{classroom.name}</option>)}
        </select>
        <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Recording title" className="rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500" />
        <input value={form.url} onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))} placeholder="https://..." className="rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500" />
        <input type="number" value={form.durationMinutes} onChange={(e) => setForm((prev) => ({ ...prev, durationMinutes: Number(e.target.value) }))} placeholder="Duration minutes" className="rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500" />
        <button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white md:col-span-2">Add recording</button>
      </form>

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {isLoading ? <div className="p-8 text-center text-gray-500">Loading recordings...</div> : recordings.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 p-5 lg:grid-cols-2">
            {recordings.map((recording: any) => (
              <a key={recording._id} href={recording.url} target="_blank" rel="noreferrer" className="rounded-xl border border-gray-100 p-5 transition hover:border-green-200 hover:bg-green-50/40">
                <h2 className="font-semibold text-gray-900">{recording.title}</h2>
                <p className="mt-2 text-sm text-gray-500">{recording.classroom?.name || "Class"} - {recording.durationMinutes || 0} minutes</p>
              </a>
            ))}
          </div>
        ) : <div className="p-10 text-center text-gray-500">No recordings yet.</div>}
      </section>
    </DashboardShell>
  );
};

export default TeacherRecordings;
