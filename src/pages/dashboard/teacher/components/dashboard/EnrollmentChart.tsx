// pages/dashboard/teacher/components/EnrollmentChart.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { HiOutlineUsers } from "react-icons/hi";

const EnrollmentChart = () => {
  const data = [
    { month: 'Jan', students: 180 },
    { month: 'Feb', students: 195 },
    { month: 'Mar', students: 210 },
    { month: 'Apr', students: 225 },
    { month: 'May', students: 238 },
    { month: 'Jun', students: 247 },
    { month: 'Jul', students: 252 },
    { month: 'Aug', students: 258 },
    { month: 'Sep', students: 265 },
  ];

  const totalStudents = data[data.length - 1].students;
  const newStudentsThisMonth = totalStudents - data[data.length - 2].students;
  const percentageGrowth = ((newStudentsThisMonth / data[data.length - 2].students) * 100).toFixed(1);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          <p className="text-[#3BAC51] text-lg font-bold">
            {payload[0].value} students
          </p>
          <p className="text-xs text-gray-500 mt-1">Total enrolled students</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <HiOutlineUsers size={20} className="text-[#3BAC51]" />
            <h3 className="text-lg font-semibold text-gray-800">Student Growth</h3>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-gray-900">{totalStudents}</span>
            <span className="text-sm text-green-600">+{percentageGrowth}% this month</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Total students enrolled</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={{ stroke: '#E5E7EB' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="students"
            stroke="#3BAC51"
            strokeWidth={3}
            dot={{ r: 4, fill: '#3BAC51' }}
            activeDot={{ r: 6, fill: '#2d8a41' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnrollmentChart;