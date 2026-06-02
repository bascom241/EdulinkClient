import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  HiOutlineArrowLeft,
  HiOutlineClock,
  HiOutlineStatusOnline,
  HiOutlineUserGroup,
} from "react-icons/hi";
import DashboardShell from "./DashboardShell";
import Loader from "../../../components/ui/Loader";
import { useGetSingleSession } from "../../../features/session/hooks/useTeacher";
import {
  useCheckInSession,
  useCheckOutSession,
} from "../../../features/session/hooks/useStudent";
import { getLiveSocket } from "../../../realtime/socket";
import { getApiErrorMessage } from "../../../utils/apiError";
import { workspaceKeys } from "../../../features/workspace/workspaceKeys";

type ActivityItem = {
  id: string;
  label: string;
  detail: string;
  time: string;
};

const formatDateTime = (date?: string) => {
  if (!date) return "Not scheduled";
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const LiveClassRoom = () => {
  const { sessionId = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const role = localStorage.getItem("role");
  const isStudent = role === "ROLE_USER";
  const sessionQuery = useGetSingleSession(sessionId);
  const checkIn = useCheckInSession();
  const checkOut = useCheckOutSession();
  const checkedInRef = useRef(false);
  const checkedOutRef = useRef(false);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const session = sessionQuery.data;
  const classId = session?.classId;
  const liveRoomUrl = useMemo(() => {
    if (session?.liveRoomUrl) return session.liveRoomUrl;
    if (sessionId) return `https://meet.jit.si/edlink-${sessionId}`;
    return "";
  }, [session?.liveRoomUrl, sessionId]);

  useEffect(() => {
    const socket = getLiveSocket();
    if (!socket || !classId) return;

    socket.emit("classroom:join", classId);

    const addActivity = (label: string, detail: string) => {
      setActivity((prev) => [
        {
          id: `${Date.now()}-${Math.random()}`,
          label,
          detail,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        ...prev,
      ].slice(0, 8));
    };

    const onJoined = (payload: any) => {
      if (payload.sessionId === sessionId) {
        addActivity("Student joined", "Attendance check-in recorded.");
      }
    };
    const onLeft = (payload: any) => {
      if (payload.sessionId === sessionId) {
        addActivity(
          "Student left",
          `${payload.durationMinutes || 0} minutes saved.`
        );
      }
    };
    const onEnded = (payload: any) => {
      if (payload.sessionId === sessionId) {
        addActivity("Session ended", "The scheduled live room has expired.");
      }
    };

    socket.on("live-session:student-joined", onJoined);
    socket.on("live-session:student-left", onLeft);
    socket.on("live-session:ended", onEnded);

    return () => {
      socket.emit("classroom:leave", classId);
      socket.off("live-session:student-joined", onJoined);
      socket.off("live-session:student-left", onLeft);
      socket.off("live-session:ended", onEnded);
    };
  }, [classId, sessionId]);

  useEffect(() => {
    if (!isStudent || !sessionId || !classId || checkedInRef.current) return;

    checkedInRef.current = true;
    checkIn.mutate(
      { sessionId, classId },
      {
        onSuccess: () => toast.success("Attendance recorded"),
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: workspaceKeys.dashboardSummary });
          queryClient.invalidateQueries({ queryKey: workspaceKeys.grades });
        },
        onError: (error: any) => {
          checkedInRef.current = false;
          toast.error(getApiErrorMessage(error, "Could not record attendance"));
        },
      }
    );
  }, [checkIn, classId, isStudent, sessionId]);

  useEffect(() => {
    if (!isStudent || !sessionId) return;

    const checkout = () => {
      if (!checkedInRef.current || checkedOutRef.current) return;
      checkedOutRef.current = true;
      checkOut.mutate(sessionId, {
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: workspaceKeys.dashboardSummary });
          queryClient.invalidateQueries({ queryKey: workspaceKeys.grades });
        },
      });
    };

    window.addEventListener("beforeunload", checkout);
    return () => {
      window.removeEventListener("beforeunload", checkout);
      checkout();
    };
  }, [checkOut, isStudent, queryClient, sessionId]);

  if (sessionQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" message="Opening live class..." />
      </div>
    );
  }

  if (!session) {
    return (
      <DashboardShell
        title="Live Class"
        subtitle="We could not find this session."
        icon={HiOutlineStatusOnline}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="app-button-primary rounded-lg px-4 py-2 text-sm font-semibold"
        >
          Go back
        </button>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title={session.topic || "Live Class"}
      subtitle="Join the embedded live classroom. Student attendance is tracked when the room opens and duration is saved when they leave."
      icon={HiOutlineStatusOnline}
      action={
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700"
        >
          <HiOutlineArrowLeft />
          Back
        </button>
      }
    >
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <div className="app-panel overflow-hidden rounded-2xl">
          <div className="flex flex-col gap-3 border-b border-[var(--app-border)] p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {session.sessionStatus || "ongoing"}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {formatDateTime(session.startTime)} to {formatDateTime(session.endTime)}
              </p>
            </div>
            <a
              href={liveRoomUrl}
              target="_blank"
              rel="noreferrer"
              className="w-fit rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700"
            >
              Open in new tab
            </a>
          </div>
          <iframe
            title="EduLink live classroom"
            src={liveRoomUrl}
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            className="h-[72vh] min-h-[520px] w-full border-0 bg-gray-950"
          />
        </div>

        <aside className="space-y-4">
          <div className="app-panel rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-50 p-3 text-green-700">
                <HiOutlineClock size={22} />
              </div>
              <div>
                <p className="text-sm app-muted">Attendance</p>
                <p className="font-bold text-gray-900">
                  {isStudent ? "Auto tracking" : "Live tracking"}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-500">
              Students are checked in when they enter this room and checked out when they leave.
            </p>
          </div>

          <div className="app-panel rounded-2xl p-5">
            <div className="mb-4 flex items-center gap-2">
              <HiOutlineUserGroup className="text-green-600" />
              <h2 className="font-semibold text-gray-900">Live activity</h2>
            </div>
            {activity.length > 0 ? (
              <div className="space-y-3">
                {activity.map((item) => (
                  <div key={item.id} className="rounded-xl bg-gray-50 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                      <span className="text-xs text-gray-400">{item.time}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{item.detail}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-gray-500">
                Join and leave events will appear here while the class is running.
              </p>
            )}
          </div>
        </aside>
      </section>
    </DashboardShell>
  );
};

export default LiveClassRoom;
