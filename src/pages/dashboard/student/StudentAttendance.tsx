import { HiOutlineClock } from "react-icons/hi";
import { useDashboardSummary } from "../../../features/workspace/hooks/useWorkspace";
import DashboardShell from "../shared/DashboardShell";

const StudentAttendance = () => {
  const { data: summary, isLoading } = useDashboardSummary();
  const records = summary?.attendanceRecords || [];
  const stats = summary?.stats || {};
  const totalMinutes = records.reduce((sum: number, record: any) => sum + Number(record.durationMinutes || 0), 0);

  return (
    <DashboardShell title="Attendance" subtitle="Review checked-in sessions and time spent learning." icon={HiOutlineClock}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Sessions Joined</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{records.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Minutes</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{stats.totalMinutes ?? totalMinutes}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Average</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.averageMinutes ?? (records.length ? Math.round(totalMinutes / records.length) : 0)}</p>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {isLoading ? <div className="p-8 text-center text-gray-500">Loading attendance...</div> : records.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {records.map((record: any) => (
              <div key={`${record.sessionId}-${record.topic}`} className="p-5">
                <h2 className="font-semibold text-gray-900">{record.topic}</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {record.classroom?.name || "Class"} - {record.durationMinutes || 0} minutes - grade {record.grade ?? "pending"}
                </p>
              </div>
            ))}
          </div>
        ) : <div className="p-10 text-center text-gray-500">No attendance records yet.</div>}
      </section>
    </DashboardShell>
  );
};

export default StudentAttendance;
