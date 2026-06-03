import axiosInstance from "../../../api/axios";
import type { Classroom, TimeTableResponse } from "../../../types/classroomTypes";
import type{ CreateClassPayload } from "../../../types/classroomTypes";


export const getStudentCounts = async () => {
    const res = await axiosInstance.get("/classroom/get-student-counts");
    return res.data;
}

export const getClassCounts = async () => {
    const res = await axiosInstance.get("/classroom/class-counts");
    return res.data;
}


export const getTeacherClassrooms = async (): Promise<Classroom[]> => {
  const res = await axiosInstance.get("/classroom/get-student-class");
  return Array.isArray(res.data?.data) ? res.data.data : [];
};




export const createClassroom = async (data: CreateClassPayload) => {
  const res = await axiosInstance.post("/classroom/create-class", data);
  return res.data.data;
};

export const bulkArchiveClassrooms = async (classIds: string[]) => {
  const res = await axiosInstance.post("/classroom/bulk/archive", { classIds });
  return res.data;
};


export const getClassCategories = async () => {
  const res = await axiosInstance.get("/classroom/get-cats");
  return res.data.data;
}

export const getSingleClassroom = async (classId: string): Promise<Classroom> => {
  const res = await axiosInstance.get(`/classroom/get-teacher-class/${classId}`);
  return res.data.data;
}

export const createSessionTimeTable = async (data: {
  classId: string;
  topic: string;
  startTime: string;
  endTime: string;
}) => {
  const res = await axiosInstance.post("/classroom/session-time-table", data);
  return res.data.data;
}

export const getClassTimeTable = async (classId: string): Promise<TimeTableResponse> => {
  const res = await axiosInstance.get(`/classroom/${classId}/timetable`);
  return res.data.data;
}

export const updateClassTimeTable = async (data: {
  classId: string;
  timetableId: string;
  topic: string;
  startTime: string;
  endTime: string;
}): Promise<TimeTableResponse> => {
  const res = await axiosInstance.patch(
    `/classroom/${data.classId}/timetable/${data.timetableId}`,
    {
      topic: data.topic,
      startTime: data.startTime,
      endTime: data.endTime,
    },
  );
  return res.data.data;
}

export const deleteClassTimeTable = async (data: {
  classId: string;
  timetableId: string;
}): Promise<TimeTableResponse> => {
  const res = await axiosInstance.delete(`/classroom/${data.classId}/timetable/${data.timetableId}`);
  return res.data.data;
}

export const getClassStudents = async (classId: string) => {
  const res = await axiosInstance.get(`/classroom/${classId}/students`);
  return Array.isArray(res.data?.data) ? res.data.data : [];
}




