// frontend/web/hooks/useUser.ts
import { useState, useEffect } from 'react'
import { User } from '@/types/user'

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        
        if (token) {
          // Try to parse user from localStorage
          const savedUser = localStorage.getItem('user')
          if (savedUser) {
            const parsedUser = JSON.parse(savedUser)
            // Convert date strings back to Date objects
            setUser({
              ...parsedUser,
              createdAt: new Date(parsedUser.createdAt),
              updatedAt: new Date(parsedUser.updatedAt)
            })
          }
        }
      } catch (err) {
        setError('Failed to fetch user data')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // Mock API call
      const mockUser: User = {
        id: 'user_001',
        email,
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        avatar: '/avatars/default.jpg',
        role: 'buyer',
        emailVerified: true,
        phoneVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      // Store with date as strings
      localStorage.setItem('user', JSON.stringify({
        ...mockUser,
        createdAt: mockUser.createdAt.toISOString(),
        updatedAt: mockUser.updatedAt.toISOString()
      }))
      
      localStorage.setItem('token', 'mock-token-123')
      setUser(mockUser)
      
      return { success: true }
    } catch (err) {
      setError('Login failed')
      return { success: false, error: 'Invalid credentials' }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }) => {
    try {
      setLoading(true)
      setError(null)
      
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || '',
        avatar: '/avatars/default.jpg',
        role: 'buyer',
        emailVerified: false,
        phoneVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      // Store with date as strings
      localStorage.setItem('user', JSON.stringify({
        ...mockUser,
        createdAt: mockUser.createdAt.toISOString(),
        updatedAt: mockUser.updatedAt.toISOString()
      }))
      
      localStorage.setItem('token', `mock-token-${Date.now()}`)
      setUser(mockUser)
      
      return { success: true }
    } catch (err) {
      setError('Registration failed')
      return { success: false, error: 'Registration failed' }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const updateProfile = async (updates: Partial<User>) => {
    try {
      setLoading(true)
      
      if (user) {
        const updatedUser = { 
          ...user, 
          ...updates, 
          updatedAt: new Date() 
        }
        
        // Store with date as strings
        localStorage.setItem('user', JSON.stringify({
          ...updatedUser,
          createdAt: updatedUser.createdAt.toISOString(),
          updatedAt: updatedUser.updatedAt.toISOString()
        }))
        
        setUser(updatedUser)
      }
      
      return { success: true }
    } catch (err) {
      setError('Failed to update profile')
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  }
}