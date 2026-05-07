export interface getStudentNumbers {
    userId: string
}


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