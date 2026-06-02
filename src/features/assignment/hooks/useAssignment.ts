import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createAssignment,
  deleteAssignment,
  getStudentAssignments,
  getTeacherAssignments,
  updateAssignment,
} from "../api/assignment";
import { assignmentKeys } from "../assignmentKeys";

export const useGetTeacherAssignments = (classId?: string) => {
  return useQuery({
    queryKey: assignmentKeys.teacher(classId),
    queryFn: () => getTeacherAssignments(classId),
  });
};

export const useGetStudentAssignments = () => {
  return useQuery({
    queryKey: assignmentKeys.student(),
    queryFn: getStudentAssignments,
  });
};

export const useCreateAssignment = () => {
  return useMutation({ mutationFn: createAssignment });
};

export const useUpdateAssignment = () => {
  return useMutation({ mutationFn: updateAssignment });
};

export const useDeleteAssignment = () => {
  return useMutation({ mutationFn: deleteAssignment });
};
