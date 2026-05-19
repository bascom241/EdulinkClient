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
              <Route path="teacher/:id" element={<MyClassDetail/>}/>
            </Route>

            <Route element={<RoleRoute allowedRoles={["ROLE_USER"]} />}>
              <Route path="/dashboard/student" element={<StudentDashboard />} />
            </Route>
          </Route>

        </Route>
      </Routes>
    </>
  )
}

export default App
