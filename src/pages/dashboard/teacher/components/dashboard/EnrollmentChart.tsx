import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { HiOutlineUsers } from "react-icons/hi";

type EnrollmentPoint = {
  month: string;
  students: number;
};

const EnrollmentChart = ({ data = [] }: { data?: EnrollmentPoint[] }) => {
  const chartData = data.length ? data : [{ month: "Now", students: 0 }];
  const totalStudents = chartData.reduce((sum, item) => sum + Number(item.students || 0), 0);
  const lastMonth = chartData[chartData.length - 1]?.students || 0;
  const previousMonth = chartData[chartData.length - 2]?.students || 0;
  const percentageGrowth = previousMonth
    ? (((lastMonth - previousMonth) / previousMonth) * 100).toFixed(1)
    : "0.0";

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <p className="mb-2 font-semibold text-gray-800">{label}</p>
          <p className="text-lg font-bold text-[#3BAC51]">
            {payload[0].value} new enrollments
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <HiOutlineUsers size={20} className="text-[#3BAC51]" />
            <h3 className="text-lg font-semibold text-gray-800">Student Growth</h3>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{totalStudents}</span>
            <span className="text-sm text-green-600">{percentageGrowth}% from last month</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">Enrollments from server records</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 12 }} />
          <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="students"
            stroke="#3BAC51"
            strokeWidth={3}
            dot={{ r: 4, fill: "#3BAC51" }}
            activeDot={{ r: 6, fill: "#2d8a41" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnrollmentChart;
