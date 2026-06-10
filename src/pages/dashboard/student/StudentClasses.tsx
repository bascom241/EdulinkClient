import { useNavigate } from "react-router-dom";
import { useGetStudentClassrooms } from "../../../features/classroom/hooks/useStudent";

const StudentClasses = () => {
  const navigate = useNavigate();
  const { data: classrooms = [], isLoading } = useGetStudentClassrooms();

  if (isLoading) return <div className="p-6 text-gray-500">Loading classes...</div>;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
        <p className="mt-1 text-sm text-gray-500">Classes you are enrolled in.</p>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {classrooms.map((classroom) => (
          <article
            key={classroom._id}
            onClick={() => navigate(`/dashboard/student/my-classes/${classroom._id}`)}
            className="cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-green-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{classroom.name}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">{classroom.description || "No description"}</p>
              </div>
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">{classroom.classLevel}</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-gray-500">Location</p>
                <p className="mt-1 font-semibold capitalize text-gray-900">{classroom.location}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-gray-500">Students</p>
                <p className="mt-1 font-semibold text-gray-900">{classroom.students?.length || 0} / {classroom.maximumStudent}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {classrooms.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">
          You have not joined any classes yet.
        </div>
      )}
    </div>
  );
};

export default StudentClasses;
