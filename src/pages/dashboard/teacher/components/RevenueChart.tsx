// pages/dashboard/teacher/components/RevenueChart.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useState } from 'react';
import { HiOutlineTrendingUp } from "react-icons/hi";

const RevenueChart = () => {
  const [activeBar, setActiveBar] = useState<number | null>(null);
  
  const data = [
    { month: 'Jan', revenue: 12500 },
    { month: 'Feb', revenue: 15200 },
    { month: 'Mar', revenue: 13800 },
    { month: 'Apr', revenue: 16800 },
    { month: 'May', revenue: 18400 },
    { month: 'Jun', revenue: 20200 },
  ];

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const lastMonthRevenue = data[data.length - 1].revenue;
  const previousMonthRevenue = data[data.length - 2].revenue;
  const percentageChange = ((lastMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(1);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          <p className="text-[#3BAC51] text-lg font-bold">
            ₪{payload[0].value.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">Revenue earned</p>
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
            <HiOutlineTrendingUp size={20} className="text-[#3BAC51]" />
            <h3 className="text-lg font-semibold text-gray-800">Revenue Overview</h3>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-gray-900">
              ₪{totalRevenue.toLocaleString()}
            </span>
            <span className={`text-sm ${parseFloat(percentageChange) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {percentageChange}% from last month
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Total revenue earned</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          onMouseLeave={() => setActiveBar(null)}
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
            tickFormatter={(value) => `₪${value / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 172, 81, 0.1)' }} />
          <Bar
            dataKey="revenue"
            radius={[8, 8, 0, 0]}
            onMouseEnter={(_, index) => setActiveBar(index)}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={activeBar === index ? '#2d8a41' : '#3BAC51'}
                className="transition-all duration-300 cursor-pointer"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;