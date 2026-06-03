import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineDocumentText } from "react-icons/hi";
import { assignmentKeys } from "../../../features/assignment/assignmentKeys";
import { useCreateAssignment, useGetTeacherAssignments } from "../../../features/assignment/hooks/useAssignment";
import { useGetAllTeacherClassrooms } from "../../../features/classroom/hooks/useTeacher";
import DashboardShell from "../shared/DashboardShell";
import { getApiErrorMessage } from "../../../utils/apiError";

const TeacherAssignments = () => {
  const queryClient = useQueryClient();
  const { data: classrooms = [] } = useGetAllTeacherClassrooms();
  const [classId, setClassId] = useState("");
  const { data: assignments = [] } = useGetTeacherAssignments(classId || undefined);
  const createAssignment = useCreateAssignment();
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    points: 100,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classId) {
      toast.error("Select a class");
      return;
    }
    try {
      await createAssignment.mutateAsync({
        classroomId: classId,
        ...form,
      });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.teacher(classId) });
      setForm({ title: "", description: "", dueDate: "", points: 100 });
      toast.success("Assignment created");
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, "Could not create assignment"));
    }
  };

  const totalPages = Math.max(1, Math.ceil(assignments.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleAssignments = assignments.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <DashboardShell title="Assignments" subtitle="Create work, set due dates, and monitor everything students need to complete." icon={HiOutlineDocumentText}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="app-panel rounded-2xl p-5">
          <p className="text-sm text-gray-500">Assignments</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{assignments.length}</p>
        </div>
        <div className="app-panel rounded-2xl p-5">
          <p className="text-sm text-gray-500">Classes</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{classrooms.length}</p>
        </div>
        <div className="app-panel rounded-2xl p-5">
          <p className="text-sm text-gray-500">Selected</p>
          <p className="mt-2 text-lg font-bold text-gray-900">{classrooms.find((item) => item._id === classId)?.name || "All classes"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="app-panel grid grid-cols-1 gap-4 rounded-2xl p-5 md:grid-cols-2">
        <select value={classId} onChange={(e) => setClassId(e.target.value)} className="app-control rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500">
          <option value="">Select class</option>
          {classrooms.map((classroom) => (
            <option key={classroom._id} value={classroom._id}>{classroom.name}</option>
          ))}
        </select>
        <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Assignment title" className="app-control rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500" />
        <input type="datetime-local" value={form.dueDate} onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))} className="app-control rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500" />
        <input type="number" value={form.points} onChange={(e) => setForm((prev) => ({ ...prev, points: Number(e.target.value) }))} className="app-control rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500" />
        <textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Instructions" className="app-control rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 md:col-span-2" />
        <button className="app-button-primary rounded-lg px-4 py-2 font-medium md:col-span-2">Create Assignment</button>
      </form>

      <section className="app-panel overflow-hidden rounded-2xl">
        {assignments.length > 0 ? (
          <div className="divide-y divide-[var(--app-border)]">
            {visibleAssignments.map((assignment) => (
              <div key={assignment._id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                  <p className="text-sm text-gray-500">{assignment.description || "No instructions"}</p>
                </div>
                <div className="text-sm text-gray-500">
                  Due {new Date(assignment.dueDate).toLocaleString()} - {assignment.points} pts
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-gray-500">No assignments yet.</div>
        )}
        {assignments.length > pageSize && (
          <div className="flex items-center justify-between border-t border-[var(--app-border)] px-5 py-3 text-sm">
            <button onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={safePage === 1} className="app-button-secondary rounded-lg px-3 py-1.5 disabled:opacity-40">
              Previous
            </button>
            <span className="app-muted font-semibold">{safePage} / {totalPages}</span>
            <button onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={safePage === totalPages} className="app-button-secondary rounded-lg px-3 py-1.5 disabled:opacity-40">
              Next
            </button>
          </div>
        )}
      </section>
    </DashboardShell>
  );
};

export default TeacherAssignments;
