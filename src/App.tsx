import { Routes, Route } from "react-router-dom";

// Pages 
import Register from "./pages/auth/register";
import Login from "./pages/auth/login"
import TokenLogin from "./pages/auth/TokenLogin";
import VeryLogin from "./pages/auth/VeryLogin";
import Select from "./pages/profile/SelectRole";
import RegisterTeacherProfileForm from "./pages/profile/RegisterTeacherProfileForm";
import RoleRoute from "./routes/RoleRoute";
// components 
import { Toaster } from "react-hot-toast";
import DashboardLayout from "./layouts/DashboardLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import TeacherDashboard from "./pages/dashboard/teacher/TeacherDashboard";
import StudentDashboard from "./pages/dashboard/student/StudentDashboard";
import DashboardIndex from "./pages/dashboard";
import MyClass from "./pages/dashboard/teacher/myClassrooms";
import MyClassDetail from "./pages/dashboard/teacher/MyClassDetail";
import TeacherSchedule from "./pages/dashboard/teacher/TeacherSchedule";
import TeacherAssignments from "./pages/dashboard/teacher/TeacherAssignments";
import TeacherAttendance from "./pages/dashboard/teacher/TeacherAttendance";
import TeacherStudents from "./pages/dashboard/teacher/TeacherStudents";
import TeacherGrades from "./pages/dashboard/teacher/TeacherGrades";
import TeacherRecordings from "./pages/dashboard/teacher/TeacherRecordings";
import Settings from "./pages/dashboard/shared/Settings";
import Messages from "./pages/dashboard/shared/Messages";
import Notifications from "./pages/dashboard/shared/Notifications";
import LiveClassRoom from "./pages/dashboard/shared/LiveClassRoom";
import StudentSchedule from "./pages/dashboard/student/StudentSchedule";
import StudentAssignments from "./pages/dashboard/student/StudentAssignments";
import StudentClasses from "./pages/dashboard/student/StudentClasses";
import StudentJoinClass from "./pages/dashboard/student/StudentJoinClass";
import StudentGrades from "./pages/dashboard/student/StudentGrades";
import StudentAttendance from "./pages/dashboard/student/StudentAttendance";
import StudentMaterials from "./pages/dashboard/student/StudentMaterials";
import StudentMarketplace from "./pages/dashboard/student/StudentMarketplace";

function App() {
  return (

    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Register/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/token-login" element={<TokenLogin />} />
        <Route path="/veify-login" element={<VeryLogin />} />
        <Route path="/select" element={<Select />} />
        <Route path="/teacher-profile" element={<RegisterTeacherProfileForm />} />
        
      

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardIndex />} />
            <Route element={<RoleRoute allowedRoles={["ROLE_TEACHER"]} />}>
              <Route path="teacher" element={<TeacherDashboard />} />
              <Route path="teacher/classrooms" element={<MyClass/>}/>
              <Route path="teacher/students" element={<TeacherStudents/>}/>
              <Route path="teacher/schedule" element={<TeacherSchedule/>}/>
              <Route path="teacher/assignments" element={<TeacherAssignments/>}/>
              <Route path="teacher/attendance" element={<TeacherAttendance/>}/>
              <Route path="teacher/grades" element={<TeacherGrades/>}/>
              <Route path="teacher/recordings" element={<TeacherRecordings/>}/>
              <Route path="teacher/:classId" element={<MyClassDetail/>}/>
            </Route>

            <Route element={<RoleRoute allowedRoles={["ROLE_USER"]} />}>
              <Route path="/dashboard/student" element={<StudentDashboard />} />
              <Route path="/dashboard/student/marketplace" element={<StudentMarketplace />} />
              <Route path="/dashboard/student/join-room" element={<StudentJoinClass />} />
              <Route path="/dashboard/student/my-classes" element={<StudentClasses />} />
              <Route path="/dashboard/student/assignments" element={<StudentAssignments />} />
              <Route path="/dashboard/student/schedule" element={<StudentSchedule />} />
              <Route path="/dashboard/student/grades" element={<StudentGrades />} />
              <Route path="/dashboard/student/attendance" element={<StudentAttendance />} />
              <Route path="/dashboard/student/materials" element={<StudentMaterials />} />
            </Route>

            <Route path="settings" element={<Settings />} />
            <Route path="messages" element={<Messages />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="live/:sessionId" element={<LiveClassRoom />} />
          </Route>

        </Route>
      </Routes>
    </>
  )
}

export default App
