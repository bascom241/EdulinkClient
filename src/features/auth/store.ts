import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthState {
  token: string | null
  user: {
    id: string
    email: string
    name: string
    role: 'ROLE_TEACHER' | 'ROLE_USER' | null
    verified: boolean
  } | null
  isAuthenticated: boolean
  setToken: (token: string) => void
  setUser: (user: AuthState['user']) => void
  setAuthData: (token: string, user: AuthState['user']) => void
  logout: () => void
  updateRole: (role: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setToken: (token) => {
        localStorage.setItem('accessToken', token)
        set({ token, isAuthenticated: !!token })
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user })
      },

      setAuthData: (token, user) => {
        localStorage.setItem('accessToken', token)
        set({ token, user, isAuthenticated: true })
      },

      logout: () => {
        localStorage.removeItem('accessToken')
        set({ token: null, user: null, isAuthenticated: false })
      },

      updateRole: (role) => {
        set((state) => ({
          user: state.user ? { ...state.user, role: role as any } : null,
        }))
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
