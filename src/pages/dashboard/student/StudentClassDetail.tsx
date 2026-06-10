import { Link, useNavigate, useParams } from "react-router-dom";
import { HiOutlineArrowLeft, HiOutlineCalendar, HiOutlineExternalLink } from "react-icons/hi";
import Loader from "../../../components/ui/Loader";
import {
  useGetStudentClassTimeTable,
  useGetStudentClassrooms,
} from "../../../features/classroom/hooks/useStudent";

const formatDateTime = (date?: string) => {
  if (!date) return "Not scheduled";
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const StudentClassDetail = () => {
  const { classId = "" } = useParams();
  const navigate = useNavigate();
  const { data: classrooms = [], isLoading: classesLoading } = useGetStudentClassrooms();
  const { data: timetable, isLoading: timetableLoading } = useGetStudentClassTimeTable(classId);
  const classroom = classrooms.find((item) => item._id === classId);
  const sessions = timetable?.sessions || [];

  if (classesLoading || timetableLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" message="Loading class..." />
      </div>
    );
  }

  if (!classroom) {
    return (
      <section className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Class not found</h1>
        <p className="mt-2 text-sm text-gray-500">
          This class is not in your enrolled classes yet.
        </p>
        <button
          type="button"
          onClick={() => navigate("/dashboard/student/my-classes")}
          className="mt-5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Back to my classes
        </button>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate("/dashboard/student/my-classes")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-green-700"
      >
        <HiOutlineArrowLeft />
        My classes
      </button>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold capitalize text-green-700">
                {classroom.classLevel}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-700">
                {classroom.location}
              </span>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">{classroom.name}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
              {classroom.description || "No description has been added for this class."}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4 text-sm">
            <p className="text-gray-500">Students</p>
            <p className="mt-1 font-bold text-gray-900">
              {classroom.students?.length || 0} / {classroom.maximumStudent}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <HiOutlineCalendar className="text-green-600" />
            <h2 className="font-semibold text-gray-900">Timetable</h2>
          </div>
          <Link
            to="/dashboard/student/schedule"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-700"
          >
            Full schedule
            <HiOutlineExternalLink />
          </Link>
        </div>

        {sessions.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {sessions.map((session) => (
              <div
                key={session._id || session.startTime}
                className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{session.topic}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDateTime(session.startTime)} to {formatDateTime(session.endTime)}
                  </p>
                </div>
                {session.activeSessionId && (
                  <Link
                    to={`/dashboard/live/${session.activeSessionId}`}
                    className="w-fit rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white"
                  >
                    Join live
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-sm text-gray-500">No timetable set yet.</div>
        )}
      </section>
    </div>
  );
};

export default StudentClassDetail;
