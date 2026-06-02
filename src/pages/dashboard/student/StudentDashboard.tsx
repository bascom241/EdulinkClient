import { Link } from "react-router-dom";
import { HiOutlineAcademicCap, HiOutlineClock, HiOutlineDocumentText, HiOutlineVideoCamera } from "react-icons/hi";
import { useGetStudentAssignments } from "../../../features/assignment/hooks/useAssignment";
import { useGetStudentClassTimeTable, useGetStudentClassrooms } from "../../../features/classroom/hooks/useStudent";
import { useDashboardSummary } from "../../../features/workspace/hooks/useWorkspace";
import Loader from "../../../components/ui/Loader";

const formatDateTime = (date?: string) => {
  if (!date) return "Not scheduled";
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const StudentClassSchedule = ({ classId, className }: { classId: string; className: string }) => {
  const { data } = useGetStudentClassTimeTable(classId);
  const sessions = data?.sessions || [];

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="font-semibold text-gray-900">{className}</h2>
      </div>
      {sessions.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {sessions.slice(0, 4).map((session) => (
            <div key={session._id || session.startTime} className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{session.topic}</h3>
                <p className="text-sm text-gray-500">
                  {formatDateTime(session.startTime)} to {formatDateTime(session.endTime)}
                </p>
              </div>
              <span className="w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                Timetable
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-sm text-gray-500">No timetable set yet.</div>
      )}
    </section>
  );
};

const StudentDashboard = () => {
  const { data: classrooms = [], isLoading } = useGetStudentClassrooms();
  const { data: assignments = [] } = useGetStudentAssignments();
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const stats = summary?.stats || {};
  const upcoming = summary?.upcomingSessions || [];
  const ongoing = summary?.ongoingSessions || [];

  if (isLoading || summaryLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" message="Loading dashboard data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Your classes, live sessions, attendance, and assignments from the server.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <HiOutlineAcademicCap className="text-green-600" />
          <p className="mt-3 text-sm text-gray-500">Joined Classes</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">{classrooms.length}</h2>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <HiOutlineDocumentText className="text-green-600" />
          <p className="mt-3 text-sm text-gray-500">Assignments</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">{assignments.length}</h2>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <HiOutlineClock className="text-green-600" />
          <p className="mt-3 text-sm text-gray-500">Minutes Attended</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">{stats.totalMinutes || 0}</h2>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <HiOutlineVideoCamera className="text-green-600" />
          <p className="mt-3 text-sm text-gray-500">Live Now</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">{ongoing.length}</h2>
        </div>
      </div>

      {ongoing.length > 0 && (
        <section className="rounded-2xl border border-green-100 bg-green-50 p-5">
          <h2 className="font-semibold text-green-900">Live classes happening now</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {ongoing.map((session: any) => (
              <Link
                key={session._id}
                to={`/dashboard/live/${session._id}`}
                className="rounded-xl bg-white p-4 text-sm font-semibold text-green-700 shadow-sm"
              >
                Join {session.topic}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">Upcoming Sessions</h2>
        </div>
        {upcoming.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {upcoming.map((session: any) => (
              <div key={session._id} className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{session.topic}</h3>
                  <p className="text-sm text-gray-500">
                    {session.classroom?.name || "Class"} - {formatDateTime(session.startTime)}
                  </p>
                </div>
                {session.sessionStatus === "ongoing" && (
                  <Link to={`/dashboard/live/${session._id}`} className="w-fit rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white">
                    Join live
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-sm text-gray-500">No upcoming live sessions yet.</div>
        )}
      </section>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Time Table</h2>
        {classrooms.length > 0 ? (
          classrooms.map((classroom) => (
            <StudentClassSchedule key={classroom._id} classId={classroom._id} className={classroom.name} />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">
            You have not joined any classes yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
