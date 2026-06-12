import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  HiOutlineArrowLeft,
  HiOutlineExclamation,
  HiOutlineExternalLink,
  HiOutlineClock,
  HiOutlineStatusOnline,
  HiOutlineUserGroup,
} from "react-icons/hi";
import DashboardShell from "./DashboardShell";
import Loader from "../../../components/ui/Loader";
import {
  useGetLiveSessionAccess,
  useGetSingleSession,
} from "../../../features/session/hooks/useTeacher";
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
  const liveAccessQuery = useGetLiveSessionAccess(sessionId);
  const checkIn = useCheckInSession();
  const checkOut = useCheckOutSession();
  const checkedInRef = useRef(false);
  const checkedOutRef = useRef(false);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [hasOpenedMeet, setHasOpenedMeet] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const session = sessionQuery.data;
  const liveAccess = liveAccessQuery.data;
  const classId = session?.classId;
  const liveRoomUrl = useMemo(() => {
    if (liveAccess?.liveRoomUrl) return liveAccess.liveRoomUrl;
    if (session?.liveRoomUrl) return session.liveRoomUrl;
    return "";
  }, [liveAccess?.liveRoomUrl, session?.liveRoomUrl]);

  useEffect(() => {
    if (!isStudent || !liveAccess?.isJoined) return;
    checkedInRef.current = true;
    setIsCheckedIn(true);
  }, [isStudent, liveAccess?.isJoined]);

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

  const handleJoinGoogleMeet = async () => {
    if (!liveRoomUrl) {
      toast.error("Google Meet link is not available yet");
      return;
    }

    const meetWindow = window.open("about:blank", "_blank");
    if (!meetWindow) {
      toast.error("Please allow pop-ups so Google Meet can open");
      return;
    }

    if (isStudent && sessionId && classId && !checkedInRef.current) {
      try {
        await checkIn.mutateAsync({ sessionId, classId });
        checkedInRef.current = true;
        setIsCheckedIn(true);
        toast.success("Attendance check-in recorded");
        queryClient.invalidateQueries({ queryKey: workspaceKeys.dashboardSummary });
        queryClient.invalidateQueries({ queryKey: workspaceKeys.grades });
      } catch (error: any) {
        meetWindow.close();
        toast.error(getApiErrorMessage(error, "Could not record attendance"));
        return;
      }
    }

    meetWindow.opener = null;
    meetWindow.location.href = liveRoomUrl;
    setHasOpenedMeet(true);
  };

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

  if (sessionQuery.isLoading || liveAccessQuery.isLoading) {
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
      subtitle="Join Google Meet from EduLink. Student attendance is checked in here and duration is saved while this page stays open."
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
            <button
              type="button"
              onClick={handleJoinGoogleMeet}
              disabled={checkIn.isPending || !liveRoomUrl}
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <HiOutlineExternalLink />
              {checkIn.isPending
                ? "Recording attendance..."
                : isStudent && isCheckedIn
                ? "Open Google Meet"
                : "Join Google Meet"}
            </button>
          </div>

          <div className="space-y-5 p-6">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
                  <HiOutlineExclamation size={22} />
                </div>
                <div>
                  <h2 className="font-bold text-amber-900">Keep EduLink open</h2>
                  <p className="mt-2 text-sm leading-6 text-amber-800">
                    Google Meet opens in a new tab. EduLink records your check-in when you click
                    Join Google Meet, then tracks checkout while this page stays open. Do not close
                    this EduLink tab until class is finished.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 p-6 text-center">
              <HiOutlineStatusOnline className="mx-auto text-green-600" size={42} />
              <h2 className="mt-4 text-xl font-bold text-gray-900">Google Meet class room</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-500">
                Use the button above to open the class meeting. Return to this EduLink tab when you
                are done so your attendance duration can be saved.
              </p>
              {hasOpenedMeet && (
                <p className="mt-4 text-sm font-semibold text-green-700">
                  Meet opened. Attendance tracking is active while this page remains open.
                </p>
              )}
            </div>
          </div>
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
                  {isStudent ? (isCheckedIn ? "Tracking active" : "Waiting for join") : "Live tracking"}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-500">
              Students are checked in when they click Join Google Meet and checked out when they leave this EduLink page.
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
