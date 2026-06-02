import { useMutation, useQuery } from "@tanstack/react-query"
import { getStudentCounts,getClassCounts, getTeacherClassrooms , createClassroom, getClassCategories, getSingleClassroom, createSessionTimeTable, getClassTimeTable, updateClassTimeTable, deleteClassTimeTable, getClassStudents} from "../api/teacher"
import { classroomKeys } from "../classroomKeys"



// Invalidate when student data changes
// (add/remove/transfer students) because total student count may change
export const useGetStudentCount = () => {
    return useQuery({
        queryKey:classroomKeys.studentCount(),
        queryFn: getStudentCounts
    })
}
// Invalidate when a classroom is created or deleted
// because total classroom count changes
export const useGetClassCounts = () => {
    return useQuery({
        queryKey: classroomKeys.classroomCount(),
        queryFn:getClassCounts
    })
}
// Invalidate when a classroom is created, updated, or deleted
// because the teacher classroom list may become stale
export const useGetAllTeacherClassrooms = () => {
    return useQuery({
        queryKey: classroomKeys.teacherClassrooms(),
        queryFn:getTeacherClassrooms
    })
}
export const useCreateClassroom = ()  => {
    return useMutation({
        mutationFn:createClassroom, 
    })
}

export const useCreateSessionTimeTable = ()  => {
    return useMutation({
        mutationFn:createSessionTimeTable,
    })
}

export const useGetClassTimeTable = (classId: string) => {
    return useQuery({
        queryKey: classroomKeys.timetable(classId),
        queryFn: () => getClassTimeTable(classId),
        enabled: !!classId
    })
}

export const useUpdateClassTimeTable = () => {
    return useMutation({
        mutationFn: updateClassTimeTable
    })
}

export const useDeleteClassTimeTable = () => {
    return useMutation({
        mutationFn: deleteClassTimeTable
    })
}

export const useGetClassStudents = (classId: string) => {
    return useQuery({
        queryKey: classroomKeys.classStudents(classId),
        queryFn: () => getClassStudents(classId),
        enabled: !!classId
    })
}
// Invalidate when admin creates, updates,
// or deletes classroom categories
export const useGetClassRoomCategory = () => {
    return  useQuery({
        queryKey: classroomKeys.classCategory(), 
        queryFn:getClassCategories
    })
}

// Invalidate specific classroom query
// after update/delete:
//
// classroomKeys.classroom(id)
//
// If ID is unknown:
// invalidate ["classrooms", "classroom"]
export const useGetSingleClass = (classId: string ) => {
    return useQuery({
        queryKey: classroomKeys.classroom(classId),
        queryFn:() =>  getSingleClassroom(classId),
        enabled: !!classId
    })
}

