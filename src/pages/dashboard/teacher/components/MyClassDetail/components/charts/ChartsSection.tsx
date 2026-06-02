import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Session } from "../../types/classroom.types";

type Props = {
  sessions: Session[];
};

const formatShortDate = (date?: string) => {
  if (!date) return "TBD";
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getDurationInMinutes = (start?: string, end?: string) => {
  if (!start || !end) return 0;
  const minutes = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
  return Number.isFinite(minutes) && minutes > 0 ? minutes : 0;
};

const ChartsSection = ({ sessions }: Props) => {
  const chartSessions = sessions.slice(-6);

  const sessionLoad = chartSessions.map((session, index) => ({
    name: session.topic || `Session ${index + 1}`,
    date: formatShortDate(session.startTime),
    minutes: getDurationInMinutes(session.startTime, session.endTime),
  }));

  const timeline = chartSessions.map((session, index) => ({
    date: formatShortDate(session.startTime),
    sessions: index + 1,
  }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-8">
      <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900">Session Duration</h2>
          <p className="text-sm text-gray-500">Minutes planned for recent sessions</p>
        </div>

        <div className="h-72">
          {sessionLoad.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionLoad}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf2f7" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="minutes" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-gray-500">
              No session data yet
            </div>
          )}
        </div>
      </section>

      <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900">Class Momentum</h2>
          <p className="text-sm text-gray-500">Recent session growth for this class</p>
        </div>

        <div className="h-72">
          {timeline.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline}>
                <defs>
                  <linearGradient id="sessionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf2f7" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="sessions" stroke="#059669" fill="url(#sessionGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-gray-500">
              Create sessions to see trends
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ChartsSection;
