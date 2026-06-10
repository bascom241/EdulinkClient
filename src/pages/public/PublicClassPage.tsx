import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiOutlineAcademicCap,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineUsers,
} from "react-icons/hi";
import Loader from "../../components/ui/Loader";
import {
  useGetPublicClassroom,
  useJoinMarketplaceClass,
} from "../../features/classroom/hooks/useStudent";
import { getAccessToken, isAccessTokenExpired } from "../../features/auth/utils/authToken";
import { getApiErrorMessage } from "../../utils/apiError";

const formatDateTime = (date?: string) => {
  if (!date) return "Not scheduled";
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const PublicClassPage = () => {
  const { classId = "" } = useParams();
  const navigate = useNavigate();
  const classQuery = useGetPublicClassroom(classId);
  const joinClass = useJoinMarketplaceClass();
  const redirectPath = `/classes/${classId}`;

  const isAuthenticated = useMemo(() => {
    const token = getAccessToken();
    return !!token && !isAccessTokenExpired(token);
  }, []);

  const handleJoin = async () => {
    if (!isAuthenticated) {
      navigate(`/register?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }

    try {
      const data = await joinClass.mutateAsync(classId);
      if (typeof data === "string" && data.startsWith("http")) {
        window.location.href = data;
        return;
      }

      toast.success(data || "Joined class successfully");
      navigate("/dashboard/student/my-classes");
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, "Could not join this class"));
    }
  };

  if (classQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader size="lg" message="Loading class..." />
      </div>
    );
  }

  if (!classQuery.data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <section className="max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-gray-900">Class not found</h1>
          <p className="mt-2 text-sm text-gray-500">This shared class link is unavailable.</p>
        </section>
      </main>
    );
  }

  const classroom = classQuery.data;
  const sessions = classroom.sessions || [];

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-white">
        <div className="mx-auto grid min-h-[72vh] max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-[1.2fr_0.8fr] md:px-6">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold capitalize text-green-700">
                {classroom.classLevel}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-700">
                {classroom.location}
              </span>
            </div>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-gray-950 md:text-5xl">
              {classroom.name}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
              {classroom.description || "Join this EduLink class and learn with a structured instructor-led schedule."}
            </p>
            <button
              type="button"
              onClick={handleJoin}
              disabled={joinClass.isPending || classroom.isFull}
              className="mt-6 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {classroom.isFull
                ? "Class full"
                : joinClass.isPending
                ? "Joining..."
                : isAuthenticated
                ? Number(classroom.price || 0) > 0
                  ? "Join and pay"
                  : "Join class"
                : "Create account to join"}
            </button>
            {!isAuthenticated && (
              <button
                type="button"
                onClick={() => navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`)}
                className="ml-3 mt-6 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-green-200 hover:text-green-700"
              >
                Sign in
              </button>
            )}
          </div>

          <aside className="rounded-2xl border border-gray-100 bg-gray-50 p-5 shadow-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white p-4">
                <HiOutlineUsers className="text-green-600" />
                <p className="mt-2 text-lg font-bold text-gray-900">
                  {classroom.studentsCount}/{classroom.maximumStudent}
                </p>
                <p className="text-xs text-gray-500">Students</p>
              </div>
              <div className="rounded-xl bg-white p-4">
                <HiOutlineCurrencyDollar className="text-green-600" />
                <p className="mt-2 text-lg font-bold text-gray-900">
                  {Number(classroom.price || 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Price</p>
              </div>
              <div className="rounded-xl bg-white p-4">
                <HiOutlineAcademicCap className="text-green-600" />
                <p className="mt-2 truncate text-lg font-bold text-gray-900">{classroom.owner}</p>
                <p className="text-xs text-gray-500">Instructor</p>
              </div>
              <div className="rounded-xl bg-white p-4">
                <HiOutlineCalendar className="text-green-600" />
                <p className="mt-2 text-lg font-bold text-gray-900">{sessions.length}</p>
                <p className="text-xs text-gray-500">Upcoming sessions</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <h2 className="text-xl font-bold text-gray-900">Upcoming timetable</h2>
        <div className="mt-4 divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white shadow-sm">
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <div key={session._id || session.startTime} className="p-5">
                <h3 className="font-semibold text-gray-900">{session.topic}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {formatDateTime(session.startTime)} to {formatDateTime(session.endTime)}
                </p>
              </div>
            ))
          ) : (
            <div className="p-5 text-sm text-gray-500">No upcoming timetable has been added yet.</div>
          )}
        </div>
      </section>
    </main>
  );
};

export default PublicClassPage;
