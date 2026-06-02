import { useMutation } from "@tanstack/react-query";
import { checkInSession, checkOutSession } from "../api/student";

export const useCheckInSession = () => {
  return useMutation({
    mutationFn: checkInSession,
  });
};

export const useCheckOutSession = () => {
  return useMutation({
    mutationFn: checkOutSession,
  });
};
