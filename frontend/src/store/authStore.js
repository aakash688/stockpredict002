import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '../services/authService'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),
      setToken: (token) => {
        set({ token })
        if (token) {
          localStorage.setItem('token', token)
        } else {
          localStorage.removeItem('token')
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const data = await authService.login(email, password)
          const user = await authService.getCurrentUser()
          set({ user, token: data.access_token, isLoading: false })
          return { success: true }
        } catch (error) {
          set({
            error: error.response?.data?.detail || 'Login failed',
            isLoading: false,
          })
          return { success: false, error: error.response?.data?.detail || 'Login failed' }
        }
      },

      signup: async (email, password, fullName) => {
        set({ isLoading: true, error: null })
        try {
          await authService.signup(email, password, fullName)
          const data = await authService.login(email, password)
          const user = await authService.getCurrentUser()
          set({ user, token: data.access_token, isLoading: false })
          return { success: true }
        } catch (error) {
          set({
            error: error.response?.data?.detail || 'Signup failed',
            isLoading: false,
          })
          return { success: false, error: error.response?.data?.detail || 'Signup failed' }
        }
      },

      logout: () => {
        authService.logout()
        set({ user: null, token: null })
      },

      checkAuth: async () => {
        const token = localStorage.getItem('token')
        if (!token) {
          set({ user: null, token: null })
          return
        }
        try {
          const user = await authService.getCurrentUser()
          set({ user, token })
        } catch (error) {
          set({ user: null, token: null })
          localStorage.removeItem('token')
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)

