// In features/session/api/teacher.js
import axiosInstance from "../../../api/axios";

export const getSessions = async (classId: string) => {
    const response = await axiosInstance.get(`/session/all/${classId}`);
    return response.data.data; // Make sure to return the data property
}

// Add this function for creating a session
export const createSession = async (payload: any) => {
    const response = await axiosInstance.post("/session/start", payload);
    return response.data.data;
}