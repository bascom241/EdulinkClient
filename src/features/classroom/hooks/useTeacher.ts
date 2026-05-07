import { useMutation, useQuery } from "@tanstack/react-query"
import { getStudentCounts,getClassCounts, getTeacherClassrooms , createClassroom} from "../api/teacher"
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