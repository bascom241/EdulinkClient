// pages/dashboard/teacher/components/PerformanceMetrics.tsx
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  
} from 'recharts';
import { HiOutlineStar } from "react-icons/hi";

interface PerformanceMetricsProps {
  teacherData: any;
}

const PerformanceMetrics = ({ teacherData }: PerformanceMetricsProps) => {
  const data = [
    { name: 'Completed Sessions', value: teacherData.noOfSessionCompleted, color: '#3BAC51' },
    { name: 'Remaining Sessions', value: 44, color: '#E5E7EB' },
  ];

  const ratingData = [
    { name: '5 Stars', value: 68, color: '#3BAC51' },
    { name: '4 Stars', value: 22, color: '#85D497' },
    { name: '3 Stars', value: 7, color: '#C7E9D0' },
    { name: '2 Stars', value: 2, color: '#E5E7EB' },
    { name: '1 Star', value: 1, color: '#F3F4F6' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{payload[0].name}</p>
          <p className="text-[#3BAC51] font-bold">{payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <HiOutlineStar size={20} className="text-[#3BAC51]" />
        <h3 className="text-lg font-semibold text-gray-800">Performance Metrics</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Session Completion */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Session Completion</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-2">
            <p className="text-2xl font-bold text-gray-800">{teacherData.noOfSessionCompleted}</p>
            <p className="text-xs text-gray-500">Total Sessions</p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Rating Distribution</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={ratingData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {ratingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-2">
            <div className="flex items-center justify-center gap-1">
              <span className="text-2xl font-bold text-gray-800">{teacherData.studentReviewCount}</span>
              <span className="text-yellow-500 text-lg">★</span>
            </div>
            <p className="text-xs text-gray-500">Average Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;