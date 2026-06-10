import { useMutation } from "@tanstack/react-query";
import { verifyPayment } from "../api/payment";

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: verifyPayment,
  });
};
