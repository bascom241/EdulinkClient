import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { HiOutlineBell, HiOutlineCheckCircle } from "react-icons/hi";
import { workspaceKeys } from "../../../features/workspace/workspaceKeys";
import { useMarkNotificationRead, useNotifications } from "../../../features/workspace/hooks/useWorkspace";
import DashboardShell from "./DashboardShell";

const Notifications = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: notifications = [], isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const unread = notifications.filter((item: any) => !item.isRead).length;

  const handleRead = async (id: string) => {
    await markRead.mutateAsync(id);
    queryClient.invalidateQueries({ queryKey: workspaceKeys.notifications });
    toast.success("Notification marked as read");
  };

  return (
    <DashboardShell
      title="Notifications"
      subtitle="Follow schedule reminders, assignment updates, messages, and system alerts."
      icon={HiOutlineBell}
      action={<span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">{unread} unread</span>}
    >
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading notifications...</div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {notifications.map((item: any) => (
              <article key={item._id} className={`p-5 ${item.isRead ? "bg-white" : "bg-green-50/40"}`}>
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-900">{item.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">{item.body}</p>
                    <p className="mt-2 text-xs uppercase text-gray-400">{item.type}</p>
                  </div>
                  {!item.isRead && (
                    <div className="flex flex-wrap gap-2">
                      {item.type === "live_session" && item.metadata?.sessionId && (
                        <button
                          onClick={() => navigate(`/dashboard/live/${item.metadata.sessionId}`)}
                          className="inline-flex w-fit items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white shadow-sm"
                        >
                          Join live
                        </button>
                      )}
                      <button onClick={() => handleRead(item._id)} className="inline-flex w-fit items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-green-700 shadow-sm">
                        <HiOutlineCheckCircle /> Mark read
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-gray-500">No notifications yet.</div>
        )}
      </section>
    </DashboardShell>
  );
};

export default Notifications;
