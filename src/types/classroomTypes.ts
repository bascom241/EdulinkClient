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
  createdAt: string;
  updatedAt: string 
    defaultLink?: string;
  otherLinks?: string[];
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