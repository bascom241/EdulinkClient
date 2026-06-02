import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createMessage,
  createRecording,
  getDashboardSummary,
  getGradeSummary,
  getMaterials,
  getMessages,
  getNotifications,
  getRecordings,
  markNotificationRead,
} from "../api/workspace";
import { workspaceKeys } from "../workspaceKeys";

export const useMessages = () => useQuery({ queryKey: workspaceKeys.messages, queryFn: getMessages });
export const useCreateMessage = () => useMutation({ mutationFn: createMessage });
export const useNotifications = () => useQuery({ queryKey: workspaceKeys.notifications, queryFn: getNotifications });
export const useMarkNotificationRead = () => useMutation({ mutationFn: markNotificationRead });
export const useMaterials = () => useQuery({ queryKey: workspaceKeys.materials, queryFn: getMaterials });
export const useRecordings = () => useQuery({ queryKey: workspaceKeys.recordings, queryFn: getRecordings });
export const useCreateRecording = () => useMutation({ mutationFn: createRecording });
export const useGradeSummary = () => useQuery({ queryKey: workspaceKeys.grades, queryFn: getGradeSummary });
export const useDashboardSummary = () => useQuery({ queryKey: workspaceKeys.dashboardSummary, queryFn: getDashboardSummary });
