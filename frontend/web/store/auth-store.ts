import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string  // Add avatar here
  role: 'buyer' | 'seller' | 'admin'
  emailVerified: boolean
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, password: string) => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          // Mock API call - replace with real API
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Demo user based on email
          const isSeller = email.includes('seller')
          const isAdmin = email.includes('admin')
          
          const user: User = {
            id: '1',
            email,
            firstName: isSeller ? 'Seller' : isAdmin ? 'Admin' : 'Buyer',
            lastName: 'Demo',
            role: isSeller ? 'seller' : isAdmin ? 'admin' : 'buyer',
            emailVerified: true,
          }

          set({
            user,
            token: 'demo-token',
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          set({
            error: error.message || 'Login failed',
            isLoading: false,
          })
          throw error
        }
      },

      register: async (userData: any) => {
        set({ isLoading: true, error: null })
        try {
          // Mock API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const user: User = {
            id: '1',
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.userType,
            emailVerified: false,
          }

          set({
            user,
            token: 'demo-token',
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          set({
            error: error.message || 'Registration failed',
            isLoading: false,
          })
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },

      forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null })
        try {
          // Mock API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          set({ isLoading: false })
        } catch (error: any) {
          set({
            error: error.message || 'Failed to send reset email',
            isLoading: false,
          })
          throw error
        }
      },

      resetPassword: async (token: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          // Mock API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          set({ isLoading: false })
        } catch (error: any) {
          set({
            error: error.message || 'Failed to reset password',
            isLoading: false,
          })
          throw error
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
)