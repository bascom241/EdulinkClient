
import TeacherStats from "./components/dashboard/TeacherStats";
import RevenueChart from "./components/dashboard/RevenueChart";
import RecentActivity from "./components/dashboard/RecentActivity";
import EnrollmentChart from "./components/dashboard/EnrollmentChart";
import PerformanceMetrics from "./components/dashboard/PerformanceMetrics";
import { useGetTeacherProfile } from "../../../features/profile/hooks/useTeacherProfile";
const TeacherDashboard = () => {
  // Demo teacher data

  const {data} = useGetTeacherProfile();
console.log(data?.data);

const apiData = data?.data;

const teacherData = {
  fullName: apiData?.fullName || "Unknown Teacher",

  professionalTitle:
    apiData?.professionalTitle || "Instructor",

  shortBio:
    apiData?.shortBio || "",

  country:
    apiData?.country || "",

  coursesToTeach:
    apiData?.coursesToTeach || [],

  teachingExperience:
    apiData?.teachingExperience || "Beginner",

  // fallback stats so UI never breaks
  noOfStudentsEnrolled:
    apiData?.noOfStudentsEnrolled || 0,

  noOfCoursesCompleted:
    apiData?.noOfCoursesCompleted || 0,

  noOfSessionCompleted:
    apiData?.noOfSessionCompleted || 0,

  sctaPoints:
    apiData?.sctaPoints || 0,

  classroomCount:
    apiData?.classroomCount || 0,

  teacherBadge:
    apiData?.teacherBadge || "New Teacher",

  studentReviewCount:
    apiData?.studentReviewCount || 0,
};

  return (
    <div className="p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {teacherData.fullName}!
        </h1>
        <p className="text-gray-500 mt-1">
          {teacherData.professionalTitle} • Here's what's happening with your teaching journey
        </p>
      </div>

      {/* Stats Cards */}
      <TeacherStats teacherData={teacherData} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <RevenueChart />
        <EnrollmentChart />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <PerformanceMetrics teacherData={teacherData} />
        <RecentActivity />
      </div>
    </div>
  );
};

export default TeacherDashboard;