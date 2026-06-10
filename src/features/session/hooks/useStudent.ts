import { useMutation } from "@tanstack/react-query";
import { checkInSession, checkOutSession, joinSession } from "../api/student";

export const useJoinSession = () => {
  return useMutation({
    mutationFn: joinSession,
  });
};

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
