import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const { user, token, isLoading, checkAuth, logout } = useAuthStore()

  useEffect(() => {
    if (!user && token) {
      checkAuth()
    }
  }, [user, token, checkAuth])

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.is_admin || false,
    logout,
  }
}

