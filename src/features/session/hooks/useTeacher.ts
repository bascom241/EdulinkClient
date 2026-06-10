// features/session/hooks/useTeacher.js
import { useMutation, useQuery } from "@tanstack/react-query"
import { sessionKeys } from "../sessionKeys"
import { createSession, getLiveSessionAccess, getSessionAttendance, getSessions, getSingleSession, gradeSessionAttendance } from "../api/teacher"


export const useGetAllSessionForTeachers = (classId: string) => {
    return useQuery({
        queryKey: sessionKeys.list(classId),
        queryFn: () => getSessions(classId),
        enabled: !!classId,
        select: (data) => data?.session ? data : { session: [], pagination: data?.pagination }
    });
};

export const useGetSessionAttendance = (sessionId: string) => {
    return useQuery({
        queryKey: sessionKeys.attendance(sessionId),
        queryFn: () => getSessionAttendance(sessionId),
        enabled: !!sessionId,
    });
};

export const useGradeSessionAttendance = () => {
    return useMutation({
        mutationFn: gradeSessionAttendance,
    });
};

export const useCreateLiveSession = () => {
    return useMutation({
        mutationFn: createSession,
    });
};

export const useGetSingleSession = (sessionId: string) => {
    return useQuery({
        queryKey: sessionKeys.detail(sessionId),
        queryFn: () => getSingleSession(sessionId),
        enabled: !!sessionId,
    });
};

export const useGetLiveSessionAccess = (sessionId: string) => {
    return useQuery({
        queryKey: [...sessionKeys.detail(sessionId), "live-access"],
        queryFn: () => getLiveSessionAccess(sessionId),
        enabled: !!sessionId,
    });
};
