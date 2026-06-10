import axiosInstance from "../../../api/axios";

export const joinSession = async (payload: { sessionId: string; classId: string }) => {
  const res = await axiosInstance.post("/session/join", payload);
  return res.data.data;
};

export const checkInSession = async (payload: { sessionId: string; classId: string }) => {
  const res = await axiosInstance.post(`/session/${payload.sessionId}/check-in`, {
    classId: payload.classId,
  });
  return res.data.data;
};

export const checkOutSession = async (sessionId: string) => {
  const res = await axiosInstance.post(`/session/${sessionId}/check-out`);
  return res.data.data;
};
