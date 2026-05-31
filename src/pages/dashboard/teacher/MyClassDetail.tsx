// MyClassDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useGetSingleClass } from "../../../features/classroom/hooks/useTeacher";
import { useGetAllSessionForTeachers } from "../../../features/session/hooks/useTeacher";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";

const MyClassDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("overview");

  const { 
    data: classData, 
    isLoading: classLoading, 
    error: classError 
  } = useGetSingleClass(classId as string);
  
  const { 
    data: sessionsResponse, 
    isLoading: sessionsLoading, 
    error: sessionsError 
  } = useGetAllSessionForTeachers(classId as string);

  useEffect(() => {
    console.log("Sessions Response:", sessionsResponse);
    console.log("Class Data:", classData);
  }, [sessionsResponse, classData]);

  let sessions = [];
  let pagination = null;
  
  if (sessionsResponse) {
    if (Array.isArray(sessionsResponse)) {
      sessions = sessionsResponse;
    } else if (sessionsResponse.session && Array.isArray(sessionsResponse.session)) {
      sessions = sessionsResponse.session;
      pagination = sessionsResponse.pagination;
    } else if (sessionsResponse.data && sessionsResponse.data.session) {
      sessions = sessionsResponse.data.session;
      pagination = sessionsResponse.data.pagination;
    } else if (sessionsResponse.data && Array.isArray(sessionsResponse.data)) {
      sessions = sessionsResponse.data;
    } else {
      console.log("Unexpected sessions response structure:", sessionsResponse);
    }
  }

  const formatDate = (dateString: any) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatTime = (dateString: any) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatDateTime = (dateString: any) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getSessionStatusBadge = (status: string) => {
    switch(status) {
      case 'ongoing':
      case 'active':
        return <span className="px-2 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-medium border border-red-200">Live Now</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium border border-green-200">Completed</span>;
      case 'scheduled':
        return <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-200">Scheduled</span>;
      default:
        return <span className="px-2 py-1 bg-gray-50 text-gray-700 rounded-lg text-xs font-medium border border-gray-200">{status || 'Scheduled'}</span>;
    }
  };

  if (!classId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-3xl text-red-500"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Class Not Found</h2>
          <p className="text-gray-500 mb-6">The class you're looking for doesn't exist</p>
          <button 
            onClick={() => navigate("/teacher/classes")}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm"
          >
            Back to Classes
          </button>
        </div>
      </div>
    );
  }

  if (classLoading || sessionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading class details...</p>
        </div>
      </div>
    );
  }

  if (classError || !classData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-3xl text-red-500"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Class</h2>
          <p className="text-gray-500 mb-6">There was an error loading the class details</p>
          <button 
            onClick={() => navigate("/teacher/classes")}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm"
          >
            Back to Classes
          </button>
        </div>
      </div>
    );
  }

  const totalSessions = sessions.length || 0;
  const completedSessions = sessions.filter((s: any) => s.sessionStatus === "completed").length || 0;
  const ongoingSessions = sessions.filter((s: any) => s.sessionStatus === "ongoing" || s.sessionStatus === "active").length || 0;
  const totalStudents = classData?.students?.length || 0;
  const courseProgress = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  // Generate chart data from sessions
  const getAttendanceData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        attendance: Math.floor(Math.random() * 40) + 60, // Mock data - replace with real data
        students: Math.floor(Math.random() * 30) + 10
      });
    }
    return last7Days;
  };

  const getSessionProgressData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      completed: Math.floor(Math.random() * 10),
      scheduled: Math.floor(Math.random() * 8)
    }));
  };

  const getStudentProgressData = () => {
    return [
      { name: '0-20%', value: Math.floor(Math.random() * 10), color: '#EF4444' },
      { name: '21-40%', value: Math.floor(Math.random() * 15), color: '#F59E0B' },
      { name: '41-60%', value: Math.floor(Math.random() * 20), color: '#FBBF24' },
      { name: '61-80%', value: Math.floor(Math.random() * 25), color: '#10B981' },
      { name: '81-100%', value: Math.floor(Math.random() * 30), color: '#059669' }
    ];
  };

  const attendanceData = getAttendanceData();
  const sessionProgressData = getSessionProgressData();
  const studentProgressData = getStudentProgressData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="text-sm font-semibold text-gray-800">{label}</p>
          {payload.map((p: any, idx: number) => (
            <p key={idx} className="text-sm text-gray-600">
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-100/50 sticky top-0 z-10 shadow-sm">
  <div className="max-w-[1400px] mx-auto px-6 py-3">
    <div className="flex items-center justify-between">
      {/* Left Section - Glass Effect */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-all duration-200"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
            <i className="fas fa-arrow-left text-sm"></i>
          </div>
          <span className="text-sm font-medium hidden sm:inline">Back</span>
        </button>
        
        <div className="hidden sm:block h-5 w-px bg-gray-200"></div>
        
        <div className="flex items-center gap-3">
          {/* Class Icon */}
          <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-sm">
            <i className="fas fa-graduation-cap text-white text-sm"></i>
          </div>
          
          <div>
            <h1 className="text-lg font-semibold text-gray-800 tracking-tight">
              {classData.name}
            </h1>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <i className="far fa-folder-open text-[10px]"></i>
                {classData.category?.name || "Class"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <i className="far fa-calendar text-[10px]"></i>
                {formatDate(classData.startDate)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Modern */}
      <div className="flex items-center gap-3">
        {/* Session Status Indicator */}
        {ongoingSessions > 0 && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-full">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-red-600">{ongoingSessions} Live Now</span>
          </div>
        )}
        
        {/* Teacher Card */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
          <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-green-600 font-medium text-xs">
              {classData.owner?.name?.charAt(0) || classData.owner?.charAt(0) || 'T'}
            </span>
          </div>
          <span className="text-xs text-gray-600 hidden sm:inline">
            {classData.owner?.name?.split(' ')[0] || "Teacher"}
          </span>
          <i className="fas fa-chevron-down text-[10px] text-gray-400"></i>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <i className="fas fa-users text-green-600 text-xl"></i>
              </div>
              <span className="text-3xl font-bold text-gray-800">{totalStudents}</span>
            </div>
            <p className="text-gray-600 font-medium mb-1">Total Students</p>
            <p className="text-sm text-gray-400">Max capacity: {classData.maximumStudent}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <i className="fas fa-calendar-check text-blue-600 text-xl"></i>
              </div>
              <span className="text-3xl font-bold text-gray-800">{totalSessions}</span>
            </div>
            <p className="text-gray-600 font-medium mb-1">Total Sessions</p>
            <p className="text-sm text-gray-400">{completedSessions} completed, {ongoingSessions} ongoing</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <i className="fas fa-chart-line text-purple-600 text-xl"></i>
              </div>
              <span className="text-3xl font-bold text-gray-800">85%</span>
            </div>
            <p className="text-gray-600 font-medium mb-1">Avg. Attendance</p>
            <p className="text-sm text-gray-400">Per session average</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <i className="fas fa-flag-checkered text-orange-600 text-xl"></i>
              </div>
              <span className="text-3xl font-bold text-gray-800">{courseProgress}%</span>
            </div>
            <p className="text-gray-600 font-medium mb-1">Course Progress</p>
            <div className="mt-2">
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-green-500 rounded-full h-2 transition-all duration-500" 
                  style={{ width: `${courseProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section - First Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Attendance Trend Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Attendance Trend</h3>
                <p className="text-sm text-gray-500 mt-1">Last 7 days attendance rate</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <i className="fas fa-chart-line text-green-600"></i>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={attendanceData}>
                <defs>
                  <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  fill="url(#attendanceGradient)"
                  name="Attendance %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Session Progress Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Session Progress</h3>
                <p className="text-sm text-gray-500 mt-1">Monthly session breakdown</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <i className="fas fa-chart-bar text-blue-600"></i>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sessionProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="completed" fill="#10B981" name="Completed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="scheduled" fill="#FBBF24" name="Scheduled" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Section - Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Student Progress Distribution */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Student Progress Distribution</h3>
                <p className="text-sm text-gray-500 mt-1">How students are performing</p>
              </div>
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <i className="fas fa-chart-pie text-purple-600"></i>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={studentProgressData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={{ stroke: '#9CA3AF', strokeWidth: 1 }}
                >
                  {studentProgressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
              {studentProgressData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Sessions Preview */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Upcoming Sessions</h3>
                <p className="text-sm text-gray-500 mt-1">Next 3 scheduled sessions</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <i className="fas fa-calendar-alt text-green-600"></i>
              </div>
            </div>
            <div className="space-y-4">
              {sessions.slice(0, 3).map((session: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center shadow-sm">
                    <span className="text-lg font-bold text-green-600">
                      {session.startTime ? new Date(session.startTime).getDate() : '--'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {session.startTime ? new Date(session.startTime).toLocaleDateString('en-US', { month: 'short' }) : ''}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{session.topic || 'Upcoming Session'}</p>
                    <p className="text-sm text-gray-500">
                      <i className="far fa-clock mr-1"></i>
                      {formatDateTime(session.startTime)}
                    </p>
                  </div>
                  {getSessionStatusBadge(session.sessionStatus)}
                </div>
              ))}
              {sessions.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <i className="fas fa-calendar-times text-4xl mb-3 opacity-50"></i>
                  <p>No upcoming sessions scheduled</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6">
          <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 w-fit">
            {[
              { id: "overview", label: "Overview", icon: "fas fa-info-circle" },
              { id: "sessions", label: "All Sessions", icon: "fas fa-video" },
              { id: "students", label: "Students", icon: "fas fa-users" },
              { id: "resources", label: "Resources", icon: "fas fa-folder-open" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-6 py-2.5 font-medium transition-all rounded-lg capitalize flex items-center gap-2 text-sm ${
                  selectedTab === tab.id
                    ? "bg-green-50 text-green-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <i className={`${tab.icon} text-sm`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Overview Tab */}
          {selectedTab === "overview" && (
            <div className="p-6 md:p-8 space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <i className="fas fa-book-open text-green-600"></i>
                  About This Class
                </h3>
                <p className="text-gray-600 leading-relaxed">{classData.description || "No description provided."}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <i className="fas fa-clipboard-list text-green-600"></i>
                    Class Details
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: "Start Date", value: formatDate(classData.startDate), icon: "far fa-calendar-alt" },
                      { label: "End Date", value: formatDate(classData.endDate), icon: "far fa-calendar-check" },
                      { label: "Location", value: classData.location || "Online", icon: "fas fa-map-marker-alt" },
                      { label: "Level", value: classData.classLevel || "Beginner", icon: "fas fa-chart-simple" },
                      { label: "Price", value: `$${classData.price || 0}`, icon: "fas fa-tag" }
                    ].map((detail, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-50">
                        <div className="flex items-center gap-3">
                          <i className={`${detail.icon} text-gray-400 text-sm w-4`}></i>
                          <span className="text-gray-500 text-sm">{detail.label}</span>
                        </div>
                        <span className="font-medium text-gray-700 text-sm">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <i className="fas fa-bolt text-green-600"></i>
                    Quick Actions
                  </h4>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-green-50 transition-all group">
                      <span className="text-gray-700 font-medium group-hover:text-green-700">Send Announcement</span>
                      <i className="fas fa-bullhorn text-gray-400 group-hover:text-green-600 transition-colors"></i>
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-green-50 transition-all group">
                      <span className="text-gray-700 font-medium group-hover:text-green-700">Schedule Session</span>
                      <i className="fas fa-plus-circle text-gray-400 group-hover:text-green-600 transition-colors"></i>
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-green-50 transition-all group">
                      <span className="text-gray-700 font-medium group-hover:text-green-700">Invite Students</span>
                      <i className="fas fa-envelope text-gray-400 group-hover:text-green-600 transition-colors"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All Sessions Tab */}
          {selectedTab === "sessions" && (
            <div className="p-6 md:p-8">
              <div className="space-y-3">
                {sessions.map((session: any, idx: number) => (
                  <div key={session._id || session.id || idx} className="group flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                        session.sessionStatus === "ongoing" || session.sessionStatus === "active" 
                          ? "bg-red-50 text-red-600" 
                          : session.sessionStatus === "completed"
                          ? "bg-green-50 text-green-600"
                          : "bg-blue-50 text-blue-600"
                      }`}>
                        <i className={`fas ${
                          session.sessionStatus === "ongoing" || session.sessionStatus === "active" 
                            ? "fa-play" 
                            : session.sessionStatus === "completed"
                            ? "fa-check"
                            : "fa-clock"
                        } text-sm`}></i>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="font-semibold text-gray-800">{session.topic || "Untitled Session"}</p>
                          {getSessionStatusBadge(session.sessionStatus)}
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          <i className="far fa-calendar mr-1"></i>
                          {formatDateTime(session.startTime)} - {formatTime(session.endTime)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {session.students && session.students.length > 0 && (
                        <p className="text-xs text-gray-400">
                          <i className="fas fa-user-friends mr-1"></i>
                          {session.students.length} attending
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {(!sessions || sessions.length === 0) && (
                  <div className="text-center py-12 text-gray-400">
                    <i className="fas fa-calendar-times text-5xl mb-4 opacity-50"></i>
                    <p>No sessions scheduled for this class yet.</p>
                  </div>
                )}
              </div>
              
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-6 flex justify-between items-center border-t border-gray-100 pt-4">
                  <div className="text-sm text-gray-400">
                    Showing {sessions.length} of {pagination.total} sessions
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:border-green-300 hover:text-green-600 transition-all">
                      Previous
                    </button>
                    <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:border-green-300 hover:text-green-600 transition-all">
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Students Tab */}
          {selectedTab === "students" && (
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <i className="fas fa-user-graduate text-green-600"></i>
                  Enrolled Students ({totalStudents})
                </h3>
                <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm hover:border-green-300 hover:text-green-600 transition-all flex items-center gap-2">
                  <i className="fas fa-download text-xs"></i>
                  Export List
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-500 text-sm">Student</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-500 text-sm">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-500 text-sm">Joined</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-500 text-sm">Progress</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-500 text-sm"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {classData.students?.map((student: any, idx: number) => (
                      <tr key={student._id || student || idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 font-medium text-sm">
                              {student.name?.charAt(0) || student.fullName?.charAt(0) || 'S'}
                            </div>
                            <span className="font-medium text-gray-800 text-sm">{student.name || student.fullName || 'Student'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-sm">{student.email || 'N/A'}</td>
                        <td className="py-3 px-4 text-gray-500 text-sm">
                          {student.joinedAt ? formatDate(student.joinedAt) : 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-100 rounded-full h-1.5 max-w-[100px]">
                              <div className="bg-green-500 rounded-full h-1.5 transition-all" style={{ width: `${student.progress || 0}%` }}></div>
                            </div>
                            <span className="text-xs text-gray-500">{student.progress || 0}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors">
                            Profile →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(!classData.students || classData.students.length === 0) && (
                  <div className="text-center py-12 text-gray-400">
                    <i className="fas fa-users-slash text-5xl mb-4 opacity-50"></i>
                    <p>No students enrolled in this class yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {selectedTab === "resources" && (
            <div className="p-6 md:p-8">
              <div className="space-y-3">
                {classData.defaultLink && (
                  <div className="group p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                          <i className="fas fa-video text-green-600 text-lg"></i>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">Default Meeting Link</p>
                          <p className="text-sm text-gray-400 truncate max-w-md">{classData.defaultLink}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigator.clipboard.writeText(classData.defaultLink)}
                        className="px-4 py-2 text-green-600 border border-green-200 rounded-xl hover:bg-green-50 transition-all text-sm flex items-center gap-2"
                      >
                        <i className="far fa-copy"></i>
                        Copy
                      </button>
                    </div>
                  </div>
                )}
                
                {classData.otherLinks?.map((link: string, index: number) => (
                  <div key={index} className="group p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-green-50 transition-colors">
                          <i className={`fas ${
                            link.includes("github") ? "fa-github" : 
                            link.includes("discord") ? "fa-discord" : 
                            "fa-link"
                          } text-gray-500 group-hover:text-green-600 text-lg transition-colors`}></i>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {link.includes("github") ? "GitHub Repository" : 
                             link.includes("discord") ? "Discord Community" : 
                             `Resource ${index + 1}`}
                          </p>
                          <p className="text-sm text-gray-400 truncate max-w-md">{link}</p>
                        </div>
                      </div>
                      <a 
                        href={link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-gray-500 border border-gray-200 rounded-xl hover:border-green-300 hover:text-green-600 transition-all text-sm flex items-center gap-2"
                      >
                        Open <i className="fas fa-external-link-alt text-xs"></i>
                      </a>
                    </div>
                  </div>
                ))}
                {(!classData.defaultLink && (!classData.otherLinks || classData.otherLinks.length === 0)) && (
                  <div className="text-center py-12 text-gray-400">
                    <i className="fas fa-folder-open text-5xl mb-4 opacity-50"></i>
                    <p>No resources available for this class yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyClassDetail;