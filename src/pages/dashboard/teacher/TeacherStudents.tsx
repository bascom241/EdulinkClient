import { Link } from "react-router-dom";
import { useGetAllTeacherClassrooms } from "../../../features/classroom/hooks/useTeacher";

const TeacherStudents = () => {
  const { data: classrooms = [], isLoading } = useGetAllTeacherClassrooms();

  const students = classrooms.flatMap((classroom) =>
    (classroom.students || []).map((student: any) => ({
      id: typeof student === "string" ? student : student._id,
      name: typeof student === "string" ? "Student" : student.fullName || student.name || "Student",
      email: typeof student === "string" ? "" : student.email || "",
      className: classroom.name,
      classId: classroom._id,
    })),
  );

  const uniqueStudents = Array.from(new Map(students.map((student) => [student.id, student])).values());

  if (isLoading) return <div className="p-6 text-gray-500">Loading students...</div>;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        <p className="mt-1 text-sm text-gray-500">Track learners enrolled across your classes.</p>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Unique Students</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{uniqueStudents.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Class Enrollments</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{students.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Active Classes</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{classrooms.length}</p>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {students.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {students.map((student, index) => (
              <div key={`${student.id}-${index}`} className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 font-semibold text-green-700">
                    {student.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{student.name}</h2>
                    <p className="text-sm text-gray-500">{student.email || student.id}</p>
                  </div>
                </div>
                <Link to={`/dashboard/teacher/${student.classId}`} className="w-fit rounded-lg bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                  {student.className}
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-gray-500">No students enrolled yet.</div>
        )}
      </section>
    </div>
  );
};

export default TeacherStudents;
