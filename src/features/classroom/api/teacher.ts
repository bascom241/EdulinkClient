import axiosInstance from "../../../api/axios";
import type { Classroom, CreateClassCategoryRequest } from "../../../types/classroomTypes";
import type{ CreateClassPayload } from "../../../types/classroomTypes";


export const getStudentCounts = async () => {
    const res = await axiosInstance.get("/classroom/get-student-counts");
    console.log(res)
    return res.data;
}

export const getClassCounts = async () => {
    const res = await axiosInstance.get("/classroom/class-counts");
    return res.data;
}


export const getTeacherClassrooms = async (): Promise<Classroom[]> => {
  const res = await axiosInstance.get("/classroom/get-student-class");
  console.log(res)
  return res.data.data;
};


export const createClassroom = async (data: CreateClassPayload) => {
  const res = await axiosInstance.post("/classroom/create-class", data);
  return res.data.data;
};


export const getClassCategories = async () => {
  const res = await axiosInstance.get("/classroom/get-cats");
  return res.data.data;
}


