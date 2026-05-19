
import axiosInstance from "../../../api/axios"

export const getTeacherProfile = async() => {
    const res = await axiosInstance.get("/profile/teacher");
    console.log(res)
    return res.data;
}