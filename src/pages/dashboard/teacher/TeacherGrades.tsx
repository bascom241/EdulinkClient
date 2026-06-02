import { HiOutlineBadgeCheck } from "react-icons/hi";
import { useGradeSummary } from "../../../features/workspace/hooks/useWorkspace";
import DashboardShell from "../shared/DashboardShell";

const TeacherGrades = () => {
  const { data: grades = [], isLoading } = useGradeSummary();
  const graded = grades.filter((item: any) => item.grade !== undefined && item.grade !== null);
  const average = graded.length
    ? Math.round(graded.reduce((sum: number, item: any) => sum + Number(item.grade || 0), 0) / graded.length)
    : 0;

  return (
    <DashboardShell
      title="Grades"
      subtitle="Review attendance grades and participation performance across sessions."
      icon={HiOutlineBadgeCheck}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Records</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{grades.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Graded</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{graded.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Average</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{average}%</p>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading grades...</div>
        ) : grades.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {grades.map((record: any) => (
              <div key={`${record.sessionId}-${record.student?._id}`} className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">{record.student?.fullName || "Student"}</h2>
                  <p className="text-sm text-gray-500">{record.topic} - {record.durationMinutes || 0} minutes</p>
                </div>
                <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">{record.grade ?? "Ungraded"}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-gray-500">No grade records yet.</div>
        )}
      </section>
    </DashboardShell>
  );
};

export default TeacherGrades;
