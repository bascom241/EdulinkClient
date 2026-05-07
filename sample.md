import { useState } from "react";
import { useGetClassCounts } from "../hooks/useClassroom"; // Adjust path
import CreateClassForm from "./CreateClassForm";
import ClassDetails from "./ClassDetails";

// Mock data/types for illustration
type ViewState = "list" | "create" | "details";

const MyClass = () => {
  const [view, setView] = useState<ViewState>("list");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  // Fetching your classes (using the hook you shared previously)
  const { data: classes, isLoading } = useGetClassCounts();

  // Helper to open details
  const handleViewDetails = (id: string) => {
    setSelectedClassId(id);
    setView("details");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header / Indicator Area */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Classroom Management</h1>
          <p className="text-sm text-gray-500">
            {view === "list" && "Viewing all your active classes"}
            {view === "create" && "Setting up a new classroom"}
            {view === "details" && `Viewing Class ID: ${selectedClassId}`}
          </p>
        </div>

        {view !== "list" ? (
          <button 
            onClick={() => setView("list")}
            className="text-blue-600 hover:underline"
          >
            &larr; Back to List
          </button>
        ) : (
          <button 
            onClick={() => setView("create")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Create New Class
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <main className="bg-white rounded-xl shadow-sm min-h-[400px]">
        {isLoading && <div className="p-10 text-center">Loading classrooms...</div>}

        {view === "list" && (
          <div className="grid gap-4 p-4">
            {/* Map through your real data here */}
            {classes?.data?.length > 0 ? (
              classes.data.map((cls: any) => (
                <div key={cls.id} className="border p-4 rounded-lg flex justify-between items-center">
                  <span>{cls.name}</span>
                  <button 
                    onClick={() => handleViewDetails(cls.id)}
                    className="text-sm border px-3 py-1 rounded hover:bg-gray-50"
                  >
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-10">No classes found. Create your first one!</p>
            )}
          </div>
        )}

        {view === "create" && <CreateClassForm onSuccess={() => setView("list")} />}

        {view === "details" && <ClassDetails classId={selectedClassId} />}
      </main>
    </div>
  );
};

export default MyClass;