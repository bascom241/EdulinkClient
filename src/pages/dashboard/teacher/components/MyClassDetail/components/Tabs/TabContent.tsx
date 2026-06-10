import type { Classroom, Session, Student, Tab } from "../../types/classroom.types";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { classroomKeys } from "../../../../../../../features/classroom/classroomKeys";
import {
  useDeleteClassTimeTable,
  useGetClassTimeTable,
  useUpdateClassTimeTable,
} from "../../../../../../../features/classroom/hooks/useTeacher";

type Props = {
  selectedTab: Tab["id"];
  classData: Classroom;
  classId: string;
  sessions: Session[];
  pagination?: {
    total?: number;
    totalPages?: number;
    currentPage?: number;
    page?: number;
    limit?: number;
  };
  totalStudents: number;
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

const getStatus = (session: Session) => {
  if (session.sessionStatus) return session.sessionStatus;
  if (session.isCompleted) return "completed";
  return "scheduled";
};

const EmptyState = ({ title }: { title: string }) => (
  <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">
    {title}
  </div>
);

const TimetablePanel = ({ classId }: { classId: string }) => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetClassTimeTable(classId);
  const updateMutation = useUpdateClassTimeTable();
  const deleteMutation = useDeleteClassTimeTable();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ topic: "", startTime: "", endTime: "", liveRoomUrl: "" });

  const toInputDate = (date?: string) => {
    if (!date) return "";
    const value = new Date(date);
    value.setMinutes(value.getMinutes() - value.getTimezoneOffset());
    return value.toISOString().slice(0, 16);
  };

  const startEdit = (item: { _id?: string; topic: string; startTime: string; endTime: string; liveRoomUrl?: string }) => {
    if (!item._id) return;
    setEditingId(item._id);
    setForm({
      topic: item.topic,
      startTime: toInputDate(item.startTime),
      endTime: toInputDate(item.endTime),
      liveRoomUrl: item.liveRoomUrl || "",
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await updateMutation.mutateAsync({
      classId,
      timetableId: editingId,
      topic: form.topic,
      startTime: form.startTime,
      endTime: form.endTime,
      liveRoomUrl: form.liveRoomUrl.trim() || undefined,
    });
    queryClient.invalidateQueries({ queryKey: classroomKeys.timetable(classId) });
    setEditingId(null);
    toast.success("Timetable updated");
  };

  const deleteItem = async (timetableId?: string) => {
    if (!timetableId) return;
    await deleteMutation.mutateAsync({ classId, timetableId });
    queryClient.invalidateQueries({ queryKey: classroomKeys.timetable(classId) });
    toast.success("Timetable removed");
  };

  if (isLoading) {
    return <EmptyState title="Loading timetable..." />;
  }

  const items = data?.sessions || [];

  return (
    <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {items.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {items.map((item) => (
            <div key={item._id || item.startTime} className="p-5">
              {editingId === item._id ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input
                    value={form.topic}
                    onChange={(e) => setForm((prev) => ({ ...prev, topic: e.target.value }))}
                    className="md:col-span-2 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                  <input
                    type="datetime-local"
                    value={form.startTime}
                    onChange={(e) => setForm((prev) => ({ ...prev, startTime: e.target.value }))}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                  <input
                    type="datetime-local"
                    value={form.endTime}
                    onChange={(e) => setForm((prev) => ({ ...prev, endTime: e.target.value }))}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                  <input
                    type="url"
                    value={form.liveRoomUrl}
                    onChange={(e) => setForm((prev) => ({ ...prev, liveRoomUrl: e.target.value }))}
                    placeholder="https://meet.google.com/..."
                    className="md:col-span-4 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                  <div className="md:col-span-4 flex gap-2 justify-end">
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700">
                      Cancel
                    </button>
                    <button onClick={saveEdit} className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white">
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.topic}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDateTime(item.startTime)} to {formatDateTime(item.endTime)}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {item.liveRoomUrl ? "Uses session Google Meet link" : "Uses class default Google Meet link"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(item)} className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
                      Edit
                    </button>
                    <button onClick={() => deleteItem(item._id)} className="px-4 py-2 text-sm rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No timetable has been set for this class yet." />
      )}
    </section>
  );
};

const TabContent = ({ selectedTab, classData, classId, sessions, pagination, totalStudents }: Props) => {
  if (selectedTab === "timetable") {
    return <TimetablePanel classId={classId} />;
  }

  if (selectedTab === "sessions") {
    return (
      <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {sessions.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {sessions.map((session, index) => (
              <div key={session.id || session._id || index} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{session.topic || `Session ${index + 1}`}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDateTime(session.startTime)} to {formatDateTime(session.endTime)}
                  </p>
                </div>
                <span className="w-fit px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium capitalize">
                  {getStatus(session)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No sessions have been created for this class yet." />
        )}
        {pagination && (
          <div className="px-5 py-3 bg-gray-50 text-sm text-gray-500">
            Showing {sessions.length} of {pagination.total ?? sessions.length} sessions
          </div>
        )}
      </section>
    );
  }

  if (selectedTab === "students") {
    const students = (classData.students || []) as Array<string | Student>;

    return (
      <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {students.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {students.map((student, index) => {
              const item = typeof student === "string" ? { _id: student } : student;
              return (
                <div key={item._id || index} className="p-5 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.fullName || item.name || `Student ${index + 1}`}
                    </h3>
                    <p className="text-sm text-gray-500">{item.email || item._id}</p>
                  </div>
                  <span className="text-sm font-medium text-green-600">{item.progress ?? 0}%</span>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState title="No students have joined this class yet." />
        )}
      </section>
    );
  }

  if (selectedTab === "resources") {
    return <EmptyState title="No resources are attached to this class yet." />;
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{classData.name}</h2>
        <p className="text-sm leading-6 text-gray-600">{classData.description || "No description provided."}</p>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <p className="text-xs uppercase text-gray-400 font-semibold">Location</p>
          <p className="text-sm text-gray-800 capitalize">{classData.location || "Not set"}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-400 font-semibold">Level</p>
          <p className="text-sm text-gray-800 capitalize">{classData.classLevel || "Not set"}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-400 font-semibold">Students</p>
          <p className="text-sm text-gray-800">{totalStudents} / {classData.maximumStudent}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-400 font-semibold">Price</p>
          <p className="text-sm text-gray-800">NGN {Number(classData.price || 0).toLocaleString()}</p>
        </div>
      </div>
    </section>
  );
};

export default TabContent;
