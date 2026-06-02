import { HiOutlineBadgeCheck } from "react-icons/hi";
import { useGradeSummary } from "../../../features/workspace/hooks/useWorkspace";
import DashboardShell from "../shared/DashboardShell";

const StudentGrades = () => {
  const { data: grades = [], isLoading } = useGradeSummary();

  return (
    <DashboardShell title="Grades" subtitle="See grades from attendance and learning participation." icon={HiOutlineBadgeCheck}>
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading grades...</div>
        ) : grades.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {grades.map((record: any) => (
              <div key={`${record.sessionId}-${record.topic}`} className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">{record.topic}</h2>
                  <p className="text-sm text-gray-500">{record.durationMinutes || 0} minutes attended</p>
                </div>
                <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">{record.grade ?? "Ungraded"}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-gray-500">No grades yet.</div>
        )}
      </section>
    </DashboardShell>
  );
};

export default StudentGrades;
