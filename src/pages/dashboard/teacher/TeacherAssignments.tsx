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

  return (
    <DashboardShell title="Assignments" subtitle="Create work, set due dates, and monitor everything students need to complete." icon={HiOutlineDocumentText}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Assignments</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{assignments.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Classes</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{classrooms.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Selected</p>
          <p className="mt-2 text-lg font-bold text-gray-900">{classrooms.find((item) => item._id === classId)?.name || "All classes"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <select value={classId} onChange={(e) => setClassId(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500">
          <option value="">Select class</option>
          {classrooms.map((classroom) => (
            <option key={classroom._id} value={classroom._id}>{classroom.name}</option>
          ))}
        </select>
        <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Assignment title" className="px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
        <input type="datetime-local" value={form.dueDate} onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))} className="px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
        <input type="number" value={form.points} onChange={(e) => setForm((prev) => ({ ...prev, points: Number(e.target.value) }))} className="px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
        <textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Instructions" className="md:col-span-2 px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
        <button className="md:col-span-2 rounded-lg bg-green-600 px-4 py-2 text-white font-medium">Create Assignment</button>
      </form>

      <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {assignments.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {assignments.map((assignment) => (
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
      </section>
    </DashboardShell>
  );
};

export default TeacherAssignments;
