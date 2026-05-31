// features/session/hooks/useTeacher.js
import { useQuery } from "@tanstack/react-query"
import { sessionKeys } from "../sessionKeys"
import { getSessions } from "../api/teacher"


export const useGetAllSessionForTeachers = (classId: string) => {
    return useQuery({
        queryKey: sessionKeys.list(classId),
        queryFn: () => getSessions(classId),
        enabled: !!classId,
        // Add this to handle empty sessions
        select: (data) => data?.session || []
    });
};