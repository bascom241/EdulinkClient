import { updateRole } from "../api/updateRole";
import { useMutation } from "@tanstack/react-query";


export const useUpdateRole = () => {
    return useMutation({
        mutationFn: updateRole
    })
}