import { useGetStudentAssignments } from "../../../features/assignment/hooks/useAssignment";

const StudentAssignments = () => {
  const { data: assignments = [], isLoading } = useGetStudentAssignments();

  if (isLoading) return <div className="p-6 text-gray-500">Loading assignments...</div>;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
        <p className="mt-1 text-sm text-gray-500">Review due work across your joined classes.</p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {assignments.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-900">{assignment.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-500">{assignment.description || "No instructions"}</p>
                  </div>
                  <span className="w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    {assignment.points} pts
                  </span>
                </div>
                <p className="mt-3 text-xs text-gray-500">Due {new Date(assignment.dueDate).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-gray-500">No assignments yet.</div>
        )}
      </section>
    </div>
  );
};

export default StudentAssignments;
