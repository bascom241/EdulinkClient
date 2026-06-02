// MyClassDetail/hooks/useClassDetailData.ts
import { useMemo } from 'react';
import type { Classroom, SessionsResponse, Session } from '../../types/classroom.types';

interface UseClassDetailDataProps {
  classData?: Classroom;
  sessionsResponse?: SessionsResponse;
}

interface UseClassDetailDataReturn {
  sessions: Session[];
  pagination?: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  totalSessions: number;
  completedSessions: number;
  ongoingSessions: number;
  totalStudents: number;
  courseProgress: number;
}

export const useClassDetailData = ({ 
  classData, 
  sessionsResponse 
}: UseClassDetailDataProps): UseClassDetailDataReturn => {
  return useMemo(() => {
    let sessions: Session[] = [];
    let pagination = undefined;
    
    if (sessionsResponse) {
      if (Array.isArray(sessionsResponse)) {
        sessions = sessionsResponse;
      } else if (sessionsResponse.session && Array.isArray(sessionsResponse.session)) {
        sessions = sessionsResponse.session;
        pagination = sessionsResponse.pagination;
      } else if (sessionsResponse.data && sessionsResponse.data.session) {
        sessions = sessionsResponse.data.session;
        pagination = sessionsResponse.data.pagination;
      } else if (sessionsResponse.data && Array.isArray(sessionsResponse.data)) {
        sessions = sessionsResponse.data;
      }
    }

    const totalSessions = sessions.length || 0;
    const completedSessions = sessions.filter((s: Session) => s.sessionStatus === "completed").length || 0;
    const ongoingSessions = sessions.filter((s: Session) => 
      s.sessionStatus === "ongoing" || s.sessionStatus === "active"
    ).length || 0;
    const totalStudents = classData?.students?.length || 0;
    const courseProgress = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

    return {
      sessions,
      pagination,
      totalSessions,
      completedSessions,
      ongoingSessions,
      totalStudents,
      courseProgress
    };
  }, [sessionsResponse, classData]);
};
