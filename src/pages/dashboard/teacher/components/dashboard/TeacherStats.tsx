// pages/dashboard/teacher/components/TeacherStats.tsx
import { 
  HiOutlineUsers, 
  HiOutlineBookOpen, 
  HiOutlineStar, 
  HiOutlineChartBar
} from "react-icons/hi";

interface TeacherStatsProps {
  teacherData: any;
}

import { useGetClassCounts, useGetStudentCount } from "../../../../../features/classroom/hooks/useTeacher";

const TeacherStats = ({ teacherData }: TeacherStatsProps) => {
// 1. Fetch Student Count
  const { data: studentData } = useGetStudentCount();

  // 2. Fetch Class Count (Corrected hook call)
  const { data: classData } = useGetClassCounts();
  console.log(studentData);
  console.log(classData)
  const stats = [
    {
      title: "Total Students",
    value: studentData?.data ?? 0,
      change: "+12%",
      icon: HiOutlineUsers,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Active Classes",
      value: classData?.data ?? 0,
      change: "+2",
      icon: HiOutlineBookOpen,
      color: "bg-green-50 text-[#3BAC51]"
    },
    {
      title: "SCTA Points",
      value: teacherData.sctaPoints,
      change: "+450",
      icon: HiOutlineStar,
      color: "bg-yellow-50 text-yellow-600"
    },
    {
      title: "Sessions Completed",
      value: teacherData.noOfSessionCompleted,
      change: "+12",
      icon: HiOutlineChartBar,
      color: "bg-purple-50 text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-lg ${stat.color}`}>
                <Icon size={20} />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value.toLocaleString()}</h3>
            <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
          </div>
        );
      })}
    </div>
  );
};

export default TeacherStats;