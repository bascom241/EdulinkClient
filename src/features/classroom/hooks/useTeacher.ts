import { useMutation, useQuery } from "@tanstack/react-query"
import { getStudentCounts,getClassCounts, getTeacherClassrooms , createClassroom, getClassCategories} from "../api/teacher"
import { classroomKeys } from "../classroomKeys"
export const useGetStudentCount = () => {
    return useQuery({
        queryKey:classroomKeys.studentCount(),
        queryFn: getStudentCounts
    })
}


export const useGetClassCounts = () => {
    return useQuery({
        queryKey: classroomKeys.classroomCount(),
        queryFn:getClassCounts
    })
}


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

export const useGetClassRoomCategory = () => {
    return  useQuery({
        queryKey: classroomKeys.classCategory(), 
        queryFn:getClassCategories
    })
}

