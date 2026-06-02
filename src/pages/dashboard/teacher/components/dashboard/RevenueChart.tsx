import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useState } from "react";
import { HiOutlineTrendingUp } from "react-icons/hi";

type RevenuePoint = {
  month: string;
  revenue: number;
};

const RevenueChart = ({ data = [] }: { data?: RevenuePoint[] }) => {
  const [activeBar, setActiveBar] = useState<number | null>(null);
  const chartData = data.length ? data : [{ month: "Now", revenue: 0 }];
  const totalRevenue = chartData.reduce((sum, item) => sum + Number(item.revenue || 0), 0);
  const lastMonthRevenue = chartData[chartData.length - 1]?.revenue || 0;
  const previousMonthRevenue = chartData[chartData.length - 2]?.revenue || 0;
  const percentageChange = previousMonthRevenue
    ? (((lastMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100).toFixed(1)
    : "0.0";

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <p className="mb-2 font-semibold text-gray-800">{label}</p>
          <p className="text-lg font-bold text-[#3BAC51]">
            NGN {payload[0].value.toLocaleString()}
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
            <HiOutlineTrendingUp size={20} className="text-[#3BAC51]" />
            <h3 className="text-lg font-semibold text-gray-800">Revenue Overview</h3>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              NGN {totalRevenue.toLocaleString()}
            </span>
            <span className={`text-sm ${Number(percentageChange) >= 0 ? "text-green-600" : "text-red-600"}`}>
              {percentageChange}% from last month
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">Successful payments from server records</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          onMouseLeave={() => setActiveBar(null)}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 12 }} />
          <YAxis
            tick={{ fill: "#6B7280", fontSize: 12 }}
            tickFormatter={(value) => `NGN ${value / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59, 172, 81, 0.1)" }} />
          <Bar dataKey="revenue" radius={[8, 8, 0, 0]} onMouseEnter={(_, index) => setActiveBar(index)}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={activeBar === index ? "#2d8a41" : "#3BAC51"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
