import { useMutation } from "@tanstack/react-query";
import { tokenLogin } from "../api/tokenLogin";


export const useTokenLogin = () => {
    return useMutation({
        mutationFn:tokenLogin 
    })
}