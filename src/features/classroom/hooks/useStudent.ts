import { useQuery } from "@tanstack/react-query";
import { classroomKeys } from "../classroomKeys";
import { useMutation } from "@tanstack/react-query";
import { getPublicClassroom, getStudentClassrooms, getStudentClassTimeTable, getStudentMarketplace, joinMarketplaceClass } from "../api/student";

export const useGetStudentClassrooms = () => {
  return useQuery({
    queryKey: [...classroomKeys.all, "student-classrooms"],
    queryFn: getStudentClassrooms,
  });
};

export const useGetStudentClassTimeTable = (classId: string) => {
  return useQuery({
    queryKey: classroomKeys.timetable(classId),
    queryFn: () => getStudentClassTimeTable(classId),
    enabled: !!classId,
  });
};

export const useGetStudentMarketplace = (params: {
  search?: string;
  level?: string;
  location?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [...classroomKeys.all, "marketplace", params],
    queryFn: () => getStudentMarketplace(params),
  });
};

export const useJoinMarketplaceClass = () => {
  return useMutation({
    mutationFn: joinMarketplaceClass,
  });
};

export const useGetPublicClassroom = (classId: string) => {
  return useQuery({
    queryKey: [...classroomKeys.all, "public", classId],
    queryFn: () => getPublicClassroom(classId),
    enabled: !!classId,
  });
};
