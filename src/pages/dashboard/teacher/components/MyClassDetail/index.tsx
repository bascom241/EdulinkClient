// MyClassDetail/index.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useGetSingleClass } from "../../../../../features/classroom/hooks/useTeacher";
import { useGetAllSessionForTeachers } from "../../../../../features/session/hooks/useTeacher";
import ClassDetailHeader from "./components/header/ClassHeader";
import StatsCards from "./components/StatsCards/StatsCards";
import ChartsSection from "./components/charts/ChartsSection";
import TabsNavigation from "./components/Tabs/TabsNavigation";
import TabContent from "./components/Tabs/TabContent";
import ClassLoadingState from "./components/LoadingStates/ClassLoadingState";
import ErrorState from "./components/LoadingStates/ErrorState";
import { useClassDetailData } from "./hooks/useClassDetailData";
import type { Tab } from "./types/classroom.types";

const MyClassDetail: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<Tab['id']>("overview");

  const { 
    data: classData, 
    isLoading: classLoading, 
    error: classError 
  } = useGetSingleClass(classId as string);
  
  const { 
    data: sessionsResponse, 
    isLoading: sessionsLoading, 
    error: sessionsError 
  } = useGetAllSessionForTeachers(classId as string);

  const {
    sessions,
    pagination,
    totalSessions,
    completedSessions,
    ongoingSessions,
    totalStudents,
    courseProgress
  } = useClassDetailData({ classData, sessionsResponse });

  if (!classId) {
    return <ErrorState type="not-found" onBack={() => navigate("/dashboard/teacher/classrooms")} />;
  }

  if (classLoading || sessionsLoading) {
    return <ClassLoadingState />;
  }

  if (classError || sessionsError || !classData) {
    return <ErrorState type="error" onBack={() => navigate("/dashboard/teacher/classrooms")} />;
  }

  const tabs: Tab[] = [
    { id: "overview", label: "Overview", icon: "fas fa-info-circle" },
    { id: "timetable", label: "Time Table", icon: "fas fa-calendar-alt" },
    { id: "sessions", label: "All Sessions", icon: "fas fa-video" },
    { id: "students", label: "Students", icon: "fas fa-users" },
    { id: "resources", label: "Resources", icon: "fas fa-folder-open" }
  ];

  return (
    <div className="space-y-6">
      <ClassDetailHeader 
        classData={classData}
        ongoingSessions={ongoingSessions}
        onBack={() => navigate(-1)}
      />

      <div className="max-w-[1400px] mx-auto space-y-6">
        <StatsCards
          totalStudents={totalStudents}
          totalSessions={totalSessions}
          completedSessions={completedSessions}
          ongoingSessions={ongoingSessions}
          courseProgress={courseProgress}
          maximumStudent={classData.maximumStudent}
        />

        <ChartsSection sessions={sessions} />

        <TabsNavigation 
          tabs={tabs}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
        />

        <TabContent
          selectedTab={selectedTab}
          classData={classData}
          classId={classId}
          sessions={sessions}
          pagination={pagination}
          totalStudents={totalStudents}
        />
      </div>
    </div>
  );
};

export default MyClassDetail;
