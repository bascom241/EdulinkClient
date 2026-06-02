// In features/session/api/teacher.js
import axiosInstance from "../../../api/axios";

export const getSessions = async (classId: string) => {
    const response = await axiosInstance.get(`/session/all/${classId}`);
    return response.data.data; // Make sure to return the data property
}

// Add this function for creating a session
export const createSession = async (payload: any) => {
    const response = await axiosInstance.post("/session", payload);
    return response.data.data;
}

export const getSingleSession = async (sessionId: string) => {
    const response = await axiosInstance.get(`/session/${sessionId}`);
    return response.data.data;
}

export const getSessionAttendance = async (sessionId: string) => {
    const response = await axiosInstance.get(`/session/${sessionId}/attendance`);
    return response.data.data;
}

export const gradeSessionAttendance = async (payload: {
    sessionId: string;
    studentId: string;
    grade: number;
    note?: string;
}) => {
    const response = await axiosInstance.patch(
        `/session/${payload.sessionId}/attendance/${payload.studentId}/grade`,
        { grade: payload.grade, note: payload.note },
    );
    return response.data.data;
}
