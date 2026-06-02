export const assignmentKeys = {
  all: ["assignments"],
  teacher: (classId?: string) => [...assignmentKeys.all, "teacher", classId],
  student: () => [...assignmentKeys.all, "student"],
};
