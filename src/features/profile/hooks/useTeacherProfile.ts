import { createTeacherProfile } from "../api/createTeacherProfile";
import { useMutation } from "@tanstack/react-query";


export const useCreateTeacherProfile = () => {
    return useMutation({
        mutationFn:createTeacherProfile
    })
}
