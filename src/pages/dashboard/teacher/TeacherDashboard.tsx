
import TeacherStats from "./components/TeacherStats";
import RevenueChart from "./components/RevenueChart";
import RecentActivity from "./components/RecentActivity";
import EnrollmentChart from "./components/EnrollmentChart";
import PerformanceMetrics from "./components/PerformanceMetrics";

const TeacherDashboard = () => {
  // Demo teacher data



  const teacherData = {
    fullName: "Dr. Sarah Johnson",
    professionalTitle: "Senior Mathematics Instructor",
    noOfStudentsEnrolled: 0,
    noOfCoursesCompleted: 8,
    noOfSessionCompleted: 156,
    sctaPoints: 2840,
    classroomCount: 4,
    teacherBadge: "Gold Teacher",
    studentReviewCount: 4.8,
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