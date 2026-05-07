import axiosInstance from "../../../api/axios";
import type  { VerifyToken } from "../../../types/userType";


export const verifyToken = async (data: VerifyToken) => {
    const res = await axiosInstance.post("/auth/verify-login", data);
    return res.data;
}