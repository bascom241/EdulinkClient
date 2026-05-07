import axiosInstance from "../../../api/axios";
import type  { RegisterUserData } from "../../../types/userType";

export const register = async (data: RegisterUserData) => {
    const res = await axiosInstance.post("/auth/register", data );
    return res.data
}