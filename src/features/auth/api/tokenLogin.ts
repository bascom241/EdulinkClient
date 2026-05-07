import axiosInstance from "../../../api/axios";
import type { TokenLogin } from "../../../types/userType";


export const tokenLogin = async (data: TokenLogin) => {
    const res = await axiosInstance.post("/auth/login-with-token", data);
    return res.data;
}
