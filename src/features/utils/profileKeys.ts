export const profileKeys = {
    all:["profiles"],
    teacher: () => [...profileKeys.all,"teacher-profile"],
    student: () => [...profileKeys.all, "student-profile"]
}