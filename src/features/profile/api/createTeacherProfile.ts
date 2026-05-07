import axiosInstance from "../../../api/axios";
import type { TeacherFormData } from "../../../pages/profile/RegisterTeacherProfileForm";

export const createTeacherProfile = async (data:TeacherFormData) => {
    const res = await axiosInstance.post("/profile/teacher", data);
    return res.data;
}