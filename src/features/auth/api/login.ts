import axiosInstance from "../../../api/axios";
import type  { NormalLogin } from "../../../types/userType";


export const login = async (data: NormalLogin) => {
    const res = await axiosInstance.post("/auth/login", data );
    return res.data
}