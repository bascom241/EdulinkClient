// config/tabs.ts
import {
  HiOutlineHome,
  HiOutlinePlusCircle,
  HiOutlineUsers,
  HiOutlineBookOpen,
  HiOutlineCog,
  HiOutlineCalendar,
  HiOutlineChatAlt2,
  HiOutlineBell,
  HiOutlineAcademicCap,
  HiOutlineClipboardList,
  HiOutlineDocumentText,
  HiOutlineVideoCamera,
  HiOutlineBadgeCheck,
  HiOutlineClock,
  HiOutlineUserAdd,
  HiOutlineLibrary,
  HiOutlineShoppingBag
} from "react-icons/hi";

import type { Tab } from "../types";

// Teacher specific tabs
const teacherMainTabs: Tab[] = [
  { path: "/dashboard/teacher", icon: HiOutlineClipboardList, label: "Dashboard" },
  { path: "/dashboard/teacher/classrooms", icon: HiOutlinePlusCircle, label: "Classrooms" },
  { path: "/dashboard", icon: HiOutlineHome, label: "Home" }
];

const teacherMoreTabs: Tab[] = [
  { path: "/dashboard/teacher/students", icon: HiOutlineUsers, label: "Students" },
  { path: "/dashboard/teacher/assignments", icon: HiOutlineDocumentText, label: "Assignments" },
  { path: "/dashboard/teacher/schedule", icon: HiOutlineCalendar, label: "Schedule" },
  { path: "/dashboard/teacher/attendance", icon: HiOutlineClock, label: "Attendance" },
  { path: "/dashboard/teacher/grades", icon: HiOutlineBadgeCheck, label: "Grades" },
  { path: "/dashboard/teacher/recordings", icon: HiOutlineVideoCamera, label: "Recordings" },
  { path: "/dashboard/settings", icon: HiOutlineCog, label: "Settings" },
  { path: "/dashboard/messages", icon: HiOutlineChatAlt2, label: "Messages" },
  { path: "/dashboard/notifications", icon: HiOutlineBell, label: "Notifications" }
];

// Student specific tabs
const studentMainTabs: Tab[] = [
  { path: "/dashboard/student", icon: HiOutlineAcademicCap, label: "Dashboard" },
  { path: "/dashboard/student/marketplace", icon: HiOutlineShoppingBag, label: "Marketplace" },
  { path: "/dashboard/student/join-room", icon: HiOutlineUserAdd, label: "Join Class" },
  { path: "/dashboard/student/my-classes", icon: HiOutlineLibrary, label: "My Classes" },
  { path: "/dashboard", icon: HiOutlineHome, label: "Home" }
];

// Student "More" tabs
const studentMoreTabs: Tab[] = [
  { path: "/dashboard/student/assignments", icon: HiOutlineDocumentText, label: "Assignments" },
  { path: "/dashboard/student/schedule", icon: HiOutlineCalendar, label: "Schedule" },
  { path: "/dashboard/student/grades", icon: HiOutlineBadgeCheck, label: "Grades" },
  { path: "/dashboard/student/attendance", icon: HiOutlineClock, label: "Attendance" },
  { path: "/dashboard/student/materials", icon: HiOutlineBookOpen, label: "Materials" },
  { path: "/dashboard/settings", icon: HiOutlineCog, label: "Settings" },
  { path: "/dashboard/messages", icon: HiOutlineChatAlt2, label: "Messages" },
  { path: "/dashboard/notifications", icon: HiOutlineBell, label: "Notifications" }
];

export const getTabsByRole = (role: string | null) => {
  const isTeacher = role === "ROLE_TEACHER";

  return {
    mainTabs: isTeacher ? teacherMainTabs : studentMainTabs,
    moreTabs: isTeacher ? teacherMoreTabs : studentMoreTabs
  };
};
