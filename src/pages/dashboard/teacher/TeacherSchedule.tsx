import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { HiOutlineCalendar } from "react-icons/hi";
import { useGetAllTeacherClassrooms, useGetClassTimeTable } from "../../../features/classroom/hooks/useTeacher";
import { useCreateLiveSession } from "../../../features/session/hooks/useTeacher";
import { sessionKeys } from "../../../features/session/sessionKeys";
import { getApiErrorMessage } from "../../../utils/apiError";
import { workspaceKeys } from "../../../features/workspace/workspaceKeys";
import DashboardShell from "../shared/DashboardShell";

const formatDateTime = (date?: string) => {
  if (!date) return "Not scheduled";
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ClassSchedule = ({ classId, className }: { classId: string; className: string }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data } = useGetClassTimeTable(classId);
  const createLive = useCreateLiveSession();
  const sessions = data?.sessions || [];

  const handleStartLive = async (session: any) => {
    try {
      const liveSession = await createLive.mutateAsync({
        classroom: classId,
        topic: session.topic,
        startTime: new Date().toISOString(),
        endTime: session.endTime,
        sessionStatus: "ongoing",
      });

      queryClient.invalidateQueries({ queryKey: sessionKeys.list(classId) });
      queryClient.invalidateQueries({ queryKey: workspaceKeys.dashboardSummary });
      toast.success("Live class started. Students have been notified.");
      navigate(`/dashboard/live/${liveSession._id}`);
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, "Could not start live class"));
    }
  };

  if (sessions.length === 0) return null;

  return (
    <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">{className}</h2>
        <Link to={`/dashboard/teacher/${classId}`} className="text-sm font-medium text-green-600">
          Manage
        </Link>
      </div>
      <div className="divide-y divide-gray-100">
        {sessions.map((session) => (
          <div key={session._id || session.startTime} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="font-medium text-gray-900">{session.topic}</h3>
              <p className="text-sm text-gray-500">{formatDateTime(session.startTime)} to {formatDateTime(session.endTime)}</p>
            </div>
            <span className="w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              Timetable
            </span>
            <button
              type="button"
              onClick={() => handleStartLive(session)}
              disabled={createLive.isPending}
              className="w-fit rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createLive.isPending ? "Starting..." : "Start live"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

const TeacherSchedule = () => {
  const { data: classrooms = [], isLoading } = useGetAllTeacherClassrooms();

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading schedule...</div>;
  }

  return (
    <DashboardShell title="Schedule" subtitle="Plan, review, and jump into upcoming timetable sessions across your classes." icon={HiOutlineCalendar}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Classes</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{classrooms.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Timetable Source</p>
          <p className="mt-2 text-3xl font-bold text-green-600">Live</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Management</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">Edit</p>
        </div>
      </div>

      {classrooms.length > 0 ? (
        classrooms.map((classroom) => (
          <ClassSchedule key={classroom._id} classId={classroom._id} className={classroom.name} />
        ))
      ) : (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-500">
          No classrooms yet.
        </div>
      )}
    </DashboardShell>
  );
};

export default TeacherSchedule;
