import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { Classroom } from "../../../types/classroomTypes";
import { useClassroomForm } from "../../../features/classroom/hooks/useClassroomForm";
import {
  useCreateClassroom,
  useGetAllTeacherClassrooms,
} from "../../../features/classroom/hooks/useTeacher";
import { classroomKeys } from "../../../features/classroom/classroomKeys";
import ClassroomTable from "./components/classroom/ClassroomTable";
import ClassroomActionBar from "./components/classroom/ClassroomActionBar";
import ClassHeader from "./components/classroom/ClassHeader";
import CreateClassWizard from "./components/classroom/CreateClassWizard";
import CreateTimeTable from "./components/classroom/CreateTimeTable";
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
        toast.error(
          error?.response?.data?.message ||
          "Failed to create classroom"
        );
      },
    });
  };

  // -----------------------------------
  // FILTER CLASSROOMS
  // -----------------------------------
  const filteredClassrooms =
    classrooms.filter((cls: Classroom) =>
      cls.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

  // -----------------------------------
  // LOADING
  // -----------------------------------
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin" />
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
  return (
    <div className="p-4 md:p-8 bg-white min-h-screen">
      {/* HEADER */}
      <ClassHeader />

      {/* ACTION BAR */}
      <ClassroomActionBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCreate={() =>
          setIsModalOpen(true)
        }
      />

      {/* TABLE */}
      <ClassroomTable
        classrooms={filteredClassrooms}
        onSelect={setSelectedClass}
        onCreateTimeTable={()=>setIsTimeTableOpen(true)}
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


      />
    </div>
  );
};

export default MyClass;