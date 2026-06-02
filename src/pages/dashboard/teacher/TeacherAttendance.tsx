import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineClock } from "react-icons/hi";
import { useGetAllTeacherClassrooms } from "../../../features/classroom/hooks/useTeacher";
import { sessionKeys } from "../../../features/session/sessionKeys";
import { useGetAllSessionForTeachers, useGetSessionAttendance, useGradeSessionAttendance } from "../../../features/session/hooks/useTeacher";
import DashboardShell from "../shared/DashboardShell";
import type { Session } from "../../../types/classroomTypes";

const TeacherAttendance = () => {
  const queryClient = useQueryClient();
  const { data: classrooms = [] } = useGetAllTeacherClassrooms();
  const [classId, setClassId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const { data: sessionsData } = useGetAllSessionForTeachers(classId);
  const { data: attendance } = useGetSessionAttendance(sessionId);
  const gradeMutation = useGradeSessionAttendance();

  const sessions = sessionsData?.session || [];
  const records = attendance?.students || [];
  const averageMinutes = records.length
    ? Math.round(records.reduce((sum: number, record: any) => sum + Number(record.durationMinutes || 0), 0) / records.length)
    : 0;

  const gradeStudent = async (studentId: string, grade: number) => {
    if (!sessionId || !studentId) return;
    await gradeMutation.mutateAsync({ sessionId, studentId, grade });
    queryClient.invalidateQueries({ queryKey: sessionKeys.attendance(sessionId) });
    toast.success("Grade saved");
  };

  return (
    <DashboardShell title="Attendance & Grades" subtitle="Review live participation, minutes attended, and grade learners after sessions." icon={HiOutlineClock}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Attendance Records</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{records.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Avg. Minutes</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{averageMinutes}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Sessions</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{sessions.length}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <select value={classId} onChange={(e) => { setClassId(e.target.value); setSessionId(""); }} className="px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500">
          <option value="">Select class</option>
          {classrooms.map((classroom) => (
            <option key={classroom._id} value={classroom._id}>{classroom.name}</option>
          ))}
        </select>
        <select value={sessionId} onChange={(e) => setSessionId(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500">
          <option value="">Select session</option>
          {sessions.map((session: Session) => {
            const currentSessionId = session.id || session._id || "";
            return (
              <option key={currentSessionId} value={currentSessionId}>{session.topic}</option>
            );
          })}
        </select>
      </div>

      <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {records.length ? (
          <div className="divide-y divide-gray-100">
            {records.map((record: any) => (
              <div key={record.studentId?._id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{record.studentId?.fullName || "Student"}</h3>
                  <p className="text-sm text-gray-500">
                    {record.durationMinutes || 0} minutes attended - {record.studentId?.email || "No email"}
                  </p>
                </div>
                <input
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={record.grade || 0}
                  onBlur={(e) => gradeStudent(record.studentId?._id, Number(e.target.value))}
                  className="w-28 px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-gray-500">Select a session to view attendance records.</div>
        )}
      </section>
    </DashboardShell>
  );
};

export default TeacherAttendance;
