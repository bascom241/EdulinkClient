import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getApiClient } from './client'

// User API Types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface VerifyRequest {
  email: string
  verificationCode: string
}

export interface User {
  id: string
  email: string
  name: string
  role: 'ROLE_TEACHER' | 'ROLE_USER'
  verified: boolean
}

// Auth Hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await getApiClient().post('/api/user/login', data)
      return response.data
    },
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await getApiClient().post('/api/user/register', data)
      return response.data
    },
  })
}

export const useVerify = () => {
  return useMutation({
    mutationFn: async (data: VerifyRequest) => {
      const response = await getApiClient().post('/api/user/verify', data)
      return response.data
    },
  })
}

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await getApiClient().post('/api/user/refresh')
      return response.data
    },
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await getApiClient().post('/api/user/forgot-password', { email })
      return response.data
    },
  })
}

export const useUpdateRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (role: string) => {
      const response = await getApiClient().post('/api/user/update-role', { role })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

// Get current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user', 'current'],
    queryFn: async () => {
      const response = await getApiClient().get('/api/user/profile')
      return response.data as User
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  })
}
