import { useMutation } from "@tanstack/react-query";
import { verifyToken } from "../api/verifyToken";


export const useVerifyToken = () => {
    return useMutation({
        mutationFn: verifyToken
    })
}
