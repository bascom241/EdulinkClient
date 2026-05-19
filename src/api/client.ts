import axios, { AxiosError, AxiosInstance } from 'axios'
import { useAuthStore } from '../features/auth/store'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

let apiClient: AxiosInstance

export const initializeApiClient = (baseURL: string = API_BASE_URL) => {
  apiClient = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Add token to requests
  apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  // Handle token expiry
  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )

  return apiClient
}

export const getApiClient = () => {
  if (!apiClient) {
    initializeApiClient()
  }
  return apiClient
}

export default getApiClient()
