import React from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Users, BookOpen, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { useAuthStore } from './auth/store'

const Dashboard: React.FC = () => {
  const { user } = useAuthStore()

  // Mock data for charts
  const chartData = [
    { name: 'Mon', students: 40, resources: 24 },
    { name: 'Tue', students: 30, resources: 13 },
    { name: 'Wed', students: 20, resources: 98 },
    { name: 'Thu', students: 27, resources: 39 },
    { name: 'Fri', students: 20, resources: 48 },
    { name: 'Sat', students: 39, resources: 38 },
    { name: 'Sun', students: 30, resources: 43 },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-neutral-600 mt-2">
        {user?.role === 'ROLE_TEACHER'
  ? "Here's your teaching overview"
  : "Here's your learning overview"}
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm font-medium">Total Classes</p>
                <p className="text-3xl font-bold text-primary-700 mt-2">12</p>
              </div>
              <div className="bg-primary-50 p-3 rounded-lg">
                <BookOpen className="w-8 h-8 text-primary-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm font-medium">Students</p>
                <p className="text-3xl font-bold text-primary-700 mt-2">248</p>
              </div>
              <div className="bg-primary-50 p-3 rounded-lg">
                <Users className="w-8 h-8 text-primary-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm font-medium">Assignments</p>
                <p className="text-3xl font-bold text-primary-700 mt-2">32</p>
              </div>
              <div className="bg-primary-50 p-3 rounded-lg">
                <Calendar className="w-8 h-8 text-primary-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm font-medium">Growth</p>
                <p className="text-3xl font-bold text-primary-700 mt-2">↑ 24%</p>
              </div>
              <div className="bg-primary-50 p-3 rounded-lg">
                <TrendingUp className="w-8 h-8 text-primary-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Students enrolled and resources added</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="students" fill="#15803d" name="Students" />
                <Bar dataKey="resources" fill="#22c55e" name="Resources" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Trend</CardTitle>
            <CardDescription>Monthly engagement rate</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="students"
                  stroke="#15803d"
                  strokeWidth={2}
                  dot={{ fill: '#15803d' }}
                  activeDot={{ r: 6 }}
                  name="Engagement"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest updates from your classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-neutral-200 last:border-b-0">
                <div>
                  <p className="font-medium text-neutral-900">Student joined Mathematics 101</p>
                  <p className="text-sm text-neutral-600 mt-1">2 hours ago</p>
                </div>
                <Badge variant="success">New</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
