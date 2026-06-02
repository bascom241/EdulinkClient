import axiosInstance from "../../../api/axios";
import type { Classroom, MarketplaceResponse, TimeTableResponse } from "../../../types/classroomTypes";

export const getStudentClassrooms = async (): Promise<Classroom[]> => {
  const res = await axiosInstance.get("/classroom/get-student-class");
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

export const getStudentClassTimeTable = async (classId: string): Promise<TimeTableResponse> => {
  const res = await axiosInstance.get(`/classroom/${classId}/timetable`);
  return res.data.data;
};

export const getStudentMarketplace = async (params: {
  search?: string;
  level?: string;
  location?: string;
  page?: number;
  limit?: number;
}): Promise<MarketplaceResponse> => {
  const res = await axiosInstance.get("/classroom/marketplace", { params });
  return (
    res.data?.data || {
      classroom: [],
      pagination: { total: 0, page: 1, limit: 12, totalPages: 0 },
    }
  );
};

export const joinMarketplaceClass = async (classId: string): Promise<string> => {
  const res = await axiosInstance.post("/classroom/join", { classId });
  return res.data?.data;
};
