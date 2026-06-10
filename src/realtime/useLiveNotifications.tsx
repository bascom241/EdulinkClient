import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { getLiveSocket } from "./socket";
import { workspaceKeys } from "../features/workspace/workspaceKeys";
import { getStoredRole } from "../features/auth/utils/authToken";

type LiveStartedPayload = {
  sessionId: string;
  classId: string;
  topic: string;
  title: string;
  body: string;
};

type TimetableReadyPayload = {
  classId: string;
  timetableId: string;
  topic: string;
  title: string;
  body: string;
};

export const useLiveNotifications = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getLiveSocket();
    if (!socket) return;

    const handleStarted = (payload: LiveStartedPayload) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.notifications });
      queryClient.invalidateQueries({ queryKey: workspaceKeys.dashboardSummary });
      toast.custom(
        (t) => (
          <div
            className={`max-w-sm rounded-2xl border border-green-100 bg-white p-4 shadow-xl transition ${
              t.visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            <p className="text-sm font-bold text-gray-900">{payload.title}</p>
            <p className="mt-1 text-sm text-gray-600">{payload.body}</p>
            <button
              type="button"
              onClick={() => {
                toast.dismiss(t.id);
                navigate(`/dashboard/live/${payload.sessionId}`);
              }}
              className="mt-3 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white"
            >
              Join live class
            </button>
          </div>
        ),
        { duration: 10000, position: "top-right" }
      );
    };

    const handleTimetableReady = (payload: TimetableReadyPayload) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.notifications });
      queryClient.invalidateQueries({ queryKey: workspaceKeys.dashboardSummary });
      toast.custom(
        (t) => (
          <div
            className={`max-w-sm rounded-2xl border border-green-100 bg-white p-4 shadow-xl transition ${
              t.visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            <p className="text-sm font-bold text-gray-900">{payload.title}</p>
            <p className="mt-1 text-sm text-gray-600">{payload.body}</p>
            <button
              type="button"
              onClick={() => {
                toast.dismiss(t.id);
                const role = getStoredRole();
                navigate(role === "ROLE_TEACHER" ? "/dashboard/teacher/schedule" : "/dashboard/student/schedule");
              }}
              className="mt-3 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white"
            >
              Open schedule
            </button>
          </div>
        ),
        { duration: 10000, position: "top-right" }
      );
    };

    socket.on("live-session:started", handleStarted);
    socket.on("timetable-session:ready", handleTimetableReady);

    return () => {
      socket.off("live-session:started", handleStarted);
      socket.off("timetable-session:ready", handleTimetableReady);
    };
  }, [navigate, queryClient]);
};
