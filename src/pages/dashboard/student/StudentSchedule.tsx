import { useGetStudentClassTimeTable, useGetStudentClassrooms } from "../../../features/classroom/hooks/useStudent";

const formatDateTime = (date?: string) => {
  if (!date) return "Not scheduled";
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ScheduleBlock = ({ classId, className }: { classId: string; className: string }) => {
  const { data } = useGetStudentClassTimeTable(classId);
  const sessions = data?.sessions || [];

  return (
    <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="font-semibold text-gray-900">{className}</h2>
      </div>
      {sessions.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {sessions.map((session) => (
            <div key={session._id || session.startTime} className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{session.topic}</h3>
                <p className="text-sm text-gray-500">{formatDateTime(session.startTime)} to {formatDateTime(session.endTime)}</p>
              </div>
              {data?.defaultLink && (
                <a href={data.defaultLink} target="_blank" rel="noreferrer" className="w-fit rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white">
                  Join
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-sm text-gray-500">No timetable set yet.</div>
      )}
    </section>
  );
};

const StudentSchedule = () => {
  const { data: classrooms = [], isLoading } = useGetStudentClassrooms();

  if (isLoading) return <div className="p-6 text-gray-500">Loading schedule...</div>;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
        <p className="mt-1 text-sm text-gray-500">All upcoming class timetable entries.</p>
      </section>
      {classrooms.map((classroom) => (
        <ScheduleBlock key={classroom._id} classId={classroom._id} className={classroom.name} />
      ))}
      {classrooms.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">
          You have not joined any classes yet.
        </div>
      )}
    </div>
  );
};

export default StudentSchedule;
