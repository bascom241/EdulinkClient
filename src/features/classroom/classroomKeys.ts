export const classroomKeys = {
  all: ["classrooms"],

  lists: () => [...classroomKeys.all, "list"],
  list: (filter?: any) => [...classroomKeys.lists(), filter],

  classroom: (id: string) => [...classroomKeys.all, "classroom", id],

  students: () => [...classroomKeys.all, "students"],
  studentCount: () => [...classroomKeys.all, "student-count"],

  classrooms: () => [...classroomKeys.all, "classrooms"],
  classroomCount: () => [...classroomKeys.all, "class-counts"],

  teacherClassrooms: () => [...classroomKeys.all, "teacher-classrooms"],
  classCategory: () => [...classroomKeys.all, "class-category"]
};