// pages/dashboard/teacher/components/RecentActivity.tsx
import { useMemo, useState } from "react";
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
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(activities.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleActivities = useMemo(
    () => activities.slice((safePage - 1) * pageSize, safePage * pageSize),
    [activities, safePage]
  );

  return (
    <div className="app-panel rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <HiOutlineClock size={20} className="text-[#3BAC51]" />
          <h3 className="text-lg font-semibold text-[var(--app-text)]">Recent Activity</h3>
        </div>
        <span className="app-muted text-xs font-semibold">
          {activities.length} total
        </span>
      </div>

      <div className="space-y-2">
        {visibleActivities.length > 0 ? visibleActivities.map((activity) => {
          const Icon = getActivityIcon(activity.type);
          return (
            <div key={activity.id} className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-[var(--app-surface-soft)]">
              <div className={`rounded-lg bg-[var(--app-surface-soft)] p-2 ${getActivityColor(activity.type)}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1">
                <p className="line-clamp-2 text-sm text-[var(--app-text)]">{activity.message}</p>
                <p className="app-muted mt-1 text-xs">{formatRelative(activity.createdAt)}</p>
              </div>
            </div>
          );
        }) : <p className="app-muted text-sm">No recent activity yet.</p>}
      </div>

      {activities.length > pageSize && (
        <div className="mt-4 flex items-center justify-between border-t border-[var(--app-border)] pt-3 text-sm">
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={safePage === 1}
            className="app-button-secondary rounded-lg px-3 py-1.5 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <span className="app-muted font-semibold">
            {safePage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            disabled={safePage === totalPages}
            className="app-button-secondary rounded-lg px-3 py-1.5 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
