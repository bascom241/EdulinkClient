import axiosInstance from "../../../api/axios";
import type { Assignment } from "../../../types/classroomTypes";

export const getTeacherAssignments = async (classId?: string): Promise<Assignment[]> => {
  const res = await axiosInstance.get("/assignment/teacher", {
    params: classId ? { classId } : undefined,
  });
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

export const getStudentAssignments = async (): Promise<Assignment[]> => {
  const res = await axiosInstance.get("/assignment/student");
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

export const createAssignment = async (data: {
  classroomId: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
}) => {
  const res = await axiosInstance.post("/assignment", data);
  return res.data.data;
};

export const updateAssignment = async (data: Partial<Assignment> & { assignmentId: string }) => {
  const { assignmentId, ...payload } = data;
  const res = await axiosInstance.patch(`/assignment/${assignmentId}`, payload);
  return res.data.data;
};

export const deleteAssignment = async (assignmentId: string) => {
  const res = await axiosInstance.delete(`/assignment/${assignmentId}`);
  return res.data.data;
};
