import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { Classroom } from "../../../types/classroomTypes";
import { useClassroomForm } from "../../../features/classroom/hooks/useClassroomForm";
import {
  useCreateClassroom,
  useGetAllTeacherClassrooms,
  useCreateSessionTimeTable,
  useBulkArchiveClassrooms,
} from "../../../features/classroom/hooks/useTeacher";
import { classroomKeys } from "../../../features/classroom/classroomKeys";
import { sessionKeys } from "../../../features/session/sessionKeys";
import ClassroomTable from "./components/classroom/ClassroomTable";
import ClassroomActionBar from "./components/classroom/ClassroomActionBar";
import CreateClassWizard from "./components/classroom/CreateClassWizard";
import CreateTimeTable from "./components/classroom/CreateTimeTable";
import DashboardShell from "../shared/DashboardShell";
import Loader from "../../../components/ui/Loader";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { getApiErrorMessage } from "../../../utils/apiError";
const MyClass = () => {
  const queryClient = useQueryClient();

  // -----------------------------------
  // STATE
  // -----------------------------------
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [isTimeTableOpen, setIsTimeTableOpen] = useState(false);

  const [selectedClass, setSelectedClass] =
    useState<Classroom | null>(null);

  const [searchQuery, setSearchQuery] =
    useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // -----------------------------------
  // FORM HOOK
  // -----------------------------------
  const {
    formData,
    handleInputChange,
    handleOtherLinkChange,
    addNewLink,
    resetForm,
  } = useClassroomForm();

  // -----------------------------------
  // QUERIES
  // -----------------------------------
  const {
    data: classrooms = [],
    isLoading,
    error,
  } = useGetAllTeacherClassrooms();

  // -----------------------------------
  // MUTATION
  // -----------------------------------
  const {
    mutate,
    isPending,
  } = useCreateClassroom();

  const createTimeTable = useCreateSessionTimeTable();
  const bulkArchive = useBulkArchiveClassrooms();

  // -----------------------------------
  // CREATE CLASS
  // -----------------------------------
  const handleCreateClass = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    // OPTIONAL VALIDATION
    if (
      formData.location === "ONLINE" &&
      !formData.defaultLink
    ) {
      toast.error(
        "Please provide meeting link"
      );

      return;
    }

    if (
      formData.location === "PHYSICAL" &&
      !formData.physicalAddress
    ) {
      toast.error(
        "Please provide physical address"
      );

      return;
    }

    // CLEAN PAYLOAD
    const payload = {
      ...formData,

      latitude: formData.latitude
        ? Number(formData.latitude)
        : null,

      longitude: formData.longitude
        ? Number(formData.longitude)
        : null,
    };

    mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey:
            classroomKeys.teacherClassrooms(),
        });

        resetForm();

        setIsModalOpen(false);

        toast.success(
          "Class created successfully"
        );
      },

      onError: (error: any) => {
        toast.error(getApiErrorMessage(error, "Failed to create classroom"));
      },
    });
  };

  const handleOpenTimeTable = (classroom: Classroom) => {
    setSelectedClass(classroom);
    setIsTimeTableOpen(true);
  };

  const handleCreateTimeTable = async (data: {
    classId: string;
    topic: string;
    startTime: string;
    endTime: string;
  }) => {
    await createTimeTable.mutateAsync(data);

    queryClient.invalidateQueries({
      queryKey: classroomKeys.classroom(data.classId),
    });

    queryClient.invalidateQueries({
      queryKey: sessionKeys.list(data.classId),
    });

    queryClient.invalidateQueries({
      queryKey: classroomKeys.timetable(data.classId),
    });
  };

  const exportClassrooms = (rows: Classroom[]) => {
    const exportRows = selectedIds.length
      ? rows.filter((classroom) => selectedIds.includes(classroom._id))
      : rows;

    if (exportRows.length === 0) {
      toast.error("No classrooms to export");
      return;
    }

    const headers = ["Name", "Description", "Students", "Capacity", "Price", "Location", "Level"];
    const csvRows = exportRows.map((classroom) => [
      classroom.name,
      classroom.description || "",
      String(classroom.students?.length || 0),
      String(classroom.maximumStudent || 0),
      String(classroom.price || 0),
      classroom.location || "",
      classroom.classLevel || "",
    ]);
    const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const csv = [headers, ...csvRows]
      .map((row) => row.map((value) => escapeCsv(String(value))).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `edlink-classrooms-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleBulkArchive = () => {
    if (selectedIds.length === 0) {
      toast.error("Select at least one classroom");
      return;
    }

    bulkArchive.mutate(selectedIds, {
      onSuccess: (data) => {
        toast.success(data?.message || "Classrooms archived");
        setSelectedIds([]);
        queryClient.invalidateQueries({
          queryKey: classroomKeys.teacherClassrooms(),
        });
      },
      onError: (error: any) => {
        toast.error(getApiErrorMessage(error, "Bulk archive failed"));
      },
    });
  };

  // -----------------------------------
  // FILTER CLASSROOMS
  // -----------------------------------


  // -----------------------------------
  // LOADING
  // -----------------------------------
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" message="Loading classrooms..." />
      </div>
    );
  }

  // -----------------------------------
  // ERROR
  // -----------------------------------
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Failed to load classrooms
      </div>
    );
  }

  // -----------------------------------
  // UI
  // -----------------------------------
  const classroomList = Array.isArray(classrooms) ? classrooms : [];

  const filteredClassrooms = classroomList.filter((classroom) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery = !query ||
      classroom.name?.toLowerCase().includes(query) ||
      classroom.description?.toLowerCase().includes(query) ||
      classroom._id?.toLowerCase().includes(query);

    const location = classroom.location?.toLowerCase();
    const price = Number(classroom.price || 0);
    const students = classroom.students?.length || 0;
    const capacity = Number(classroom.maximumStudent || 0);
    const matchesFilter =
      filterValue === "all" ||
      filterValue === location ||
      (filterValue === "free" && price === 0) ||
      (filterValue === "paid" && price > 0) ||
      (filterValue === "full" && capacity > 0 && students >= capacity);

    return matchesQuery && matchesFilter;
  });

  return (
    <DashboardShell
      title="Classrooms"
      subtitle="Create, organize, schedule, and monitor every class from one polished workspace."
      icon={HiOutlinePlusCircle}
      action={
        <button
          onClick={() => setIsModalOpen(true)}
          className="app-button-primary rounded-lg px-4 py-2 text-sm font-semibold"
        >
          Create Class
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="app-panel rounded-2xl p-5">
          <p className="text-sm app-muted">Total Classes</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{classrooms.length}</p>
        </div>
        <div className="app-panel rounded-2xl p-5">
          <p className="text-sm app-muted">Visible</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{filteredClassrooms.length}</p>
        </div>
        <div className="app-panel rounded-2xl p-5">
          <p className="text-sm app-muted">Capacity</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {classrooms.reduce((sum, classroom) => sum + Number(classroom.maximumStudent || 0), 0)}
          </p>
        </div>
        <div className="app-panel rounded-2xl p-5">
          <p className="text-sm app-muted">Theme</p>
          <p className="mt-2 text-3xl font-bold text-green-600">Live</p>
        </div>
      </div>

      <ClassroomActionBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        selectedCount={selectedIds.length}
        onBulkArchive={handleBulkArchive}
        onExport={() => exportClassrooms(filteredClassrooms)}
        isBulkPending={bulkArchive.isPending}
        onCreate={() =>
          setIsModalOpen(true)
        }
      />

      {/* TABLE */}
      <ClassroomTable
        classrooms={filteredClassrooms}
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
        onSelect={setSelectedClass}
        onCreateTimeTable={handleOpenTimeTable}
      />

      {/* CREATE MODAL */}
      <CreateClassWizard
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleCreateClass}
        isPending={isPending}
        handleOtherLinkChange={handleOtherLinkChange}
        addNewLink={addNewLink}
      />
      

      <CreateTimeTable
        isOpen={isTimeTableOpen}
        onClose={()=> setIsTimeTableOpen(false)}
        selectedClass={selectedClass}
        onSubmit={handleCreateTimeTable}
        isPending={createTimeTable.isPending}
      />
    </DashboardShell>
  );
};

export default MyClass;
