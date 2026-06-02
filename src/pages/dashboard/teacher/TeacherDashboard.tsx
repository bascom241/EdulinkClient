import TeacherStats from "./components/dashboard/TeacherStats";
import RevenueChart from "./components/dashboard/RevenueChart";
import RecentActivity from "./components/dashboard/RecentActivity";
import EnrollmentChart from "./components/dashboard/EnrollmentChart";
import PerformanceMetrics from "./components/dashboard/PerformanceMetrics";
import { useGetTeacherProfile } from "../../../features/profile/hooks/useTeacherProfile";
import { useDashboardSummary } from "../../../features/workspace/hooks/useWorkspace";
import Loader from "../../../components/ui/Loader";

const TeacherDashboard = () => {
  const { data } = useGetTeacherProfile();
  const { data: summary, isLoading } = useDashboardSummary();
  const apiData = data?.data;
  const summaryStats = summary?.stats || {};

  const teacherData = {
    fullName: apiData?.fullName || "Teacher",
    professionalTitle: apiData?.professionalTitle || "Instructor",
    shortBio: apiData?.shortBio || "",
    country: apiData?.country || "",
    coursesToTeach: apiData?.coursesToTeach || [],
    teachingExperience: apiData?.teachingExperience || "Beginner",
    noOfStudentsEnrolled: summaryStats.students || 0,
    noOfCoursesCompleted: summaryStats.classes || 0,
    noOfSessionCompleted: summaryStats.completedSessions || 0,
    sctaPoints: apiData?.sctaPoints || 0,
    classroomCount: summaryStats.classes || apiData?.classroomCount || 0,
    teacherBadge: apiData?.teacherBadge || "New Teacher",
    studentReviewCount: summaryStats.averageGrade || 0,
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" message="Loading dashboard data..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {teacherData.fullName}!
        </h1>
        <p className="mt-1 text-gray-500">
          {teacherData.professionalTitle} - live data from your classes, sessions, and attendance.
        </p>
      </div>

      <TeacherStats teacherData={teacherData} summaryStats={summaryStats} />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart data={summary?.charts?.revenue || []} />
        <EnrollmentChart data={summary?.charts?.enrollment || []} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PerformanceMetrics
          summaryStats={summaryStats}
          sessionCompletion={summary?.charts?.sessionCompletion || []}
        />
        <RecentActivity activities={summary?.recentActivity || []} />
      </div>
    </div>
  );
};

export default TeacherDashboard;
