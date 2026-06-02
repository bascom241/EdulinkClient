import axiosInstance from "../../../api/axios";

export const getMessages = async () => {
  const res = await axiosInstance.get("/workspace/messages");
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

export const createMessage = async (data: {
  classroom?: string;
  recipient?: string;
  subject: string;
  body: string;
}) => {
  const res = await axiosInstance.post("/workspace/messages", data);
  return res.data.data;
};

export const getNotifications = async () => {
  const res = await axiosInstance.get("/workspace/notifications");
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

export const markNotificationRead = async (notificationId: string) => {
  const res = await axiosInstance.patch(`/workspace/notifications/${notificationId}/read`);
  return res.data.data;
};

export const getMaterials = async () => {
  const res = await axiosInstance.get("/workspace/materials");
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

export const getRecordings = async () => {
  const res = await axiosInstance.get("/workspace/recordings");
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

export const createRecording = async (data: {
  classroom: string;
  session?: string;
  title: string;
  url: string;
  durationMinutes: number;
}) => {
  const res = await axiosInstance.post("/workspace/recordings", data);
  return res.data.data;
};

export const getGradeSummary = async () => {
  const res = await axiosInstance.get("/workspace/grades");
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

export const getDashboardSummary = async () => {
  const res = await axiosInstance.get("/workspace/dashboard-summary");
  return res.data?.data;
};
