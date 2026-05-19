import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getApiClient } from './client'

// Classroom Types
export interface Category {
  id: string
  name: string
  description?: string
}

export interface Classroom {
  id: string
  name: string
  description?: string
  categoryId: string
  category?: Category
  teacherId: string
  studentCount: number
  resourceCount: number
  joinCode?: string
  createdAt: string
  updatedAt: string
}

export interface ClassroomStats {
  totalClasses: number
  totalStudents: number
  activeStudents: number
}

// Classroom Hooks
export const useCreateClassroom = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { name: string; description?: string; categoryId: string }) => {
      const response = await getApiClient().post('/api/classroom/create-class', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] })
    },
  })
}

export const useGetCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await getApiClient().get('/api/classroom/get-cats')
      return response.data as Category[]
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const response = await getApiClient().post('/api/classroom/create-cat', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export const useGetTeacherClassrooms = () => {
  return useQuery({
    queryKey: ['classrooms', 'teacher'],
    queryFn: async () => {
      const response = await getApiClient().get('/api/classroom/get-teacher-class')
      return response.data as Classroom[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useGetStudentClassrooms = () => {
  return useQuery({
    queryKey: ['classrooms', 'student'],
    queryFn: async () => {
      const response = await getApiClient().get('/api/classroom/get-student-class')
      return response.data as Classroom[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useGetAllClassrooms = () => {
  return useQuery({
    queryKey: ['classrooms', 'all'],
    queryFn: async () => {
      const response = await getApiClient().get('/api/classroom/get-all-classes')
      return response.data as Classroom[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useGetClassroom = (id: string) => {
  return useQuery({
    queryKey: ['classroom', id],
    queryFn: async () => {
      const response = await getApiClient().get(`/api/classroom/get-single-class?id=${id}`)
      return response.data as Classroom
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useJoinClassroom = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (joinCode: string) => {
      const response = await getApiClient().post('/api/classroom/join', { joinCode })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] })
    },
  })
}

export const useGenerateJoinLink = () => {
  return useMutation({
    mutationFn: async (classroomId: string) => {
      const response = await getApiClient().get(`/api/classroom/generate-class-link?id=${classroomId}`)
      return response.data
    },
  })
}

export const useGetClassroomStats = (classroomId: string) => {
  return useQuery({
    queryKey: ['classroom', classroomId, 'stats'],
    queryFn: async () => {
      const response = await getApiClient().get(`/api/classroom/get-student-counts?id=${classroomId}`)
      return response.data as ClassroomStats
    },
    staleTime: 1000 * 60, // 1 minute
  })
}

export const useAddResource = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await getApiClient().post('/api/classroom/add-resource', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classroom'] })
    },
  })
}

export const useAddTimeTable = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await getApiClient().post('/api/classroom/session-time-table', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classroom'] })
    },
  })
}
