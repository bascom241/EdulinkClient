import axiosInstance from "../../../api/axios";

export const verifyPayment = async (reference: string) => {
  const res = await axiosInstance.get(`/payment/verify/${reference}`);
  return res.data.data;
};
