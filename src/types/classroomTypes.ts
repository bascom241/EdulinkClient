export interface getStudentNumbers {
    userId: string
}


export const ClassLocation = {
  HYBRID: "hybrid",
  PHYSICAL: "physical",
  ONLINE: "onsite",
} as const;

export const ClassLevel = {
  JUNIOR: "junior",
  INTERMEDIATE: "intermediate",
  EXPERT: "expert",
} as const;

// --- Types ---
export interface Classroom {
  _id: string;
  name: string;
  owner: {
    _id: string;
    email: string;
  };
  status: "Active" | "Suspended" | "Archived";
  students: string[];
  maximumStudent: number;
  description: string;
  endDate: string;
  price: number;
  classLevel: string;
  location: string;
  isFull: boolean;
  startDate: string 
  createdAt: string;
  updatedAt: string 
  defaultLink?: string ;
  otherLinks?: string[];
  sessions?: TimeTableItem[];
}

export interface CreateClassPayload {
  name: string;
  description: string;
  endDate: string;
  price: number;
  maximumStudent: number;
  classLevel: string;
  location: string;
  category: string;
  level: string;
  defaultLink?: string;
  otherLinks?: string[];
}

export interface CreateClassCategoryRequest {
  title: string
}

// Newly Added

// types/classroom.types.ts
export interface Student {
  _id?: string;
  name?: string;
  fullName?: string;
  email?: string;
  joinedAt?: string;
  progress?: number;
}

export interface Session {
  _id?: string;
  id?: string;
  topic?: string;
  startTime: string;
  endTime: string;
  sessionStatus?: 'ongoing' | 'active' | 'completed' | 'scheduled';
  students?: Student[];
  isCompleted?: boolean;
}

export interface TimeTableItem {
  _id?: string;
  topic: string;
  startTime: string;
  endTime: string;
  isCompleted?: boolean;
}

export interface TimeTableResponse {
  classId: string;
  className: string;
  defaultLink?: string;
  sessions: TimeTableItem[];
}

export interface SctaBreakdown {
  enrollment: number;
  attendance: number;
  duration: number;
  grades: number;
  schedule: number;
}

export interface MarketplaceClassroom {
  _id: string;
  name: string;
  description: string;
  startDate?: string;
  endDate?: string;
  price: number;
  maximumStudent: number;
  isFull: boolean;
  location: string;
  classLevel: string;
  category?: string;
  owner: string;
  studentsCount: number;
  sctaScore: number;
  sctaBreakdown: SctaBreakdown;
  sctaMetrics: {
    studentCount: number;
    capacity: number;
    sessionsTracked: number;
    attendanceRecords: number;
    gradedRecords: number;
    futureScheduleCount: number;
  };
  sctaCalculatedAt: string;
}

export interface MarketplaceResponse {
  classroom: MarketplaceClassroom[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Assignment {
  _id: string;
  classroom: string | { _id: string; name: string; defaultLink?: string };
  title: string;
  description?: string;
  dueDate: string;
  points: number;
  createdAt?: string;
}

export interface AttendanceStudent {
  studentId: {
    _id: string;
    fullName?: string;
    email?: string;
  };
  joinedAt?: string;
  leftAt?: string;
  durationMinutes?: number;
  grade?: number;
  note?: string;
  stage?: string;
}


export interface SessionsResponse {
  session?: Session[];
  pagination?: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  data?: {
    session: Session[];
    pagination: {
      total: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}

export interface Tab {
  id: 'overview' | 'timetable' | 'sessions' | 'students' | 'resources';
  label: string;
  icon: string;
}

export interface StatCardData {
  title: string;
  value: number | string;
  subtitle: string;
  icon: string;
  bgColor: string;
  iconColor: string;
  progress?: number;
}
