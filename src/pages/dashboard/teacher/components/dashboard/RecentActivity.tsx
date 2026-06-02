// pages/dashboard/teacher/components/RecentActivity.tsx
import { HiOutlineClock, HiOutlineUserAdd, HiOutlineTrendingUp } from "react-icons/hi";

type Activity = {
  id: string;
  type: string;
  message: string;
  createdAt: string;
};

const getActivityIcon = (type: string) => {
  if (type.includes("join") || type === "enrollment") return HiOutlineUserAdd;
  if (type.includes("session") || type.includes("attendance")) return HiOutlineClock;
  return HiOutlineTrendingUp;
};

const getActivityColor = (type: string) => {
  if (type.includes("join") || type === "enrollment") return "text-blue-500";
  if (type.includes("session") || type.includes("attendance")) return "text-green-500";
  return "text-yellow-500";
};

const formatRelative = (date?: string) => {
  if (!date) return "Just now";
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.round(hours / 24)} day ago`;
};

const RecentActivity = ({ activities = [] }: { activities?: Activity[] }) => {

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
        {activities.length > 0 ? activities.map((activity) => {
          const Icon = getActivityIcon(activity.type);
          return (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`p-2 rounded-lg bg-gray-100 ${getActivityColor(activity.type)}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">{activity.message}</p>
                <p className="text-xs text-gray-400 mt-1">{formatRelative(activity.createdAt)}</p>
              </div>
            </div>
          );
        }) : <p className="text-sm text-gray-500">No recent activity yet.</p>}
      </div>
    </div>
  );
};

export default RecentActivity;
