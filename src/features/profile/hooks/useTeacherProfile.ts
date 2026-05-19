import { profileKeys } from "../../utils/profileKeys";
import { createTeacherProfile } from "../api/createTeacherProfile";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getTeacherProfile } from "../api/getProflle";


export const useCreateTeacherProfile = () => {
    return useMutation({
        mutationFn:createTeacherProfile
    })
}

export const useGetTeacherProfile = () => {
    return useQuery({
        queryKey: profileKeys.teacher(),
        queryFn: getTeacherProfile
    })
}
