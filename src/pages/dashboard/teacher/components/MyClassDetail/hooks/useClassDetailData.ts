import { useMemo } from "react";
import type { Classroom, Session, SessionsResponse } from "../types/classroom.types";

type Pagination = {
  total: number;
  totalPages: number;
  currentPage?: number;
  page?: number;
  limit: number;
};

interface UseClassDetailDataProps {
  classData?: Classroom;
  sessionsResponse?: SessionsResponse | Session[];
}

export const useClassDetailData = ({
  classData,
  sessionsResponse,
}: UseClassDetailDataProps) => {
  return useMemo(() => {
    let sessions: Session[] = [];
    let pagination: Pagination | undefined;

    if (Array.isArray(sessionsResponse)) {
      sessions = sessionsResponse;
    } else if (sessionsResponse?.session) {
      sessions = sessionsResponse.session;
      pagination = sessionsResponse.pagination as Pagination | undefined;
    } else if (sessionsResponse?.data?.session) {
      sessions = sessionsResponse.data.session;
      pagination = sessionsResponse.data.pagination as Pagination | undefined;
    }

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(
      (session) => session.sessionStatus === "completed" || session.isCompleted
    ).length;
    const ongoingSessions = sessions.filter(
      (session) => session.sessionStatus === "ongoing" || session.sessionStatus === "active"
    ).length;
    const totalStudents = classData?.students?.length || 0;
    const courseProgress =
      totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

    return {
      sessions,
      pagination,
      totalSessions,
      completedSessions,
      ongoingSessions,
      totalStudents,
      courseProgress,
    };
  }, [classData, sessionsResponse]);
};
