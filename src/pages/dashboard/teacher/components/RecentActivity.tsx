// pages/dashboard/teacher/components/RecentActivity.tsx
import { HiOutlineClock, HiOutlineUserAdd, HiOutlineTrendingUp } from "react-icons/hi";

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'enrollment',
      message: 'New student enrolled in Advanced Mathematics',
      time: '2 hours ago',
      icon: HiOutlineUserAdd,
      color: 'text-blue-500'
    },
    {
      id: 2,
      type: 'scta',
      message: 'Earned 50 SCTA points for completing session',
      time: '5 hours ago',
      icon: HiOutlineTrendingUp,
      color: 'text-yellow-500'
    },
    {
      id: 3,
      type: 'completion',
      message: 'Student completed Data Science Bootcamp',
      time: '1 day ago',
      icon: HiOutlineClock,
      color: 'text-green-500'
    },
    {
      id: 4,
      type: 'enrollment',
      message: '5 new students joined Physics Fundamentals',
      time: '2 days ago',
      icon: HiOutlineUserAdd,
      color: 'text-blue-500'
    },
    {
      id: 5,
      type: 'scta',
      message: 'Achieved Gold Teacher badge!',
      time: '3 days ago',
      icon: HiOutlineTrendingUp,
      color: 'text-yellow-500'
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <HiOutlineClock size={20} className="text-[#3BAC51]" />
          <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
        </div>
        <button className="text-sm text-[#3BAC51] hover:text-[#2d8a41] font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`p-2 rounded-lg bg-gray-100 ${activity.color}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">{activity.message}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;