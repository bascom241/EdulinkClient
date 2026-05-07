import axiosInstance from "../../../api/axios";
import type{ UpdateRole } from "../../../types/userType";



export const updateRole = async(data: UpdateRole ) => {
    const res = await axiosInstance.post("/auth/update-role", data);
    return res.data
}