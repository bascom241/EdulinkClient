import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { HiOutlineStar } from "react-icons/hi";

type Props = {
  summaryStats?: any;
  sessionCompletion?: { name: string; value: number }[];
};

const PerformanceMetrics = ({ summaryStats, sessionCompletion = [] }: Props) => {
  const completionData = (sessionCompletion.length
    ? sessionCompletion
    : [
        { name: "Completed", value: summaryStats?.completedSessions || 0 },
        {
          name: "Remaining",
          value: Math.max(0, (summaryStats?.sessions || 0) - (summaryStats?.completedSessions || 0)),
        },
      ]
  ).map((item, index) => ({ ...item, color: index === 0 ? "#3BAC51" : "#E5E7EB" }));
  const averageGrade = Number(summaryStats?.averageGrade || 0);
  const gradeData = [
    { name: "Average Grade", value: averageGrade, color: "#3BAC51" },
    { name: "Remaining", value: Math.max(0, 100 - averageGrade), color: "#E5E7EB" },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="font-semibold text-gray-800">{payload[0].name}</p>
          <p className="font-bold text-[#3BAC51]">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <HiOutlineStar size={20} className="text-[#3BAC51]" />
        <h3 className="text-lg font-semibold text-gray-800">Performance Metrics</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="mb-2 text-sm text-gray-500">Session Completion</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={completionData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                {completionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 text-center">
            <p className="text-2xl font-bold text-gray-800">{summaryStats?.completedSessions || 0}</p>
            <p className="text-xs text-gray-500">Completed Sessions</p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm text-gray-500">Average Attendance Grade</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={gradeData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value">
                {gradeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 text-center">
            <p className="text-2xl font-bold text-gray-800">{averageGrade} pts</p>
            <p className="text-xs text-gray-500">From recorded attendance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
